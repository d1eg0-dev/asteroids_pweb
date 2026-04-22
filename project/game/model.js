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

// Helpers de asteroides

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
  if (sizeType === "small") return randomRange(14, 22);
  if (sizeType === "medium") return randomRange(24, 38);
  return randomRange(40, 60);
}

function getSpeedBySize(sizeType) {
  if (sizeType === "small") return randomRange(2.2, 3.4);
  if (sizeType === "medium") return randomRange(1.4, 2.3);
  return randomRange(0.8, 1.5);
}

export function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function createAsteroid(canvasWidth, canvasHeight, ship) {
  const side = Math.floor(Math.random() * 4);
  const sizeType = getRandomSizeType();
  const radius = getRadiusBySize(sizeType);
  const speed = getSpeedBySize(sizeType);

  const minDistanceFromShip = 220;
  let x, y, attempts = 0;

  do {
    if (side === 0) {
      x = Math.random() * canvasWidth;
      y = -radius - 20;
    } else if (side === 1) {
      x = canvasWidth + radius + 20;
      y = Math.random() * canvasHeight;
    } else if (side === 2) {
      x = Math.random() * canvasWidth;
      y = canvasHeight + radius + 20;
    } else {
      x = -radius - 20;
      y = Math.random() * canvasHeight;
    }
    attempts++;
  } while (getDistance(x, y, ship.x, ship.y) < minDistanceFromShip && attempts < 20);

  let angle;
  if (side === 0) angle = randomRange(0.7, 2.4);
  else if (side === 1) angle = randomRange(1.9, 4.1);
  else if (side === 2) angle = randomRange(3.8, 5.5);
  else angle = randomRange(-0.8, 0.8);

  const vertices = Math.floor(Math.random() * 4) + 8;
  const offsets = Array.from({ length: vertices }, () => Math.random() * 0.45 + 0.75);

  return {
    x,
    y,
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

// Láseres
const LASER_SPEED = 12;
const LASER_LIFETIME = 55;
const LASER_LENGTH = 18;

export function createLaser(ship) {
  return {
    x: ship.x + Math.cos(ship.angle) * 50,
    y: ship.y + Math.sin(ship.angle) * 50,
    dx: Math.cos(ship.angle) * LASER_SPEED,
    dy: Math.sin(ship.angle) * LASER_SPEED,
    angle: ship.angle,
    length: LASER_LENGTH,
    life: LASER_LIFETIME,
    opacity: 1
  };
}

// Explosiones
const EXPLOSION_LIFE = 26;
const EXPLOSION_SPARKS = 18;
const EXPLOSION_DEBRIS = 10;

export function createExplosion(x, y, radius) {
  const particles = [];

  for (let i = 0; i < EXPLOSION_SPARKS; i++) {
    const angle = randomRange(0, Math.PI * 2);
    const speed = randomRange(2.5, 6.5) + radius * 0.03;

    particles.push({
      type: "spark",
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      size: randomRange(2, 4.5),
      life: EXPLOSION_LIFE,
      maxLife: EXPLOSION_LIFE,
      color: i % 2 === 0 ? "255,200,90" : "255,120,30"
    });
  }

  for (let i = 0; i < EXPLOSION_DEBRIS; i++) {
    const angle = randomRange(0, Math.PI * 2);
    const speed = randomRange(1.2, 4.2) + radius * 0.02;

    particles.push({
      type: "debris",
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      size: randomRange(2, 5),
      life: EXPLOSION_LIFE + Math.floor(randomRange(4, 10)),
      maxLife: EXPLOSION_LIFE + Math.floor(randomRange(4, 10)),
      rotation: randomRange(0, Math.PI * 2),
      rotationSpeed: randomRange(-0.25, 0.25),
      color: "150,150,150"
    });
  }

  return {
    x,
    y,
    flashRadius: radius * 0.9,
    flashLife: 10,
    particles
  };
}

// Updates

export function updateShip(ship, keys, canvasWidth, canvasHeight) {
  if (keys["ArrowLeft"]) ship.angle -= 0.05;
  if (keys["ArrowRight"]) ship.angle += 0.05;

  if (keys["ArrowUp"]) {
    ship.x += Math.cos(ship.angle) * 3;
    ship.y += Math.sin(ship.angle) * 3;
  }

  if (ship.x < 0) ship.x = canvasWidth;
  if (ship.x > canvasWidth) ship.x = 0;
  if (ship.y < 0) ship.y = canvasHeight;
  if (ship.y > canvasHeight) ship.y = 0;
}

export function updateAsteroids(asteroids, canvasWidth, canvasHeight) {
  for (const asteroid of asteroids) {
    asteroid.x += asteroid.dx;
    asteroid.y += asteroid.dy;
    asteroid.rotation += asteroid.rotationSpeed;

    if (asteroid.x < -asteroid.radius - 10) asteroid.x = canvasWidth + asteroid.radius + 10;
    if (asteroid.x > canvasWidth + asteroid.radius + 10) asteroid.x = -asteroid.radius - 10;
    if (asteroid.y < -asteroid.radius - 10) asteroid.y = canvasHeight + asteroid.radius + 10;
    if (asteroid.y > canvasHeight + asteroid.radius + 10) asteroid.y = -asteroid.radius - 10;
  }
}

export function handleAsteroidCollisions(asteroids) {
  for (let i = 0; i < asteroids.length; i++) {
    for (let j = i + 1; j < asteroids.length; j++) {
      const a = asteroids[i];
      const b = asteroids[j];

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = a.radius + b.radius;

      if (distance < minDistance) {
        [a.dx, b.dx] = [b.dx, a.dx];
        [a.dy, b.dy] = [b.dy, a.dy];
        [a.rotationSpeed, b.rotationSpeed] = [b.rotationSpeed, a.rotationSpeed];

        const overlap = minDistance - distance;
        const angle = Math.atan2(dy, dx);
        const moveX = Math.cos(angle) * (overlap / 2);
        const moveY = Math.sin(angle) * (overlap / 2);

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
    l.x += l.dx;
    l.y += l.dy;
    l.life--;
    l.opacity = l.life / LASER_LIFETIME;

    if (l.x < 0) l.x = canvasWidth;
    if (l.x > canvasWidth) l.x = 0;
    if (l.y < 0) l.y = canvasHeight;
    if (l.y > canvasHeight) l.y = 0;

    if (l.life <= 0) lasers.splice(i, 1);
  }
}

export function handleLaserAsteroidHits(lasers, asteroids, explosions) {
  for (let i = lasers.length - 1; i >= 0; i--) {
    const laser = lasers[i];
    let hit = false;

    for (let j = asteroids.length - 1; j >= 0; j--) {
      const asteroid = asteroids[j];
      const distance = getDistance(laser.x, laser.y, asteroid.x, asteroid.y);

      if (distance <= asteroid.radius) {
        explosions.push(createExplosion(asteroid.x, asteroid.y, asteroid.radius));
        asteroids.splice(j, 1);
        lasers.splice(i, 1);
        hit = true;
        break;
      }
    }

    if (hit) continue;
  }
}

export function updateExplosions(explosions) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const explosion = explosions[i];

    explosion.flashLife--;
    explosion.flashRadius *= 1.08;

    for (let j = explosion.particles.length - 1; j >= 0; j--) {
      const p = explosion.particles[j];

      p.x += p.dx;
      p.y += p.dy;

      p.dx *= 0.98;
      p.dy *= 0.98;
      p.life--;

      if (p.type === "spark") {
        p.size *= 0.97;
      } else {
        p.rotation += p.rotationSpeed;
        p.size *= 0.985;
      }

      if (p.life <= 0 || p.size <= 0.3) {
        explosion.particles.splice(j, 1);
      }
    }

    if (explosion.flashLife <= 0 && explosion.particles.length === 0) {
      explosions.splice(i, 1);
    }
  }
}