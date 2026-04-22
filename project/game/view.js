export function drawStars(ctx, stars) {
  ctx.fillStyle = "white";
  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawShip(ctx, ship) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  // Cuerpo principal
  ctx.beginPath();
  ctx.moveTo(50, 0);
  ctx.lineTo(-20, -18);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-20, 18);
  ctx.closePath();
  ctx.fillStyle = "#1a0800";
  ctx.strokeStyle = "#ff5500";
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Ala superior
  ctx.beginPath();
  ctx.moveTo(-10, -18);
  ctx.lineTo(-30, -42);
  ctx.lineTo(-18, -18);
  ctx.closePath();
  ctx.fillStyle = "#1a0800";
  ctx.strokeStyle = "#ff6600";
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Ala inferior
  ctx.beginPath();
  ctx.moveTo(-10, 18);
  ctx.lineTo(-30, 42);
  ctx.lineTo(-18, 18);
  ctx.closePath();
  ctx.fillStyle = "#1a0800";
  ctx.strokeStyle = "#ff6600";
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Cabina / detalle frontal
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.lineTo(10, -7);
  ctx.lineTo(6, 0);
  ctx.lineTo(10, 7);
  ctx.closePath();
  ctx.fillStyle = "#2a1000";
  ctx.strokeStyle = "#ff8800";
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  // Línea dorsal
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(40, 0);
  ctx.strokeStyle = "rgba(255,119,0,0.5)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Motor — llama exterior
  ctx.beginPath();
  ctx.ellipse(-16, 0, 5, 3, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,68,0,0.8)";
  ctx.fill();

  // Motor — llama interior
  ctx.beginPath();
  ctx.ellipse(-20, 0, 3, 1.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,170,0,0.95)";
  ctx.fill();

  ctx.restore();
}

export function drawAsteroids(ctx, asteroids) {
  for (const asteroid of asteroids) {
    ctx.save();
    ctx.translate(asteroid.x, asteroid.y);
    ctx.rotate(asteroid.rotation);

    ctx.beginPath();
    for (let j = 0; j < asteroid.vertices; j++) {
      const angle = (Math.PI * 2 / asteroid.vertices) * j;
      const r = asteroid.radius * asteroid.offsets[j];
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "#2f2f2f";
    ctx.strokeStyle = "#9a9a9a";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    _drawAsteroidDetails(ctx, asteroid);

    ctx.restore();
  }
}

function _drawAsteroidDetails(ctx, asteroid) {
  ctx.strokeStyle = "#5e5e5e";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(-asteroid.radius * 0.30, -asteroid.radius * 0.10);
  ctx.lineTo(asteroid.radius * 0.10, asteroid.radius * 0.15);
  ctx.lineTo(asteroid.radius * 0.35, asteroid.radius * 0.05);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-asteroid.radius * 0.15, asteroid.radius * 0.30);
  ctx.lineTo(asteroid.radius * 0.05, asteroid.radius * 0.05);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    asteroid.radius * 0.18,
    -asteroid.radius * 0.18,
    asteroid.radius * 0.12,
    0, Math.PI * 2
  );
  ctx.stroke();
}

export function drawLasers(ctx, lasers) {
  for (const l of lasers) {
    ctx.save();

    // Capa externa de luz del laser
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(
      l.x - Math.cos(l.angle) * l.length,
      l.y - Math.sin(l.angle) * l.length
    );
    ctx.strokeStyle = `rgba(255, 120, 0, ${l.opacity * 0.35})`;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.stroke();

    // Núcleo brillante
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(
      l.x - Math.cos(l.angle) * l.length,
      l.y - Math.sin(l.angle) * l.length
    );
    ctx.strokeStyle = `rgba(255, 220, 100, ${l.opacity})`;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();

    // Punta brillante
    ctx.beginPath();
    ctx.arc(l.x, l.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 180, ${l.opacity})`;
    ctx.fill();

    ctx.restore();
  }
}

export function drawExplosions(ctx, explosions) {
  for (const explosion of explosions) {
    // Destello central
    if (explosion.flashLife > 0) {
      const alpha = explosion.flashLife / 10;

      ctx.save();
      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, explosion.flashRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 200, 120, ${alpha * 0.25})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, explosion.flashRadius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 245, 200, ${alpha * 0.5})`;
      ctx.fill();
      ctx.restore();
    }

    for (const p of explosion.particles) {
      const alpha = p.life / p.maxLife;

      ctx.save();
      ctx.globalAlpha = alpha;

      if (p.type === "spark") {
        // halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, 0.18)`;
        ctx.fill();

        // núcleo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, 0.95)`;
        ctx.fill();
      } else {
        // fragmentos tipo escombro
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        ctx.moveTo(-p.size, -p.size * 0.6);
        ctx.lineTo(p.size, -p.size * 0.25);
        ctx.lineTo(p.size * 0.55, p.size * 0.8);
        ctx.lineTo(-p.size * 0.75, p.size * 0.35);
        ctx.closePath();
        ctx.fillStyle = `rgba(${p.color}, 0.8)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(220,220,220,${alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    }
  }
}

export function drawInfo(ctx) {
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Controles: ← → rotar, ↑ avanzar, Tecla Espacio disparar", 20, 30);
}

export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}