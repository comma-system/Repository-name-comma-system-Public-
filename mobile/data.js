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
    cards: [
      { type: "안전형", theme: "safe", icon: "shield", name: "SK하이닉스", price: "248,500원", score: "콤마 86점", chart: [20, 35, 28, 45, 38, 30, 42, 55, 48, 62, 58, 72] },
      { type: "공격형", theme: "aggressive", icon: "fire", name: "한미반도체", price: "135,800원", score: "콤마 91점", chart: [15, 28, 22, 40, 32, 50, 44, 38, 58, 52, 70, 80] },
      { type: "기관매집", theme: "inst", icon: "bank", name: "현대차", price: "203,000원", score: "콤마 84점", chart: [25, 20, 35, 30, 45, 38, 52, 46, 60, 55, 68, 75] },
      { type: "3일폭발", theme: "burst", icon: "bolt", name: "에코프로", price: "78,300원", score: "콤마 89점", chart: [18, 30, 25, 42, 36, 55, 48, 62, 56, 74, 68, 88] },
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
