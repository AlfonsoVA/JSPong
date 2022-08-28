var GameEngine = (function(GameEngine) {
  let PI2 = 2*Math.PI;

  class Ball {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;      

      this.speed = 500;
      this.angle = Math.random() * Math.PI/2.2;
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
    }

    update(elapsed) {
      this.x += this.vx * elapsed;
      this.y += this.vy * elapsed;
    }

    render(ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.fillRect(this.x, this.y, this.size, this.size);    
      ctx.fill();  
    }
  }

  GameEngine.Ball = Ball;
  return GameEngine;
})(GameEngine || {})