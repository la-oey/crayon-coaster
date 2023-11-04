
function recordData(){
   console.log(trial.strokes);
   console.log(trial.physObj);
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
      drawnLines: trial.strokes,
      drawnPhysObj: trial.physObj,
      trialStartTime: trial.trialStartTime,
      drawTime: trial.drawTime,
      runTime: trial.runTime
   })
}

function recordAllStrokes(){
   strokedata.push(stroke);
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