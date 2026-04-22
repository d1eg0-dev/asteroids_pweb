import {
  createShip,
  createStars,
  createLaser,
  updateLasers,
  createAsteroid,
  updateShip,
  updateAsteroids,
  handleAsteroidCollisions,
  handleLaserAsteroidHits,
  updateExplosions
} from "./model.js";

import {
  clearCanvas,
  drawStars,
  drawShip,
  drawAsteroids,
  drawLasers,
  drawInfo,
  drawExplosions
} from "./view.js";

const MAX_ASTEROIDS = 8;
const ASTEROID_INTERVAL = 130;
const SHOOT_COOLDOWN = 12;

export function initGame(canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let ship = createShip(canvas.width, canvas.height);
  let stars = createStars(canvas.width, canvas.height);
  let asteroids = [];
  let lasers = [];
  let explosions = [];
  let keys = {};
  let asteroidTimer = 0;
  let shootTimer = 0;

  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " ") e.preventDefault();
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  function spawnAsteroids() {
    asteroidTimer++;
    if (asteroidTimer >= ASTEROID_INTERVAL && asteroids.length < MAX_ASTEROIDS) {
      asteroids.push(createAsteroid(canvas.width, canvas.height, ship));
      asteroidTimer = 0;
    }
  }

  function handleShooting() {
    if (shootTimer > 0) shootTimer--;

    if (keys[" "] && shootTimer === 0) {
      lasers.push(createLaser(ship));
      shootTimer = SHOOT_COOLDOWN;
    }
  }

  function gameLoop() {
    clearCanvas(ctx, canvas.width, canvas.height);

    // Modelo
    updateShip(ship, keys, canvas.width, canvas.height);
    handleShooting();
    spawnAsteroids();
    updateAsteroids(asteroids, canvas.width, canvas.height);
    handleAsteroidCollisions(asteroids);
    updateLasers(lasers, canvas.width, canvas.height);
    handleLaserAsteroidHits(lasers, asteroids, explosions);
    updateExplosions(explosions);

    // Vista
    drawStars(ctx, stars);
    drawShip(ctx, ship);
    drawLasers(ctx, lasers);
    drawAsteroids(ctx, asteroids);
    drawExplosions(ctx, explosions);
    drawInfo(ctx);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}