class Game {
  constructor(config = {}) {
      this.phaserConfig = {
         type: Phaser.AUTO,
         parent: config.id ? config.id : "game",
         width: config.width ? config.width : 800,
         height: config.height ? config.height : 600,
            // backgroundColor: config.backgroundColor ? config.backgroundColor : "#FFFFFF",
         physics: {
            default: 'arcade', //default: 'arcade',
            arcade: { //arcade: {
               gravity: {y:300},
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
      //this.matter.world.setBounds();
      let sc_width = this.game.config.width;
      let sc_height = this.game.config.height;
      this.undo_button = new Button("text", sc_width*.45, sc_height*.05, "undo", this, () => { console.log(this.graphics) });
      this.phys_button = new Button("text", sc_width*.55, sc_height*.05, "turn on\nphysics", this, () => console.log('turn on physics'));

      this.marble = new Marble(sc_width*.1, sc_height*.1, this);
      this.ground = new Ground(sc_width/2, sc_height*.9+100, sc_width, 100, this);
      this.goal = new Goal(sc_width*.12, sc_height*.9, this);



      this.physics.add.collider(this.marble, this.ground);
      this.physics.add.collider(this.marble, this.goal);
      this.physics.add.collider(this.goal, this.ground);

      this.graphics = this.add.graphics();
      this.graphics.lineStyle(4, 0x00aa00);

      this.draw_txt = this.add.text(sc_width/2,sc_height/2, "Draw!", {fontFamily:"Georgia", fontSize: 36, color: '#00aa00'})
         .setInteractive()
         .setOrigin(0.5);
   }
   async updateScene() {
      // this.physics.arcade.collide(this.marble, this.ground);
      if(!this.input.activePointer.isDown && this.isDrawing) {
         this.isDrawing = false;
      } else if(this.input.activePointer.isDown){
         if(!this.isDrawing) {
            this.path = new Phaser.Curves.Path(this.input.activePointer.position.x - 2, this.input.activePointer.position.y - 2);
            // this.path.setInteractive();
            this.strokes.push(this.path); //encode to array of all strokes
            // console.log(this.strokes);
            this.isDrawing = true;
         } else {
            this.path.lineTo(this.input.activePointer.position.x - 2, this.input.activePointer.position.y - 2);
         }
         this.path.draw(this.graphics);
         // this.path.setInteractive();
         // this.path.destroy();
         this.draw_txt.destroy();

      }

      // this.undo_button.once('pointerdown', function(){
      //     this.path.destroy()
      // })
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
      let dot_size = 3;
      let core_size = 25;

      const c = scene.add.ellipse(x, y, core_size*2, core_size*2, 0x604cdb);
      scene.physics.add.existing(c);
      c.body.setCollideWorldBounds(true);
      c.body.setBounce(0.5,0.5);
      return(c);
   }
}

class Ground {
   constructor(x, y, width, height, scene) {
      const g = scene.add.rectangle(x, y, width, height, 0xff0000);
      scene.physics.add.existing(g);
      g.body.setImmovable(true);
      g.body.allowGravity = false;
      return(g);
   }
}

class Goal {
  constructor(x, y, scene) {
      const trapezoid = [
         { x: 0, y: 0 },
         { x: 15, y: 100 },
         { x: 75, y: 100 },
         { x: 90, y: 0 },
         { x: 85, y: 0 },
         { x: 70, y: 95 },
         { x: 20, y: 95 },
         { x: 5, y: 0 }
      ];
      const goal = scene.add.polygon(x, y, trapezoid, 0xaa6622);
      scene.physics.add.existing(goal);
      goal.body.setBounce(0.5,0.5);
      goal.body.setImmovable(true);
      goal.body.allowGravity = false;
      //goal.setImmovable(true);
      return(goal);
      //scene.matter.add.gameObject(goal, {shape: {type: 'fromVerts', verts: trapezoid, flagInteral: true}});

      //goal.beginPath();
      //goal.moveTo(polygon.points[0].x, polygon.points[0].y);

      // for (let i = 1; i < polygon.points.length; i++) {
      //    goal.lineTo(polygon.points[i].x, polygon.points[i].y);
      // }

      //goal.closePath();
      //goal.strokePath();
      //goal.fillStyle(0x604cdb);
      //goal.strokePoints(polygon.points, true);

      //scene.physics.add.existing(goal);
      //goal.body.setImmovable(true);
      //goal.body.allowGravity = false;
      //return(goal);
   }
}

function undoDraw(obj) {
   let graphics = game;
   graphics.kill();
}

// export class SimpleScene extends Phaser.Scene {
//   create() {
//     const helloButton = this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
//     helloButton.setInteractive();
//   }
// }


function pageLoad() {
    //preload();
    //clicksMap[startPage]();
   const game = new Game({
      "id": "game",
      "width": window.innerWidth,
      "height": window.innerHeight
   });
   game.createGame();

    // this.undo = game.scene.add.text(this.game.config.width/2, this.game.config.height*.1, "undo");
}


function experimentDone() {
   submitExternal(client);
}

// let data = {

// };


