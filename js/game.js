/* =====================
   🎮 BRAIN BOOST ARENA
   FINAL GAME.JS
===================== */

let soundOn = true;
let vibrationOn = true;

const bgm = document.getElementById('bgm');

let score = 0;
let level = 1;
let gridSize = 4;
let revealTime = 3000;
let answerIndex = 0;
let mode = 'number';
let player = 'Player';
let items = [];
let timeUp = null;
let canSelect = true;
let timerInterval = null;

/* 🔊 SOUND */
const snd = {
  start: new Audio('audio/start.mp3'),
  click: new Audio('audio/click.mp3'),
  correct: new Audio('audio/correct.mp3'),
  wrong: new Audio('audio/wrong.mp3'),
  level: new Audio('audio/levelup.mp3')
};

/* 👑 SVG CROWN */
const crownSVG = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="gold"
 xmlns="http://www.w3.org/2000/svg">
 <path d="M3 7l4 4 5-6 5 6 4-4v10H3V7z"/>
</svg>`;

/* =====================
   ▶ START GAME
===================== */
function startGame() {
  player = document.getElementById('playerName').value || 'Player';
  mode = document.getElementById('mode').value;

  score = 0;
  level = 1;
  gridSize = 4;

  document.getElementById('setup').classList.add('hidden');
  document.querySelector('.game').classList.remove('hidden');
  document.getElementById('gameOver').classList.add('hidden');

  snd.start.play();
  if (soundOn) {
    bgm.volume = 0.4;
    bgm.currentTime = 0;
    bgm.play();
  }

  startRound();
}

/* =====================
   ▶ START ROUND
===================== */
function startRound() {
  clearTimeout(timeUp);
  clearInterval(timerInterval);

  canSelect = true;
  updateLevel();

  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  /* 📱 เต็มจอมือถือ */
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  grid.style.height = 'calc(100vh - 220px)';

  const total = gridSize * gridSize;
  items = generatePool(total);
  answerIndex = Math.floor(Math.random() * total);

  document.getElementById('display').innerText =
    `🎯 หา: ${items[answerIndex]} | คะแนน: ${score}`;

  items.forEach((v, i) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.innerText = v;
    cell.onclick = () => checkAnswer(i, cell);
    grid.appendChild(cell);
  });

  startTimer();
  timeUp = setTimeout(hideCells, revealTime);
}

/* ⏳ TIMER BAR */
function startTimer() {
  const bar = document.getElementById('timeBar');
  let t = revealTime;
  bar.style.width = '100%';

  timerInterval = setInterval(() => {
    t -= 50;
    bar.style.width = `${(t / revealTime) * 100}%`;
    if (t <= 0) clearInterval(timerInterval);
  }, 50);
}

/* ⏱ หมดเวลา → ซ่อนเลข แต่ยังเดาได้ */
function hideCells() {
  document.querySelectorAll('.cell').forEach(btn => {
    btn.innerText = '❓';
    btn.classList.add('hidden-cell');
  });
}

/* =====================
   ▶ CHECK ANSWER
===================== */
function checkAnswer(i, cell) {
  if (!canSelect) return;
  canSelect = false;

  snd.click.play();

  if (i === answerIndex) {
    cell.classList.add('correct');
    if (vibrationOn) navigator.vibrate?.(120);
    snd.correct.play();
    score += 10;

    setTimeout(startRound, 700);
  } else {
    cell.classList.add('wrong');
    if (vibrationOn) navigator.vibrate?.([80, 40, 80]);
    snd.wrong.play();

    setTimeout(endGame, 700);
  }
}

/* =====================
   ▶ LEVEL SYSTEM (100–600)
===================== */
function updateLevel() {
  const prev = level;

  level = Math.floor(score / 100) + 1;
  if (level > 7) level = 7;

  gridSize = level <= 4
    ? 4 + (level - 1)
    : 4 + (level - 5);

  revealTime = level >= 5 ? 2500 : 3000;

  const lvEl = document.getElementById('level');
  lvEl.innerText = `Lv.${level}`;

  if (level > prev) {
    snd.level.play();
    lvEl.classList.add('level-up');
    setTimeout(() => lvEl.classList.remove('level-up'), 600);
  }
}

/* =====================
   ▶ POOL GENERATOR
===================== */
function generatePool(total) {
  let pool = [];

  if (mode === 'number') {
    pool = level >= 5
      ? Array.from({ length: 900 }, (_, i) => i + 100)
      : Array.from({ length: 90 }, (_, i) => i + 10);
  }

  if (mode === 'eng') {
    pool = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
  }

  if (mode === 'thai') {
    pool = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'.split('');
  }

  return shuffle(pool).slice(0, total);
}

/* =====================
   ▶ END GAME
===================== */
function endGame() {
  clearTimeout(timeUp);
  clearInterval(timerInterval);
  bgm.pause();
  saveScore();

  document.getElementById('finalScore').innerText =
    `คะแนน: ${score}`;

  document.getElementById('gameOver').classList.remove('hidden');
}

/* =====================
   🏆 RANK SYSTEM (SVG)
===================== */
function saveScore() {
  const key = 'rank_' + mode;
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  data.push({ name: player, score });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(data.slice(0, 10)));
}

function renderRank() {
  const key = 'rank_' + document.getElementById('mode').value;
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  const list = document.getElementById('rankList');

  list.innerHTML = '';

  data.forEach((r, i) => {
    const li = document.createElement('li');
    li.innerHTML =
      `${i < 3 ? crownSVG : ''} <b>${r.name}</b> — ${r.score}`;
    list.appendChild(li);
  });
}

/* =====================
   ▶ CONTROLS
===================== */
function toggleSound() {
  soundOn = !soundOn;
  document.getElementById('soundBtn').innerText =
    soundOn ? '🔊' : '🔇';
  soundOn ? bgm.play() : bgm.pause();
}

function toggleVibration() {
  vibrationOn = !vibrationOn;
  document.getElementById('vibrateBtn').innerText =
    vibrationOn ? '📳' : '📴';
}

/* ▶ INIT */
window.addEventListener('load', renderRank);
document.getElementById('mode').addEventListener('change', renderRank);
