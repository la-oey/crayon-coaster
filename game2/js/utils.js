
function recordAttemptData(){
   trialdata.push({
      trainingCond: expt.trainingCond,
      exptPart: trial.exptPart,
      numTrial: trial.numtrial,
      levelIndex: thisTrial.level.nindex,
      levelID: thisTrial.level.id,
      marbleStartLoc: thisTrial.level.marbleLoc,
      cupLoc: thisTrial.level.cupLoc,
      blockLoc: thisTrial.level.blockLoc,
      gravX: thisTrial.wind.gravX,
      gravY: thisTrial.planet.gravY,
      mass: thisTrial.size.mass,
      radius: thisTrial.size.radius,
      numAttempts: trial.numattempt,
      maxAttempt: trial.maxattempt,
      marbleEndLoc: marbleEndLoc,
      marbleCoords: marbleCoords,
      marbleEndDist: endMarbleDist,
      marbleMinDist: minMarbleDist,
      runOutcome: getOutcome(),
      drawnLines: trial.strokes,
      drawnPhysObj: trial.physObj,
      trialStartTime: trial.trialStartTime,
      drawTime: trial.drawTime,
      runTime: trial.runTime
   })
}

function pushDataToServer(){
   data = {
      client: client, 
      version: 'crayon_coaster_test',
      data: trialdata,
      endsurvey: expt.endSurvey,
      demographic: expt.demographic,
      bonus: bonus
   };
   writeServer(data);
}




function randomizeTrial(){
   let allTrials = [];

   //get wide
   for(cond of ["wide","narrow"]){
      let shuffSubjs = shuffle(imageSubjs[cond]);
      let trainingLevels = trainingIndices[cond].map(x=>levels[x]);
      let subjInd = 0
      for(l of trainingLevels){
         for(w of ["left","right","none"]){
            let directory = l.id + "-" + w;
            let direcArr = imageData[directory]
            let imageID = direcArr.filter(str => str.includes(shuffSubjs[subjInd]))

            allTrials.push(directory + "/" + imageID);
            ++subjInd;
         }
      }

   }
   trialOrder = shuffle(allTrials);
   expt.totaltrials = trialOrder.length;

   return(trialOrder);
}




// helper functions
function sample(set) {
    return (set[Math.floor(Math.random() * set.length)]);
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

