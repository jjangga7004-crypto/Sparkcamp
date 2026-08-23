// 불꽃캠프 오답 TOP5 카드뉴스 생성기 (1080x1080 인스타용 PNG)
// 사용법: node card-news.js <입력.json> <출력폴더>
// 입력 JSON: { week: "19주차 (8/22-23)", handle: "@인스타핸들", sample: false,
//   items: [ { rank:1, subject:"사문", source:"2024 수능 사회문화 17번",
//              trap:"함정 한 줄", key:"핵심 개념 한 줄", votes:3 }, ... ] }
// votes는 TOP5 선정용 내부 데이터 — 카드에 표시하지 않는다.
// ⚠️ 대외 콘텐츠(카드·캡션·톡방 공지)에 "조교" 언급 금지 (사용자 방침 2026-08-23).
// 출력: 00-cover.png, 01~05-item.png, 99-cta.png
// 출처(source)·원문 규칙 (사용자 방침 2026-08-23):
//   기출(수능·평가원·교육청) = 실명 표기("2024 수능 사회문화 17번") + 원문 게재 OK(사용자 확인).
//     원문은 생성 시점에 시험지 PDF에서 문항을 이미지로 크롭해 문제 카드(별장)로 추가하는 방식 권장.
//   자체 OX = "불꽃 모의고사 N회" 표기 가능(자체 브랜드).
//   사설 = 이름 절대 금지(타 업체 언급 금지)! source를 비우면 카드에 "이번 주 실전 문항"으로 익명 처리됨. 내용(함정·핵심)만.
const fs = require('fs');
const path = require('path');
const sharp = require(path.join(process.env.CARDNEWS_NODE_MODULES || '.', 'node_modules', 'sharp'));

const [, , inputPath, outDir] = process.argv;
const cfg = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

const W = 1080, H = 1080;
const FIRE = '#FF5A2C', DEEP = '#E0410F', EMBER = '#FF9A3D',
  CREAM = '#FFF8F3', SOFT = '#FFE3D2', INK = '#181210', MUT = '#7C726A', LINE = '#EADDD1';
const FONT = 'Malgun Gothic, sans-serif';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 긴 문장 → 여러 줄 (대략 글자수 기준 줄바꿈)
function wrap(text, maxChars) {
  const words = String(text).split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; }
    else cur = (cur ? cur + ' ' : '') + w;
  }
  if (cur) lines.push(cur);
  return lines;
}
const tspans = (lines, x, y, lh) =>
  lines.map((l, i) => `<tspan x="${x}" y="${y + i * lh}">${esc(l)}</tspan>`).join('');

const bg = `
  <rect width="${W}" height="${H}" fill="${CREAM}"/>
  <circle cx="1020" cy="-40" r="300" fill="${EMBER}" opacity="0.14"/>
  <circle cx="40" cy="1100" r="240" fill="${FIRE}" opacity="0.10"/>`;

const brandBar = `
  <g font-family="${FONT}">
    <circle cx="84" cy="90" r="14" fill="${FIRE}"/>
    <text x="112" y="101" font-size="34" font-weight="900" fill="${INK}">불꽃캠프</text>
    <text x="996" y="101" text-anchor="end" font-size="26" font-weight="700" fill="${MUT}">${esc(cfg.handle || '@sparkcamp_2026')}</text>
  </g>`;

const sampleTag = cfg.sample ? `
  <g font-family="${FONT}"><rect x="800" y="140" width="196" height="52" rx="26" fill="${INK}"/>
  <text x="898" y="175" text-anchor="middle" font-size="26" font-weight="800" fill="#fff">디자인 시안</text></g>` : '';

async function png(svg, name) {
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, name));
  console.log('생성:', name);
}

(async () => {
  // ── 표지 ──
  await png(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${bg}${brandBar}${sampleTag}
    <g font-family="${FONT}">
      <text x="84" y="340" font-size="40" font-weight="800" fill="${DEEP}">불꽃캠프 오답 리포트 · ${esc(cfg.week)}</text>
      <text x="80" y="470" font-size="88" font-weight="900" fill="${INK}">이번 주 애들이</text>
      <text x="80" y="580" font-size="88" font-weight="900" fill="${INK}">가장 많이 틀린 문제</text>
      <text x="80" y="716" font-size="110" font-weight="900" fill="${FIRE}">TOP 5</text>
      <text x="84" y="820" font-size="32" font-weight="600" fill="${MUT}">이번 주 캠프 모의고사에서 그대로 뽑았습니다</text>
      <rect x="84" y="900" width="380" height="72" rx="36" fill="${FIRE}"/>
      <text x="274" y="948" text-anchor="middle" font-size="32" font-weight="800" fill="#fff">넘겨서 확인 →</text>
    </g></svg>`, '00-cover.png');

  // ── 문항 카드 ──
  for (const it of cfg.items) {
    const trapLines = wrap(it.trap, 24);
    const keyLines = wrap(it.key, 22);
    await png(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${bg}${brandBar}${sampleTag}
      <g font-family="${FONT}">
        <circle cx="140" cy="300" r="58" fill="${FIRE}"/>
        <text x="140" y="322" text-anchor="middle" font-size="56" font-weight="900" fill="#fff">${it.rank}</text>
        <text x="230" y="282" font-size="34" font-weight="800" fill="${DEEP}">${esc(it.subject)}</text>
        <text x="230" y="336" font-size="44" font-weight="900" fill="${INK}">${esc(it.source || '이번 주 실전 문항')}</text>
        <rect x="84" y="420" width="912" height="${100 + trapLines.length * 54}" rx="24" fill="#fff" stroke="${LINE}" stroke-width="2"/>
        <text x="120" y="482" font-size="30" font-weight="800" fill="${MUT}">😵 왜 이렇게 많이 틀렸나</text>
        <text font-size="40" font-weight="800" fill="${INK}">${tspans(trapLines, 120, 545, 54)}</text>
        <rect x="84" y="${560 + trapLines.length * 54}" width="912" height="${100 + keyLines.length * 54}" rx="24" fill="${SOFT}"/>
        <text x="120" y="${622 + trapLines.length * 54}" font-size="30" font-weight="800" fill="${DEEP}">🔑 핵심 한 줄</text>
        <text font-size="40" font-weight="900" fill="${DEEP}">${tspans(keyLines, 120, 685 + trapLines.length * 54, 54)}</text>
        <text x="84" y="1010" font-size="28" font-weight="700" fill="${MUT}">🔥 불꽃캠프 오답 리포트 · ${esc(cfg.week)}</text>
      </g></svg>`, `${String(it.rank).padStart(2, '0')}-item.png`);
  }

  // ── CTA ──
  await png(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${bg}${brandBar}${sampleTag}
    <g font-family="${FONT}">
      <text x="80" y="380" font-size="72" font-weight="900" fill="${INK}">이 문제들,</text>
      <text x="80" y="480" font-size="72" font-weight="900" fill="${INK}">캠프에서는 <tspan fill="${FIRE}">그날</tspan></text>
      <text x="80" y="580" font-size="72" font-weight="900" fill="${INK}"><tspan fill="${FIRE}">다시 맞히고</tspan> 갑니다.</text>
      <text x="84" y="690" font-size="34" font-weight="600" fill="${MUT}">풀고 → 고치고 → 그날 재시험 100점제</text>
      <rect x="84" y="800" width="912" height="120" rx="28" fill="${FIRE}"/>
      <text x="540" y="875" text-anchor="middle" font-size="40" font-weight="900" fill="#fff">상담·시간표는 프로필 링크에서</text>
      <text x="84" y="1000" font-size="26" font-weight="600" fill="${MUT}">대치동 탑스터디 · 사회문화 | 생활과윤리 | 윤리와사상</text>
    </g></svg>`, '99-cta.png');
})();
