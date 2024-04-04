
class Game {
  constructor(config = {}) {
      this.phaserConfig = {
         type: Phaser.AUTO,
         parent: config.id,
         width: 800,
         height: 600,
         physics: {
            default: 'matter',
            matter: {
               debug: true
            }
         },
         scene: {
           key: "default",
           preload: this.preload,
           create: this.createScene,
           update: this.updateScene
        }
      };
   }

   preload() {
      this.load.image("jupiter","assets/jupiter.png");
      this.load.image("grass","assets/grass.png");
      //Title: "Wind"
      //Author: ic2icon
      //Source: https://thenounproject.com/icon/wind-2243817/
      //License: CC BY 4.0
      this.load.image("windwhite","assets/windwhite_right.png");
      //alterated icon color
      this.load.image("windblack","assets/windblack_right.png");
   }

   createScene() {
      sc_width = this.game.config.width;
      sc_height = this.game.config.height;
      thisTrial = trialOrder[trial.numrun];
      thisTrial.planet = physSettings.planet[0];
      thisTrial.size = physSettings.size[0];

      this.cameras.main.setBackgroundColor(thisTrial.planet.sky); //update sky background for level
      //update gravity and wind for level
      this.matter.world.localWorld.gravity.x = thisTrial.wind.gravX;
      this.matter.world.localWorld.gravity.y = thisTrial.planet.gravY;

      //this.matter.world.setBounds();
      //this.matter.world.update60Hz();
      this.scdims = {
         x0: sc_width/2,
         y0: 0,
         width: sc_width,
         height: sc_height
      }

      toolheight = 0.1;
      const tooldims = {
         x0: sc_width/2,
         y0: 0,
         width: sc_width,
         height: sc_height*toolheight
      }

      let background = this.add.image(sc_width/2, sc_height, thisTrial.planet.ground).setOrigin(0.5, 1);
      background.depth = -2;
      if(thisTrial.wind.gravX != 0){
         let windcolor = thisTrial.planet.windcolor; // icon color depends on planet background
         let windicon = this.add.image(convXW(0.9), convY(0.2), "wind"+windcolor).setOrigin(0.5, 1).setScale(0.25);
         windicon.flipX = thisTrial.wind.iconflip; // icon direction depends on wind direction
      }
      

      var curr = null;
      var prev = null;
      curves = [];
      this.curve = null;
      let rects = [];
      allRects = [];
      inGoal = false;
      trial.strokes = [];
      trial.physObj = [];
      

      let key = thisTrial.level;
      marbleLoc = { x: convXW(key.marbleLoc.x), y: convY(key.marbleLoc.y) };
      cupLoc = { x: convXW(key.cupLoc.x), y: convY(key.cupLoc.y) }
      let blockArr = key.blockLoc;


        ///////////////////////////////////
       // place marble outline and goal //
      ///////////////////////////////////
      this.outline = new Marble_outline(marbleLoc.x, marbleLoc.y, this);
      blockArr.forEach(b => {
         this.block = new Block(convXW(b.x), convY(b.y), convXW(b.width), convH(b.height), this);
      });

      this.cup = new Cup(cupLoc.x, cupLoc.y, this);

        //////////////////////////////
       // define toolbar + buttons //
      //////////////////////////////
      const toolbar = this.add.rectangle(tooldims.x0, tooldims.y0, tooldims.width, tooldims.height*2, 0x212121);
      toolbar.setInteractive();
      toolbar.on('pointerover', () => {
         this.game.canvas.style.cursor = 'default';
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


      this.trialLabel = trialLabel(trial.numrun, thisTrial.imageID, this);

      marble = null;
      setTimeout(() => {
         //clear marble
         // if(marble != null){
         //    marble.destroy();
         // }

         trial.startTime = Date.now();

         //drop new marble
         if(expt.running){
            marble = new Marble(marbleLoc.x, marbleLoc.y, this);
         }
         
         isStationary = false;
         isOutofBound = false;
         dists = [];
         marbleCoords = [];
      }, 200);

        ////////////////////////////
       // line drawing functions //
      ////////////////////////////
      this.graphics = this.add.graphics();
      


      // set up drawing stroke parameters
      const lineCategory = this.matter.world.nextCategory();
      options = { friction: 0, restitution: 1, isStatic: true, angle: 0, collisionFilter: {category: lineCategory} }


        /////////////////////////////////
       // select solution to simulate //
      /////////////////////////////////
      
      // select solution from solutions.js 
      let solution = thisTrial.drawing;
      recreateStroke(solution.drawnLines, this)

      // add physics objects
      solution.drawnPhysObj.forEach(physstroke => {
         // add initial circle
         let scirc = physstroke[0];
         this.matter.add.circle(scirc.x, scirc.y, size/2, options);

         // add subsequence rectangles
         for(let v = 1; v < physstroke.length; v++){
            let verts = physstroke[v];
            let mid = {x: (verts[0].x + verts[2].x) / 2, y: (verts[0].y + verts[2].y) / 2 };

            // recreate rectangles as polygons from vertices
            this.matter.add.fromVertices(mid.x, mid.y, verts, options);
         }
      })

        ///////////////////////////////
       // cursor replaced by square //
      ///////////////////////////////
      this.squareCursor = this.add.graphics();
      this.squareCursor.fillStyle(draw_color); 
      this.squareCursor.fillRect(-size/2, -size/2, size, size);
      this.squareCursor.depth = 1000;
      this.game.canvas.style.cursor = 'none';
   }


   updateScene(time, delta) {
      this.squareCursor.x = this.input.x;
      this.squareCursor.y = this.input.y;
      
      if(marble != null && !isOutofBound && !isWithinBound(marble.body.position.x, marble.body.position.y, this.scdims)){
         debugLog("marble is out of bound");
         isOutofBound = true;
         endTrial(this);
      }

      // checks if marble exists and is within screen bounds
      if(marble != null && !isOutofBound && !isStationary) {
         marbleCoords.push(marble.body.position); //LO TO DO don't need JSONstringify?
         dists.push(getDistance(marble.body.position, cupLoc));

         // fail safe: checks if marble run time is greater than 10 seconds and not stationary
         if(Date.now() - trial.startTime > expt.maxRunTime){
            debugLog("hit max run time");
            isStationary = true;
            endTrial(this);
         }

         // checks if marble is stationary for more than 1 second
         if(Math.round(marble.body.position.x) === prevMarble.x && Math.round(marble.body.position.y) === prevMarble.y){
            stationaryTime += delta;
            if(stationaryTime >= 1000) {
               debugLog("marble is stationary");
               isStationary = true;

               // check if marble is in goal
               if(Phaser.Physics.Matter.Matter.Vertices.contains(internalCup, marble.body.position)){
                  debugLog("and is in the goal");
                  inGoal = true;
                  endTrial(this, "success");
               } else{
                  debugLog("but is not in the goal");
                  endTrial(this);
               }
            }
         } else {
            stationaryTime = 0;
            prevMarble.x = Math.round(marble.body.position.x);
            prevMarble.y = Math.round(marble.body.position.y);
         }
      } 
   }

   authenticate() { }
   joinOrCreateGame(id) { }
   joinGame(id, authId) { }
   createGame(id, authId) {
      this.game = new Phaser.Game(this.phaserConfig);
      this.game.scene.start("default",{
         "gameId": id
      });
   }
}



function endTrial(scene, outcome="fail"){
   trial.runTime = Date.now() - trial.startTime;
   
   // save canvas to image
   // let captureCompleted = false
   // game.game.events.on('postrender', function () {
   //    if(captureCompleted){
   //       return
   //    }
   //    // Set the flag to prevent further captures
   //    captureCompleted = true;
   //    saveSvgFromCanvas();
   // });
   
   
   if(!isOutofBound){
      marble.setStatic(true); //prevent new drawn lines from moving marble
   }
   marbleEndLoc = marble.body.position;
   if(outcome == "success"){
      endMarbleDist = 0;
      minMarbleDist = 0;
      recordAttemptData();
   } else{
      endMarbleDist = getDistance(marble.body.position, cupLoc);
      minMarbleDist = Math.min(...dists);
      recordAttemptData();
   }

   pushDataToServer();

   trial.numrun++;
      
   if(trial.numrun< expt.runs){
      clearDrawing(scene)
      
      //clear current round
      // scene.scene.restart();
   } else {
      scene.scene.stop();
      endGame();
   }
}


function trialLabel(nrun, imageID, scene){
   let label = "run #"+(nrun+1)+" of "+expt.runs+"\n\n"+imageID;
   return(
      scene.add.text(sc_width*.05,sc_height*.05, label, {fontFamily:"Georgia", color: '#ffffff'})
      .setOrigin(0, 0.5)
   )
}

class Marble_outline {
   constructor(x, y, scene) {
      const circle = new Phaser.Geom.Circle(x, y, thisTrial.size.radius);
      const graphics = scene.add.graphics({ lineStyle: { width: 3, color: 0x967de3 } });

      // line outline
      graphics.clear();
      graphics.strokeCircleShape(circle);
   }
}

class Marble { //extends Phaser.Physics.Arcade.Body 
   constructor(x, y, scene) {
      const circShape = scene.add.circle(x, y, thisTrial.size.radius, 0x604cdb);
      const circ = scene.matter.add.gameObject(circShape, {
         shape: 'circle',
         radius: thisTrial.size.radius,
         restitution: 1,
         mass: thisTrial.size.mass,
         friction: 0,
         label: 'marble'
      })
      circ.setBounce(physSettings.bounciness)
      return(circ);
   }
}

class Block {
   constructor(x, y, width, height, scene) {
      const rect = scene.add.rectangle(x, y, width, height, thisTrial.planet.windcolor); //invert block color to background
      scene.matter.add.gameObject(rect, {
         restitution: 1,
         friction: 1,
         isStatic: true
      });
      return(rect);
   }
}

var internalCup;
class Cup {
  constructor(x, y, scene) {
      const cupVerts = [
         { x: 0, y: 0 },
         { x: 22, y: 120 },
         { x: 82, y: 120 },
         { x: 104, y: 0 },
         { x: 98, y: 0 },
         { x: 76, y: 114 },
         { x: 28, y: 114 },
         { x: 6, y: 0 }
      ];
      internalCup = [
         { x: x+46, y: y },
         { x: x+24, y: y+114 },
         { x: x-24, y: y+114 },
         { x: x-46, y: y }
      ];

      const cup = scene.add.polygon(x, y, cupVerts, 0x000000); //0xaa6622
      scene.matter.add.gameObject(cup, {
         shape: {
            type: 'fromVerts',
            verts: cupVerts
         },
         restitution: 0,
         friction: 2,
         density: 0.05,
         isStatic: true,
         damping: 1
      })

      const graphics = scene.add.graphics();
      graphics.fillStyle(0xd3d3d3);
      graphics.fillPoints(internalCup);
      graphics.closePath();
      graphics.fillPath();
      graphics.setPosition(0,-79);
   }
}

// class Button {
//    constructor(x, y, label, scene, callback) {
//       this.button = scene.add.text(x, y, label, {fontFamily:"Georgia"})
//          .setOrigin(0.5)
//          .setPadding(10)
//          .on('pointerdown', () => {
//             callback();
//          })
//       this.scene = scene;
//    }

//    enable(defaultcolor='#fff'){
//       this.button.setInteractive()
//          .setStyle({ fill: defaultcolor})
//          .on('pointerover', () => {
//             this.button.setStyle({ fill: '#f39c12' });
//             this.scene.game.canvas.style.cursor = 'pointer';
//             this.scene.squareCursor.setVisible(false);
//          })
//          .on('pointerout', () => {
//             this.button.setStyle({ fill: defaultcolor });
//             this.scene.game.canvas.style.cursor = 'none';
//             this.scene.squareCursor.setVisible(true);
//          });
//    }

//    disable(defaultcolor='#ff0000'){
//       this.button.disableInteractive()
//          .setStyle({ fill: defaultcolor})
//          .on('pointerover', () => {
//             this.scene.game.canvas.style.cursor = 'default';
//             this.scene.squareCursor.setVisible(false);
//          })
//          .on('pointerout', () => {
//             this.scene.game.canvas.style.cursor = 'none';
//             this.scene.squareCursor.setVisible(true);
//          });
//    }
// }


// clear drawn line
function clearDrawing(scene){   
   //record that strokes are being cleared
   for(let i=0; i<curves.length; i++){
      let thisCurve = curves[i] != null ? getPoints(curves[i]) : "error";
      let thisRect = allRects[i] != null ? getVerts(allRects[i]) : "error";
   }
   trial.strokes = [];
   trial.physObj = [];

   //clear graphics
   scene.graphics.clear();
   curves = [];
   //clear all physics objects
   if(allRects.length > 0){
      allRects.forEach(rs => {
         scene.matter.world.remove(rs.start);
         rs.rect.forEach(r => {
            scene.matter.world.remove(r); //remove array of rect arrays
         });
      });
   }
   allRects = [];
}

// get points from curve spline graphic
function getPoints(curve){
   let arr = curve.points.map(point => ({ x: Math.round(point.x), y: Math.round(point.y) }));
   return(arr.slice());
}
// get vertices from array of rects
function getVerts(physObj){
   let arr = [];
   let startObj = physObj.start.position;
   startObj.r = physObj.start.circleRadius;
   arr.push(startObj);
   physObj.rect.forEach(r => {
      arr.push(r.vertices.map(vertex => ({ x: Math.round(vertex.x), y: Math.round(vertex.y) })));
   })
   return(arr.slice());
}

function recreateStroke(strokes, scene){
   // draw strokes
   strokes.forEach(stroke => {
      // let stringToJSON = JSON.parse(coords); //if coords is stringified
      let copy = new Phaser.Curves.Spline(stroke);
      scene.graphics.lineStyle(size, draw_color);
      // scene.graphics.lineStyle(2, 0xaa6622); //test
      copy.draw(scene.graphics, 64)
   })
}


function shiftRects(rects, scene, xadd, yadd){
   let newcirc = {x:rects[0].x+xadd, y:rects[0].y+yadd, r:rects[0].r}
   circ = scene.matter.add.circle(newcirc.x, newcirc.y, newcirc.r, options);

   let newrects = [];
   rects.slice(1).forEach(r => {
      let newmidx = (r[0] - r[1])/2;
      // let newrect = [];
      // rect.forEach(vert => {
      //    // newrect.push({x:vert.x+xadd, y:vert.y+yadd});
      // })
      // newrects.push(newrect)
   });
   // scene.matter.add.rectangle(midx, midy, widthx, heighty, options);
}



function saveSvgFromCanvas() {
   const dataUrl = game.game.canvas.toDataURL('image/png');
   writeImgServer(dataUrl);
  
   // test locally
   // const link = document.createElement('a');
   // link.href = dataUrl;
   // link.download = 'download.png';
   // link.click();
}


