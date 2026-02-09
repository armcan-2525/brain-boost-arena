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
  gridSize = 4 + level - 1;
  revealTime = level >= 3 ? 5000 : 3000;

  const lvEl = document.getElementById('level');
  lvEl.innerText = `Lv.${level}`;

  if (level > prev) {
    sounds.levelup.play();

    // trigger animation
    lvEl.classList.add('level-up');
    setTimeout(() => lvEl.classList.remove('level-up'), 600);
  }
}



function generatePool(total) {
  let pool = [];

  // 🔢 ตัวเลข (เลข 3 หลักเฉพาะเลเวลสูง)
  if (mode === 'number') {
    if (level >= 4) {
      pool = Array.from({ length: 900 }, (_, i) => i + 100); // 100–999
    } else {
      pool = Array.from({ length: 90 }, (_, i) => i + 10);  // 10–99
    }
  }

  // 🔤 อังกฤษ
  if (mode === 'eng') {
    pool = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
  }

  // 🇹🇭 ไทย
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

  document.getElementById('finalScore').innerText =
    `คะแนน: ${score}`;

  document.getElementById('gameOver')
    .classList.remove('hidden');
}



/* =====================
   🏆 RANK แยกตามโหมด
===================== */

function saveScore() {
  const key = 'rank_' + mode;
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  data.push({ name: player, score });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(data.slice(0, 10)));
}

function showRank() {
  const key = 'rank_' + mode;
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  console.table(data);
}
document.getElementById('level').classList.add('level-up');
setTimeout(()=>level.classList.remove('level-up'),600);

function restartGame() {
  document.getElementById('gameOver')
    .classList.add('hidden');

  score = 0;
  level = 1;
  gridSize = 4;

  nextRound();
}

function changeProfile() {
  document.getElementById('gameOver')
    .classList.add('hidden');

  document.getElementById('setup').style.display = 'block';
  document.querySelector('.game').classList.add('hidden');
}
