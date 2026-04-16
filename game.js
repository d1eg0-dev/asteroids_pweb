const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  angle: 0
};

let keys = {};
let asteroids = [];
let asteroidTimer = 0;
let asteroidInterval = 130;
let maxAsteroids = 8; 

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  updateShip();
  spawnAsteroids();
  updateAsteroids();
  handleAsteroidCollisions();

  drawShip();
  drawAsteroids();
  drawInfo();

  requestAnimationFrame(gameLoop);
}

gameLoop();

function drawShip() {
  context.save();

  context.translate(ship.x, ship.y);
  context.rotate(ship.angle);

  context.beginPath();
  context.moveTo(20, 0);
  context.lineTo(-10, -10);
  context.lineTo(-10, 10);
  context.closePath();

  context.strokeStyle = "deepskyblue";
  context.lineWidth = 2;
  context.stroke();

  context.restore();
}

function updateShip() {
  if (keys["ArrowLeft"]) {
    ship.angle -= 0.05;
  }

  if (keys["ArrowRight"]) {
    ship.angle += 0.05;
  }

  if (keys["ArrowUp"]) {
    ship.x += Math.cos(ship.angle) * 3;
    ship.y += Math.sin(ship.angle) * 3;
  }

  if (ship.x < 0) ship.x = canvas.width;
  if (ship.x > canvas.width) ship.x = 0;
  if (ship.y < 0) ship.y = canvas.height;
  if (ship.y > canvas.height) ship.y = 0;
}

function createAsteroid() {
  let side = Math.floor(Math.random() * 4);
  let x, y;

  let sizeType = getRandomSizeType();
  let radius = getRadiusBySize(sizeType);
  let speed = getSpeedBySize(sizeType);

  let attempts = 0;
  let minDistanceFromShip = 220;

  do {
    if (side === 0) {
      x = Math.random() * canvas.width;
      y = -radius - 20;
    } else if (side === 1) {
      x = canvas.width + radius + 20;
      y = Math.random() * canvas.height;
    } else if (side === 2) {
      x = Math.random() * canvas.width;
      y = canvas.height + radius + 20;
    } else {
      x = -radius - 20;
      y = Math.random() * canvas.height;
    }

    attempts++;
  } while (
    getDistance(x, y, ship.x, ship.y) < minDistanceFromShip &&
    attempts < 20
  );

  let angle;

  if (side === 0) {
    angle = randomRange(0.7, 2.4);
  } else if (side === 1) {
    angle = randomRange(1.9, 4.1);
  } else if (side === 2) {
    angle = randomRange(3.8, 5.5);
  } else {
    angle = randomRange(-0.8, 0.8);
  }

  let vertices = Math.floor(Math.random() * 4) + 8;
  let offsets = [];

  for (let i = 0; i < vertices; i++) {
    offsets.push(Math.random() * 0.45 + 0.75);
  }

  asteroids.push({
    x: x,
    y: y,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    radius: radius,
    sizeType: sizeType,
    vertices: vertices,
    offsets: offsets,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: randomRange(-0.03, 0.03),
    mass: radius
  });
}

function spawnAsteroids() {
  asteroidTimer++;

  if (asteroidTimer >= asteroidInterval && asteroids.length < maxAsteroids) {
    createAsteroid();
    asteroidTimer = 0;
  }
}

function getRandomSizeType() {
  let value = Math.random();

  if (value < 0.45) {
    return "small";
  } else if (value < 0.8) {
    return "medium";
  } else {
    return "large";
  }
}

function getRadiusBySize(sizeType) {
  if (sizeType === "small") {
    return randomRange(14, 22);
  } else if (sizeType === "medium") {
    return randomRange(24, 38);
  } else {
    return randomRange(40, 60);
  }
}

function getSpeedBySize(sizeType) {
  if (sizeType === "small") {
    return randomRange(2.2, 3.4);
  } else if (sizeType === "medium") {
    return randomRange(1.4, 2.3);
  } else {
    return randomRange(0.8, 1.5);
  }
}

function updateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    let asteroid = asteroids[i];

    asteroid.x += asteroid.dx;
    asteroid.y += asteroid.dy;
    asteroid.rotation += asteroid.rotationSpeed;

    if (asteroid.x < -asteroid.radius - 10) {
      asteroid.x = canvas.width + asteroid.radius + 10;
    }
    if (asteroid.x > canvas.width + asteroid.radius + 10) {
      asteroid.x = -asteroid.radius - 10;
    }
    if (asteroid.y < -asteroid.radius - 10) {
      asteroid.y = canvas.height + asteroid.radius + 10;
    }
    if (asteroid.y > canvas.height + asteroid.radius + 10) {
      asteroid.y = -asteroid.radius - 10;
    }
  }
}

function drawAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    let asteroid = asteroids[i];

    context.save();
    context.translate(asteroid.x, asteroid.y);
    context.rotate(asteroid.rotation);

    context.beginPath();

    for (let j = 0; j < asteroid.vertices; j++) {
      let angle = (Math.PI * 2 / asteroid.vertices) * j;
      let r = asteroid.radius * asteroid.offsets[j];
      let x = Math.cos(angle) * r;
      let y = Math.sin(angle) * r;

      if (j === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.closePath();

    context.fillStyle = "#2f2f2f";
    context.strokeStyle = "#9a9a9a";
    context.lineWidth = 2;
    context.fill();
    context.stroke();

    drawAsteroidDetails(asteroid);

    context.restore();
  }
}

function drawAsteroidDetails(asteroid) {
  context.strokeStyle = "#5e5e5e";
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(-asteroid.radius * 0.3, -asteroid.radius * 0.1);
  context.lineTo(asteroid.radius * 0.1, asteroid.radius * 0.15);
  context.lineTo(asteroid.radius * 0.35, asteroid.radius * 0.05);
  context.stroke();

  context.beginPath();
  context.moveTo(-asteroid.radius * 0.15, asteroid.radius * 0.3);
  context.lineTo(asteroid.radius * 0.05, asteroid.radius * 0.05);
  context.stroke();

  context.beginPath();
  context.arc(
    asteroid.radius * 0.18,
    -asteroid.radius * 0.18,
    asteroid.radius * 0.12,
    0,
    Math.PI * 2
  );
  context.stroke();
}

function handleAsteroidCollisions() {
  for (let i = 0; i < asteroids.length; i++) {
    for (let j = i + 1; j < asteroids.length; j++) {
      let a = asteroids[i];
      let b = asteroids[j];

      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let minDistance = a.radius + b.radius;

      if (distance < minDistance) {
        let tempDx = a.dx;
        let tempDy = a.dy;

        a.dx = b.dx;
        a.dy = b.dy;

        b.dx = tempDx;
        b.dy = tempDy;

        let tempRotation = a.rotationSpeed;
        a.rotationSpeed = b.rotationSpeed;
        b.rotationSpeed = tempRotation;

        let overlap = minDistance - distance;
        let angle = Math.atan2(dy, dx);

        let moveX = Math.cos(angle) * (overlap / 2);
        let moveY = Math.sin(angle) * (overlap / 2);

        a.x -= moveX;
        a.y -= moveY;
        b.x += moveX;
        b.y += moveY;
      }
    }
  }
}

function drawInfo() {
  context.fillStyle = "white";
  context.font = "18px Arial";
  context.fillText("Controles: ← → rotar, ↑ avanzar", 20, 30);
}

function getDistance(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}