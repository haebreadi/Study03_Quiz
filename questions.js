// 퀴즈 문항 데이터
// 문항 작성 규칙은 CLAUDE.md의 "문항 작성 규칙"을 따른다.
// 형식: { id, category, question, choices: [4개], answer: 정답 인덱스(0~3), explanation }

const CATEGORIES = [
  { id: "general", name: "일반 상식", icon: "💡" },
  { id: "science", name: "과학", icon: "🔬" },
  { id: "history", name: "한국사", icon: "📜" },
  { id: "computer", name: "컴퓨터", icon: "💻" },
];

const QUESTIONS = [
  // ── 일반 상식 ──
  { id: "gen-01", category: "general", question: "대한민국의 수도는 어디인가?", choices: ["서울", "부산", "인천", "대전"], answer: 0, explanation: "대한민국의 수도는 서울이다." },
  { id: "gen-02", category: "general", question: "1년은 보통 며칠인가?", choices: ["360일", "364일", "365일", "366일"], answer: 2, explanation: "평년은 365일이고, 윤년은 366일이다." },
  { id: "gen-03", category: "general", question: "무지개의 색은 보통 몇 가지로 나타내는가?", choices: ["5가지", "6가지", "7가지", "8가지"], answer: 2, explanation: "빨주노초파남보, 7가지 색으로 나타낸다." },
  { id: "gen-04", category: "general", question: "세계에서 면적이 가장 큰 나라는?", choices: ["캐나다", "중국", "미국", "러시아"], answer: 3, explanation: "러시아는 면적이 약 1,710만㎢로 세계에서 가장 넓다." },
  { id: "gen-05", category: "general", question: "축구 경기에서 한 팀이 경기장에 내보내는 선수는 몇 명인가?", choices: ["9명", "10명", "11명", "12명"], answer: 2, explanation: "축구는 골키퍼를 포함해 한 팀 11명이 경기한다." },

  // ── 과학 ──
  { id: "sci-01", category: "science", question: "물의 화학식은?", choices: ["CO₂", "H₂O", "O₂", "NaCl"], answer: 1, explanation: "물은 수소 원자 2개와 산소 원자 1개로 이루어진 H₂O이다." },
  { id: "sci-02", category: "science", question: "태양계에서 가장 큰 행성은?", choices: ["토성", "지구", "목성", "해왕성"], answer: 2, explanation: "목성은 태양계에서 가장 큰 행성이다." },
  { id: "sci-03", category: "science", question: "1기압에서 물이 끓는 온도는?", choices: ["90℃", "100℃", "110℃", "120℃"], answer: 1, explanation: "1기압에서 물의 끓는점은 100℃이다." },
  { id: "sci-04", category: "science", question: "식물이 빛을 이용해 양분을 만드는 과정은?", choices: ["광합성", "호흡", "증산 작용", "발효"], answer: 0, explanation: "광합성은 빛 에너지로 이산화탄소와 물에서 포도당을 만드는 과정이다." },
  { id: "sci-05", category: "science", question: "사람의 혈액에서 산소를 운반하는 세포는?", choices: ["백혈구", "혈소판", "림프구", "적혈구"], answer: 3, explanation: "적혈구 속 헤모글로빈이 산소를 운반한다." },

  // ── 한국사 ──
  { id: "his-01", category: "history", question: "훈민정음을 만든 조선의 왕은?", choices: ["태조", "세종", "정조", "영조"], answer: 1, explanation: "세종대왕이 훈민정음을 만들어 1446년에 반포했다." },
  { id: "his-02", category: "history", question: "임진왜란 때 거북선을 이끌고 활약한 장군은?", choices: ["강감찬", "을지문덕", "이순신", "김유신"], answer: 2, explanation: "이순신 장군은 거북선을 앞세워 여러 해전에서 승리했다." },
  { id: "his-03", category: "history", question: "고려를 세운 사람은?", choices: ["왕건", "이성계", "궁예", "견훤"], answer: 0, explanation: "왕건이 918년에 고려를 세웠다." },
  { id: "his-04", category: "history", question: "3·1 운동이 일어난 해는?", choices: ["1910년", "1919년", "1945년", "1950년"], answer: 1, explanation: "3·1 운동은 1919년 3월 1일에 일어났다." },
  { id: "his-05", category: "history", question: "삼국 통일을 이룬 나라는?", choices: ["고구려", "백제", "가야", "신라"], answer: 3, explanation: "신라가 당과 연합해 삼국을 통일했다." },

  // ── 컴퓨터 ──
  { id: "com-01", category: "computer", question: "웹 페이지의 구조를 작성하는 언어는?", choices: ["CSS", "HTML", "SQL", "Python"], answer: 1, explanation: "HTML은 웹 페이지의 구조와 내용을 작성하는 마크업 언어이다." },
  { id: "com-02", category: "computer", question: "1바이트는 몇 비트인가?", choices: ["4비트", "8비트", "16비트", "32비트"], answer: 1, explanation: "1바이트는 8비트이다." },
  { id: "com-03", category: "computer", question: "컴퓨터의 중앙 처리 장치를 뜻하는 약어는?", choices: ["GPU", "RAM", "CPU", "SSD"], answer: 2, explanation: "CPU(Central Processing Unit)는 명령을 해석하고 실행한다." },
  { id: "com-04", category: "computer", question: "깃허브에서 웹 페이지를 무료로 배포하는 기능은?", choices: ["GitHub Pages", "GitHub Issues", "GitHub Copilot", "GitHub Gist"], answer: 0, explanation: "GitHub Pages는 저장소의 파일로 정적 웹 페이지를 배포한다." },
  { id: "com-05", category: "computer", question: "웹 페이지의 모양(색, 글꼴, 배치)을 꾸미는 언어는?", choices: ["JavaScript", "HTML", "Java", "CSS"], answer: 3, explanation: "CSS는 웹 페이지의 스타일을 지정한다." },
];
