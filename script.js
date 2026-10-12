// NCT 퀴즈 - 시작(카테고리) → 모드 선택 → 문항 → 결과
// 구현 1단계: 연습 모드와 점수 / 구현 2단계: 모드 선택, 스피드, 힌트, 틀린 문제 다시 풀기

const QUESTIONS_PER_ROUND = 10;
const TIME_LIMIT = 15;    // 스피드 모드: 문항마다 15초
const HINT_SCORE = 0.5;   // 힌트 모드: 힌트를 쓰고 맞히면 0.5점
const MODES = {
  practice: { name: "연습" },
  speed: { name: "스피드" },
  hint: { name: "힌트" },
};

// ───────── 순수 함수(자체 점검 대상) ─────────
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 문항의 보기를 섞고, 섞인 뒤의 정답 위치를 함께 돌려준다.
function shuffleChoices(q) {
  const order = shuffle([0, 1, 2, 3]);
  return { ...q, choices: order.map((i) => q.choices[i]), answer: order.indexOf(q.answer) };
}

// 한 문항의 점수: 틀리거나 시간 초과면 0, 힌트를 쓰고 맞히면 0.5, 아니면 1
function scoreOf(correct, usedHint) {
  if (!correct) return 0;
  return usedHint ? HINT_SCORE : 1;
}

// 힌트로 지울 오답 보기 2개의 위치
function pickHintRemovals(answer) {
  return shuffle([0, 1, 2, 3].filter((i) => i !== answer)).slice(0, 2);
}

function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function categoryName(id) {
  return CATEGORIES.find((c) => c.id === id).name;
}

// ───────── 상태 ─────────
const state = {
  category: null,
  mode: null,
  list: [],          // 이번 판의 문항(보기 섞인 상태)
  index: 0,
  score: 0,
  results: [],       // { q, chosen, correct, timeout, usedHint }
  isRetry: false,    // 틀린 문제 다시 풀기 중인지
  firstScore: 0,     // 연습 모드 처음 판의 점수(다시 풀기는 채점하지 않음)
  firstTotal: 0,
  usedHint: false,
  answered: false,
  timerId: null,
  timeLeft: TIME_LIMIT,
};

const $ = (id) => document.getElementById(id);

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("screen-" + name).classList.add("active");
  window.scrollTo(0, 0);
}

// ───────── 시작 화면 ─────────
function renderCategories() {
  const box = $("category-list");
  box.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    const label = document.createElement("span");
    label.textContent = c.name.replace(" ", "\n"); // 별 안에 들어가도록 두 줄로
    btn.appendChild(label);
    btn.addEventListener("click", () => {
      state.category = c.id;
      $("mode-category").textContent = c.name;
      showScreen("mode");
    });
    box.appendChild(btn);
  });
}

// ───────── 판 시작 ─────────
function startRound(mode) {
  state.mode = mode;
  const pool = QUESTIONS.filter((q) => q.category === state.category);
  const list = shuffle(pool).slice(0, QUESTIONS_PER_ROUND).map(shuffleChoices);
  beginList(list, false);
}

function startRetry() {
  const wrong = state.results.filter((r) => !r.correct).map((r) => shuffleChoices(r.q));
  beginList(shuffle(wrong), true);
}

function beginList(list, isRetry) {
  stopTimer();
  state.list = list;
  state.index = 0;
  state.score = 0;
  state.results = [];
  state.isRetry = isRetry;
  $("quiz-label").textContent = `${categoryName(state.category)} · ${MODES[state.mode].name}${isRetry ? " · 다시 풀기" : ""}`;
  showScreen("quiz");
  renderQuestion();
}

// ───────── 문항 화면 ─────────
function renderQuestion() {
  const q = state.list[state.index];
  state.answered = false;
  state.usedHint = false;

  $("quiz-progress").textContent = `${state.index + 1} / ${state.list.length}`;
  updateScoreLabel();
  $("question").textContent = q.question;
  $("feedback").className = "feedback hidden";
  $("btn-next").classList.add("hidden");

  const box = $("choices");
  box.innerHTML = "";
  q.choices.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.dataset.index = i;
    btn.textContent = `${i + 1}. ${text}`;
    btn.addEventListener("click", () => choose(i));
    box.appendChild(btn);
  });

  const hint = $("btn-hint");
  hint.classList.toggle("hidden", state.mode !== "hint");
  hint.disabled = false;
  hint.textContent = "힌트 (오답 2개 지우기)";

  if (state.mode === "speed") startTimer();
  else $("timer").classList.add("hidden");
}

function updateScoreLabel() {
  $("quiz-score").textContent = state.isRetry ? "채점 안 함" : `점수 ${formatScore(state.score)}`;
}

function useHint() {
  if (state.answered || state.usedHint) return;
  const q = state.list[state.index];
  pickHintRemovals(q.answer).forEach((i) => {
    const btn = document.querySelector(`.choice[data-index="${i}"]`);
    btn.classList.add("removed");
    btn.disabled = true;
  });
  state.usedHint = true;
  const hint = $("btn-hint");
  hint.disabled = true;
  hint.textContent = "힌트 사용함";
}

// ───────── 스피드 모드 타이머 ─────────
function startTimer() {
  stopTimer(); // 타이머가 겹쳐 돌지 않게 항상 먼저 멈춘다
  state.timeLeft = TIME_LIMIT;
  $("timer").classList.remove("hidden");
  drawTimer();
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    drawTimer();
    if (state.timeLeft <= 0) choose(null); // 시간 초과
  }, 1000);
}

function drawTimer() {
  $("timer-value").textContent = state.timeLeft;
  $("timer").classList.toggle("warn", state.timeLeft <= 5);
}

function stopTimer() {
  if (state.timerId !== null) clearInterval(state.timerId);
  state.timerId = null;
}

// ───────── 답 처리 (chosen === null 이면 시간 초과) ─────────
function choose(chosen) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();

  const q = state.list[state.index];
  const timeout = chosen === null;
  const correct = !timeout && chosen === q.answer;
  const gained = state.isRetry ? 0 : scoreOf(correct, state.usedHint);
  state.score += gained;
  state.results.push({ q, chosen, correct, timeout, usedHint: state.usedHint });

  document.querySelectorAll(".choice").forEach((btn) => {
    const i = Number(btn.dataset.index);
    btn.disabled = true;
    if (i === q.answer) btn.classList.add("correct");
    else if (i === chosen) btn.classList.add("wrong");
  });
  $("btn-hint").disabled = true;

  let title;
  if (timeout) title = "⏰ 시간 초과";
  else if (!correct) title = "X 오답";
  else if (state.isRetry) title = "O 정답";
  else title = state.usedHint ? `O 정답 (힌트 ${HINT_SCORE}점)` : "O 정답 (1점)";

  const fb = $("feedback");
  fb.innerHTML = "";
  const t = document.createElement("div");
  t.className = "feedback-title";
  t.textContent = title;
  const ex = document.createElement("div");
  ex.textContent = q.explanation + " ";
  const a = document.createElement("a");
  a.href = q.source.url;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = `출처: ${q.source.name}`;
  ex.appendChild(a);
  fb.append(t, ex);
  fb.className = "feedback " + (correct ? "good" : "bad");

  updateScoreLabel();
  const next = $("btn-next");
  next.textContent = state.index + 1 < state.list.length ? "다음" : "결과 보기";
  next.classList.remove("hidden");
}

function next() {
  state.index += 1;
  if (state.index < state.list.length) renderQuestion();
  else showResult();
}

// ───────── 결과 화면 ─────────
function showResult() {
  stopTimer();
  const total = state.list.length;
  const correctCount = state.results.filter((r) => r.correct).length;

  if (!state.isRetry) {
    state.firstScore = state.score;
    state.firstTotal = total;
  }

  $("result-label").textContent =
    `${categoryName(state.category)} · ${MODES[state.mode].name}${state.isRetry ? " · 다시 풀기" : ""}`;

  $("result-score").textContent = `${correctCount} / ${total}`;

  let note = "";
  if (!state.isRetry && state.mode === "hint") note = `점수 ${formatScore(state.score)}점`;
  if (state.isRetry) note = `다시 풀기는 채점하지 않습니다. 처음 점수 ${formatScore(state.firstScore)} / ${state.firstTotal} 그대로입니다.`;
  if (state.mode === "practice") note += (note ? " " : "") + "순위표에 기록되지 않음";
  $("result-note").textContent = note;

  const list = $("result-list");
  list.innerHTML = "";
  state.results.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = r.q.question;
    const tag = document.createElement("span");
    tag.className = "tag " + (r.correct ? "good" : "bad");
    if (r.timeout) tag.textContent = "시간 초과";
    else if (!r.correct) tag.textContent = "오답";
    else if (r.usedHint && !state.isRetry) tag.textContent = `정답 (힌트 ${HINT_SCORE}점)`;
    else tag.textContent = "정답";
    li.appendChild(tag);
    if (!r.correct) {
      const ans = document.createElement("div");
      ans.className = "lead";
      ans.style.textAlign = "left";
      ans.style.margin = "2px 0 0";
      ans.textContent = `정답: ${r.q.choices[r.q.answer]}`;
      li.appendChild(ans);
    }
    list.appendChild(li);
  });

  // 틀린 문제 다시 풀기는 연습 모드에서만, 틀린 문항이 있을 때만
  const hasWrong = correctCount < total;
  $("btn-retry").classList.toggle("hidden", !(state.mode === "practice" && hasWrong));

  showScreen("result");
}

// ───────── 자체 점검 (주소 끝에 ?test) ─────────
function runSelfTest() {
  let pass = 0, fail = 0;
  const check = (name, ok) => {
    if (ok) { pass++; console.log("통과:", name); }
    else { fail++; console.error("실패:", name); }
  };
  const ids = QUESTIONS.map((q) => q.id);

  check("카테고리 4개", CATEGORIES.length === 4);
  check("문항 40개", QUESTIONS.length === 40);
  check("카테고리마다 10문항", CATEGORIES.every((c) => QUESTIONS.filter((q) => q.category === c.id).length === 10));
  check("문항 id가 겹치지 않음", new Set(ids).size === ids.length);
  check("보기 4개가 서로 다름", QUESTIONS.every((q) => q.choices.length === 4 && new Set(q.choices).size === 4));
  check("정답 위치가 0~3", QUESTIONS.every((q) => Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3));
  check("해설과 출처가 있음", QUESTIONS.every((q) => q.explanation && q.source && /^https:\/\//.test(q.source.url)));
  check("보기를 섞어도 정답이 유지됨", QUESTIONS.every((q) => { const s = shuffleChoices(q); return s.choices[s.answer] === q.choices[q.answer]; }));
  check("한 판은 10문항", shuffle(QUESTIONS.filter((q) => q.category === CATEGORIES[0].id)).slice(0, QUESTIONS_PER_ROUND).length === 10);
  check("모드 3개(연습, 스피드, 힌트)", Object.keys(MODES).join() === "practice,speed,hint");
  check("스피드 제한 시간 15초", TIME_LIMIT === 15);
  check("오답과 시간 초과는 0점", scoreOf(false, false) === 0 && scoreOf(false, true) === 0);
  check("힌트 없이 맞히면 1점", scoreOf(true, false) === 1);
  check("힌트를 쓰고 맞히면 0.5점", scoreOf(true, true) === 0.5);
  check("힌트는 정답이 아닌 보기 2개를 지움", [0, 1, 2, 3].every((a) => { const r = pickHintRemovals(a); return r.length === 2 && !r.includes(a) && r[0] !== r[1]; }));

  console.log(`자체 점검 결과: 통과 ${pass}, 실패 ${fail}`);
  return { pass, fail };
}

// ───────── 연결 ─────────
if (typeof document !== "undefined") {
  document.querySelectorAll(".mode-btn").forEach((b) => b.addEventListener("click", () => startRound(b.dataset.mode)));
  $("btn-back").addEventListener("click", () => showScreen("start"));
  $("btn-hint").addEventListener("click", useHint);
  $("btn-next").addEventListener("click", next);
  $("btn-retry").addEventListener("click", startRetry);
  $("btn-again").addEventListener("click", () => startRound(state.mode));
  $("btn-home").addEventListener("click", () => { stopTimer(); showScreen("start"); });
  renderCategories();
  if (new URLSearchParams(location.search).has("test")) runSelfTest();
}
