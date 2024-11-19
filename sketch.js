let whiteBall;
let balls = [];
let pocketRadius = 15;
let friction = 0.99;

function setup() {
  createCanvas(800, 400);
  // Criar a bola branca no centro
  whiteBall = new Ball(width / 4, height / 2, color(255));
  // Criar as bolas coloridas em forma de triângulo
  let colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)];
  let startX = (3 * width) / 4;
  let startY = height / 2;
  let offset = 20;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col <= row; col++) {
      let x = startX + row * offset;
      let y = startY + col * offset - (row * offset) / 2;
      balls.push(new Ball(x, y, colors[row % colors.length]));
    }
  }
}

function draw() {
  background(0, 100, 0);
  drawTable();
  
  // Atualizar e exibir as bolas
  whiteBall.update();
  whiteBall.display();
  for (let ball of balls) {
    ball.update();
    ball.display();
  }
  
  // Checar colisões entre bolas
  for (let i = 0; i < balls.length; i++) {
    whiteBall.checkCollision(balls[i]);
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkCollision(balls[j]);
    }
  }
}

function mousePressed() {
  let force = createVector(mouseX - whiteBall.x, mouseY - whiteBall.y);
  force.setMag(10); // Ajustar a força da tacada
  whiteBall.applyForce(force);
}

function drawTable() {
  // Desenhar os bolsos
  fill(0);
  circle(0, 0, pocketRadius * 2);
  circle(width, 0, pocketRadius * 2);
  circle(0, height, pocketRadius * 2);
  circle(width, height, pocketRadius * 2);
  circle(width / 2, 0, pocketRadius * 2);
  circle(width / 2, height, pocketRadius * 2);
}

class Ball {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.r = 10;
    this.c = c;
    this.vel = createVector(0, 0);
  }
  
  display() {
    fill(this.c);
    noStroke();
    circle(this.x, this.y, this.r * 2);
  }
  
  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.vel.mult(friction);
    
    // Checar colisão com a mesa
    if (this.x - this.r < 0 || this.x + this.r > width) {
      this.vel.x *= -1;
      this.x = constrain(this.x, this.r, width - this.r);
    }
    if (this.y - this.r < 0 || this.y + this.r > height) {
      this.vel.y *= -1;
      this.y = constrain(this.y, this.r, height - this.r);
    }
    
    // Checar se a bola caiu no bolso
    let pockets = [
      createVector(0, 0), createVector(width, 0),
      createVector(0, height), createVector(width, height),
      createVector(width / 2, 0), createVector(width / 2, height)
    ];
    for (let pocket of pockets) {
      if (dist(this.x, this.y, pocket.x, pocket.y) < pocketRadius) {
        this.vel.set(0, 0);
        this.x = -100; // Remove a bola da mesa
        this.y = -100;
      }
    }
  }
  
  applyForce(force) {
    this.vel.add(force);
  }
  
  checkCollision(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    if (d < this.r + other.r) {
      // Resolução simples de colisão
      let collisionNormal = createVector(other.x - this.x, other.y - this.y).normalize();
      let relativeVelocity = p5.Vector.sub(this.vel, other.vel);
      let speed = relativeVelocity.dot(collisionNormal);
      if (speed > 0) return;
      
      let impulse = collisionNormal.mult(speed);
      this.vel.sub(impulse);
      other.vel.add(impulse);
    }
  }
}
