let currentPool = [];

function startRound() {
  updateLevel();

  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize},1fr)`;

  const total = gridSize * gridSize;
  currentPool = generatePool(total);
  answerIndex = Math.floor(Math.random() * total);

  document.getElementById('display').innerText =
    `🎯 หา: ${currentPool[answerIndex]} | คะแนน: ${score}`;

  currentPool.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.innerText = item;
    btn.onclick = () => selectCell(i);
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
    setTimeout(startRound, 1200);
  } else {
    sounds.wrong.play();
    endGame();
  }
}
