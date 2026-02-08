let currentPool = [];

function startMatch() {
  startMatch();
}

function nextRound() {
  updateLevel();

  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize},1fr)`;

  const total = gridSize * gridSize;
  answerIndex = Math.floor(Math.random() * total);

  currentPool = generatePool(total);

  document.getElementById('display').innerText =
    `🎯 หา: ${currentPool[answerIndex]} | คะแนน: ${score}`;

  currentPool.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.innerText = item;
    btn.onclick = () => selectCell(i, btn);
    grid.appendChild(btn);
  });

  setTimeout(() => {
    [...grid.children].forEach(b => b.innerText = '❓');
  }, revealTime);
}

function selectCell(i) {
  sounds.click.play();

  const grid = document.getElementById('grid');
  [...grid.children].forEach((b, idx) => {
    b.innerText = currentPool[idx];
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
  gridSize = Math.min(4 + level - 1, 6);

  if (level >= 4 && mode === 'number') revealTime = 5000;
  else if (level >= 2) revealTime = 4000;
  else revealTime = 3000;

  document.getElementById('level').innerText = `Lv.${level}`;
  if (level > prev) sounds.levelup.play();
}
