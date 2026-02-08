let score = 0;
let level = 1;
let gridSize = 4;
let revealTime = 3000;
let answerIndex = 0;
let mode = 'number';
let player = 'Player';

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

  document.getElementById('setup').style.display = 'none';
  document.querySelector('.game').classList.remove('hidden');

  sounds.start.play();
  nextRound();
}

function nextRound() {
  updateLevel();

  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize},1fr)`;

  const total = gridSize * gridSize;
  answerIndex = Math.floor(Math.random() * total);
  const pool = generatePool(total);

  document.getElementById('display').innerText =
    `🎯 หา: ${pool[answerIndex]} | คะแนน: ${score}`;

  pool.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.innerText = item;
    btn.onclick = () => selectCell(i, btn);
    grid.appendChild(btn);
  });

  setTimeout(() => {
    [...grid.children].forEach(b => b.innerText = '❓');
  }, revealTime);
}

function selectCell(i, btn) {
  sounds.click.play();

  const grid = document.getElementById('grid');
  [...grid.children].forEach((b, idx) => {
    b.innerText = generatePool(gridSize * gridSize)[idx];
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
  gridSize = 4 + level - 1;
  revealTime = level >= 3 ? 5000 : 3000;

  document.getElementById('level').innerText = `Lv.${level}`;

  if (level > prev) sounds.levelup.play();
}

function endGame() {
  saveScore();
  alert(`เกมจบ ❌\nคะแนน: ${score}`);
  location.reload();
}

function generatePool(total) {
  let pool = [];

  if (mode === 'number') {
    pool = Array.from({ length: 99 }, (_, i) => i + 1);
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
  return arr.sort(() => Math.random() - 0.5);
}

function saveScore() {
  const key = 'rank_' + mode;
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  data.push({ name: player, score });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(data.slice(0, 10)));
}
