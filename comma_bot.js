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
// 최종 판단
// =======================
function decision(data) {
  const clean = noiseFilter(data);
  const breakout = detectBreakout(data);
  const strength = calcStrength(data);
  const flow = orderFlow(data);

  let result = "진입 금지";
  let action = "패스";

  if (clean && breakout && strength >= 60 && flow === "매수 우위") {
    result = "🔥 S급";
    action = "10~20% 진입";
  }

  return {
    current: data[data.length - 1].close,
    clean,
    breakout,
    strength: strength.toFixed(0),
    flow,
    result,
    action,
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
  console.log(res);
}

run();
