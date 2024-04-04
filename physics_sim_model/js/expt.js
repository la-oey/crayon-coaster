function pageLoad() {
    // trialOrder = serialOrder();


	startGame();
}

// if running all levels/solutions/sims serially - runs into issues on level 30 from memory issues(?)
function serialOrder(){
    var allTrials = [];
    for(cond of ["wide","narrow"]){
       let ratedlevels = trainingIndices[cond].map(x=>levels[x]);
       for(l of ratedlevels){
          for(w of physSettings.wind){
             let levelwind = l.id + "-" + w.label;
             let solutionLvlArr = solutions[levelwind];
             for(let [key, value] of Object.entries(solutionLvlArr)){
                allTrials.push({
                   level: l, 
                   wind: w,
                   imageID: key,
                   drawing: value
                });
             }
             
          }
       }
    }
 
    debugLog(allTrials)
 
    return(allTrials);
}
 
var game; //simulation
 
function startGame() {
    $("#game").css('display','block');
    
    game = new Game({
       "id": "game"
    });
    game.createGame();
}



function endGame() {
    $('#game').css('display','none');
    $("#survey").css('display','block');

    let surveyms = surveyseconds * 1000;
    $('#surveytimer').html(surveyseconds); //throwing issues for some reason - LO check this later
    setTimeout(() => {
        $('#survey-button').prop("disabled",false);
    }, surveyms);
}

 
 