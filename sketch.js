var Clocks = [];

var r = 237;
var g = 34;
var b = 93;

function resetCanvas() {
  Clocks = [];
  while (Clocks.length < random(6, 12)) {
    var diameter = random((windowWidth + windowHeight) / 16, (windowWidth + windowHeight) / 12);
    var radius = diameter / 2;
    var x = random(radius, width - radius);
    var y = random(radius, height - radius);
    Clocks.push(new Clock(x, y, diameter));
  }
}

function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight);
  resetCanvas();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetCanvas();
}

function draw() {
  background(255, 255, 255);
  for (var i = 0; i < Clocks.length; i++) {
    Clocks[i].draw();
    Clocks[i].move();
  }
}

function Clock(x, y, diameter) {
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.radius = this.diameter / 2;
  this.sRadius = this.radius * 0.72;
  this.mRadius = this.radius * 0.60;
  this.hRadius = this.radius * 0.50;
  this.xDir = random(0, 1) ? -1 : 1;
  this.yDir = random(0, 1) ? -1 : 1;
  this.xSpeed = random(1, 4);
  this.ySpeed = random(1, 4);
  this.s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  this.m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  this.h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;
  this.frameCount = 0;
  this.mouseOver = (dist(mouseX, mouseY, this.x, this.y) < this.radius) ? true : false;

  this.draw = function() {
    fill(r, g, b, 10)
    stroke(r, g, b, 100);
    ellipse(this.x, this.y, this.diameter);
    this.mouseOver = (dist(mouseX, mouseY, this.x, this.y) < this.radius) ? true : false;
    this.collision = false;
    for (var i = 0; i < Clocks.length; i++) {
      if (Clocks[i] != this && dist(Clocks[i].x, Clocks[i].y, this.x, this.y) <= this.radius + Clocks[i].radius) {
        this.collision = true;
      }
    }
    var actual_s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
    var actual_m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
    var actual_h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

    if (this.mouseOver || this.collision) {
      this.frameCount++;
      this.s = map(second() + (this.frameCount), 0, 60, 0, TWO_PI) - HALF_PI;
      this.m = map(minute() + (this.frameCount) + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
      this.h = map(hour() + (this.frameCount) + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;
    }
    else if (!this.mouseOver && (this.s != actual_s || this.m != actual_m || this.h != actual_h)) {
      if (this.frameCount > 1) {
        this.frameCount--;

        this.s -= (this.s > actual_s) ? diff(this.s, actual_s) / this.frameCount : 0;
        this.s += (this.s < actual_s) ? diff(this.s, actual_s) / this.frameCount : 0;

        this.m -= (this.m > actual_m) ? diff(this.m, actual_m) / this.frameCount : 0;
        this.m += (this.m < actual_m) ? diff(this.m, actual_m) / this.frameCount : 0;

        this.h -= (this.h > actual_h) ? diff(this.h, actual_h) / this.frameCount : 0;
        this.h += (this.h < actual_h) ? diff(this.h, actual_h) / this.frameCount : 0;

      } else {
        this.s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
        this.m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
        this.h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;
      }
    }

    // Draw the hands of the clock
    strokeWeight(1);
    line(this.x, this.y, this.x + cos(this.s) * this.sRadius, this.y + sin(this.s) * this.sRadius);
    strokeWeight(2);
    line(this.x, this.y, this.x + cos(this.m) * this.mRadius, this.y + sin(this.m) * this.mRadius);
    strokeWeight(4);
    line(this.x, this.y, this.x + cos(this.h) * this.hRadius, this.y + sin(this.h) * this.hRadius);

    // Draw the hour ticks
    strokeWeight(2);
    beginShape(POINTS);
    for (var a = 0; a < 360; a += 30) {
      var angle = radians(a);
      var x = this.x + cos(angle) * this.sRadius;
      var y = this.y + sin(angle) * this.sRadius;
      vertex(x, y);
    }
    endShape();
  }

  this.move = function() {
    this.x = this.x += (this.xDir * this.xSpeed);
    this.y = this.y += (this.yDir * this.ySpeed);
    this.xDir = (this.x - this.radius < 0 || this.x + this.radius > width) ? -this.xDir : this.xDir;
    this.yDir = (this.y - this.radius < 0 || this.y + this.radius > height) ? -this.yDir : this.yDir;
  }
}

function diff(a, b) {
  return abs(a - b);
}
