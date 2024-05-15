
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

   preload() {
      this.load.image("jupiter","assets/jupiter.png");
      //Title: "Wind"
      //Author: ic2icon
      //Source: https://thenounproject.com/icon/wind-2243817/
      //License: CC BY 4.0
      this.load.image("windwhite","assets/windwhite_right.png");
   }

   createScene() {
      sc_width = this.game.config.width;
      sc_height = this.game.config.height;
      expt.level.planet = physSettings.planet[0];
      expt.level.size = physSettings.size[0];
      expt.level.restitution = 1;

      ogBounce = expt.level.restitution
      ogMass = expt.level.size.mass;
      ogGravX = expt.wind.gravX;
      ogGravY = expt.level.planet.gravY;

      this.cameras.main.setBackgroundColor(expt.level.planet.sky); //update sky background for level
      //update gravity and wind for level
      this.matter.world.localWorld.gravity.x = expt.wind.gravX;
      this.matter.world.localWorld.gravity.y = expt.level.planet.gravY;

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

      let background = this.add.image(sc_width/2, sc_height, expt.level.planet.ground).setOrigin(0.5, 1);
      background.depth = -2;
      if(expt.wind.gravX != 0){
         let windcolor = expt.level.planet.windcolor; // icon color depends on planet background
         let windicon = this.add.image(convXW(0.9), convY(0.2), "wind"+windcolor).setOrigin(0.5, 1).setScale(0.25);
         windicon.flipX = expt.wind.iconflip; // icon direction depends on wind direction
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
      

      let key = expt.level;
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

        ////////////////////
       // define toolbar //
      ////////////////////
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


        ////////////////////////////
       // line drawing functions //
      ////////////////////////////
      this.graphics = this.add.graphics();

      // set up drawing stroke parameters
      const lineCategory = this.matter.world.nextCategory();
      options = { friction: 0, restitution: expt.level.restitution, isStatic: true, angle: 0, collisionFilter: {category: lineCategory} }


        /////////////////////////////////
       // select solution to simulate //
      /////////////////////////////////
      
      // select solution from solutions.js
      marble = null;

      this.solutionalLabel = solutionLabel(thisTrial.imageID, this);
      this.trialLabel = trialLabel(trial.numrun, trial.type, this);

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
      run(this);


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



function run(scene){
   setTimeout(() => {
      //clear marble
      if(marble != null){
         marble.destroy();
      }

      trial.startTime = Date.now();

      //drop new marble
      if(expt.running){
         // reset to default
         trial.marbleX = marbleLoc.x;
         trial.marbleY = marbleLoc.y;
         trial.bounce = ogBounce;
         options.restitution = ogBounce;
         trial.mass = ogMass;
         expt.level.size.mass = ogMass;
         trial.wind = ogGravX;
         scene.matter.world.localWorld.gravity.x = ogGravX;
         trial.gravity = ogGravY;
         scene.matter.world.localWorld.gravity.y = ogGravY;

         // manipulate physics parameters
         if(trial.type ==  "tweak position"){
            //tweak x marble position
            trial.marbleX = rnorm(marbleLoc.x, sd_position);
            //tweak y marble position
            trial.marbleY = rnorm(marbleLoc.y, sd_position);
         } else if(trial.type == "tweak object"){
            //tweak bounce
            trial.bounce = Math.random();
            options.restitution = trial.bounce; //note randomize between 0 and 1, not using random norm
            //tweak mass
            trial.mass =  Math.max(0.1, rnorm(ogMass, sd_mass));
            expt.level.size.mass =trial.mass;
         } else if(trial.type == "tweak environment"){
            //tweak wind
            trial.wind = rnorm(ogGravX, sd_gravX);
            expt.wind.gravX = trial.wind;
            scene.matter.world.localWorld.gravity.x = trial.wind;
            //tweak gravity
            trial.gravity = rnorm(ogGravY, sd_gravY);
            expt.level.planet.gravY = trial.gravity;
            scene.matter.world.localWorld.gravity.y = trial.gravity;
         }
         marble = new Marble(trial.marbleX, trial.marbleY, scene);
      }
      
      isStationary = false;
      isOutofBound = false;
      dists = [];
      marbleCoords = [];
   }, 200);
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
   
   
   marbleEndLoc = marble.body.position;
   if(outcome == "success"){
      endMarbleDist = 0;
      minMarbleDist = 0;
      recordData();
   } else{
      endMarbleDist = getDistance(marble.body.position, cupLoc);
      minMarbleDist = Math.min(...dists);
      recordData();
   }
   pushDataToServer(); //save every trial
   trial.numrun++;
   
   if(trial.type == "ground truth"){
      if(trial.numrun == expt.groundtruthruns){ //max ground truth runs, move to next simulation
         simTypeNum++;
         trial.type = expt.typeSims[simTypeNum];
         trial.numrun = 0;
      } 
      scene.trialLabel.destroy();
      scene.trialLabel = trialLabel(trial.numrun, trial.type, scene);
      run(scene);
   } else{
      if(trial.numrun == expt.runs && simTypeNum == (expt.typeSims.length - 1)){
         // pushDataToServer(); // save data at end of game
         scene.scene.stop();
         endGame();
      } else{
         if(trial.numrun == expt.runs){ // switch between typeSims
            // pushDataToServer(); // save data between simulation type switches
            simTypeNum++;
            trial.type = expt.typeSims[simTypeNum];
            trial.numrun = 0;
         }
         scene.trialLabel.destroy();
         scene.trialLabel = trialLabel(trial.numrun, trial.type, scene);
         run(scene);
      }
   }
}


function trialLabel(nrun, type, scene){
   let maxruns;
   if(trial.type == "ground truth"){
      maxruns = expt.groundtruthruns;
   } else{
      maxruns = expt.runs;
   }
   let label = "run #"+(nrun+1)+" of "+maxruns+"\n\n"+type;
   return(
      scene.add.text(sc_width*.05,sc_height*.05, label, {fontFamily:"Georgia", color: '#ffffff'})
      .setOrigin(0, 0.5)
   )
}

function solutionLabel(imageID, scene){
   return(
      scene.add.text(sc_width*.5,sc_height*.05, imageID, {fontFamily:"Georgia", color: '#ffffff'})
      .setOrigin(0.5)
   )
}

class Marble_outline {
   constructor(x, y, scene) {
      const circle = new Phaser.Geom.Circle(x, y, expt.level.size.radius);
      const graphics = scene.add.graphics({ lineStyle: { width: 3, color: 0x967de3 } });

      // line outline
      graphics.clear();
      graphics.strokeCircleShape(circle);
   }
}

class Marble { //extends Phaser.Physics.Arcade.Body 
   constructor(x, y, scene) {
      const circShape = scene.add.circle(x, y, expt.level.size.radius, 0x604cdb);
      const circ = scene.matter.add.gameObject(circShape, {
         shape: 'circle',
         radius: expt.level.size.radius,
         restitution: 1,
         mass: expt.level.size.mass,
         friction: 0,
         label: 'marble'
      })
      circ.setBounce(physSettings.bounciness)
      return(circ);
   }
}

class Block {
   constructor(x, y, width, height, scene) {
      const rect = scene.add.rectangle(x, y, width, height, expt.level.planet.windcolor); //invert block color to background
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


function saveSvgFromCanvas() {
   const dataUrl = game.game.canvas.toDataURL('image/png');
   writeImgServer(dataUrl);
  
   // test locally
   // const link = document.createElement('a');
   // link.href = dataUrl;
   // link.download = 'download.png';
   // link.click();
}

