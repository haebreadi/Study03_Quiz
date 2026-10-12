// 퀴즈 게임 - 화면 흐름: 카테고리 선택 → 모드 선택 → 문제 풀이 → 결과
const TIME_LIMIT = 15;     // 스피드 모드 문항당 제한 시간(초)
const HINT_SCORE = 0.5;    // 힌트를 쓰고 맞힌 문항의 점수
const MODE_NAMES = { practice: "연습", speed: "스피드", hint: "힌트" };

const state = {
  category: null,   // 고른 카테고리 id
  mode: null,       // practice | speed | hint
  list: [],         // 이번 회차에 풀 문항 목록
  index: 0,
  score: 0,
  results: [],      // { q, chosen, correct, timeout, usedHint }
  usedHint: false,
  answered: false,
  timerId: null,
  timeLeft: TIME_LIMIT,
  isRetry: false,
};

const $ = (id) => document.getElementById(id);

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("screen-" + name).classList.add("active");
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

// ── 1. 카테고리 ──
function renderCategories() {
  const box = $("category-list");
  box.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const count = QUESTIONS.filter((q) => q.category === c.id).length;
    const btn = document.createElement("button");
    btn.className = "card";
    btn.innerHTML = `<span class="card-icon">${c.icon}</span><span class="card-name">${c.name}</span><span class="card-desc">${count}문항</span>`;
    btn.addEventListener("click", () => selectCategory(c.id));
    box.appendChild(btn);
  });
}

function selectCategory(id) {
  state.category = id;
  $("mode-category-name").textContent = CATEGORIES.find((c) => c.id === id).name;
  showScreen("mode");
}

// ── 2. 모드 ──
function selectMode(mode) {
  state.mode = mode;
  const list = QUESTIONS.filter((q) => q.category === state.category);
  startRound(shuffle(list), false);
}

function startRound(list, isRetry) {
  state.list = list;
  state.index = 0;
  state.score = 0;
  state.results = [];
  state.isRetry = isRetry;
  $("quiz-mode-label").textContent = MODE_NAMES[state.mode] + (isRetry ? " · 다시 풀기" : "");
  showScreen("quiz");
  renderQuestion();
}

// ── 3. 문제 풀이 ──
function renderQuestion() {
  const q = state.list[state.index];
  state.answered = false;
  state.usedHint = false;

  $("quiz-progress").textContent = `${state.index + 1} / ${state.list.length}`;
  $("quiz-score").textContent = `점수 ${formatScore(state.score)}`;
  $("question-text").textContent = q.question;
  $("feedback").className = "feedback hidden";
  $("btn-next").classList.add("hidden");

  const box = $("choice-list");
  box.innerHTML = "";
  q.choices.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.dataset.index = i;
    btn.textContent = `${i + 1}. ${text}`;
    btn.addEventListener("click", () => answer(i));
    box.appendChild(btn);
  });

  const hintBtn = $("btn-hint");
  if (state.mode === "hint") {
    hintBtn.classList.remove("hidden");
    hintBtn.disabled = false;
  } else {
    hintBtn.classList.add("hidden");
  }

  if (state.mode === "speed") startTimer();
  else $("timer-box").classList.add("hidden");
}

function useHint() {
  if (state.answered || state.usedHint) return;
  const q = state.list[state.index];
  const wrongIdx = shuffle([0, 1, 2, 3].filter((i) => i !== q.answer)).slice(0, 2);
  wrongIdx.forEach((i) => {
    const btn = document.querySelector(`.choice[data-index="${i}"]`);
    btn.classList.add("removed");
    btn.disabled = true;
  });
  state.usedHint = true;
  $("btn-hint").disabled = true;
}

// 스피드 모드 타이머
function startTimer() {
  stopTimer();
  state.timeLeft = TIME_LIMIT;
  const box = $("timer-box");
  box.classList.remove("hidden", "warn");
  updateTimer();
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimer();
    if (state.timeLeft <= 0) {
      stopTimer();
      answer(null); // 시간 초과
    }
  }, 1000);
}

function updateTimer() {
  $("timer-value").textContent = state.timeLeft;
  $("timer-fill").style.width = (state.timeLeft / TIME_LIMIT) * 100 + "%";
  $("timer-box").classList.toggle("warn", state.timeLeft <= 5);
}

function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
}

// chosen === null 이면 시간 초과
function answer(chosen) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();

  const q = state.list[state.index];
  const timeout = chosen === null;
  const correct = !timeout && chosen === q.answer;
  let gained = 0;
  if (correct) gained = state.mode === "hint" && state.usedHint ? HINT_SCORE : 1;
  state.score += gained;
  state.results.push({ q, chosen, correct, timeout, usedHint: state.usedHint });

  document.querySelectorAll(".choice").forEach((btn) => {
    const i = Number(btn.dataset.index);
    btn.disabled = true;
    if (i === q.answer) btn.classList.add("correct");
    else if (i === chosen) btn.classList.add("wrong");
  });
  $("btn-hint").disabled = true;

  const fb = $("feedback");
  let title;
  if (timeout) title = "⏰ 시간 초과!";
  else if (correct) title = gained === 1 ? "⭕ 정답! (+1점)" : `⭕ 정답! 힌트 사용 (+${HINT_SCORE}점)`;
  else title = "❌ 오답";
  fb.innerHTML = `<div class="feedback-title">${title}</div><div>정답: ${q.choices[q.answer]} — ${q.explanation}</div>`;
  fb.className = "feedback " + (correct ? "good" : "bad");

  $("quiz-score").textContent = `점수 ${formatScore(state.score)}`;
  const next = $("btn-next");
  next.textContent = state.index + 1 < state.list.length ? "다음 문제" : "결과 보기";
  next.classList.remove("hidden");
}

function nextQuestion() {
  state.index += 1;
  if (state.index < state.list.length) renderQuestion();
  else showResult();
}

// ── 4. 결과 ──
function showResult() {
  stopTimer();
  const total = state.list.length;
  const correctCount = state.results.filter((r) => r.correct).length;
  const hintCount = state.results.filter((r) => r.correct && r.usedHint).length;
  const timeoutCount = state.results.filter((r) => r.timeout).length;

  let summary = `${MODE_NAMES[state.mode]} 모드${state.isRetry ? " (다시 풀기)" : ""} · ${total}문항 중 ${correctCount}개 정답 · 점수 ${formatScore(state.score)} / ${total}점`;
  if (state.mode === "hint" && hintCount) summary += ` · 힌트로 맞힌 문항 ${hintCount}개(각 ${HINT_SCORE}점)`;
  if (state.mode === "speed" && timeoutCount) summary += ` · 시간 초과 ${timeoutCount}개`;
  $("result-summary").textContent = summary;

  const wrong = state.results.filter((r) => !r.correct);
  const box = $("wrong-list");
  box.innerHTML = "";
  if (wrong.length === 0) {
    box.innerHTML = `<p class="lead">모두 맞혔어요! 🎉</p>`;
  } else {
    const h = document.createElement("h3");
    h.textContent = `틀린 문제 ${wrong.length}개`;
    box.appendChild(h);
    wrong.forEach((r) => {
      const div = document.createElement("div");
      div.className = "wrong-item";
      const mine = r.timeout ? "시간 초과" : r.q.choices[r.chosen];
      div.innerHTML = `<div class="q"></div><div class="a"></div>`;
      div.querySelector(".q").textContent = r.q.question;
      div.querySelector(".a").textContent = `내 답: ${mine} / 정답: ${r.q.choices[r.q.answer]}`;
      box.appendChild(div);
    });
  }

  // 틀린 문제 다시 풀기: 연습 모드 결과 화면에서만, 틀린 문제가 있을 때
  const retryBtn = $("btn-retry-wrong");
  retryBtn.classList.toggle("hidden", !(state.mode === "practice" && wrong.length > 0));
  state.wrongForRetry = wrong.map((r) => r.q);

  showScreen("result");
}

// ── 이벤트 연결 ──
document.querySelectorAll(".mode-btn").forEach((btn) =>
  btn.addEventListener("click", () => selectMode(btn.dataset.mode))
);
$("btn-back-category").addEventListener("click", () => showScreen("category"));
$("btn-hint").addEventListener("click", useHint);
$("btn-next").addEventListener("click", nextQuestion);
$("btn-retry-wrong").addEventListener("click", () => startRound(shuffle(state.wrongForRetry), true));
$("btn-restart").addEventListener("click", () => selectMode(state.mode));
$("btn-home").addEventListener("click", () => showScreen("category"));

renderCategories();
