let score = 0;
let level = 1;
let gridSize = 4;
let revealTime = 3000;
let answerIndex = 0;
let mode = 'number';
let player = 'Player';
let pool = [];
let canClick = false;

const sounds = {
  start: new Audio('audio/start.mp3'),
  click: new Audio('audio/click.mp3'),
  correct: new Audio('audio/correct.mp3'),
  wrong: new Audio('audio/wrong.mp3'),
  levelup: new Audio('audio/levelup.mp3')
};

function startGame() {
  player = document.getElementById('playerName').value || 'Player';
  mode = document.getElementById('mode').value;

  score = 0;
  level = 1;
  gridSize = 4;
  revealTime = 3000;

  document.getElementById('setup').style.display = 'none';
  document.querySelector('.game').classList.remove('hidden');

  sounds.start.play();
  nextRound();
}

function nextRound() {
  updateLevel();
  canClick = false;

  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize},1fr)`;

  const total = gridSize * gridSize;
  pool = generatePool(total);
  answerIndex = Math.floor(Math.random() * total);

  document.getElementById('display').innerText =
    `🎯 จำให้ดี แล้วหา: ${pool[answerIndex]} | คะแนน: ${score}`;

  pool.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'cell';
    btn.innerText = item;
    btn.onclick = () => selectCell(i, btn);
    grid.appendChild(btn);
  });

  setTimeout(() => {
    [...grid.children].forEach(b => b.innerText = '❓');
    canClick = true;
  }, revealTime);
}

function selectCell(i, btn) {
  if (!canClick) return;
  canClick = false;

  sounds.click.play();

  const grid = document.getElementById('grid');
  [...grid.children].forEach((b, idx) => {
    b.innerText = pool[idx];
    b.disabled = true;
  });

  if (i === answerIndex) {
    sounds.correct.play();
    score += 10;

    setTimeout(nextRound, 1200);
  } else {
    sounds.wrong.play();
    endGame();
  }
}

function updateLevel() {
  const prev = level;
  level = Math.floor(score / 100) + 1;

  gridSize = 4 + (level - 1);
  revealTime = level >= 2 ? 4000 : 3000;
  if (level >= 4) revealTime = 5000;

  document.getElementById('level').innerText = `Lv.${level}`;

  if (level > prev) sounds.levelup.play();
}

function endGame() {
  saveScore();
  setTimeout(() => {
    alert(`❌ เกมจบ\nผู้เล่น: ${player}\nคะแนน: ${score}\nเลเวลสูงสุด: ${level}`);
    location.reload();
  }, 500);
}

function generatePool(total) {
  let base = [];

  if (mode === 'number') {
    base = Array.from({ length: 99 }, (_, i) => i + 1);
  }
  if (mode === 'eng') {
    base = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
  }
  if (mode === 'thai') {
    base = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'.split('');
  }

  return shuffle(base).slice(0, total);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function saveScore() {
  const key = 'rank_' + mode;
  const data = JSON.parse(localStorage.getItem(key) || '[]');

  data.push({ name: player, score });
  data.sort((a, b) => b.score - a.score);

  localStorage.setItem(key, JSON.stringify(data.slice(0, 10)));
}
