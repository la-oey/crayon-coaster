
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
               debug: false
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

   async preload() {
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

   async createScene() {
      trial.trialStartTime = Date.now();
      sc_width = this.game.config.width;
      sc_height = this.game.config.height;
      thisTrial = trialOrder[trial.numtrial];
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

      if(trial.exptPart == "test"){
         this.draw_txt = this.add.text(convXW(0.5),convY(0.5), "Draw!", {fontFamily:"Georgia", fontSize: 36, color: '#00aa00'})
            .setInteractive()
            .setOrigin(0.5);
      }

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


      this.trialLabel = levelLabel(trial.numtrial+1, trial.numattempt+1, this);
      
      this.clear_button = new Button(sc_width*.4, sc_height*.05, "clear", this, false, () => { 
         if(marble == null || isStationary || isOutofBound){
            if(s == 1 && t == 7){
               currentTutButton.button.destroy();
               t++;
               createNewButton(s, t, this);
            }
            if(currentErrButton != null){
               currentErrButton.button.destroy();
            }

            //clear marble
            if(marble != null){
               marble.destroy();
               marble = null;
            }

            clearDrawing(this);
         }
      });
      this.undo_button = new Button(sc_width*.5, sc_height*.05, "undo", this, false, () => {
         if(marble == null || isStationary || isOutofBound){
            if(s == 1 && t == 7){
               currentTutButton.button.destroy();
               t++;
               createNewButton(s, t, this);
            }
            if(currentErrButton != null){
               currentErrButton.button.destroy();
            }

            //clear marble
            if(marble != null){
               marble.destroy();
               marble = null;
            }

            let lastCurvePts, lastPhysObj;
            //clear last drawn stroke
            if(curves.length > 0){
               let lastCurve = curves.pop();
               lastCurvePts = trial.strokes.pop();
               lastPhysObj = trial.physObj.pop();
               this.graphics.clear();
               this.graphics.lineStyle(size, draw_color);
            
               curves.forEach(c => {
                  if(c.points.length == 1){
                     this.graphics.fillStyle(draw_color, 1);
                     this.graphics.fillRect(c.points[0].x-size/2, c.points[0].y-size/2, size, size);
                  } else{
                     c.draw(this.graphics, 64);
                  }
               });
            }
            if(allRects.length > 0){
               let lastRect = allRects.pop();
               this.matter.world.remove(lastRect.start);
               lastRect.rect.forEach(r => {
                  this.matter.world.remove(r);
               });
            }

            stroke = {
               graphic: lastCurvePts,
               physObj: lastPhysObj,
               action: "undo",
               startTime: Date.now(),
               endTime: -1,
               duration: -1
            }
            recordAllStrokes();
         }
      });
      marble = null;
      this.drop_button = new Button(sc_width*.6, sc_height*.05, "drop\nball", this, false, () => { 
         //clear marble
         if(marble != null){
            marble.destroy();
         }
         if(this.draw_txt != null){
            this.draw_txt.destroy();
         }

         if(s == 0 && t == 2 || s == 1 && t == 1){
            currentTutButton.button.destroy();
            t++;
            createNewButton(s, t, this);
         }
         if(currentErrButton != null){
            currentErrButton.button.destroy();
         }

         //shift rectangles

         //drop new marble
         marble = new Marble(marbleLoc.x, marbleLoc.y, this);
         
         isStationary = false;
         isOutofBound = false;
         dists = [];
         marbleCoords = [];
         trial.drawEndTime = Date.now();
         trial.drawTime = trial.drawEndTime - trial.trialStartTime;
      });

      this.next_button = new Button(sc_width*.9, sc_height*.05, "next \u2192", this, false, () => { 
         if( (s == 0 && t == (tutorinfo[0].length-1)) || (s == 1 && t == (tutorinfo[1].length-1)) ){
            currentTutButton.button.destroy();
            s++;
            t = 0;
         }

         // save data between each round and overwrite
         pushDataToServer();
         
         trial.numtrial++;
         if(trial.numtrial < expt.totaltrials){
            //set next round
            trial.numattempt = 0;
            
            //clear current round
            this.scene.restart();
         } else {
            this.scene.stop();
            if(trial.exptPart == "tutorial"){
               endTutorial();
            } else{
               endGame();
            }
         }
      });

      this.clear_button.enable();
      this.undo_button.enable();
      this.drop_button.enable();
      this.next_button.disable();


        ////////////////////////////
       // line drawing functions //
      ////////////////////////////
      this.graphics = this.add.graphics();

      // set up drawing stroke parameters
      const lineCategory = this.matter.world.nextCategory();
      const distance = size; //size
      // const options = { friction: 0, restitution: 1, inertia: Infinity, ignoreGravity: true, isStatic: true, angle: 0, collisionFilter: { category: lineCategory } };  
      options = { friction: 0, restitution: 1, isStatic: true, angle: 0, collisionFilter: {category: lineCategory} }
      const lastPosition = new Phaser.Math.Vector2();
      
      this.input.on('pointerdown', function(pointer){
         if(!isWithinBound(pointer.x, pointer.y, tooldims) && drawingEnabled){ // button clicks don't result in drawing
            if(marble == null || isStationary || isOutofBound || trial.numattempt >= trial.maxattempt){
               if(currentErrButton != null){
                  currentErrButton.button.destroy();
               }
               strokeStartTime = Date.now();
               if(this.draw_txt != null){
                  this.draw_txt.destroy();
               }
               
               rects = [];
               lastPosition.x = pointer.x;
               lastPosition.y = pointer.y;

               this.circ = this.matter.add.circle(pointer.x, pointer.y, size/2, options);
               prev = this.circ;

               this.curve = new Phaser.Curves.Spline([ pointer.x, pointer.y ]);
               curves.push(this.curve);
            }
         } else{
            debugLog("can't draw in toolbar");
         }
      }, this);

      this.input.on('pointermove', function(pointer){
         if(pointer.isDown && !isWithinBound(pointer.x, pointer.y, tooldims) && drawingEnabled){
            if(s == 2 && t == 0){
               currentTutButton.button.destroy();
            }
            if(marble == null || isStationary || isOutofBound || trial.numattempt >= trial.maxattempt){
               const x = pointer.x;
               const y = pointer.y;

               if(Phaser.Math.Distance.Between(x, y, lastPosition.x, lastPosition.y) > distance){
                  options.angle = Phaser.Math.Angle.Between(x, y, lastPosition.x, lastPosition.y);

                  // physics objects are angled rectangles
                  let midx = (pointer.x+lastPosition.x)/2;
                  let midy = (pointer.y+lastPosition.y)/2;
                  let widthx = Math.max(20,Math.abs(x-lastPosition.x)); // in case of undefined polygons
                  let heighty = 20;
                  curr = this.matter.add.rectangle(midx, midy, widthx, heighty, options);
     
                  rects.push(curr);

                  lastPosition.x = x;
                  lastPosition.y = y;

                  this.matter.add.constraint(prev, curr, distance, {stiffness: stiffness});

                  prev = curr;
                  this.curve.addPoint(x, y);

                  this.graphics.clear();
                  this.graphics.lineStyle(size, draw_color);
                  curves.forEach(c => {
                     if(c.points.length == 1){
                        this.graphics.fillStyle(draw_color, 1);
                        this.graphics.fillRect(c.points[0].x-size/2, c.points[0].y-size/2, size, size);
                     } else{
                        c.draw(this.graphics, 64);
                     }
                  });
               }
            }
         }
      }, this);

      this.input.on('pointerup', function(pointer){
         if(!isWithinBound(pointer.x, pointer.y, tooldims) && drawingEnabled){
            if(marble == null || isStationary || isOutofBound || trial.numattempt >= trial.maxattempt){
               // catch drawing errors in tutorial
               if(s == 1 && t == 3){
                  currentTutButton.button.destroy();
                  let gp0 = {x: convXW(g.p0.x), y: convY(g.p0.y)};
                  let gp1 = {x: convXW(g.p1.x), y: convY(g.p1.y)};
                  // debugLog("p0 distance: " + getDistance(this.curve.points[0], gp0));
                  // debugLog("p1 distance: " + getDistance(this.curve.points[this.curve.points.length-1], gp1));
                  let maxDistErr = 20;
                  // let maxDistErr = 100; //test fails
                  if(getDistance(this.curve.points[0], gp0) > maxDistErr || getDistance(this.curve.points[this.curve.points.length-1], gp1) > maxDistErr){
                     // failed distance test for drawing example line
                     let params = drawErr;
                     currentErrButton = new Button(convXW(params.x), convY(params.y), params.text, this, params.clickable, () => {
                        clearDrawing(this, "drawerror");

                        setTimeout(() => {
                           drawingEnabled = true;
                        }, 200);
                     });
                     currentErrButton.enable("black");
                     drawingEnabled = false;
                  } else {
                     // passed distance test for drawing example line
                     debugLog("line passes test");
                     if(t==3){
                        t++;
                        createNewButton(s, t, this);
                     }
                  }
               }

               strokeEndTime = Date.now();
               // let svgString = this.graphics.pathData();
               let curvePhys = {start: this.circ, rect: rects};
               allRects.push(curvePhys);
               
               //if only one point drawn, make rectangle
               if(this.curve.points.length == 1){
                  this.graphics.fillStyle(draw_color, 1);
                  this.graphics.fillRect(pointer.x-size/2, pointer.y-size/2, size, size);
               }
               
               let curveCoords = getPoints(this.curve);
               trial.strokes.push(curveCoords);
               let curvePhysObjs = getVerts(curvePhys);
               trial.physObj.push(curvePhysObjs);

               stroke = {
                  graphic: curveCoords,
                  physObj: curvePhysObjs,
                  action: "add",
                  startTime: strokeStartTime,
                  endTime: strokeEndTime,
                  duration: strokeEndTime - strokeStartTime
               }
               recordAllStrokes();
            }
         }
      }, this);

        ///////////////////////////
       // tutorial instructions //
      ///////////////////////////
      if(trial.exptPart == "tutorial"){
         if(s == 2){
            drawingEnabled = true;

            // exception for last tutorial button
            let params = tutorinfo[s][t];
            currentTutButton = new Button(convXW(params.x), convY(params.y), params.text, this, params.clickable, () => {});
            currentTutButton.disable("white");
         } else{
            drawingEnabled = false;
            this.clear_button.disable();
            this.undo_button.disable();
            this.drop_button.disable();

            currentTutButton = createNewButton(s, t, this); //recursively calls next button
         }

         if(guideline != null){
            guideline.destroy();
         }
      }


        ///////////////////////////////
       // cursor replaced by square //
      ///////////////////////////////
      this.squareCursor = this.add.graphics();
      this.squareCursor.fillStyle(draw_color);  // Red color for illustration
      this.squareCursor.fillRect(-size/2, -size/2, size, size);
      this.squareCursor.depth = 1000;
      this.game.canvas.style.cursor = 'none';
   }


   async updateScene(time, delta) {
      this.squareCursor.x = this.input.x;
      this.squareCursor.y = this.input.y;
      
      if(marble != null && !isOutofBound && !isWithinBound(marble.body.position.x, marble.body.position.y, this.scdims)){
         debugLog("marble is out of bound");
         isOutofBound = true;
         endTrial(this);
      }

      // checks if marble exists and is within screen bounds
      if(marble != null && !isOutofBound && !isStationary) {
         this.clear_button.disable();
         this.undo_button.disable();
         this.drop_button.disable();
         this.next_button.disable();
         marbleCoords.push(marble.body.position); //LO TO DO don't need JSONstringify?
         dists.push(getDistance(marble.body.position, cupLoc));

         // fail safe: checks if marble run time is greater than 10 seconds and not stationary
         if(Date.now() - trial.drawEndTime > expt.maxRunTime){
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

      if(trial.numattempt >= trial.maxattempt || inGoal){
         this.clear_button.disable();
         this.undo_button.disable();
         this.drop_button.disable();
         this.next_button.enable();
      }
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
   constructor(x, y, label, scene, destroy, callback) {
      this.button = scene.add.text(x, y, label, {fontFamily:"Georgia"})
         .setOrigin(0.5)
         .setPadding(10)
         .on('pointerdown', () => {
            callback();
            if(destroy){
               this.button.destroy();
               this.scene.game.canvas.style.cursor = 'none';
               this.scene.squareCursor.setVisible(true);
            }
         })
      this.scene = scene;
   }

   enable(defaultcolor='#fff'){
      this.button.setInteractive()
         .setStyle({ fill: defaultcolor})
         .on('pointerover', () => {
            this.button.setStyle({ fill: '#f39c12' });
            this.scene.game.canvas.style.cursor = 'pointer';
            this.scene.squareCursor.setVisible(false);
         })
         .on('pointerout', () => {
            this.button.setStyle({ fill: defaultcolor });
            this.scene.game.canvas.style.cursor = 'none';
            this.scene.squareCursor.setVisible(true);
         });
   }

   disable(defaultcolor='#ff0000'){
      this.button.disableInteractive()
         .setStyle({ fill: defaultcolor})
         .on('pointerover', () => {
            this.scene.game.canvas.style.cursor = 'default';
            this.scene.squareCursor.setVisible(false);
         })
         .on('pointerout', () => {
            this.scene.game.canvas.style.cursor = 'none';
            this.scene.squareCursor.setVisible(true);
         });
   }
}

function levelLabel(ntrial, nattempt, scene){
   let label = "level #"+ntrial+" of "+expt.totaltrials+"\n\nattempt "+nattempt+" of "+trial.maxattempt;
   return(
      scene.add.text(sc_width*.1,sc_height*.05, label, {fontFamily:"Georgia", color: '#ffffff'})
      .setOrigin(0.5)
   )
}

class Marble_outline {
   constructor(x, y, scene) {
      const circle = new Phaser.Geom.Circle(x, y, thisTrial.size.radius);
      const graphics = scene.add.graphics({ lineStyle: { width: 3, color: 0x967de3 } });

      // remove circle after X seconds
      // setTimeout(function(){graphics.destroy()}, 5000)

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

class FadedLine {
   constructor(xstart, ystart, xend, yend, scene) {
      const line = scene.add.graphics();
      line.lineStyle(size, 0x97dd97, 1);
      line.beginPath();
      line.moveTo(xstart, ystart);
      line.lineTo(xend, yend);
      // line.closePath();
      line.strokePath();
      return(line);
   }
}

// clear drawn line
function clearDrawing(scene, recordedaction="clear"){   
   //record that strokes are being cleared
   for(let i=0; i<curves.length; i++){
      stroke = {
         graphic: getPoints(curves[i]),
         physObj: getVerts(allRects[i]),
         action: recordedaction, //"clear"
         startTime: Date.now(),
         endTime: -1,
         duration: -1
      }
      recordAllStrokes();
   }
   trial.strokes = [];
   trial.physObj = [];

   //clear graphics
   scene.graphics.clear();
   curves = [];
   //clear all physics objects
   allRects.forEach(rs => {
      scene.matter.world.remove(rs.start);
      rs.rect.forEach(r => {
         scene.matter.world.remove(r); //remove array of rect arrays
      });
   });
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

function recreateStroke(coords, scene){
   // let stringToJSON = JSON.parse(coords); //if coords is stringified
   let copy = new Phaser.Curves.Spline(coords);
   // scene.graphics.lineStyle(size, draw_color);
   scene.graphics.lineStyle(2, 0xaa6622); //test
   copy.draw(scene.graphics, 64)
}
// draw multiple strokes:
// curves.forEach(c => {
//    recreateStroke(c.coords, this);
// });

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


function createNewButton(round, counter, scene){
   s = round;
   t = counter;
   if(round < tutorinfo.length && counter < tutorinfo[round].length){
      let params = tutorinfo[round][counter];
      let child = new Button(convXW(params.x), convY(params.y), params.text, scene, params.clickable, () => {
         if(params.clickable){
            currentTutButton = null;
            createNewButton(round, counter+1, scene);
         }
      });
      if(params.clickable){
         child.enable("black");
      } else{
         child.disable("black");
      }
      
      currentTutButton = child;
      
      // turns on/off drawing
      if(s == 1 && (t == 3 || t == 8)){ 
         setTimeout(() => {
            drawingEnabled = true;
         }, 500);
         if(t == 3){
            g = guidelineinfo[0];
            guideline = new FadedLine(convXW(g.p0.x), convY(g.p0.y), convXW(g.p1.x), convY(g.p1.y), scene);
         } else if(t == 8){
            g = guidelineinfo[1];
            guideline = new FadedLine(convXW(g.p0.x), convY(g.p0.y), convXW(g.p1.x), convY(g.p1.y), scene);
         }
         guideline.depth = -1;
      } else if(s == 1 && t == 5){ 
         drawingEnabled = false;
         if(guideline != null){
            guideline.destroy();
         }
      }

      // turns on/off buttons
      // drop button
      if(s == 0 && t == 2 || s == 1 && [1, 4, 8].includes(t)){
         scene.drop_button.enable();
      } else if(s == 1 && [2, 3, 5, 6, 7].includes(t)){
         scene.drop_button.disable();
      }
      // clear/undo button
      if(s == 1 && t == 7){
         scene.clear_button.enable();
         scene.undo_button.enable();
      } else if(s == 1 && [3,6].includes(t)){
         scene.clear_button.disable();
         scene.undo_button.disable();
      }
   }
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


