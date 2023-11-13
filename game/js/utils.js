
function recordData(){
   debugLog(trialdata);
   trialdata.push({
      numTrial: trial.numtrial,
      levelIndex: thisTrial.level.nindex,
      levelID: thisTrial.level.id,
      marbleLoc: thisTrial.level.marbleLoc,
      cupLoc: thisTrial.level.cupLoc,
      blockLoc: thisTrial.level.blockLoc,
      gravX: thisTrial.wind.gravX,
      gravY: thisTrial.planet.gravY,
      mass: thisTrial.size.mass,
      radius: thisTrial.size.radius,
      numAttempts: trial.numattempt,
      maxAttempt: trial.maxattempt,
      goalLocation: cupLoc,
      marbleStartLoc: marbleLoc,
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

function recordAllStrokes(){
   // debugLog(strokedata);
   strokedata.push(stroke);
}


function randomizeTrial(){
   let allTrials = [];
   for(l in levels){
      for(p in physSettings.planet){
         for(w in physSettings.wind){
            for(s in physSettings.size){
               allTrials.push({
                  level: levels[l], 
                  planet: physSettings.planet[p], 
                  wind: physSettings.wind[w], 
                  size: physSettings.size[s]});
            }
         }
      }
   }
   return(shuffle(allTrials));
}

// from https://github.com/cogtoolslab/photodraw_cogsci2021/blob/master/experiments/instancedraw_photo/js/jspsych-cued-drawing.js#L176
// send stroke data back to server to save to db
// function send_stroke_data(path) {
//    // path.selected = false;
//    var svgString = path.exportSVG({asString: false}).getAttribute('d');


//    // specify other metadata
//    stroke_data = _.extend({}, trial, {
//        eventType: 'stroke',
//        gameID: trial.gameID,
//        //SONA_ID: trial.SONA_ID,
//        prolificID : trial.prolificID,
//        studyID : trial.studyID,
//        sessionID : trial.sessionID,
//        sketchID: sketchID,
//        strokeID: sketchID + '_' + currStrokeNum,
//        svg: svgString,
//        arcLength: path.length,
//        dbname: trial.dbname,
//        colname: trial.colname,
//        iterationName: trial.iterationName,             
//        currStrokeNum: currStrokeNum,
//        simplifyParam: simplifyParam,
//        startResponseTime: startResponseTime,
//        startStrokeTime: startStrokeTime,
//        endStrokeTime: endStrokeTime,
//        time: Date.now()
//    });

//     console.log('stroke_data',stroke_data);

//    // send stroke data to server
//    socket.emit('stroke',stroke_data);    

// }

function endTrial(scene, outcome="fail"){
   trial.runTime = Date.now() - trial.drawEndTime;
   if(!isOutofBound){
      marble.setStatic(true); //prevent new drawn lines from moving marble
   }
   if(outcome == "success"){
      endMarbleDist = 0;
      minMarbleDist = 0;
      recordData();
   } else{
      marbleEndLoc = JSON.stringify(marble.body.position);
      endMarbleDist = getDistance(marble.body.position, cupLoc);
      minMarbleDist = Math.min(...dists);
      recordData();
      trial.numattempt++;
      if(trial.numattempt < trial.maxattempt){
         scene.trialLabel.destroy();
         scene.trialLabel = roundLabel(trial.numtrial+1, trial.numattempt+1, scene);
      }
      scene.clear_button.enable();
      scene.undo_button.enable();
      scene.drop_button.enable();
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