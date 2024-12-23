/********************************************
 * pckg.js
 * - 使用 user.score & user.balls
 ********************************************/

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

const increaseSpeedButton = document.getElementById("increaseSpeed");
const decreaseSpeedButton = document.getElementById("decreaseSpeed");
const exchangeButtons = document.querySelectorAll("#exchangeButtons button");
const maxExchangeElement = document.getElementById("maxExchange");
const currentBallsElement = document.getElementById("currentBalls");
const currentPointsElement = document.getElementById("currentPoints");
const ballSpeedElement = document.getElementById("ballSpeed");

let ballSpeed = 0;
let shootingInterval = null;

function updateDisplay() {
  currentPointsElement.textContent = getCurrentScore();
  currentBallsElement.textContent = getCurrentBalls();
  ballSpeedElement.textContent = ballSpeed;
  updateMaxExchange();
}

function updateMaxExchange() {
  const maxBalls = Math.floor(getCurrentScore() / 50);
  maxExchangeElement.textContent = maxBalls;
}

function updateBallShooting() {
  if (shootingInterval) {
    clearInterval(shootingInterval);
    shootingInterval = null;
  }
  if (ballSpeed > 0 && getCurrentBalls() > 0) {
    shootingInterval = setInterval(() => {
      if (getCurrentBalls() > 0) {
        const offset = (Math.random() - 0.5) * 50;
        balls.push(createBall(offset));
        deductBalls(1);
        updateDisplay();
      }
    }, 1000 / ballSpeed);
  }
}

// 調整球速
increaseSpeedButton.addEventListener("click", () => {
  if (ballSpeed < 5) {
    ballSpeed++;
    updateBallShooting();
    updateDisplay();
  }
});

decreaseSpeedButton.addEventListener("click", () => {
  if (ballSpeed > 0) {
    ballSpeed--;
    updateBallShooting();
    updateDisplay();
  }
});

// 兌換球
exchangeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const data = btn.getAttribute("data-balls");
    let requestedBalls = 0;

    if (data === "all") {
      requestedBalls = Math.floor(getCurrentScore() / 50);
    } else {
      requestedBalls = parseInt(data, 10);
    }

    const requiredPoints = requestedBalls * 50;
    if (getCurrentScore() >= requiredPoints) {
      deductScore(requiredPoints);
      addBalls(requestedBalls);
      updateDisplay();
    } else {
      alert("分數不足，無法兌換球！");
    }
  });
});

function createBall(offset = 0) {
  return {
    x: gameCanvas.width / 2 + offset,
    y: 20,
    radius: 8,
    dx: Math.random() * 2 - 1,
    dy: 2,
    gravity: 0.25,
    friction: 0.99,
  };
}

let balls = [];
let particles = [];

// 釘子
const pegs = [];
for (let row = 0; row < 12; row++) {
  const xOffset = row % 2 === 0 ? 25 : 50;
  for (let col = xOffset; col < gameCanvas.width; col += 50) {
    pegs.push({ x: col, y: 100 + row * 50, radius: 5 });
  }
}

// 分隔釘子
const separatorXPositions = [50, 100, 150, 200, 250, 300, 350, 400, 450];
const separatorYPositions = [760, 770, 780, 790, 800];
separatorXPositions.forEach(xPos => {
  separatorYPositions.forEach(yPos => {
    pegs.push({ x: xPos, y: yPos, radius: 5 });
  });
});

// 得分區
const catchers = [
  { x: 5,   width: 40, points: 0 },
  { x: 55,  width: 40, points: 10 },
  { x: 105, width: 40, points: 20 },
  { x: 155, width: 40, points: 40 },
  { x: 205, width: 40, points: 80 },
  { x: 255, width: 40, points: 80 },
  { x: 305, width: 40, points: 40 },
  { x: 355, width: 40, points: 20 },
  { x: 405, width: 40, points: 10 },
  { x: 455, width: 40, points: 0 },
];

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;
    this.color = color;
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.opacity = 1;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity -= 0.02;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
  isDead() {
    return this.opacity <= 0;
  }
}

function addParticles(x, y, color="255,255,255") {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(x, y, color));
  }
}

function drawBall(ball) {
  gameCtx.beginPath();
  gameCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  gameCtx.fillStyle = "lightgray";
  gameCtx.fill();
  gameCtx.closePath();
}

function drawPegs() {
  pegs.forEach(peg => {
    gameCtx.beginPath();
    gameCtx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
    gameCtx.fillStyle = "white";
    gameCtx.fill();
    gameCtx.closePath();
  });
}

function drawCatchers() {
  catchers.forEach(c => {
    gameCtx.fillStyle = "orange";
    gameCtx.fillRect(c.x, gameCanvas.height - 20, c.width, 20);
    gameCtx.fillStyle = "white";
    gameCtx.font = "14px Arial";
    gameCtx.textAlign = "center";
    gameCtx.fillText(`${c.points} 分`, c.x + c.width / 2, gameCanvas.height - 5);
  });
}

function updateBall(ball) {
  ball.dy += ball.gravity;
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 左右邊界
  if (ball.x + ball.radius > gameCanvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx * ball.friction;
  }

  // 底部
  if (ball.y + ball.radius > gameCanvas.height) {
    catchers.forEach(c => {
      if (ball.x > c.x && ball.x < c.x + c.width) {
        addScore(c.points); // 增加對應分數
        addParticles(ball.x, gameCanvas.height - 10, "255,165,0"); // 增加粒子效果
      }
    });
    balls.splice(balls.indexOf(ball), 1); // 移除球
    updateDisplay();
    return;
  }

  // 與釘子碰撞
  pegs.forEach(peg => {
    const distX = ball.x - peg.x;
    const distY = ball.y - peg.y;
    const distance = Math.sqrt(distX * distX + distY * distY);
    if (distance < ball.radius + peg.radius) {
      // 碰撞邏輯

      const overlap = ball.radius + peg.radius - distance;
      const angle = Math.atan2(distY, distX);
      // 分離
      ball.x += Math.cos(angle) * overlap * 0.5;
      ball.y += Math.sin(angle) * overlap * 0.5;

      const elasticity = 0.8; // 彈性系數
      const normalX = distX / distance;
      const normalY = distY / distance;
      const dotProduct = ball.dx * normalX + ball.dy * normalY;
      ball.dx -= 2 * dotProduct * normalX * elasticity;
      ball.dy -= 2 * dotProduct * normalY * elasticity;
      ball.dx += (Math.random() - 0.5) * 0.5; // 隨機偏移

      addParticles(ball.x, ball.y, "255,255,255");
    }
  });

  ball.dx *= ball.friction;
  ball.dy *= ball.friction;
}

function drawParticles() {
  particles.forEach((p, i) => {
    if (p.isDead()) {
      particles.splice(i, 1);
    } else {
      p.update();
      p.draw(gameCtx);
    }
  });
}

function drawBackground() {
  gameCtx.fillStyle = "black";
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function animate() {
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawBackground();
  drawPegs();
  drawCatchers();
  balls.forEach(ball => {
    drawBall(ball);
    updateBall(ball);
  });
  drawParticles();
  requestAnimationFrame(animate);
}

window.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  initializeCurrentUserScoreBalls();
  updateDisplay();
  animate();
});

// 回到大廳
document.getElementById("lobby").addEventListener("click", () => {
  window.location.href = "settings.html";
});

// 前往分數榜
document.getElementById("leaderboard").addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});
