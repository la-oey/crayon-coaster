
function recordData(){
   let success = getOutcome();

   trialdata.push({
      simtype: trial.type,
      numRun: trial.numrun,
      marbleX: trial.marbleX,
      marbleY: trial.marbleY,
      cupLoc: expt.level.cupLoc,
      blockLoc: expt.level.blockLoc,
      gravX: trial.wind,
      gravY: trial.gravity,
      mass: trial.mass,
      radius: trial.radius,
      bounce: trial.bounce,
      marbleEndLoc: marbleEndLoc,
      marbleCoords: marbleCoords,
      marbleEndDist: endMarbleDist,
      marbleMinDist: minMarbleDist,
      runOutcome: success,
      trialStartTime: trial.startTime,
      runTime: trial.runTime
   });
}


function pushDataToServer(){
   data = {
      expt: expt,
      version: 'crayon_coaster_simulation',
      starttime: expt.starttime,
      data: trialdata
   };
   debugLog(data);
   writeServer(data);
}


function getOutcome(){
   if(inGoal){
      return("goal");
   } else if(isOutofBound){
      return("outofbound");
   } else if(isStationary){
      return("stationary");
   }
}


// helper functions
function convXW(perc){
   return(sc_width * perc);
}
function convY(perc){
   return(sc_height*(1-toolheight) * perc + sc_height*toolheight);
}
function convH(perc){
   return(sc_height*(1-toolheight) * perc);
}

function sample(set) {
   return (set[Math.floor(Math.random() * set.length)]);
}

function rnorm(mean, sd) { //from stack overflow
   const u = 1 - Math.random(); // convert [0,1) to (0,1]
   const v = Math.random();
   const z = Math.sqrt(-2.0 * Math.log(u) ) * Math.cos(2.0 * Math.PI * v);
   // Transform to the desired mean and standard deviation:
   return z * sd + mean;
}

function isWithinBound(x, y, dims){
   return(
      x >= dims.x0 - dims.width/2 && 
      x <= dims.x0 + dims.width/2 &&
      y >= dims.y0 && 
      y <= dims.y0 + dims.height
   )
}

function getDistance(positionA, positionB){
   let distx = positionB.x - positionA.x;
   let disty = positionB.y - positionA.y;
   return(Math.sqrt(distx**2 + disty**2));
}

function debugLog(message){
   if(expt.debug){
      console.log(message);
   }
}

function shuffle(set){
    var j, x, i;
    for (i = set.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = set[i];
        set[i] = set[j];
        set[j] = x;
    }
    return set;
}

