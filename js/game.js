let player = "";
let mode = "";
let score = 0;
let level = 1;
let gridSize = 4;
let answer = null;

const sounds = {
  click: new Audio("audio/click.mp3"),
  success: new Audio("audio/success.mp3"),
  fail: new Audio("audio/fail.mp3")
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn")
    .addEventListener("click", startMatch);
});

function startMatch() {
  player = document.getElementById("playerName").value || "Player";
  mode = document.getElementById("mode").value;

  score = 0;
  level = 1;
  gridSize = 4;

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  nextRound();
}

function nextRound() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  grid.style.gridTemplateColumns = `repeat(${Math.sqrt(gridSize)}, 1fr)`;

  const items = generateItems();
  answer = items[Math.floor(Math.random() * items.length)];

  document.getElementById("status").textContent =
    `เลือก: ${answer}`;

  items.forEach(item => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = item;

    cell.onclick = () => handleClick(cell, item);
    grid.appendChild(cell);
  });
}

function handleClick(cell, value) {
  sounds.click.play();

  if (value === answer) {
    cell.classList.add("correct");
    sounds.success.play();
    score += 10;
    level++;
    gridSize = Math.min(16, gridSize + 2);
    setTimeout(nextRound, 600);
  } else {
    cell.classList.add("wrong");
    sounds.fail.play();
    alert(`❌ เกมจบ\nคะแนน: ${score}`);
    location.reload();
  }

  document.getElementById("score").textContent = score;
}

function generateItems() {
  let base = [];

  if (mode === "number") {
    base = Array.from({ length: gridSize }, (_, i) => i + 1);
  }

  if (mode === "thai") {
    base = ["ก","ข","ค","ง","จ","ฉ","ช","ซ","ด","ต","ถ","ท","น","บ","ป","พ"]
      .slice(0, gridSize);
  }

  if (mode === "english") {
    base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .slice(0, gridSize);
  }

  return shuffle(base);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
