
function recordAttemptData(){
   trialdata.push({
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

function recordAllStrokes(){
   stroke.exptPart = trial.exptPart;
   stroke.numtrial = trial.numtrial;
   stroke.numattempt = trial.numattempt;
   debugLog(strokedata);
   strokedata.push({stroke});
}

function pushDataToServer(){
   data = {
      client: client, 
      version: 'crayon_coaster_test',
      stroke: strokedata,
      data: trialdata,
      tutorialsurvey: expt.tutorialSurvey,
      endsurvey: expt.endSurvey,
      demographic: expt.demographic,
      bonus: bonus
   };
   writeServer(data);
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
   // in tutorial, check to see if marble is in goal
   if(s == 1 && t == 4){ //expecting marble to NOT get into cup
      currentTutButton.button.destroy();
      t++;
      if(outcome == "fail"){
         createNewButton(s, t, scene);
      } else{ //unexpectedly getting into cup
         let params = successErr;
         currentErrButton = new Button(convXW(params.x), convY(params.y), params.text, scene, params.clickable, () => {
            t = t+4;
            createNewButton(s, t, scene);
         });
         currentErrButton.enable("black");
      }
   } else if(s == 1 && t == 8){ //expect marble to get into cup
      currentTutButton.button.destroy();
      if(outcome == "success"){
         t++;
         createNewButton(s, t, scene);
      } else{
         let params = failErr;
         currentErrButton = new Button(convXW(params.x), convY(params.y), params.text, scene, params.clickable, () => {});
         currentErrButton.disable("black");
      }
   }
   
   // save canvas to image
   if(trial.exptPart == "test"){
      let captureCompleted = false
      game.game.events.on('postrender', function () {
         if(captureCompleted){
            return
         }
         // Set the flag to prevent further captures
         captureCompleted = true;
         saveSvgFromCanvas();
      });
   }
   
   
   if(!isOutofBound){
      marble.setStatic(true); //prevent new drawn lines from moving marble
   }
   if(outcome == "success"){
      if(trial.exptPart == "test"){
         expt.successtrials++;
      }
      endMarbleDist = 0;
      minMarbleDist = 0;
      recordAttemptData();
   } else{
      marbleEndLoc = marble.body.position; //LO TO DO don't need JSON stringify?
      endMarbleDist = getDistance(marble.body.position, cupLoc);
      minMarbleDist = Math.min(...dists);
      recordAttemptData();
      trial.numattempt++;
      if(trial.numattempt < trial.maxattempt){
         scene.trialLabel.destroy();
         scene.trialLabel = levelLabel(trial.numtrial+1, trial.numattempt+1, scene);
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

