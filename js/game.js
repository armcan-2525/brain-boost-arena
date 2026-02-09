let soundOn = true;
const bgm = document.getElementById('bgm');

let score = 0;
let level = 1;
let gridSize = 4;        // 4x4 = 16 ช่อง (เวอร์ชันแรก)
let revealTime = 3000;
let answerIndex = 0;
let mode = 'number';
let player = 'Player';
let items = [];
let timeUp = null;

const snd = {
  start: new Audio('audio/start.mp3'),
  click: new Audio('audio/click.mp3'),
  correct: new Audio('audio/correct.mp3'),
  wrong: new Audio('audio/wrong.mp3'),
  level: new Audio('audio/levelup.mp3')
};

/* ▶ START GAME */
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

/* ▶ START ROUND */
function startRound() {
  updateLevel();

  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize},1fr)`;

  const total = gridSize * gridSize;
  items = generatePool(total);
  answerIndex = Math.floor(Math.random() * total);

  document.getElementById('display').innerText =
    `🎯 หา: ${items[answerIndex]} | คะแนน: ${score}`;

  items.forEach((v, i) => {
    const cell = document.createElement('button');
    cell.innerText = v;
    cell.onclick = () => checkAnswer(i);
    grid.appendChild(cell);
  });

  clearTimeout(timeUp);
  timeUp = setTimeout(endGame, revealTime);
}

/* ▶ CHECK ANSWER (กดถูกไปต่อทันที) */
function checkAnswer(i) {
  clearTimeout(timeUp);
  snd.click.play();

  if (i === answerIndex) {
    snd.correct.play();
    score += 10;
    setTimeout(startRound, 500);
  } else {
    snd.wrong.play();
    endGame();
  }
}

/* ▶ LEVEL SYSTEM (คุมไม่ให้โตเร็ว) */
function updateLevel() {
  const prev = level;
  level = Math.floor(score / 100) + 1;

  if (level < 4) gridSize = 4;      // 16 ช่องนาน ๆ
  else if (level < 7) gridSize = 5;
  else gridSize = 6;

  revealTime = level >= 5 ? 5000 : 3000;

  const lvEl = document.getElementById('level');
  lvEl.innerText = `Lv.${level}`;

  if (level > prev) {
    snd.level.play();
    lvEl.classList.add('level-up');
    setTimeout(() => lvEl.classList.remove('level-up'), 500);
  }
}

/* ▶ POOL GENERATOR */
function generatePool(total) {
  let pool = [];

  if (mode === 'number') {
    pool = level < 5
      ? Array.from({ length: 90 }, (_, i) => i + 10)
      : Array.from({ length: 900 }, (_, i) => i + 100);
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

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ▶ END GAME */
function endGame() {
  clearTimeout(timeUp);
  bgm.pause();
  saveScore();

  document.getElementById('finalScore').innerText =
    `คะแนน: ${score}`;

  document.getElementById('gameOver')
    .classList.remove('hidden');
}

/* 🏆 RANK แยกโหมด */
function saveScore() {
  const key = 'rank_' + mode;
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  data.push({ name: player, score });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(data.slice(0, 10)));
}

/* ▶ CONTROLS */
function restartGame() {
  document.getElementById('gameOver').classList.add('hidden');
  score = 0;
  level = 1;
  gridSize = 4;
  if (soundOn) bgm.play();
  startRound();
}

function changeProfile() {
  document.getElementById('gameOver').classList.add('hidden');
  document.getElementById('setup').classList.remove('hidden');
  document.querySelector('.game').classList.add('hidden');
}

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById('soundBtn').innerText =
    soundOn ? '🔊' : '🔇';
  soundOn ? bgm.play() : bgm.pause();
}
function renderRank() {
  const key = 'rank_' + document.getElementById('mode').value;
  const data = JSON.parse(localStorage.getItem(key) || '[]');

  const list = document.getElementById('rankList');
  list.innerHTML = '';

  data.slice(0,10).forEach((p, i) => {
    const li = document.createElement('li');
    li.className = `rank-${i+1}`;
    li.innerHTML = `<span>${p.name}</span><span>${p.score}</span>`;
    list.appendChild(li);
  });
}

// โหลดทันทีตอนเข้าเว็บ
window.addEventListener('load', renderRank);
document.getElementById('mode').addEventListener('change', renderRank);
function startGame() {
  player = document.getElementById('playerName').value || 'Player';
  mode = document.getElementById('mode').value;

  score = 0;
  level = 1;
  gridSize = 4;

  // ซ่อนหน้า setup + rank
  document.getElementById('setup').classList.add('hidden');
  document.querySelector('.game').classList.remove('hidden');

  snd.start.play();
  if (soundOn) {
    bgm.volume = 0.4;
    bgm.play();
  }

  startRound();
}

function changeProfile() {
  document.getElementById('gameOver').classList.add('hidden');
  document.getElementById('setup').classList.remove('hidden');
  document.querySelector('.game').classList.add('hidden');

  renderRank(); // กลับมาโชว์อันดับ
}
