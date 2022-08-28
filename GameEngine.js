var GameEngine = (function(GameEngine) {
  let cw;
  let ch;
  let rect_x_l;
  let rect_y_l;
  let rect_w_l;
  let rect_h_l;
  let rect_x_r;
  let rect_y_r;
  let rect_w_r;
  let rect_h_r;

  let score_left = "3";
  let title = "P O N G";
  let text = "";
  let score_title = "Puntos: ";
  let score = "0";
  let intro_text = "Presiona [espacio] para jugar";
  let begin = false;

  let Key = {
    _pressed : {},

    isPress: function(keyCode) {
      return this._pressed[keyCode];
    },
    onKeyDown: function(keyCode) {
      this._pressed[keyCode] = true;
    },
    onKeyUp: function(keyCode) {
      delete this._pressed[keyCode];
    } 
  }

  class Game {
    constructor(ctx) {
      cw = ctx.canvas.width;
      ch = ctx.canvas.height;
      this.ctx = ctx;

      rect_x_l = 30;
      rect_y_l = ch/2;
      rect_w_l = 20;
      rect_h_l = 200;
      
      rect_w_r = 20;
      rect_h_r = 500;
      rect_x_r = cw-5;
      rect_y_r = ch/2;
      
      window.addEventListener("keydown", function(evt) {
        Key.onKeyDown(evt.keyCode);        
      });

      window.addEventListener("keyup", function(evt) {
        Key.onKeyUp(evt.keyCode);
      });             
             
    }

    processInput() {     
      //Inputs del jugador de la izquierda:
      if (Key.isPress(87)) {
        rect_y_l -= 5;        
      }
      if (Key.isPress(83)) {
        rect_y_l += 5;
      } 

      //Input para "iniciar el juego"
      if (Key.isPress(32) && !(begin)) {
        begin = true;
        this.ball = new GameEngine.Ball(cw/2,cw/2,15); 
        title = "";
        intro_text = "";
        text = "";
      }          
    }

    update(elapsed) {      
      // En caso tengamos un ganador
      if(score_left === "0"){
        begin = false;
        text = "Puntaje: " + score;
        rect_h_l = 200;
        title = "Fin del juego";
        intro_text = "Presiona [espacio] para reiniciar";
        score_left = "3";
        score = 0;
      }

      // //Reubicar las posiciones del jugador en caso se pase...
      // if (rect_y_l*2 <= rect_h_l/2) {                
      //   rect_y_l = rect_h_l/2;
      // }
      // if (rect_y_l >= ch) {
      //   rect_y_l = rect_y_l - rect_h_l/2;
      // }
       
      //En caso el juego haya iniciado, actualizamos la pelota:
      if(begin){                
      	//Colision con raqueta y aumento de velocidad con 0.10
        if(this.ball.x < rect_x_l && this.ball.y > (rect_y_l - rect_y_l/2.2) && this.ball.y < (rect_y_l + rect_y_l/2)){
          score = String(parseInt(score) + 1);
          if(parseInt(score) > 0 && parseInt(score) % 5 == 0){
            if(rect_h_l > 30){
              rect_h_l -= 12;
            }
            this.ball.vx*= -1.15;
          }else{
            this.ball.vx *= -1.00;
          }
          this.ball.angle = Math.random() * Math.PI/2.2;
          //this.ball.vx *= (parseInt(score) > 0 && parseInt(score) % 5 == 0) ? -1.12 : -1.00;
          this.ball.x = rect_x_l;
        }
        //Rebote con pared
        if(this.ball.x > cw - 16){
          this.ball.vx *= -1.0;
          this.ball.x = rect_x_r-10;
        }
        //Perder vidas y reiniciar pelota.
        if (this.ball.x < this.ball.size) {
          score_left = String(parseInt(score_left) - 1);
          this.ball.angle = Math.random() * Math.PI/2.2;
          this.ball.x = this.ball.size;
          this.ball.vx *= -1;
          this.ball.x = cw/2;
          this.ball.y = cw/2;
        }
        //Chocar con pared superior
        if (this.ball.y < this.ball.size) {          
          this.ball.vy *= -1;
          this.ball.y = this.ball.size;
        }
        //Chocar con paren inferior.
        if (this.ball.y > ch-this.ball.size) {        
          this.ball.vy *= -1;
          this.ball.y = ch-this.ball.size;
        }
        //Actualizar valores de pelota.
        this.ball.update(elapsed);    
      }     
    }

    render() {
      this.ctx.clearRect(0, 0, cw, ch);
      this.ctx.fillStyle = "white";
      this.ctx.beginPath();
      this.ctx.fillRect(rect_x_l - rect_w_l/2, rect_y_l-rect_h_l/2, rect_w_l, rect_h_l);
      this.ctx.fillRect(rect_x_r - rect_w_r/2, rect_y_r-rect_h_r/2, rect_w_r, rect_h_r);      
      
      //En caso haya iniciado el juego: dibujamos la pelota:
      if(begin){
        this.ball.render(this.ctx);
      }      

      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 5;
      this.ctx.lineJoin = "bevel";
      this.ctx.font = "bold 40px Helvetica";
      this.ctx.beginPath();   
      this.ctx.fillText(title, cw/2-100, ch/2);
      this.ctx.fillText(text, cw/2-75, ch/2+60);
      this.ctx.fillText(score_title, cw/2 - 50, 40);
      this.ctx.fillText(score, cw/2 + 110, 40);
      this.ctx.fillText(String.fromCharCode(9632) + " x ", cw/2 - 300, 40);
      this.ctx.fillText(score_left, cw/2 - 220, 40);
      this.ctx.fillText(intro_text, 110, ch - 100);
    }
  }

  GameEngine.Game = Game;
  return GameEngine;
})(GameEngine || {})