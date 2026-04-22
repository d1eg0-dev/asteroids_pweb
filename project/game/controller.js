
import {
  createShip,
  createStars,
  createAsteroid,
  updateShip,
  updateAsteroids,
  handleAsteroidCollisions
} from "./model.js";
 
import {
  clearCanvas,
  drawStars,
  drawShip,
  drawAsteroids,
  drawInfo
} from "./view.js";
 
const MAX_ASTEROIDS    = 8;
const ASTEROID_INTERVAL = 130;
 
export function initGame(canvas) {
  const ctx = canvas.getContext("2d");
 
  // Dimensiones 
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
 
  //Estado del juego 
  let ship      = createShip(canvas.width, canvas.height);
  let stars     = createStars(canvas.width, canvas.height);
  let asteroids = [];
  let keys      = {};
  let asteroidTimer = 0;
 
  // Input 
  document.addEventListener("keydown", (e) => { keys[e.key] = true;  });
  document.addEventListener("keyup",   (e) => { keys[e.key] = false; });
 
  // Spawn de asteroides 
  function spawnAsteroids() {
    asteroidTimer++;
    if (asteroidTimer >= ASTEROID_INTERVAL && asteroids.length < MAX_ASTEROIDS) {
      asteroids.push(createAsteroid(canvas.width, canvas.height, ship));
      asteroidTimer = 0;
    }
  }
 
  //  Game loop 
  function gameLoop() {
    clearCanvas(ctx, canvas.width, canvas.height);
 
    // Actualizar modelo
    updateShip(ship, keys, canvas.width, canvas.height);
    spawnAsteroids();
    updateAsteroids(asteroids, canvas.width, canvas.height);
    handleAsteroidCollisions(asteroids);
 
    // Renderizar vista
    drawStars(ctx, stars);
    drawShip(ctx, ship);
    drawAsteroids(ctx, asteroids);
    drawInfo(ctx);
 
    requestAnimationFrame(gameLoop);
  }
 
  gameLoop();
}
 