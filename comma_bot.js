const axios = require("axios");

// =======================
// 1분봉 데이터
// =======================
async function fetch1m(code) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${code}.KS?range=1d&interval=1m`;
  const res = await axios.get(url);

  const r = res.data.chart.result[0];
  const closes = r.indicators.quote[0].close;
  const volumes = r.indicators.quote[0].volume;

  return closes.map((c, i) => ({
    close: c,
    volume: volumes[i],
  })).filter(x => x.close);
}

// =======================
// 노이즈 필터
// =======================
function noiseFilter(data) {
  if (data.length < 15) return false;

  const last = data.slice(-5);
  const prices = last.map(x => x.close);

  const low = Math.min(...prices);
  const high = Math.max(...prices);

  return (high - low) / low < 0.03;
}

// =======================
// 돌파 감지
// =======================
function detectBreakout(data) {
  const recent = data.slice(-15);

  const prevHigh = Math.max(...recent.slice(0, 14).map(x => x.close));
  const current = recent[14].close;

  const avgVol = recent.slice(0, 14)
    .reduce((a, b) => a + b.volume, 0) / 14;

  const currentVol = recent[14].volume;

  return current > prevHigh && currentVol > avgVol * 2;
}

// =======================
// 체결강도
// =======================
function calcStrength(data) {
  const last = data.slice(-10);

  let up = 0, down = 0;

  for (let i = 1; i < last.length; i++) {
    if (last[i].close > last[i - 1].close) up++;
    else if (last[i].close < last[i - 1].close) down++;
  }

  return (up / (up + down || 1)) * 100;
}

// =======================
// 수급 방향
// =======================
function orderFlow(data) {
  const last = data.slice(-10);

  let buy = 0, sell = 0;

  for (let i = 1; i < last.length; i++) {
    if (last[i].close >= last[i - 1].close) buy += last[i].volume;
    else sell += last[i].volume;
  }

  if (buy > sell * 1.3) return "매수 우위";
  if (sell > buy * 1.3) return "매도 우위";
  return "중립";
}

// =======================
// 종합 점수 (0 ~ 100)
// =======================
// 체결강도 40점 + 돌파 25점 + 수급 20점 + 노이즈 통과 15점
function calcScore(data) {
  const clean = noiseFilter(data);
  const breakout = detectBreakout(data);
  const strength = calcStrength(data);
  const flow = orderFlow(data);

  let score = 0;

  score += (strength / 100) * 40;

  if (breakout) score += 25;

  if (flow === "매수 우위") score += 20;
  else if (flow === "중립") score += 10;

  if (clean) score += 15;

  return {
    score: Math.round(score),
    clean,
    breakout,
    strength,
    flow,
  };
}

// =======================
// 점수 구간표 (단일 소스)
// =======================
// 등급 / 행동지침 / 설명문이 전부 이 테이블 한 곳에서 나온다.
// 점수 구간마다 문구가 다르므로 점수가 조금만 달라도 설명이 달라지고,
// 같은 점수에서 "매수해라"와 "매수하지 마라"가 동시에 나오는 일이 없다.
// min: 이 구간이 시작되는 점수 (내림차순 정렬 유지 필수)
const SCORE_BANDS = [
  {
    min: 90,
    grade: "🔥 S급",
    action: "10~20% 진입",
    desc: "모든 조건이 완벽하게 충족된 최상급 자리입니다. 지금이 매수하기 가장 좋은 타이밍입니다.",
  },
  {
    min: 85,
    grade: "🔥 S급",
    action: "10~15% 진입",
    desc: "거의 모든 조건이 충족된 매우 좋은 매수 자리입니다. 비중을 조금 낮춰 진입하세요.",
  },
  {
    min: 80,
    grade: "⭐ A급",
    action: "10% 이내 진입",
    desc: "조건 대부분이 충족된 좋은 자리입니다. 소폭 부족한 부분이 있으니 비중은 10% 이내로 제한하세요.",
  },
  {
    min: 75,
    grade: "⭐ A급",
    action: "5~10% 소량 진입",
    desc: "매수 가능한 자리이지만 일부 조건이 약합니다. 소량만 진입하고 추가 매수는 신호 확인 후 하세요.",
  },
  {
    min: 70,
    grade: "✅ B급",
    action: "5% 이내 시험 진입",
    desc: "나쁘지 않은 자리입니다. 다만 확신 구간은 아니므로 시험 삼아 최소 비중만 진입하세요.",
  },
  {
    min: 65,
    grade: "✅ B급",
    action: "진입 보류, 재확인",
    desc: "조건이 절반 이상 충족됐지만 아직 진입 근거가 부족합니다. 다음 봉에서 점수가 오르는지 확인 후 결정하세요.",
  },
  {
    min: 60,
    grade: "👀 C급",
    action: "관망",
    desc: "방향이 나쁘지는 않지만 매수 근거가 약합니다. 지금은 지켜보는 것이 좋습니다.",
  },
  {
    min: 50,
    grade: "👀 C급",
    action: "관망",
    desc: "매수와 매도 신호가 섞여 있는 애매한 구간입니다. 진입하지 말고 관망하세요.",
  },
  {
    min: 40,
    grade: "⚠️ D급",
    action: "진입 비추천",
    desc: "조건 미충족 항목이 더 많습니다. 이 자리에서의 매수는 추천하지 않습니다.",
  },
  {
    min: 30,
    grade: "⚠️ D급",
    action: "진입 금지",
    desc: "매수 근거가 거의 없습니다. 진입하지 마세요.",
  },
  {
    min: 15,
    grade: "🚫 F급",
    action: "진입 금지",
    desc: "조건이 대부분 미충족인 나쁜 자리입니다. 절대 진입하지 마세요.",
  },
  {
    min: 0,
    grade: "🚫 F급",
    action: "진입 금지",
    desc: "최악의 자리입니다. 매수 금지이며, 보유 중이라면 리스크 관리가 필요합니다.",
  },
];

// 점수 → 구간 문구 (등급/행동/설명이 항상 한 세트로 반환됨)
function describeScore(score) {
  return SCORE_BANDS.find(b => score >= b.min);
}

// =======================
// 조건별 상세 사유
// =======================
// 사실만 서술한다. 매수/매도 판단 문구는 여기 넣지 않는다.
// (판단은 SCORE_BANDS에서만 나오게 해서 모순을 차단)
function buildReasons({ clean, breakout, strength, flow }) {
  const reasons = [];

  reasons.push(clean
    ? "✔ 노이즈 필터 통과 (최근 흐름 안정)"
    : "✘ 노이즈 필터 미통과 (최근 변동성 과다)");

  reasons.push(breakout
    ? "✔ 전고점 돌파 + 거래량 2배 이상"
    : "✘ 돌파 신호 없음");

  reasons.push(strength >= 60
    ? `✔ 체결강도 양호 (${strength.toFixed(0)}%)`
    : `✘ 체결강도 부족 (${strength.toFixed(0)}%)`);

  reasons.push(flow === "매수 우위"
    ? "✔ 수급 매수 우위"
    : flow === "중립"
      ? "△ 수급 중립"
      : "✘ 수급 매도 우위");

  return reasons;
}

// =======================
// 최종 판단
// =======================
function decision(data) {
  const s = calcScore(data);
  const band = describeScore(s.score);
  const reasons = buildReasons(s);

  return {
    current: data[data.length - 1].close,
    score: s.score,
    grade: band.grade,
    action: band.action,
    desc: band.desc,
    reasons,
    clean: s.clean,
    breakout: s.breakout,
    strength: s.strength.toFixed(0),
    flow: s.flow,
  };
}

// =======================
// 실행
// =======================
async function run() {
  const code = "005930"; // 테스트용 종목

  const data = await fetch1m(code);
  const res = decision(data);

  console.log("📊 결과\n");
  console.log(`현재가   : ${res.current}`);
  console.log(`점수     : ${res.score} / 100`);
  console.log(`등급     : ${res.grade}`);
  console.log(`행동지침 : ${res.action}`);
  console.log(`설명     : ${res.desc}`);
  console.log("\n세부 조건");
  res.reasons.forEach(r => console.log(`  ${r}`));
}

run();
