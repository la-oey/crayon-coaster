function pageLoad() {
    $("#consentText").load("consent.html"); 
    $("#instructText").load("instructions.html");
    $("#tutorialSurveyText").load("tutorialsurvey.html");
 
    //halt moving on until consent form checkbox is checked
    $(document).on("change", "#consent_checkbox", function(){
       if(this.checked) {
          $('#consent-button').prop('disabled', false);
       } else{
          $('#consent-button').prop('disabled', true);
       }
    });
 
    clicksMap[startPage]();
 }
 
var tutorial, game;
 
function startInstructions() {
    $('#consent').css('display','none');
    $('#instructions').css('display','block');
}
 
function startTutorial() {
    trial.numtrial = 0;
    $('#instructions').css('display','none');
    $('#tutorial').css('display','block');
    trialOrder = tutorialOrder.slice();
    expt.totaltrials = trialOrder.length;
    trial.exptPart = "tutorial";
 
    tutorial = new Game({
       "id": "tutorial"
    });
    tutorial.createGame();
}

var tutorialQs = {
    strength: null,
    wind: null,
    delete: null,
    attempts: null,
    return: null,
    location: null
};
var tutQlen = Object.keys(tutorialQs).length;

function updateRadio(q){
    tutorialQs[q] = $('input[name='+q+']:checked').val();
}

function endTutorial(){
    $('#tutorial').css('display','none');
    $("#tutorialSurvey").css('display','block');
    //refresh answers in case of repeat
    tutorialQs = {
        strength: null,
        wind: null,
        delete: null,
        attempts: null,
        return: null,
        location: null
    };

    for(let k of Object.keys(tutorialQs)){
        $(document).on("change","input[name="+k+"]", function(){
            updateRadio(k);
            if(checkTutorialSurvey()){
                $("#tutsurvey-button").prop('disabled', false);
            } else{
                $("#tutsurvey-button").prop('disabled', true);
            }
        });
    }
}

function checkTutorialSurvey(){
    let currCt = 0;
    for(let c of Object.keys(tutorialQs)){
        if(tutorialQs[c] != null){
            currCt++;
        }
    }
    return(currCt == tutQlen);
}

var minTutSurveyCorr = 4;
function submitTutorialSurvey(){
    //saves tutorial survey data
    expt.tutorialSurvey.push(tutorialQs); //LO TO DO: double check this is being pushed to data

    //returns number of incorrect answers
    let corrCt = + (tutorialQs.strength == "false") + (tutorialQs.wind == "right") + (tutorialQs.delete == "undo") + (tutorialQs.attempts == "5") + (tutorialQs.return == "false") + (tutorialQs.location == "a");
    debugLog("# correct answers = " + corrCt);
    return(corrCt);
}
 
function startPostTutorial(){
    $("#tutorialSurvey").css('display','none');
    if(submitTutorialSurvey() >= minTutSurveyCorr){
        $("#postTutorial").css('display','block');
    } else{
        //asks to repeat tutorial if <4 correct
        //LO TO DO add alert
        alert("Oops you got fewer than 4 correct answers, so we'd like you to complete the tutorial again");
        startTutorial();
    }
}
 
function startGame() {
    $("#postTutorial").css('display','none');
    $("#game").css('display','block');
    trialOrder = randomizeTrial();
    expt.totaltrials = trialOrder.length;
    trial.exptPart = "test";
    trial.numtrial = 0;
    game = new Game({
       "id": "game"
    });
    game.createGame();
}
 
 
function experimentDone() {
    submitExternal(client);
}
 
 
 