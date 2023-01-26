const myCanvas = document.querySelector("#canvas");
const ctx = myCanvas.getContext("2d");

const background = new Image();
background.src = './images/kitchenBg.jpg';
let backgroundLoaded = false;

const kitchen = new Image();
kitchen.src = './images/kitchen.jpg';

const chef = new Image();
chef.src = './images/chef.png';
const chefWidth = 180;
const chefHeight = 250;
let chefX = myCanvas.width / 2;
let chefY = myCanvas.height - chefHeight;
let chefSpeed = 10;

const eggImage = new Image();
eggImage.src = './images/egg.png';
const eggHeight = 30;
const eggWidth = 15;
let eggX = myCanvas.width / 2;
let eggY = myCanvas.height - eggHeight;
let eggSpeed = 1;

const rottenEgg = new Image();
rottenEgg.src = './images/rottenEgg.png';
const rottenEggHeight = 30;
const rottenEggWidth = 15;
let rottenEggX = myCanvas.width / 2;
let rottenEggY = myCanvas.height - rottenEggHeight;
let rottenEggSpeed = 1;

const requiredEggs1 = 2;
const requiredEggs2 = 5;
const requiredEggs3 = 8; 

let currentLevel = 1;
let score = 0;
let gameOver = false;
let gameOverAlreadyShown = false;
let animateId;

let isMovingLeft = false;
let isMovingRight = false;

let eggs = [];

function startGame() {
  animateId = requestAnimationFrame(drawEggs);
  setInterval(generateEggs, 2000);
}

function generateEggs() {
  let randomX = Math.floor(Math.random() * (myCanvas.width - eggWidth));
  let randomY = Math.floor(Math.random() * (myCanvas.height - eggHeight));
  let randomSpeed = Math.floor(Math.random() * 10) + 1;
  let randomType = Math.random() < 0.8 ? "rotten" : "normal"; // 20% chance of normal egg, 80% chance of rotten egg
  let egg = {
    x: randomX,
    y: randomY,
    speed: randomSpeed,
    type: randomType
  };
  eggs.push(egg);
}

function drawEggs() {
  eggs.forEach(egg => {
    if (egg.type === "normal") {
      ctx.drawImage(eggImage, egg.x, egg.y, eggWidth, eggHeight);
    } else {
      ctx.drawImage(rottenEgg, egg.x, egg.y, rottenEggWidth, rottenEggHeight);
    }
    egg.y += egg.speed;
  });
}

function drawChef () {
  ctx.drawImage(chef, chefX, chefY, chefWidth, chefHeight);
}

function checkCollision() {
  eggs.forEach((egg, index) => {
    if (
      chefX < egg.x + eggWidth &&
      chefX + chefWidth > egg.x &&
      chefY < egg.y + eggHeight &&
      chefHeight + chefY > egg.y
    ) {
      if (egg.type === "normal") {
        score++;
        eggs.splice(index, 1);
        if (score === requiredEggs1 && currentLevel === 1) {
          currentLevel++;
        } else if (score === requiredEggs2 && currentLevel === 2) {
          currentLevel++;
        } else if (score === requiredEggs3 && currentLevel === 3) {
          gameOver = true;
          alert("You Win!");
        }
      } else {
        gameOver = true;
        alert("Game Over!");
      }
    }
  });
}

background.onload = function () {backgroundLoaded = true};

function animate() {
  if(!gameOver) {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    if (backgroundLoaded) {
      ctx.drawImage(background, 0, 0, myCanvas.width, myCanvas.height);
    }
    drawEggs();
    drawChef();
    requestAnimationFrame(animate);
  }

  if (gameOver && !gameOverAlreadyShown) {
    gameOverAlreadyShown = true;
    clearInterval(generateEggsInterval);
    clearInterval(checkCollisionInterval);
    alert("Game Over!");
  }
}

function increaseEggSpeed() {
  if (currentLevel === 2) {
    eggs.forEach(egg => {
      egg.speed += 0.25;
    });
  } else if (currentLevel === 3) {
    eggs.forEach(egg => {
      egg.speed += 0.5;
    });
  }
}

if (score === requiredEggs1 && currentLevel === 1) {
  currentLevel++;
  increaseEggSpeed();
  alert("Congratulations! You've reached level 2!");
} else if (score === requiredEggs2 && currentLevel === 2) {
  currentLevel++;
  increaseEggSpeed();
  alert("Congratulations! You've reached level 3!");
}

if (score === requiredEggs3 && currentLevel === 3) {
  gameOver = true;
  alert("You Win!");
}

function reset() {
  gameOver = false;
  currentLevel = 1;
  score = 0;
  eggs = [];

  const winDiv = document.querySelector("#win");
  winDiv.style.display = "none";

  clearInterval(generateEggsInterval);
  clearInterval(checkCollisionInterval);
  generateEggsInterval = setInterval(generateEggs, 2000);
  checkCollisionInterval = setInterval(checkCollision, 30);
  eggImageSpeed = 1;

  if (score === requiredEggs3 && currentLevel === 3) {
    gameOver = true;
    alert("You Win!");
    reset();
  } else if (egg.type === "rotten") {
    gameOver = true;
    console.log('jeje')
    alert("Game Over!");
    reset();
  }
}

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
      chefX -= chefSpeed;
  } else if (event.code === "ArrowRight") {
      chefX += chefSpeed;
  }
  chefX = Math.max(0, Math.min(chefX, myCanvas.width - chefWidth));
});

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
  document.getElementById("reset-button").onclick = () => {
    reset();
  };
};

setInterval(checkCollision, 30);

setInterval(increaseEggSpeed, 10000);

animate();