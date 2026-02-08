let score = 0;
let level = 1;
let gridSize = 4;        // เริ่ม 4x4 = 16 ช่อง
let revealTime = 3000;
let answerIndex = 0;
let mode = 'number';
let player = 'Player';
let items = [];

const snd = {
  start: new Audio('audio/start.mp3'),
  click: new Audio('audio/click.mp3'),
  correct: new Audio('audio/correct.mp3'),
  wrong: new Audio('audio/wrong.mp3'),
  level: new Audio('audio/levelup.mp3')
};

function startGame() {
  player = document.getElementById('playerName').value || 'Player';
  mode = document.getElementById('mode').value;

  score = 0;
  level = 1;
  gridSize = 4;

  document.getElementById('setup').classList.add('hidden');
  document.querySelector('.game').classList.remove('hidden');

  snd.start.play();
  startRound();
}

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
    cell.onclick = () => checkAnswer(i, cell);
    grid.appendChild(cell);
  });

  // ปิดตัวเลขเมื่อหมดเวลา
  setTimeout(() => {
    [...grid.children].forEach(c => c.innerText = '❓');
  }, revealTime);
}

function checkAnswer(i, cell) {
  snd.click.play();

  const grid = document.getElementById('grid');
  [...grid.children].forEach((c, idx) => {
    c.innerText = items[idx];
    c.disabled = true;
  });

  if (i === answerIndex) {
    snd.correct.play();
    score += 10;
    setTimeout(startRound, 1200);
  } else {
    snd.wrong.play();
    endGame();
  }
}

function updateLevel() {
  const prev = level;
  level = Math.floor(score / 100) + 1;

  // เพิ่มทีละ 4 ช่อง
  gridSize = 4 + (level - 1);

  // เวลา
  if (level >= 4) revealTime = 5000;
  else if (level >= 2) revealTime = 4000;
  else revealTime = 3000;

  document.getElementById('level').innerText = `Lv.${level}`;
  if (level > prev) snd.level.play();
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

function endGame() {
  saveScore();
  alert(`❌ เกมจบ\nคะแนน: ${score}`);
  location.reload();
}

function saveScore() {
  const key = 'rank_' + mode;
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  data.push({ name: player, score });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(data.slice(0, 10)));
}
