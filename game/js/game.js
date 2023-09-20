class Game {
  constructor(config = {}) {
      this.phaserConfig = {
         type: Phaser.AUTO,
         parent: config.id ? config.id : "game",
         width: config.width ? config.width : 800,
         height: config.height ? config.height - 4 : 600,
            // backgroundColor: config.backgroundColor ? config.backgroundColor : "#FFFFFF",
         physics: {
            default: 'matter', //default: 'arcade',
            matter: { //arcade: {
               gravity: {x:0, y:0},
               debug: true
            }
         },
         scene: {
           key: "default",
           init: this.initScene,
           create: this.createScene,
           update: this.updateScene
        }
      };
   }

   async preload() {
      this.load.image("undo","assets/undo.png");
   }

   async initScene(data) {
      this.strokes = [];
      this.isDrawing = false;
   }
   async createScene() {
      let sc_width = this.game.config.width;
      let sc_height = this.game.config.height;
      this.matter.world.setBounds();
      this.undo_button = new Button("text", sc_width*.45, sc_height*.05, "undo", this, () => { console.log(this.graphics) });
      this.phys_button = new Button("text", sc_width*.55, sc_height*.05, "turn on\nphysics", this, () => {
         this.matter.world.setGravity(0,1);
      });

      this.marble = new Marble(sc_width*.1, sc_height*.1, this);
      this.ground = new Ground(sc_width/2, sc_height*.9+100, sc_width, 100, this);
      this.goal = new Goal(sc_width*.12, sc_height*.95, this);

      this.draw_txt = this.add.text(sc_width/2,sc_height/2, "Draw!", {fontFamily:"Georgia", fontSize: 36, color: '#00aa00'})
         .setInteractive()
         .setOrigin(0.5);

      this.graphics = this.add.graphics();


      this.curr = null;
      this.prev = null;
      this.curves = [];
      this.curve = null;
   }


   async updateScene() {
      const lineCategory = this.matter.world.nextCategory();
      const sides = 0;
      const size = 4;
      const distance = size;
      const stiffness = 0.1;
      const options = { friction: 0, restitution: 1, isStatic: true, angle: 0, collisionFilter: { category: lineCategory } };
      const lastPosition = new Phaser.Math.Vector2();

      
      
      this.input.on('pointerdown', function(pointer){
         lastPosition.x = pointer.x;
         lastPosition.y = pointer.y;

         this.prev = this.matter.add.polygon(pointer.x, pointer.y, sides, size, options);
         this.curve = new Phaser.Curves.Spline([ pointer.x, pointer.y ]);
         this.curves.push(this.curve);

         this.draw_txt.destroy();
      }, this);

      this.input.on('pointermove', function(pointer){
         if(pointer.isDown){
            const x = pointer.x;
            const y = pointer.y;

            if(Phaser.Math.Distance.Between(x, y, lastPosition.x, lastPosition.y) > distance){
               options.angle = Phaser.Math.Angle.Between(x, y, lastPosition.x, lastPosition.y);

               lastPosition.x = x;
               lastPosition.y = y;

               this.curr = this.matter.add.polygon(pointer.x, pointer.y, sides, size, options);
               this.matter.add.constraint(this.prev, this.curr, distance, stiffness);

               this.prev = this.curr;
               this.curve.addPoint(x, y);

               this.graphics.clear();
               this.graphics.lineStyle(size, 0x00aa00);

               this.curves.forEach(c => {
                  c.draw(this.graphics, 64);
               });
            }
         }
      }, this);
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
   constructor(type, x, y, label, scene, callback) {
      if(type == "text"){
      const button = scene.add.text(x, y, label, {fontFamily:"Georgia"})
         .setOrigin(0.5)
         .setPadding(10)
         // .setStyle({ backgroundColor: '#111' })
         .setInteractive({ useHandCursor: true })
         .on('pointerdown', () => callback())
         .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
         .on('pointerout', () => button.setStyle({ fill: '#FFF' }));
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
      let dot_size = 3;
      let core_size = 25;
      const circle = new Phaser.Geom.Circle(x, y, core_size);
      const graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x967de3 } });

      // remove circle after X seconds
      // setTimeout(function(){graphics.destroy()}, 5000)

      // line outline
      // graphics.clear();
      // graphics.strokeCircleShape(circle);

      // dashed line outline
      const points = circle.getPoints(8);
      for (let i = 0; i < points.length; i++) {
         const p = points[i];
         graphics.fillRect(p.x - dot_size, p.y - dot_size, dot_size*2, dot_size*2);
      }
   }
}

class Marble { //extends Phaser.Physics.Arcade.Body 
   constructor(x, y, scene) {
      let core_size = 25;

      const circ = scene.add.circle(x, y, core_size, 0x604cdb);
      scene.matter.add.gameObject(circ, {
         shape: 'circle',
         radius: core_size,
         restitution: 1,
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
         friction: 1,
         density: 0.05
      })
   }
}

function undoDraw(obj) {
   let graphics = game;
   graphics.kill();
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


