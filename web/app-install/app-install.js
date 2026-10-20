/* ============================================================
   COMMA 365 · 앱 설치 안내 (기기 판별 · 배지 표시 · 띠 닫기 · QR)
   사용법은 README.md 참고. 의존성 없음 (QR은 선택: qrcodejs 로드 시 자동 사용)
   ============================================================ */
(function () {
  'use strict';

  var CFG = Object.assign({
    ios: '',                       // App Store 주소. 비어 있으면 iPhone에서 "준비 중"
    android: '',                   // Google Play 주소
    smart: 'https://comma365.co.kr/app', // PC QR용 주소 (기기 판별 후 스토어로 보내는 페이지)
    appUA: 'Comma365App',          // 앱(웹뷰) User-Agent에 넣을 표식 → 앱 안에서는 전부 숨김
    bannerSnoozeDays: 30,          // 띠를 닫으면 며칠 동안 안 보일지
    bannerMinVisit: 2,             // 몇 번째 방문부터 띠를 보일지 (1=첫 방문부터)
    storageKey: 'comma365.appInstall'
  }, window.COMMA_APP_INSTALL || {});

  /* ---------- 기기 판별 (forceDevice: 'ios'|'android'|'pc' 로 시연·테스트 가능) ---------- */
  var ua, isIOS, isAndroid, isMobile, isStandalone, isInApp, device;
  function detect() {
    ua = navigator.userAgent || '';
    isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    isAndroid = /Android/.test(ua);
    isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
    isInApp = !!(CFG.appUA && ua.indexOf(CFG.appUA) !== -1);
    device = CFG.forceDevice || (isIOS ? 'ios' : isAndroid ? 'android' : 'pc');
    if (CFG.forceDevice) { isIOS = device === 'ios'; isAndroid = device === 'android'; }
    isMobile = isIOS || isAndroid;
    if (CFG.forceStandalone != null) isStandalone = !!CFG.forceStandalone;
    if (CFG.forceInApp != null) isInApp = !!CFG.forceInApp;
  }
  detect();

  /* ---------- 저장소 (실패해도 동작) ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(CFG.storageKey) || '{}'); } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(CFG.storageKey, JSON.stringify(o)); } catch (e) {} }

  /* ---------- 스토어 주소 ---------- */
  function storeUrl(kind) { return kind === 'ios' ? CFG.ios : CFG.android; }
  function bestUrl() { return device === 'ios' ? CFG.ios : device === 'android' ? CFG.android : CFG.smart; }

  /* ---------- 배지 묶음: 기기에 맞는 것만 남김 ---------- */
  function setupBadges(root) {
    var all = root.querySelectorAll('.ai-badges');
    for (var i = 0; i < all.length; i++) {
      var box = all[i];
      var showBoth = box.getAttribute('data-show') === 'both' || !isMobile;
      var badges = box.querySelectorAll('.ai-badge');
      for (var j = 0; j < badges.length; j++) {
        var b = badges[j], kind = b.getAttribute('data-store'), url = storeUrl(kind);
        var mine = (kind === device);
        b.hidden = false;
        if (!showBoth && !mine) { b.hidden = true; continue; }
        var t = b.querySelector('.ai-badge-txt b');
        if (t && !t.getAttribute('data-label')) t.setAttribute('data-label', t.textContent);
        if (url) {
          b.href = url; b.classList.remove('is-soon'); b.removeAttribute('aria-disabled');
          if (t) t.textContent = t.getAttribute('data-label');
        } else {
          b.classList.add('is-soon'); b.setAttribute('aria-disabled', 'true'); b.removeAttribute('href');
          if (t) t.textContent = kind === 'ios' ? 'iPhone 앱 준비 중' : '안드로이드 앱 준비 중';
        }
      }
    }
  }

  /* ---------- 1. 첫 화면 QR (PC) ---------- */
  function setupQR(root) {
    var qr = root.querySelector('.ai-qr');
    if (!qr) return;
    var holder = qr.querySelector('.ai-qr-code');
    if (!holder || !window.QRCode) return;
    holder.innerHTML = '';
    new window.QRCode(holder, { text: CFG.smart, width: 168, height: 168, correctLevel: window.QRCode.CorrectLevel.M });
    var c = holder.querySelector('canvas, img'); if (c) { c.style.width = '84px'; c.style.height = '84px'; }
  }

  /* ---------- 2. 로그인 후 띠 ---------- */
  function setupBanner(root) {
    var bar = root.querySelector('.ai-banner');
    if (!bar) return;
    var st = load();
    st.visits = (st.visits || 0) + 1; save(st);

    var url = bestUrl();
    var hide = isStandalone || isInApp || !isMobile || !url ||
      st.visits < CFG.bannerMinVisit ||
      (st.snoozeUntil && Date.now() < st.snoozeUntil);
    if (hide) { bar.hidden = true; return; }

    bar.hidden = false;
    var cta = bar.querySelector('.ai-banner-cta'); if (cta) cta.href = url;
    var close = bar.querySelector('.ai-banner-close');
    if (close && !close.__aiBound) {
      close.__aiBound = true;
      close.addEventListener('click', function () {
        bar.hidden = true;
        var s = load(); s.snoozeUntil = Date.now() + CFG.bannerSnoozeDays * 864e5; save(s);
      });
    }
  }

  /* ---------- 앱 안에서는 전부 숨김 ---------- */
  function init(root, opts) {
    root = root || document;
    if (opts) { Object.assign(CFG, opts); detect(); }
    var blocks = root.querySelectorAll('.ai');
    for (var k = 0; k < blocks.length; k++) blocks[k].hidden = false;
    if (isInApp || isStandalone) {
      for (var i = 0; i < blocks.length; i++) if (!blocks[i].classList.contains('ai-keep')) blocks[i].hidden = true;
      return;
    }
    setupBadges(root); setupQR(root); setupBanner(root);
  }

  /* ---------- /app 스마트 링크 페이지용 ---------- */
  function redirectToStore() {
    var url = bestUrl();
    if (device === 'pc' || !url) return false;
    location.replace(url); return true;
  }

  window.CommaAppInstall = {
    init: init, redirectToStore: redirectToStore, config: CFG,
    get device() { return device; }, get isStandalone() { return isStandalone; }, get isInApp() { return isInApp; }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();
