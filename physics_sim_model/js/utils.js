
function recordAttemptData(){
   trialdata.push({
      numRun: trial.numrun,
      levelIndex: thisTrial.level.nindex,
      levelID: thisTrial.level.id,
      marbleStartLoc: thisTrial.level.marbleLoc,
      cupLoc: thisTrial.level.cupLoc,
      blockLoc: thisTrial.level.blockLoc,
      gravX: thisTrial.wind.gravX,
      gravY: thisTrial.planet.gravY,
      mass: thisTrial.size.mass,
      radius: thisTrial.size.radius,
      marbleEndLoc: marbleEndLoc,
      marbleCoords: marbleCoords,
      marbleEndDist: endMarbleDist,
      marbleMinDist: minMarbleDist,
      runOutcome: getOutcome(),
      drawnLines: trial.strokes,
      drawnPhysObj: trial.physObj,
      trialStartTime: trial.startTime,
      runTime: trial.runTime
   })
}


function pushDataToServer(){
   data = {
      client: client, 
      version: 'crayon_coaster_simulation',
      data: trialdata
   };
   if(!expt.debug){
      writeServer(data);
   }
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

function sample(set) {
   return (set[Math.floor(Math.random() * set.length)]);
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

