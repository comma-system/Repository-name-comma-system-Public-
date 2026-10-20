'use client';
/* ============================================================
   COMMA 365 · 앱 설치 안내 (Next.js / React 버전)
   <AppInstallHero/>  <AppInstallBanner/>  <AppInstallFooter/>
   app-install.css 를 전역 CSS에 import 하고, 아래 STORE 값을 채우면 끝.
   ============================================================ */
import { useEffect, useMemo, useState } from 'react';

export const STORE = {
  ios: '',                                   // 'https://apps.apple.com/kr/app/id...'
  android: '',                               // 'https://play.google.com/store/apps/details?id=...'
  smart: 'https://comma365.co.kr/app',
  appUA: 'Comma365App',
  bannerSnoozeDays: 30,
  bannerMinVisit: 2,
  storageKey: 'comma365.appInstall',
};

type Device = 'ios' | 'android' | 'pc';

function useDevice() {
  const [s, set] = useState<{ device: Device; standalone: boolean; inApp: boolean; ready: boolean }>({
    device: 'pc', standalone: false, inApp: false, ready: false,
  });
  useEffect(() => {
    const ua = navigator.userAgent || '';
    const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const android = /Android/.test(ua);
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    set({ device: ios ? 'ios' : android ? 'android' : 'pc', standalone, inApp: ua.includes(STORE.appUA), ready: true });
  }, []);
  return s;
}

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.37 12.73c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.29-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.79 5.1c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.66.77-1.25 2-1.09 3.18 1.15.09 2.33-.58 3.05-1.45z"/></svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#00C853" d="M3.6 2.4 13.3 12 3.6 21.6c-.4-.2-.6-.6-.6-1.1V3.5c0-.5.2-.9.6-1.1z"/><path fill="#2196F3" d="M16.6 8.7 13.3 12l3.3 3.3 3.9-2.2c1.1-.6 1.1-1.6 0-2.2l-3.9-2.2z"/><path fill="#FFC107" d="M3.6 2.4c.3-.2.7-.2 1.1 0l11.9 6.3L13.3 12 3.6 2.4z"/><path fill="#F44336" d="M3.6 21.6c.3.2.7.2 1.1 0l11.9-6.3L13.3 12l-9.7 9.6z"/></svg>
);

function Badge({ kind }: { kind: 'ios' | 'android' }) {
  const url = kind === 'ios' ? STORE.ios : STORE.android;
  const soon = !url;
  const label = soon ? (kind === 'ios' ? 'iPhone 앱 준비 중' : '안드로이드 앱 준비 중') : kind === 'ios' ? 'App Store' : 'Google Play';
  const Tag: any = soon ? 'span' : 'a';
  return (
    <Tag className={`ai-badge${soon ? ' is-soon' : ''}`} href={soon ? undefined : url} rel="noopener" aria-disabled={soon || undefined}>
      {kind === 'ios' ? <AppleIcon /> : <PlayIcon />}
      <span className="ai-badge-txt"><small>{kind === 'ios' ? 'Download on the' : 'GET IT ON'}</small><b>{label}</b></span>
    </Tag>
  );
}

function Badges({ showBoth }: { showBoth: boolean }) {
  const { device } = useDevice();
  const list: Array<'ios' | 'android'> = showBoth || device === 'pc' ? ['ios', 'android'] : [device as 'ios' | 'android'];
  return <div className="ai-badges">{list.map(k => <Badge key={k} kind={k} />)}</div>;
}

/** 1. 첫 화면: 무료 체험 버튼 묶음 바로 아래 */
export function AppInstallHero() {
  const d = useDevice();
  const [qr, setQr] = useState<string | null>(null);
  useEffect(() => {
    if (!d.ready || d.device !== 'pc') return;
    // QR: 외부 서비스 없이 만들려면 'qrcode' 패키지(npm i qrcode) 사용
    import('qrcode').then(m => m.toDataURL(STORE.smart, { width: 168, margin: 1 })).then(setQr).catch(() => setQr(null));
  }, [d.ready, d.device]);
  if (!d.ready || d.standalone || d.inApp) return null;
  return (
    <section className="ai ai-hero" aria-label="앱 설치 안내">
      <div className="ai-hero-copy">
        <span className="ai-eyebrow">APP</span>
        <span className="ai-title">앱으로도 이용할 수 있어요</span>
        <span className="ai-sub">추천 알림을 바로 받고, 로그인 없이 바로 열립니다.</span>
      </div>
      <Badges showBoth={false} />
      {qr && (
        <div className="ai-qr" style={{ display: 'flex' }} aria-label="휴대폰으로 QR을 찍으면 앱 설치 페이지로 이동">
          <img src={qr} alt="앱 설치 QR 코드" width={84} height={84} />
          <span>휴대폰 카메라로 찍으면 바로 설치</span>
        </div>
      )}
    </section>
  );
}

/** 2. 로그인 후 메인 상단 띠 (기존 "홈 화면에 추가" 띠 대체) */
export function AppInstallBanner() {
  const d = useDevice();
  const [show, setShow] = useState(false);
  const url = useMemo(() => (d.device === 'ios' ? STORE.ios : d.device === 'android' ? STORE.android : ''), [d.device]);
  useEffect(() => {
    if (!d.ready) return;
    let st: any = {};
    try { st = JSON.parse(localStorage.getItem(STORE.storageKey) || '{}'); } catch {}
    st.visits = (st.visits || 0) + 1;
    try { localStorage.setItem(STORE.storageKey, JSON.stringify(st)); } catch {}
    const hide = d.standalone || d.inApp || d.device === 'pc' || !url ||
      st.visits < STORE.bannerMinVisit || (st.snoozeUntil && Date.now() < st.snoozeUntil);
    setShow(!hide);
  }, [d.ready, d.standalone, d.inApp, d.device, url]);
  if (!show) return null;
  const close = () => {
    setShow(false);
    try {
      const st = JSON.parse(localStorage.getItem(STORE.storageKey) || '{}');
      st.snoozeUntil = Date.now() + STORE.bannerSnoozeDays * 864e5;
      localStorage.setItem(STORE.storageKey, JSON.stringify(st));
    } catch {}
  };
  return (
    <div className="ai ai-banner" role="region" aria-label="앱 설치 안내">
      <div className="ai-banner-icon"><img src="/logo-192.png" alt="" width={40} height={40} /></div>
      <div className="ai-banner-txt"><b>앱으로 더 편하게</b><span>추천·매도 신호 알림을 놓치지 않아요</span></div>
      <a className="ai-banner-cta" href={url} rel="noopener">앱 설치</a>
      <button className="ai-banner-close" type="button" aria-label="닫기" onClick={close}>×</button>
    </div>
  );
}

/** 3. 푸터: 사업자 정보 위 */
export function AppInstallFooter() {
  const d = useDevice();
  if (!d.ready || d.standalone || d.inApp) return null;
  return (
    <section className="ai ai-footer" aria-label="앱 다운로드">
      <div className="ai-footer-copy">
        <img className="ai-footer-logo" src="/logo-192.png" alt="" width={44} height={44} />
        <div><b>COMMA 365 앱</b><span>iPhone · 안드로이드에서 설치할 수 있습니다</span></div>
      </div>
      <Badges showBoth />
    </section>
  );
}

/** /app 스마트 링크 페이지: app/app/page.tsx 에서 사용 */
export function AppSmartLink() {
  const d = useDevice();
  useEffect(() => {
    if (!d.ready) return;
    const url = d.device === 'ios' ? STORE.ios : d.device === 'android' ? STORE.android : '';
    if (url) location.replace(url);
  }, [d.ready, d.device]);
  return (
    <main className="ai" style={{ padding: '48px 16px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.4rem' }}>COMMA 365 앱 설치</h1>
      <p style={{ color: 'var(--ai-muted)' }}>휴대폰이면 잠시 후 스토어로 이동합니다. 이동하지 않으면 아래 버튼을 눌러 주세요.</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}><Badges showBoth /></div>
    </main>
  );
}
