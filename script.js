var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 810;
canvas.height = 600;

var score = document.getElementById("score");

var direction = "right";
var x = 75;
var y = 15;
var headSize = 15;
var tail = [
  { x: 15, y: 15 },
  { x: 30, y: 15 },
  { x: 45, y: 15 },
  { x: 60, y: 15 }
];
var fps = 10;
var apple;
var snakeLength = 5;

appleGeneration();
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  score.innerHTML = snakeLength;
  if (tail.length > snakeLength) tail.shift();
  drawTail();
  collision();
  drawApple();
  tail.push({ x: x, y: y });
  ctx.fillStyle = "#9acd32";
  ctx.fillRect(x, y, headSize, headSize);
  setTimeout(function() {
    if (direction === "right") {
      x += 15;
    }

    if (x >= canvas.width) {
      x = 0;
    }

    if (direction === "left") {
      x -= 15;
    }

    if (x < 0) {
      x = canvas.width - headSize;
    }

    if (direction === "up") {
      y -= 15;
    }

    if (y < 0) {
      y = canvas.height - 15;
    }

    if (direction === "down") {
      y += 15;
    }

    if (y >= canvas.height) {
      y = 0;
    }

    if (x === appleX && y === appleY) appleEat();
    window.requestAnimationFrame(draw);
  }, 1000 / fps);
}

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  var keyCode = e.keyCode;
  if ((keyCode === 87 || keyCode === 38) && direction != "down") {
    direction = "up";
  } else if ((keyCode === 83 || keyCode === 40) && direction != "up") {
    direction = "down";
  } else if ((keyCode === 65 || keyCode === 37) && direction != "right") {
    direction = "left";
  } else if ((keyCode === 68 || keyCode === 39) && direction != "left") {
    direction = "right";
  }
}

function appleGeneration() {
  appleX =
    Math.round(getRandomCoords(15, canvas.width / headSize)) * headSize -
    headSize;
  appleY =
    Math.round(getRandomCoords(15, canvas.height / headSize)) * headSize -
    headSize;

  apple = { appleX, appleY };
}

function getRandomCoords(min, max) {
  return Math.random() * (max - min) + min;
}
// Удалена из за большой нагрузки на процессор
// function drawGrid() {
//   for (var gridX = 0.5; gridX < canvas.width; gridX += 15) {
//     ctx.moveTo(gridX, 0);
//     ctx.lineTo(gridX, canvas.width);
//   }

//   for (var gridY = 0.5; gridY < canvas.width; gridY += 15) {
//     ctx.moveTo(0, gridY);
//     ctx.lineTo(canvas.width, gridY);
//   }
//   ctx.strokeStyle = "#888";
//   ctx.stroke();
// }

function drawApple() {
  ctx.beginPath();
  // void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  ctx.arc(apple.appleX + 7, apple.appleY + 7, 7, 0, 2 * Math.PI, false);
  ctx.fillStyle = "red";
  // ctx.fillRect(apple.appleX, apple.appleY, headSize, headSize);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.stroke();
}

function drawTail() {
  for (var i = 0; i < tail.length; i++) {
    ctx.fillStyle = "#b2ec5d";
    ctx.fillRect(tail[i].x, tail[i].y, headSize, headSize);
  }
}

function appleEat() {
  snakeLength++;
  fps++;
  appleGeneration();
}

function collision() {
  for (var j = 0; j < tail.length; j++) {
    if (x === tail[j].x && y === tail[j].y) {
      gameOver();
      break;
    }
  }
}

function gameOver() {
  saveScore();
  snakeLength = 5;
  x = 75;
  y = 15;
  tail = [
    { x: 15, y: 15 },
    { x: 30, y: 15 },
    { x: 45, y: 15 },
    { x: 60, y: 15 }
  ];
  direction = "right";
  fps = 10;
  appleGeneration();
}
var allScore = "";
function saveScore() {
  var board = document.getElementById("scoreBoard");
  var name = document.getElementById("name").value;
  var date = new Date();
  var hh = date.getHours(),
    mm = date.getMinutes(),
    ss = date.getSeconds();
  if (hh.toString().length < 2) hh = "0" + hh;
  if (mm.toString().length < 2) mm = "0" + mm;
  if (ss.toString().length < 2) ss = "0" + ss;
  var time = hh + ":" + mm + ":" + ss;

  if (name === "") {
    name = "Безымянный";
  }

  allScore += `<li class="list-group-item list-group-item-secondary p-1">Имя: ${name}; Очки: ${snakeLength}; Время: ${time}</li>`;
  board.innerHTML = allScore;
}

draw();
