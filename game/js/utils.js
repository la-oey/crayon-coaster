
function recordData(){
   trialdata.push({
      numTrial: trial.numtrial,
      levelIndex: levels[trial.numtrial].nindex,
      levelID: levels[trial.numtrial].id,
      numAttempts: trial.numattempt,
      maxAttempt: trial.maxattempt,
      goalLocation: cupLoc,
      marbleStartLoc: marbleLoc,
      marbleEndLoc: marble.body.position,
      marbleDistToGoal: marbleDist,
      runOutcome: getOutcome(),
      drawnLines: allRects,
      trialStartTime: trial.trialStartTime,
      drawTime: trial.drawTime,
      runTime: trial.runTime
   })
}

function recordAllStrokes(){
   strokedata.push(strokeAction);
}




function isWithinBound(x, y, dims){
   return(
      x >= dims.x0 - dims.width/2 && 
      x <= dims.x0 + dims.width/2 &&
      y >= dims.y0 && 
      y <= dims.y0 + dims.height
   )
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

function getDistance(positionA, positionB){
   let distx = positionB.x - positionA.x;
   let disty = positionB.y - positionA.y;
   return(Math.sqrt(distx**2 + disty**2));
}

function debuglog(message){
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