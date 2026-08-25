// =====================================================================
// COMMA ONE 모바일 메인 화면 데이터 계층
// UI(render.js)는 계산하지 않는다 — 모든 수치/판단은 이 계층(백엔드)에서 준비된다.
// 실제 서비스에서는 이 객체를 백엔드 API 응답으로 대체한다.
// =====================================================================
window.COMMA_DATA = {
  header: {
    logo: "COMMA",
    tagline: "오늘도 안전하게 투자하세요",
    notificationCount: 3,
  },

  market: {
    title: "오늘의 시장",
    liveLabel: "실시간",
    statusHighlight: "보통보다 강한",
    statusRest: " 시장입니다",
    stats: [
      { label: "시장강도", value: "82점", sub: "(100점 만점)" },
      { label: "외국인", direction: "▲ 순매수", value: "+2,532억" },
      { label: "기관", direction: "▲ 순매수", value: "+1,126억" },
    ],
    strongSectors: {
      title: "강한 업종 TOP 3",
      items: [
        { rank: 1, name: "반도체", change: "+2.31%" },
        { rank: 2, name: "전력/전기", change: "+1.85%" },
        { rank: 3, name: "조선", change: "+1.42%" },
      ],
    },
    weakSectors: {
      title: "약한 업종 TOP 3",
      items: [
        { rank: 1, name: "2차전지", change: "-1.25%" },
        { rank: 2, name: "바이오", change: "-0.98%" },
        { rank: 3, name: "건설", change: "-0.76%" },
      ],
    },
  },

  pick: {
    title: "오늘의 포착 종목",
    moreLabel: "자세히 보기",
    name: "삼성전자",
    code: "005930",
    price: "191,000원",
    change: "▲ 2.31%",
    chips: [
      { label: "거래대금", value: "8,532억" },
      { label: "거래량", value: "4,521만주" },
      { label: "시가총액", value: "1,140조" },
    ],
    score: { label: "콤마 점수", value: "82점", max: "/100", percent: 82 },
    signal: "지금 관심을 가져볼 자리",
    description: ["수급과 실적이 함께 좋아지는 구간", "상승 가능성이 높은 자리입니다."],
    buyZone: { label: "매수구간", value: "186,000 ~ 190,000원" },
    targetZone: { label: "목표구간", value: "205,000 ~ 215,000원" },
    // 미니 차트 좌표(0~100 정규화, 백엔드 가공 결과)
    chart: [12, 30, 22, 38, 30, 48, 40, 36, 52, 46, 62, 58, 74, 70, 86, 82, 95],
  },

  recommend: {
    title: "오늘의 추천",
    subtitle: "(투자 목적별)",
    moreLabel: "전체보기",
    // 오늘의 추천은 항상 5개 유형 전체를 유지한다 (콤마형 포함).
    // 기준 이미지에는 4개가 보이므로 앞 4개가 기준 화면 그대로 노출되고
    // 5번째(콤마형)는 가로 스크롤로 자연스럽게 이어진다.
    cards: [
      { type: "안전형", theme: "safe", icon: "shield", code: "000660", name: "SK하이닉스", price: "248,500원", score: "콤마 86점", chart: [20, 35, 28, 45, 38, 30, 42, 55, 48, 62, 58, 72] },
      { type: "공격형", theme: "aggressive", icon: "fire", code: "042700", name: "한미반도체", price: "135,800원", score: "콤마 91점", chart: [15, 28, 22, 40, 32, 50, 44, 38, 58, 52, 70, 80] },
      { type: "기관매집", theme: "inst", icon: "bank", code: "005380", name: "현대차", price: "203,000원", score: "콤마 84점", chart: [25, 20, 35, 30, 45, 38, 52, 46, 60, 55, 68, 75] },
      { type: "3일폭발", theme: "burst", icon: "bolt", code: "086520", name: "에코프로", price: "78,300원", score: "콤마 89점", chart: [18, 30, 25, 42, 36, 55, 48, 62, 56, 74, 68, 88] },
      { type: "콤마형", theme: "comma", icon: "diamond", code: "005930", name: "삼성전자", price: "191,000원", score: "콤마 92점", chart: [14, 26, 22, 36, 30, 44, 40, 54, 50, 66, 62, 82] },
    ],
  },

  search: {
    title: "무엇을 찾으시나요?",
    placeholder: "종목명, 테마, 조건을 자연어로 검색해보세요",
    chips: ["지금 살 종목", "오늘 많이 오르는 종목", "거래량 급증 종목", "기관이 사는 종목"],
    aiChip: "AI에게 질문하기",
  },

  discovery: {
    title: "오늘의 발굴 현황",
    moreLabel: "자세히 보기",
    steps: [
      { icon: "globe", label: "전체 유니버스", count: "2,730종목", final: false },
      { icon: "funnel", label: "안전성 통과", count: "1,605종목", final: false },
      { icon: "magnify", label: "수급 분석", count: "219종목", final: false },
      { icon: "doc", label: "재무 분석", count: "61종목", final: false },
      { icon: "target", label: "최종 발굴", count: "51종목", final: true },
    ],
  },

  briefing: {
    title: "오늘의 시장 브리핑",
    message: "반도체와 전력 업종이 시장을 주도하고 있습니다.",
    buttonLabel: "브리핑 읽기",
  },

  nav: [
    { icon: "home", label: "홈", active: true },
    { icon: "stock", label: "종목", active: false },
    { icon: "comma", label: "콤마", active: false },
    { icon: "ai", label: "AI", active: false },
    { icon: "chart", label: "차트", active: false },
  ],
};

// =====================================================================
// 실데이터 매핑 계층 — /api/analyze 응답(백엔드 분석 결과)을 표시용 데이터로 변환.
// 점수/구간/판단 규칙은 PC GUI(public/index.html)와 완전히 동일하다.
// UI(render.js)는 이 결과를 그대로 표시만 한다.
// =====================================================================
(function () {
  const fmt = new Intl.NumberFormat("ko-KR");
  const roundPrice = (v) => Math.round(v / 100) * 100;

  // 캔들 종가 → 0~100 정규화 좌표 (차트 표시용)
  function normalize(closes) {
    const min = Math.min(...closes), max = Math.max(...closes);
    const span = max - min || 1;
    return closes.map((c) => ((c - min) / span) * 100);
  }

  // 콤마 점수 — PC GUI의 commaScore와 동일
  window.COMMA_SCORE = function (r) {
    let s = 0;
    s += Math.min(50, Number(r.strength) * 0.5);
    if (r.clean) s += 15;
    if (r.breakout) s += 20;
    if (r.flow === "매수 우위") s += 15;
    else if (r.flow === "중립") s += 7;
    return Math.round(s);
  };

  // 포착 종목 카드 데이터 — PC GUI의 renderHero와 동일한 매핑
  window.COMMA_MAP_PICK = function (r) {
    const prev = window.COMMA_DATA.pick;
    const closes = r.candles.map((c) => c.close);
    const totalVol = r.candles.reduce((a, c) => a + c.volume, 0);
    const totalAmt = r.candles.reduce((a, c) => a + c.volume * c.close, 0);
    const score = window.COMMA_SCORE(r);

    let change = prev.change, changeDown = false;
    if (r.prevClose) {
      const pct = ((r.current - r.prevClose) / r.prevClose) * 100;
      changeDown = pct < 0;
      change = (pct >= 0 ? "▲ " : "▼ ") + Math.abs(pct).toFixed(2) + "%";
    }

    const ok = r.result !== "진입 금지";
    const unmet = [
      r.clean ? null : "노이즈",
      r.breakout ? null : "돌파",
      Number(r.strength) >= 60 ? null : "체결강도",
      r.flow === "매수 우위" ? null : "수급",
    ].filter(Boolean).join(" · ");

    return {
      ...prev,
      code: r.code,
      name: r.name,
      price: fmt.format(r.current) + "원",
      change,
      changeDown,
      chips: [
        { label: "거래대금", value: fmt.format(Math.round(totalAmt / 1e8)) + "억" },
        { label: "거래량", value: fmt.format(Math.round(totalVol / 10000)) + "만주" },
        prev.chips[2], // 시가총액: API 미제공 — PC GUI와 동일하게 기존 값 유지
      ],
      score: { ...prev.score, value: score + "점", percent: score },
      signal: ok ? "지금 관심을 가져볼 자리" : "지금은 지켜볼 자리",
      signalWarn: !ok,
      description: ok
        ? ["수급과 실적이 함께 좋아지는 구간", "상승 가능성이 높은 자리입니다."]
        : ["진입 조건(" + unmet + ")이", "아직 충족되지 않았습니다."],
      buyZone: { label: "매수구간", value: fmt.format(roundPrice(r.current * 0.975)) + " ~ " + fmt.format(roundPrice(r.current * 0.995)) + "원" },
      targetZone: { label: "목표구간", value: fmt.format(roundPrice(r.current * 1.07)) + " ~ " + fmt.format(roundPrice(r.current * 1.12)) + "원" },
      chart: normalize(closes),
    };
  };

  // 추천 카드 데이터 — PC GUI의 loadReco와 동일한 매핑
  window.COMMA_MAP_RECO = function (card, r) {
    return {
      ...card,
      price: fmt.format(r.current) + "원",
      score: "콤마 " + window.COMMA_SCORE(r) + "점",
      chart: normalize(r.candles.map((c) => c.close)),
    };
  };
})();
