// 퀴즈 문항 데이터 (카테고리 4개 × 10문항 = 40문항) - 주제: NCT
// 문항 작성 규칙은 CLAUDE.md의 "문항 작성 규칙"을 따르고, 해설의 출처 표기와 길이는 PRD.md 4.2를 따른다.
// 형식: { id, category, question, choices: [보기 4개], answer: 정답 보기의 인덱스(0~3), explanation, source: { name, url } }
// 보기 순서는 script.js가 판마다 섞는다.
// 멤버 수처럼 시간이 지나면 바뀌는 사실은 문항으로 쓰지 않는다.

const NAMU = {
  n127: { name: "나무위키, NCT 127", url: "https://namu.wiki/w/NCT%20127" },
  dream: { name: "나무위키, NCT DREAM", url: "https://namu.wiki/w/NCT%20DREAM" },
  wayv: { name: "나무위키, WayV", url: "https://namu.wiki/w/WayV" },
  wish: { name: "나무위키, NCT WISH", url: "https://namu.wiki/w/NCT%20WISH" },
};

const CATEGORIES = [
  { id: "n127", name: "NCT 127" },
  { id: "dream", name: "NCT DREAM" },
  { id: "wayv", name: "WayV" },
  { id: "wish", name: "NCT WISH" },
];

const QUESTIONS = [
  // ── NCT 127 ──
  { id: "n127-01", category: "n127", question: "NCT 127의 이름에 들어간 '127'이 뜻하는 것은?", choices: ["서울의 경도", "서울의 위도", "데뷔 날짜", "연습생 번호"], answer: 0,
    explanation: "127은 서울의 경도로, 서울을 중심으로 활동한다는 뜻을 담았다.", source: NAMU.n127 },
  { id: "n127-02", category: "n127", question: "NCT 127이 데뷔한 해는?", choices: ["2016년", "2015년", "2017년", "2018년"], answer: 0,
    explanation: "NCT 127은 2016년 7월 7일에 데뷔했다.", source: NAMU.n127 },
  { id: "n127-03", category: "n127", question: "NCT 127의 데뷔 음반인 미니 1집의 이름은?", choices: ["NCT #127", "Regular-Irregular", "Neo Zone", "Sticker"], answer: 0,
    explanation: "데뷔 음반은 2016년 7월 발매한 미니 1집 「NCT #127」이다.", source: NAMU.n127 },
  { id: "n127-04", category: "n127", question: "NCT 127의 정규 1집 이름은?", choices: ["Regular-Irregular", "Neo Zone", "Fact Check", "Favorite"], answer: 0,
    explanation: "NCT 127의 정규 1집은 「Regular-Irregular」다.", source: NAMU.n127 },
  { id: "n127-05", category: "n127", question: "NCT 127의 정규 2집 이름은?", choices: ["Neo Zone", "Sticker", "WALK", "Ay-Yo"], answer: 0,
    explanation: "NCT 127의 정규 2집은 「Neo Zone」이다.", source: NAMU.n127 },
  { id: "n127-06", category: "n127", question: "NCT 127 정규 3집 「Sticker」의 리패키지 앨범 이름은?", choices: ["Favorite", "Ay-Yo", "Regulate", "Hello Future"], answer: 0,
    explanation: "정규 3집 「Sticker」의 리패키지는 「Favorite」이다.", source: NAMU.n127 },
  { id: "n127-07", category: "n127", question: "NCT 127 정규 4집 「질주 (2 Baddies)」의 리패키지 앨범 이름은?", choices: ["Ay-Yo", "Favorite", "Neo Zone", "Glitch Mode"], answer: 0,
    explanation: "정규 4집 「질주 (2 Baddies)」의 리패키지는 「Ay-Yo」다.", source: NAMU.n127 },
  { id: "n127-08", category: "n127", question: "NCT 127 미니 3집의 이름은?", choices: ["NCT #127 CHERRY BOMB", "NCT #127 LIMITLESS", "NCT #127 Regulate", "NCT #127 WE ARE SUPERHUMAN"], answer: 0,
    explanation: "미니 3집은 「NCT #127 CHERRY BOMB」이다.", source: NAMU.n127 },
  { id: "n127-09", category: "n127", question: "NCT 127의 팬덤 이름은?", choices: ["NCTzen 127", "NCTzen DREAM", "NCTzen WISH", "WayZenNi"], answer: 0,
    explanation: "NCT 127의 팬덤 이름은 NCTzen 127(엔시티즌 127)이다.", source: NAMU.n127 },
  { id: "n127-10", category: "n127", question: "NCT 127의 정규 5집 이름은?", choices: ["Fact Check", "WALK", "Sticker", "ISTJ"], answer: 0,
    explanation: "NCT 127의 정규 5집은 「Fact Check」다.", source: NAMU.n127 },

  // ── NCT DREAM ──
  { id: "dream-01", category: "dream", question: "NCT DREAM이 2016년 8월에 낸 데뷔 디지털 싱글은?", choices: ["Chewing Gum", "We Young", "We Go Up", "Candy"], answer: 0,
    explanation: "NCT DREAM은 디지털 싱글 「Chewing Gum」으로 데뷔했다.", source: NAMU.dream },
  { id: "dream-02", category: "dream", question: "NCT DREAM의 팬덤 이름은?", choices: ["NCTzen DREAM", "NCTzen 127", "NCTzen WISH", "WayZenNi"], answer: 0,
    explanation: "NCT DREAM의 팬덤 이름은 NCTzen DREAM(엔시티즌 드림)이다.", source: NAMU.dream },
  { id: "dream-03", category: "dream", question: "NCT DREAM이 2021년에 낸 정규 1집 이름은?", choices: ["맛 (Hot Sauce)", "Glitch Mode", "ISTJ", "DREAMSCAPE"], answer: 0,
    explanation: "NCT DREAM의 정규 1집은 2021년 발매한 「맛 (Hot Sauce)」이다.", source: NAMU.dream },
  { id: "dream-04", category: "dream", question: "NCT DREAM 정규 1집 「맛 (Hot Sauce)」의 리패키지 앨범 이름은?", choices: ["Hello Future", "Favorite", "Ay-Yo", "Beatbox"], answer: 0,
    explanation: "정규 1집의 리패키지는 2021년 발매한 「Hello Future」다.", source: NAMU.dream },
  { id: "dream-05", category: "dream", question: "NCT DREAM이 2022년에 낸 정규 2집 이름은?", choices: ["Glitch Mode", "ISTJ", "Hello Future", "We Go Up"], answer: 0,
    explanation: "NCT DREAM의 정규 2집은 2022년 발매한 「Glitch Mode」다.", source: NAMU.dream },
  { id: "dream-06", category: "dream", question: "NCT DREAM이 2023년에 낸 정규 3집 이름은?", choices: ["ISTJ", "ENFP", "INTJ", "ESTP"], answer: 0,
    explanation: "NCT DREAM의 정규 3집은 2023년 발매한 「ISTJ」다.", source: NAMU.dream },
  { id: "dream-07", category: "dream", question: "NCT DREAM이 2024년에 낸 정규 4집 이름은?", choices: ["DREAMSCAPE", "DREAMLAND", "DREAMSHOW", "DREAMDAY"], answer: 0,
    explanation: "NCT DREAM의 정규 4집은 2024년 발매한 「DREAMSCAPE」다.", source: NAMU.dream },
  { id: "dream-08", category: "dream", question: "NCT DREAM이 2017년에 낸 미니 1집 이름은?", choices: ["We Young", "We Go Up", "We Boom", "Reload"], answer: 0,
    explanation: "NCT DREAM의 미니 1집은 2017년 발매한 「We Young」이다.", source: NAMU.dream },
  { id: "dream-09", category: "dream", question: "NCT DREAM이 2018년에 낸 미니 2집 이름은?", choices: ["We Go Up", "We Young", "We Boom", "Reload"], answer: 0,
    explanation: "NCT DREAM의 미니 2집은 2018년 발매한 「We Go Up」이다.", source: NAMU.dream },
  { id: "dream-10", category: "dream", question: "NCT DREAM이 2023년 일본 데뷔 때 낸 싱글은?", choices: ["Best Friend Ever", "Moonlight", "Chewing Gum", "Candy"], answer: 0,
    explanation: "NCT DREAM은 2023년 2월 싱글 「Best Friend Ever」로 일본에 데뷔했다.", source: NAMU.dream },

  // ── WayV ──
  { id: "wayv-01", category: "wayv", question: "WayV가 데뷔한 해는?", choices: ["2019년", "2017년", "2018년", "2020년"], answer: 0,
    explanation: "WayV는 2019년 1월 17일에 데뷔했다.", source: NAMU.wayv },
  { id: "wayv-02", category: "wayv", question: "WayV의 데뷔 음반인 디지털 EP 이름은?", choices: ["The Vision", "Take Off", "Take Over The Moon", "Awaken The World"], answer: 0,
    explanation: "WayV는 디지털 EP 「The Vision」으로 데뷔했다.", source: NAMU.wayv },
  { id: "wayv-03", category: "wayv", question: "WayV의 중국어 이름은?", choices: ["威神V", "威尼V", "未来V", "威龙V"], answer: 0,
    explanation: "WayV의 중국어 이름은 威神V(웨이션V)다.", source: NAMU.wayv },
  { id: "wayv-04", category: "wayv", question: "WayV가 소속된, SM엔터테인먼트와 중국 기업의 합작 레이블은?", choices: ["LABEL V", "LABEL W", "SM China", "V Station"], answer: 0,
    explanation: "WayV는 SM과 중국 기업의 합작 레이블인 LABEL V 소속이다.", source: NAMU.wayv },
  { id: "wayv-05", category: "wayv", question: "WayV의 팬덤 이름은?", choices: ["WayZenNi", "NCTzen 127", "NCTzen DREAM", "NCTzen WISH"], answer: 0,
    explanation: "WayV의 팬덤 이름은 WayZenNi(웨이즈니)다.", source: NAMU.wayv },
  { id: "wayv-06", category: "wayv", question: "WayV가 2019년에 낸 미니 1집 이름은?", choices: ["Take Off", "Kick Back", "Phantom", "On My Youth"], answer: 0,
    explanation: "WayV의 미니 1집은 2019년 발매한 「Take Off」다.", source: NAMU.wayv },
  { id: "wayv-07", category: "wayv", question: "WayV가 2021년에 낸 미니 3집 이름은?", choices: ["Kick Back", "Take Off", "Phantom", "Give Me That"], answer: 0,
    explanation: "WayV의 미니 3집은 2021년 발매한 「Kick Back」이다.", source: NAMU.wayv },
  { id: "wayv-08", category: "wayv", question: "WayV가 2022년에 낸 미니 4집 이름은?", choices: ["Phantom", "Kick Back", "Take Off", "FREQUENCY"], answer: 0,
    explanation: "WayV의 미니 4집은 2022년 발매한 「Phantom」이다.", source: NAMU.wayv },
  { id: "wayv-09", category: "wayv", question: "WayV 멤버 텐(TEN)의 국적은?", choices: ["태국", "중국", "대만", "일본"], answer: 0,
    explanation: "WayV 멤버 가운데 텐은 태국 국적이다.", source: NAMU.wayv },
  { id: "wayv-10", category: "wayv", question: "WayV 멤버 양양(YANGYANG)의 국적은?", choices: ["대만", "태국", "중국", "일본"], answer: 0,
    explanation: "WayV 멤버 가운데 양양은 대만 국적이다.", source: NAMU.wayv },

  // ── NCT WISH ──
  { id: "wish-01", category: "wish", question: "NCT WISH가 공식 데뷔일(2024년 2월 21일)에 데뷔곡 무대를 처음 선보인 도시는?", choices: ["도쿄", "서울", "오사카", "방콕"], answer: 0,
    explanation: "SMTOWN LIVE 2024 도쿄 공연에서 데뷔곡 무대를 처음 선보였다.", source: NAMU.wish },
  { id: "wish-02", category: "wish", question: "NCT WISH의 데뷔곡 제목은?", choices: ["WISH", "Songbird", "Steady", "poppop"], answer: 0,
    explanation: "NCT WISH의 데뷔곡은 「WISH」다.", source: NAMU.wish },
  { id: "wish-03", category: "wish", question: "NCT WISH 멤버 일부를 뽑은 SM의 서바이벌 프로그램은?", choices: ["NCT Universe: LASTART", "NCT Universe: RESTART", "NCT Universe: NEWSTART", "NCT Universe: FIRSTART"], answer: 0,
    explanation: "멤버 4명은 「NCT Universe: LASTART」를 통해 뽑혔다.", source: NAMU.wish },
  { id: "wish-04", category: "wish", question: "「NCT Universe: LASTART」를 통해 NCT WISH가 결성된 해는?", choices: ["2023년", "2022년", "2024년", "2021년"], answer: 0,
    explanation: "NCT WISH는 2023년 9월 「NCT Universe: LASTART」를 통해 결성되었다.", source: NAMU.wish },
  { id: "wish-05", category: "wish", question: "NCT WISH의 팬덤 이름은?", choices: ["NCTzen WISH", "NCTzen 127", "NCTzen DREAM", "WayZenNi"], answer: 0,
    explanation: "NCT WISH의 팬덤 이름은 NCTzen WISH(엔시티즌 위시)다.", source: NAMU.wish },
  { id: "wish-06", category: "wish", question: "NCT WISH의 캐치프레이즈는?", choices: ["WISH for Our WISH", "Make a WISH", "WISH Upon a Star", "Dream of WISH"], answer: 0,
    explanation: "NCT WISH의 캐치프레이즈는 'WISH for Our WISH'다.", source: NAMU.wish },
  { id: "wish-07", category: "wish", question: "NCT WISH가 2024년 7월에 낸 싱글 2집 이름은?", choices: ["Songbird", "Steady", "WISH", "COLOR"], answer: 0,
    explanation: "NCT WISH의 싱글 2집은 2024년 7월 발매한 「Songbird」다.", source: NAMU.wish },
  { id: "wish-08", category: "wish", question: "NCT WISH의 일본 활동 레이블은?", choices: ["Avex Trax", "Sony Music", "Universal Music", "Victor"], answer: 0,
    explanation: "NCT WISH의 일본 레이블은 Avex Trax(유통 에이벡스 엔터테인먼트)다.", source: NAMU.wish },
  { id: "wish-09", category: "wish", question: "NCT WISH가 2025년 4월에 낸 미니 2집 이름은?", choices: ["poppop", "COLOR", "Steady", "Songbird"], answer: 0,
    explanation: "NCT WISH의 미니 2집은 2025년 4월 발매한 「poppop」이다.", source: NAMU.wish },
  { id: "wish-10", category: "wish", question: "NCT WISH가 2025년 9월에 낸 미니 3집 이름은?", choices: ["COLOR", "poppop", "Steady", "WISH"], answer: 0,
    explanation: "NCT WISH의 미니 3집은 2025년 9월 발매한 「COLOR」다.", source: NAMU.wish },
];
