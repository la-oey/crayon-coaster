function pageLoad() {
    expt.starttime = Date.now();

    expt.levelid = getParameterByName('level');
    expt.windid = getParameterByName('wind');

    expt.level = levels[expt.levelid];
    expt.wind = physSettings.wind[expt.windid];
    
    levelwind = expt.levelid + "-" + expt.windid;
    expt.image = getParameterByName('imageid');
    expt.imageid = expt.image + ".png";
    thisTrial = {
        imageID: expt.imageid,
        drawing: solutions[levelwind][expt.imageid]
    }

    trial.type = expt.typeSims[simTypeNum];

	startGame();
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
    $('#levelwind').html(levelwind);
    $('#imageid').html(expt.imageid);
    $('#runtime').html((Date.now() - expt.starttime) / 1000);
    $('#game').css('display','none');
    $('#end').css('display','block');
}

 
// if running all solutions/sims of a given level serially
// function pullSolutions(levelwind){
//     var allSolutions = [];
//     let solutionLvlArr = solutions[levelwind];
//     for(let [key, value] of Object.entries(solutionLvlArr)){
//         allSolutions.push({
//             imageID: key,
//             drawing: value
//         });
//     }
 
//     return(allSolutions);
// }



// if running all levels/solutions/sims serially - runs into issues on level 30 from memory issues(?)
// function serialOrder(){
//     var allTrials = [];
//     for(cond of ["wide","narrow"]){
//        let ratedlevels = trainingIndices[cond].map(x=>levels[x]);
//        for(l of ratedlevels){
//           for(w of physSettings.wind){
//              let levelwind = l.id + "-" + w.label;
//              let solutionLvlArr = solutions[levelwind];
//              for(let [key, value] of Object.entries(solutionLvlArr)){
//                 allTrials.push({
//                    level: l, 
//                    wind: w,
//                    imageID: key,
//                    drawing: value
//                 });
//              }
             
//           }
//        }
//     }
 
//     debugLog(allTrials)
 
//     return(allTrials);
// }
 
