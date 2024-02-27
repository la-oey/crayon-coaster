
function recordData(){
   trialdata.push({
      rateDim: expt.rateDim,
      numTrial: trial.numtrial,
      ratedImg: trial.ratedtrial,
      score: trial.rating,
      trialStartTime: trial.trialStartTime,
      duration: trial.duration
   })
}

function pushDataToServer(){
   data = {
      client: client, 
      version: 'crayon_coaster_rate',
      data: trialdata,
      endsurvey: expt.endSurvey,
      demographic: expt.demographic
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
   debugLog(trialOrder)
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


function updateRadio(dict, q){
   dict[q].a = $('input[name='+q+']:checked').val();
}

