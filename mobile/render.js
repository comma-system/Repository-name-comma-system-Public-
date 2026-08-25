// =====================================================================
// COMMA ONE 모바일 메인 화면 렌더러 (표시 전용)
// 데이터 계층(data.js)이 준비한 값을 기준 이미지와 동일하게 표시만 한다.
// 어떤 점수/등락률/순위 계산도 여기서 하지 않는다.
// =====================================================================
(function () {
  const D = window.COMMA_DATA;
  const app = document.getElementById("app");

  // 정규화(0~100)된 좌표를 SVG polyline 점 문자열로 변환 (표시용 좌표 변환)
  function chartPoints(values, w, h, pad) {
    const p = pad || 2;
    const step = (w - p * 2) / (values.length - 1);
    return values
      .map((v, i) => `${(p + i * step).toFixed(1)},${(h - p - ((h - p * 2) * v) / 100).toFixed(1)}`)
      .join(" ");
  }

  function lineChartSVG(values, w, h, color, id) {
    const pts = chartPoints(values, w, h, 3);
    const last = pts.split(" ").pop().split(",");
    return `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${color}" stop-opacity="0.35"/>
            <stop offset="1" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="3,${h - 3} ${pts} ${w - 3},${h - 3}" fill="url(#g${id})"/>
        <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${last[0]}" cy="${last[1]}" r="2.4" fill="#fff" stroke="${color}" stroke-width="1.5"/>
      </svg>`;
  }

  const ICONS = {
    bell: `<svg viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`,
    gear: `<svg viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" width="13" height="13" fill="#facc15"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>`,
    diamond: `<svg viewBox="0 0 24 24" width="9" height="9" fill="#3182f6"><path d="M12 2l6 6-6 14L6 8z"/><path d="M2 8h20l-4-6H6z" opacity="0.55"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" width="9" height="9" fill="#16a34a"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z"/></svg>`,
    fire: `<svg viewBox="0 0 24 24" width="9" height="9" fill="#ea580c"><path d="M12 2s1 3-1 6 -3 3-3 6a4 4 0 0 0 8 0c0-2-1-3-1-3s3 1 3 4a6 6 0 0 1-12 0c0-5 4-6 6-13z"/></svg>`,
    bank: `<svg viewBox="0 0 24 24" width="9" height="9" fill="#7c3aed"><path d="M12 2l10 6H2zM4 10h3v8H4zm6.5 0h3v8h-3zM17 10h3v8h-3zM2 20h20v2H2z"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24" width="9" height="9" fill="#dc2626"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>`,
    magnifySmall: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" width="10" height="10" fill="#2563eb"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8zM19 16l.9 3.1L23 20l-3.1.9L19 24l-.9-3.1L15 20l3.1-.9z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#2563eb" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/></svg>`,
    funnel: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linejoin="round"><path d="M3 4h18l-7 8v6l-4 2v-8z"/></svg>`,
    magnify: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 12l2-2 2 2 2-3"/></svg>`,
    doc: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>`,
    target: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#dc2626" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="#dc2626"/></svg>`,
    chartMini: `<svg viewBox="0 0 24 24" width="13" height="13" fill="#16a34a"><path d="M3 21h18v-2H5V3H3zM7 15h2.6v3H7zm4-5h2.6v8H11zm4-4h2.6v12H15z"/></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-4.5v-6h-3v6H6v-9H3z"/></svg>`,
    stock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
    comma: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12l6-6" stroke-linecap="round"/></svg>`,
    ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="10" r="7"/><path d="M8 20h8M10 17v3M14 17v3"/></svg>`,
    chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 20V10M9 20V4M14 20v-9M19 20V7"/></svg>`,
  };

  // ---------- 상단 헤더 ----------
  const header = `
    <div class="header">
      <span class="logo">${D.header.logo}</span>
      <span class="tagline">${D.header.tagline}</span>
      <div class="header-icons">
        <div class="icon-btn">${ICONS.bell}<span class="badge">${D.header.notificationCount}</span></div>
        <div class="icon-btn">${ICONS.gear}</div>
      </div>
    </div>`;

  // ---------- 1. 오늘의 시장 ----------
  const M = D.market;
  const statBoxes = M.stats
    .map((s) =>
      s.sub
        ? `<div class="stat-box"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-sub">${s.sub}</div></div>`
        : `<div class="stat-box"><div class="stat-label">${s.label}</div><div class="stat-dir"><span class="tri">▲</span> 순매수</div><div class="stat-amount">${s.value}</div></div>`
    )
    .join("");
  const sectorList = (sec, dir) => `
    <div class="sector-list">
      ${sec.items
        .map(
          (it) => `<div class="sector-row"><span class="sector-rank">${it.rank}</span><span class="sector-name">${it.name}</span><span class="sector-change ${dir}">${it.change}</span></div>`
        )
        .join("")}
    </div>`;
  const marketCard = `
    <div class="card market-card">
      <div class="market-left">
        <div class="market-title-row">
          <span class="market-title">${M.title}</span>
          <span class="live-pill">${M.liveLabel} <span class="live-dot"></span></span>
        </div>
        <div class="market-status">
          <span class="status-dot"></span>
          <b><span class="hl">${M.statusHighlight}</span>${M.statusRest}</b>
        </div>
        <div class="market-stats">${statBoxes}</div>
      </div>
      <div class="market-right">
        <div class="sector-head"><span class="sector-title">${M.strongSectors.title}</span><span class="sector-chevron">›</span></div>
        ${sectorList(M.strongSectors, "up")}
        <div class="sector-head"><span class="sector-title">${M.weakSectors.title}</span></div>
        ${sectorList(M.weakSectors, "down")}
      </div>
    </div>`;

  // ---------- 2. 오늘의 포착 종목 ----------
  const P = D.pick;
  const R = 36; // 게이지 반지름
  const CIRC = 2 * Math.PI * R;
  const gauge = `
    <div class="gauge">
      <svg viewBox="0 0 84 84">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#22c55e"/><stop offset="1" stop-color="#86efac"/>
          </linearGradient>
        </defs>
        <circle cx="42" cy="42" r="${R}" fill="none" stroke="#1d3450" stroke-width="8.5"/>
        <circle cx="42" cy="42" r="${R}" fill="none" stroke="url(#gaugeGrad)" stroke-width="8.5"
          stroke-linecap="round" stroke-dasharray="${((P.score.percent / 100) * CIRC).toFixed(1)} ${CIRC.toFixed(1)}"/>
      </svg>
      <div class="gauge-center">
        <span class="gauge-label">${P.score.label}</span>
        <span class="gauge-value">${P.score.value}</span>
        <span class="gauge-max">${P.score.max}</span>
      </div>
    </div>`;
  const pickCard = `
    <div class="card pick-card">
      <div class="pick-head">
        <span class="pick-star">${ICONS.star}</span>
        <span class="pick-title">${P.title}</span>
        <span class="pick-more">${P.moreLabel} ›</span>
      </div>
      <div class="pick-name-row"><span class="pick-name">${P.name}</span><span class="pick-code">(${P.code})</span></div>
      <div class="pick-price-row"><span class="pick-price">${P.price}</span><span class="pick-change">${P.change}</span></div>
      <div class="pick-chart">${lineChartSVG(P.chart, 108, 50, "#22c55e", "pick")}</div>
      <div class="pick-chips">
        ${P.chips.map((c) => `<span class="pick-chip">${c.label}<b>${c.value}</b></span>`).join("")}
      </div>
      <div class="pick-body">
        ${gauge}
        <div class="pick-right">
          <span class="signal-box">${P.signal}</span>
          <div class="pick-desc">${P.description.join("<br>")}</div>
        </div>
      </div>
      <div class="zone-bar">
        <span class="zone-pair"><span class="zone-label-buy">${P.buyZone.label}</span><span class="zone-value">${P.buyZone.value}</span></span>
        <span class="zone-sep">|</span>
        <span class="zone-pair"><span class="zone-label-target">${P.targetZone.label}</span><span class="zone-value">${P.targetZone.value}</span></span>
      </div>
    </div>`;

  // ---------- 3. 오늘의 추천 ----------
  const REC_COLORS = { comma: "#3182f6", safe: "#22c55e", aggressive: "#f97316", inst: "#a78bfa", burst: "#ef4444" };
  const REC_ICONS = { comma: ICONS.diamond, safe: ICONS.shield, aggressive: ICONS.fire, inst: ICONS.bank, burst: ICONS.bolt };
  const recSection = `
    <div class="section-head">
      <span class="section-title">${D.recommend.title}</span>
      <span class="section-sub">${D.recommend.subtitle}</span>
      <span class="section-more">${D.recommend.moreLabel} ›</span>
    </div>
    <div class="rec-row">
      ${D.recommend.cards
        .map(
          (c, i) => `
        <div class="rec-card">
          <span class="rec-badge ${c.theme}">${REC_ICONS[c.theme]} ${c.type}</span>
          <div class="rec-name">${c.name}</div>
          <div class="rec-price">${c.price}</div>
          <div class="rec-score">${c.score}</div>
          <div class="rec-chart">${lineChartSVG(c.chart, 70, 22, REC_COLORS[c.theme], "rec" + i)}</div>
        </div>`
        )
        .join("")}
    </div>`;

  // ---------- 4. 검색 ----------
  const S = D.search;
  const searchCard = `
    <div class="card search-card">
      <div class="search-title">${S.title}</div>
      <div class="search-input">${ICONS.magnifySmall}<span>${S.placeholder}</span></div>
      <div class="search-chips">
        ${S.chips.map((c) => `<span class="s-chip">${c}</span>`).join("")}
        <span class="s-chip ai">${ICONS.sparkle} ${S.aiChip}</span>
      </div>
    </div>`;

  // ---------- 5. 오늘의 발굴 현황 ----------
  const steps = D.discovery.steps
    .map(
      (s, i) => `
      ${i > 0 ? `<span class="step-arrow">→</span>` : ""}
      <div class="step${s.final ? " final" : ""}">
        <div class="step-icon">${ICONS[s.icon]}</div>
        <div class="step-label">${s.label}</div>
        <div class="step-count">${s.count}</div>
      </div>`
    )
    .join("");
  const discoveryCard = `
    <div class="card discovery-card">
      <div class="discovery-head">
        <span class="discovery-title">${D.discovery.title}</span>
        <span class="info-icon">i</span>
        <span class="spacer"></span>
        <span class="section-more">${D.discovery.moreLabel} ›</span>
      </div>
      <div class="discovery-steps">${steps}</div>
    </div>`;

  // ---------- 6. 오늘의 시장 브리핑 ----------
  const B = D.briefing;
  const briefingCard = `
    <div class="briefing-card">
      <div class="briefing-left">
        <div class="briefing-title">${ICONS.chartMini} ${B.title}</div>
        <div class="briefing-msg">${B.message}</div>
      </div>
      <svg class="briefing-illust" viewBox="0 0 44 38">
        <rect x="14" y="2" width="22" height="30" rx="3" fill="#fff" stroke="#bfe8cc"/>
        <rect x="18" y="8" width="14" height="2.5" rx="1" fill="#cfe3d7"/>
        <rect x="18" y="13" width="10" height="2.5" rx="1" fill="#cfe3d7"/>
        <rect x="18" y="18" width="12" height="2.5" rx="1" fill="#cfe3d7"/>
        <rect x="4" y="22" width="4" height="12" rx="1" fill="#22c55e"/>
        <rect x="10" y="18" width="4" height="16" rx="1" fill="#4ade80"/>
        <rect x="16" y="26" width="4" height="8" rx="1" fill="#86efac"/>
      </svg>
      <span class="briefing-btn">${B.buttonLabel} ›</span>
    </div>`;

  // ---------- 하단 네비게이션 ----------
  const nav = `
    <div class="bottom-nav">
      <div class="bottom-nav-inner">
        ${D.nav
          .map(
            (n) => `
          <div class="nav-item${n.active ? " active" : ""}">
            ${ICONS[n.icon]}
            <span class="nav-label">${n.label}</span>
          </div>`
          )
          .join("")}
      </div>
      <div class="home-indicator"></div>
    </div>`;

  app.innerHTML = header + marketCard + pickCard + recSection + searchCard + discoveryCard + briefingCard + nav;
})();
