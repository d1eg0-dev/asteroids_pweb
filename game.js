const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  angle : 0
};

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawShip(); 
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

  context.strokeStyle = "blue";
  context.stroke();

  context.restore();
}