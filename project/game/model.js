
export function createShip(canvasWidth, canvasHeight) {
  return {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    angle: 0
  };
}

export function createStars(canvasWidth, canvasHeight, count = 300) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 2
    });
  }
  return stars;
}

//Asteroid helpers 

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomSizeType() {
  const value = Math.random();
  if (value < 0.45) return "small";
  if (value < 0.80) return "medium";
  return "large";
}

function getRadiusBySize(sizeType) {
  if (sizeType === "small")  return randomRange(14, 22);
  if (sizeType === "medium") return randomRange(24, 38);
  return randomRange(40, 60);
}

function getSpeedBySize(sizeType) {
  if (sizeType === "small")  return randomRange(2.2, 3.4);
  if (sizeType === "medium") return randomRange(1.4, 2.3);
  return randomRange(0.8, 1.5);
}

export function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function createAsteroid(canvasWidth, canvasHeight, ship) {
  const side     = Math.floor(Math.random() * 4);
  const sizeType = getRandomSizeType();
  const radius   = getRadiusBySize(sizeType);
  const speed    = getSpeedBySize(sizeType);

  const minDistanceFromShip = 220;
  let x, y, attempts = 0;

  do {
    if (side === 0)      { x = Math.random() * canvasWidth;  y = -radius - 20; }
    else if (side === 1) { x = canvasWidth + radius + 20;    y = Math.random() * canvasHeight; }
    else if (side === 2) { x = Math.random() * canvasWidth;  y = canvasHeight + radius + 20; }
    else                 { x = -radius - 20;                 y = Math.random() * canvasHeight; }
    attempts++;
  } while (getDistance(x, y, ship.x, ship.y) < minDistanceFromShip && attempts < 20);

  let angle;
  if (side === 0)      angle = randomRange(0.7, 2.4);
  else if (side === 1) angle = randomRange(1.9, 4.1);
  else if (side === 2) angle = randomRange(3.8, 5.5);
  else                 angle = randomRange(-0.8, 0.8);

  const vertices = Math.floor(Math.random() * 4) + 8;
  const offsets  = Array.from({ length: vertices }, () => Math.random() * 0.45 + 0.75);

  return {
    x, y,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    radius,
    sizeType,
    vertices,
    offsets,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: randomRange(-0.03, 0.03),
    mass: radius
  };
}
//Laser bullets 
const LASER_SPEED    = 12;
const LASER_LIFETIME = 55;  // frames antes de desaparecer
const LASER_LENGTH   = 18;  // largo visual de la línea
 
export function createLaser(ship) {
  // Sale desde la punta de la nave (offset +50 en local X)
  return {
    x:        ship.x + Math.cos(ship.angle) * 50,
    y:        ship.y + Math.sin(ship.angle) * 50,
    dx:       Math.cos(ship.angle) * LASER_SPEED,
    dy:       Math.sin(ship.angle) * LASER_SPEED,
    angle:    ship.angle,
    length:   LASER_LENGTH,
    life:     LASER_LIFETIME,
    opacity:  1
  };
}
// Update functions 

export function updateShip(ship, keys, canvasWidth, canvasHeight) {
  if (keys["ArrowLeft"])  ship.angle -= 0.05;
  if (keys["ArrowRight"]) ship.angle += 0.05;

  if (keys["ArrowUp"]) {
    ship.x += Math.cos(ship.angle) * 3;
    ship.y += Math.sin(ship.angle) * 3;
  }

  // Reaparece en el lado opuesto de la pantalla
  if (ship.x < 0)            ship.x = canvasWidth;
  if (ship.x > canvasWidth)  ship.x = 0;
  if (ship.y < 0)            ship.y = canvasHeight;
  if (ship.y > canvasHeight) ship.y = 0;
}

export function updateAsteroids(asteroids, canvasWidth, canvasHeight) {
  for (const asteroid of asteroids) {
    asteroid.x        += asteroid.dx;
    asteroid.y        += asteroid.dy;
    asteroid.rotation += asteroid.rotationSpeed;

    // Reaparece en el lado opuesto de la pantalla
    if (asteroid.x < -asteroid.radius - 10)             asteroid.x = canvasWidth  + asteroid.radius + 10;
    if (asteroid.x >  canvasWidth + asteroid.radius + 10) asteroid.x = -asteroid.radius - 10;
    if (asteroid.y < -asteroid.radius - 10)             asteroid.y = canvasHeight + asteroid.radius + 10;
    if (asteroid.y >  canvasHeight + asteroid.radius + 10) asteroid.y = -asteroid.radius - 10;
  }
}

export function handleAsteroidCollisions(asteroids) {
  for (let i = 0; i < asteroids.length; i++) {
    for (let j = i + 1; j < asteroids.length; j++) {
      const a = asteroids[i];
      const b = asteroids[j];

      const dx          = b.x - a.x;
      const dy          = b.y - a.y;
      const distance    = Math.sqrt(dx * dx + dy * dy);
      const minDistance = a.radius + b.radius;

      if (distance < minDistance) {
        // Intercambiar velocidades
        [a.dx, b.dx] = [b.dx, a.dx];
        [a.dy, b.dy] = [b.dy, a.dy];
        [a.rotationSpeed, b.rotationSpeed] = [b.rotationSpeed, a.rotationSpeed];

        // Separar asteroides superpuestos
        const overlap = minDistance - distance;
        const angle   = Math.atan2(dy, dx);
        const moveX   = Math.cos(angle) * (overlap / 2);
        const moveY   = Math.sin(angle) * (overlap / 2);

        a.x -= moveX;
        a.y -= moveY;
        b.x += moveX;
        b.y += moveY;
      }
    }
  }
}
export function updateLasers(lasers, canvasWidth, canvasHeight) {
  for (let i = lasers.length - 1; i >= 0; i--) {
    const l = lasers[i];
    l.x      += l.dx;
    l.y      += l.dy;
    l.life--;
    l.opacity = l.life / LASER_LIFETIME;
 
    // Continuidad de los disparos a traves de los bordes
    if (l.x < 0)             l.x = canvasWidth;
    if (l.x > canvasWidth)   l.x = 0;
    if (l.y < 0)             l.y = canvasHeight;
    if (l.y > canvasHeight)  l.y = 0;
 
    if (l.life <= 0) lasers.splice(i, 1);
  }
}