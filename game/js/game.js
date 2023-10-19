let prevMarble = {
   x: -1,
   y: -1
}
let stationaryTime = 0;

class Game {
  constructor(config = {}) {
      this.phaserConfig = {
         type: Phaser.AUTO,
         parent: config.id ? config.id : "game",
         width: config.width ? config.width : 800,
         height: config.height ? config.height : 600,
            // backgroundColor: config.backgroundColor ? config.backgroundColor : "#FFFFFF",
         physics: {
            default: 'matter', //default: 'arcade',
            matter: { //arcade: {
               gravity: {x:0, y:1},
               debug: false
            }
         },
         scene: {
           key: "default",
           create: this.createScene,
           update: this.updateScene
        }
      };
   }

   async preload() {
      // this.load.image("undo","assets/undo.png");
   }

   async createScene() {
      let sc_width = this.game.config.width;
      let sc_height = this.game.config.height;
      let draw_color = 0x00aa00;

      //this.matter.world.setBounds();
      //this.matter.world.update60Hz();
      this.scdims = {
         x0: sc_width/2,
         y0: 0,
         width: sc_width,
         height: sc_height
      }

      const tooldims = {
         x0: sc_width/2,
         y0: 0,
         width: sc_width,
         height: sc_height*.1
      }


      const toolbar = this.add.rectangle(tooldims.x0, tooldims.y0, tooldims.width, tooldims.height*2, 0x212121);
      toolbar.setInteractive();
      toolbar.on('pointerover', () => {
         this.game.canvas.style.cursor = 'pointer';
         this.squareCursor.setVisible(false);
      })
      toolbar.on('pointerout', () => {
         this.game.canvas.style.cursor = 'none';
         this.squareCursor.setVisible(true);
      })
      this.matter.add.gameObject(toolbar, {
         restitution: 0,
         friction: 1,
         isStatic: true
      });
      
      this.clear_button = new Button("text", sc_width*.4, sc_height*.05, "clear", this, "enabled", () => { 
         if(this.marble == null || this.marble.isStationary || this.marble.isOutofBound){
            //clear marble
            if(this.marble != null){
               this.marble.destroy();
               this.marble = null;
            }
            
            //clear graphics
            this.graphics.clear();
            this.curves = [];
            //clear all physics objects
            this.allRects.forEach(rs => {
               this.matter.world.remove(rs.start);
               rs.rect.forEach(r => {
                  this.matter.world.remove(r); //remove array of rect arrays
               });
            });
            this.allRects = [];
         }
      });
      this.undo_button = new Button("text", sc_width*.5, sc_height*.05, "undo", this, "enabled", () => { 
         if(this.marble == null || this.marble.isStationary || this.marble.isOutofBound){
            //clear marble
            if(this.marble != null){
               this.marble.destroy();
               this.marble = null;
            }

            //clear last drawn stroke
            if(this.curves.length > 0){
               this.curves.pop();
               this.graphics.clear();
               this.graphics.lineStyle(size, draw_color);
            
               this.curves.forEach(c => {
                  c.draw(this.graphics, 64);
               });
            }
            if(this.allRects.length > 0){
               let lastRects = this.allRects.pop();
               this.matter.world.remove(lastRects.start);
               lastRects.rect.forEach(r => {
                  this.matter.world.remove(r);
               });
            }
         }
      });
      this.marble = null;
      this.drop_button = new Button("text", sc_width*.6, sc_height*.05, "drop\nball", this, "enabled", () => { 
         //clear marble
         if(this.marble != null){
            this.marble.destroy();
         }

         //drop new marble
         this.marble = new Marble(sc_width*.1, sc_height*.15, this);
         this.marble.isStationary = false;
         this.marble.isOutofBound = false;
      });

      this.outline = new Marble_outline(sc_width*.1, sc_height*.15, this);
      //this.ground = new Ground(sc_width/2, sc_height*.9+100, sc_width, 100, this);
      this.goal = new Goal(sc_width*.9, sc_height*.91, this);

      this.draw_txt = this.add.text(sc_width/2,sc_height/2, "Draw!", {fontFamily:"Georgia", fontSize: 36, color: '#00aa00'})
         .setInteractive()
         .setOrigin(0.5);

      // drawing lines
      this.graphics = this.add.graphics();

      var curr = null;
      var prev = null;
      this.curves = [];
      this.curve = null;
      let rects = [];
      this.allRects = [];

      const lineCategory = this.matter.world.nextCategory();
      // const sides = 4;
      const size = 16;
      const distance = size; //size
      const stiffness = 0.1; //0.1
      const options = { friction: 0, restitution: 1.5, ignoreGravity: true, inertia: Infinity, isStatic: true, angle: 0, collisionFilter: { category: lineCategory } };
      const lastPosition = new Phaser.Math.Vector2();
      
      this.input.on('pointerdown', function(pointer){
         if(!isWithinBound(pointer.x, pointer.y, tooldims)){ // button clicks don't result in drawing
            this.draw_txt.destroy();

            rects = [];
            lastPosition.x = pointer.x;
            lastPosition.y = pointer.y;

            this.circ = this.matter.add.circle(pointer.x, pointer.y, size/2, options);
            prev = this.circ;
            this.curve = new Phaser.Curves.Spline([ pointer.x, pointer.y ]);
            this.curves.push(this.curve);
         } else{
            console.log("can't draw in toolbar");
         }
      }, this);

      this.input.on('pointermove', function(pointer){
         if(pointer.isDown & !isWithinBound(pointer.x, pointer.y, tooldims)){
            const x = pointer.x;
            const y = pointer.y;

            if(Phaser.Math.Distance.Between(x, y, lastPosition.x, lastPosition.y) > distance){
               options.angle = Phaser.Math.Angle.Between(x, y, lastPosition.x, lastPosition.y);

               // physics objects are angled rectangles
               let midx = (pointer.x+lastPosition.x)/2;
               let midy = (pointer.y+lastPosition.y)/2;
               let widthx = Math.abs(x-lastPosition.x); // in case of undefined polygons
               //let heighty = Math.max(Math.abs(y-lastPosition.y), 2);
               let heighty = 20;
               curr = this.matter.add.rectangle(midx, midy, widthx, heighty, options);
               rects.push(curr);

               lastPosition.x = x;
               lastPosition.y = y;

               this.matter.add.constraint(prev, curr, distance, stiffness);

               prev = curr;
               this.curve.addPoint(x, y);

               this.graphics.clear();
               this.graphics.lineStyle(size, draw_color);
               this.curves.forEach(c => {
                  c.draw(this.graphics, 64);
               });
            }
         }
      }, this);

      this.input.on('pointerup', function(pointer){
         let curvePhys = {start: this.circ, rect: rects}
         this.allRects.push(curvePhys);
      }, this);

      // cursor replaced by square
      this.squareCursor = this.add.graphics();
      this.squareCursor.fillStyle(draw_color);  // Red color for illustration
      this.squareCursor.fillRect(0, 0, size, size);
      this.game.canvas.style.cursor = 'none';
   }


   async updateScene(time, delta) {
      this.squareCursor.x = this.input.x;
      this.squareCursor.y = this.input.y;

      if(this.marble != null && !this.marble.isOutofBound && !isWithinBound(this.marble.body.position.x, this.marble.body.position.y, this.scdims)){
         console.log("marble is out of bound");
         this.marble.isOutofBound = true;
      }

      // checks if marble exists and is within screen bounds
      if(this.marble != null && !this.marble.isOutofBound && !this.marble.isStationary) {
         // checks if marble is stationary for more than 2 seconds
         if(Math.round(this.marble.body.position.x) === prevMarble.x && Math.round(this.marble.body.position.y) === prevMarble.y){
            stationaryTime += delta;
            if(stationaryTime >= 2000) {
               console.log("marble is stationary");
               this.marble.isStationary = true;
            }
         } else {
            stationaryTime = 0;
            prevMarble.x = Math.round(this.marble.body.position.x);
            prevMarble.y = Math.round(this.marble.body.position.y);
         }
      } 

      // if(this.marble != null && !this.marble.isOutofBound && !this.marble.isStationary){
      //    this.clear_button.disableInteractive();
      //    this.undo_button.disableInteractive();
      // }
   }

   async authenticate() { }
   async joinOrCreateGame(id) { }
   async joinGame(id, authId) { }
   async createGame(id, authId) {
      this.game = new Phaser.Game(this.phaserConfig);
      this.game.scene.start("default",{
         "gameId": id
      });
   }
}

class Button {
   constructor(type, x, y, label, scene, enabled, callback) {
   if(type == "text"){
      const button = scene.add.text(x, y, label, {fontFamily:"Georgia"})
         .setOrigin(0.5)
         .setPadding(10)
         // .setStyle({ backgroundColor: '#111' })
         .setInteractive()
         .on('pointerdown', () => callback())
         .on('pointerover', () => {
            // if(enabled == "enabled"){
               button.setStyle({ fill: '#f39c12' });
               scene.game.canvas.style.cursor = 'pointer';
               scene.squareCursor.setVisible(false);
            // } else if(enabled == "disabled"){
            //    button.setStyle({ fill: '#ff0000'});
            //    scene.game.canvas.style.cursor = 'default';
            // }
         })
         .on('pointerout', () => {
            // if(enabled){
               button.setStyle({ fill: '#FFF' });
               scene.game.canvas.style.cursor = 'none';
               scene.squareCursor.setVisible(true);
            // } else if(enabled == "disabled"){
            //    button.setStyle({ fill: '#ff0000'});
            //    scene.game.canvas.style.cursor = 'default';
            // }
         })
   } else if(type == "image"){
      scene.load.image(label, 'assets/'+label+'.png'); //not working
      const button = scene.add.image(x, y, label)
         .setInteractive({ useHandCursor: true })
         .on('pointerdown', () => callback())
      }
   }
}

class Marble_outline {
   constructor(x, y, scene) {
      let core_size = 25;
      const circle = new Phaser.Geom.Circle(x, y, core_size);
      const graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x967de3 } });

      // remove circle after X seconds
      // setTimeout(function(){graphics.destroy()}, 5000)

      // line outline
      graphics.clear();
      graphics.strokeCircleShape(circle);
   }
}

class Marble { //extends Phaser.Physics.Arcade.Body 
   constructor(x, y, scene) {
      let core_size = 25;
      const circShape = scene.add.circle(x, y, core_size, 0x604cdb);
      const circ= scene.matter.add.gameObject(circShape, {
         shape: 'circle',
         radius: core_size,
         restitution: 1,
         density: 1,
         friction: 0
      })
      return(circ);
   }
}

class Ground {
   constructor(x, y, width, height, scene) {
      const rect = scene.add.rectangle(x, y, width, height, 0xff0000);
      scene.matter.add.gameObject(rect, {
         restitution: 0,
         friction: 1,
         isStatic: true
      });
      return(rect);
   }
}

class Goal {
  constructor(x, y, scene) {
      const cupVerts = [
         { x: 0, y: 0 },
         { x: 22, y: 120 },
         { x: 82, y: 120 },
         { x: 104, y: 0 },
         { x: 99, y: 0 },
         { x: 77, y: 115 },
         { x: 27, y: 115 },
         { x: 5, y: 0 }
      ];

      const cup = scene.add.polygon(x, y, cupVerts, 0xaa6622);
      scene.matter.add.gameObject(cup, {
         shape: {
            type: 'fromVerts',
            verts: cupVerts
         },
         restitution: 0,
         friction: 2,
         density: 0.05,
         isStatic: true
      })
   }
}

function isWithinBound(x, y, dims){
   return(
      x >= dims.x0 - dims.width/2 && 
      x <= dims.x0 + dims.width/2 &&
      y >= dims.y0 && 
      y <= dims.y0 + dims.height
   )
}

function pageLoad() {
    //preload();
    //clicksMap[startPage]();
   const game = new Game({
      "id": "game",
      "width": window.innerWidth,
      "height": window.innerHeight
   });
   game.createGame();
}


function experimentDone() {
   submitExternal(client);
}

// let data = {

// };


