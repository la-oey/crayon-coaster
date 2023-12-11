function pageLoad() {
    $("#consentText").load("consent.html"); 
    $("#instructText").load("instructions.html");
    $("#tutorialSurveyText").load("tutorialsurvey.html");
    $("#surveyText").load("survey.html");
    $("#demographicText").load("demographic.html");
    $("#debriefText").load("debrief.html");
 
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
    strength: {
        q: "Gravity is strongest in this environment.",
        corr: "false",
        a: null
    },
    wind: {
        q: "Which direction does the wind push the marble if this is the icon you see?",
        corr: "right",
        a: null
    },
    delete: {
        q: "What should you do to delete the last line after you've drawn it?",
        corr: "undo",
        a: null
    },
    attempts: {
        q: "How many attempts do you have per round?",
        corr: "5",
        a: null
    },
    return: {
        q: "You can return to a previous LEVEL after the game.",
        corr: "false",
        a: null
    },
    location: {
        q: "Where would be the end destination of the marble in this trial?",
        corr: "a",
        a: null
    }
};
var corrTutQ = 0;
var tutQlen = Object.keys(tutorialQs).length;

function updateRadio(q){
    tutorialQs[q].a = $('input[name='+q+']:checked').val();
}

function endTutorial(){
    $("canvas").remove();
    $('#tutorial').css('display','none');
    $("#tutorialSurvey").css('display','block');

    //refresh answers in case of repeat
    corrTutQ = 0;
    tutorialQs.strength.a = null;
    tutorialQs.wind.a = null;
    tutorialQs.delete.a = null;
    tutorialQs.attempts.a = null;
    tutorialQs.return.a = null;
    tutorialQs.location.a = null;
    $("#tutsurvey-button").prop('disabled', true);

    for(let k of Object.keys(tutorialQs)){
        $(document).on("change","input[name="+k+"]", function(){
            updateRadio(k);
            if(tutorialQs[k].a == tutorialQs[k].corr){
                corrTutQ++;
            }
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
    expt.tutorialSurvey.push(tutorialQs); //LO TO DO double check this is being pushed to data

    //returns number of incorrect answers
    // let corrCt = + (tutorialQs.strength == "false") + (tutorialQs.wind == "right") + (tutorialQs.delete == "undo") + (tutorialQs.attempts == "5") + (tutorialQs.return == "false") + (tutorialQs.location == "a");
    debugLog("# correct answers = " + corrTutQ);
    return(corrTutQ);
}
 
function startPostTutorial() {
    $("#tutorialSurvey").css('display','none');
    if(submitTutorialSurvey() >= minTutSurveyCorr){
        $("#postTutorial").css('display','block');
    } else{
        //asks to repeat tutorial if <4 correct
        alert("Oops you got fewer than 4 correct answers, so we'd like you to read the instruction and complete the tutorial again");
        // resets tutorial survey form
        $("form").trigger('reset');
        // restart at instructions
        s = 0;
        t = 0;
        startInstructions();
    }

    trialOrder = randomizeTrial();
    if(expt.debug & expt.totaltrials != 0){
        // debug using X number of trials
        trialOrder = trialOrder.slice(0, expt.totaltrials);
    } else{
        expt.totaltrials = trialOrder.length;
    }
    $("#gamerounds").html(expt.totaltrials);
}
 
function startGame() {
    $("#postTutorial").css('display','none');
    $("#game").css('display','block');
    
    trial.exptPart = "test";
    trial.numtrial = 0;
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

var endQs = {
    researchquestion: {
        q: "What do you think was the research question we were trying to ask with this game?",
        a: null
    },
    challenge: {
        q: "Which rounds did you find challenging?",
        a: null
    },
    approach: {
        q: "What was your approach to solving each level?",
        a: null
    },
    issues: {
        q: "Did you run into any technical issues with the game? If so, describe.",
        a: null
    },
    improve: {
        q: "Did you have any thoughts on how this game could be improved? Let us know.",
        a: null
    }
};

function startDemographic() {
    // check after continue is clicked if all textboxes contain content
    let endqct = 0;
    for(let l of Object.keys(endQs)){
        endQs[l].a = $("#"+l).val();
        if($("#"+l).val().length > 0){
            endqct++;
        }
    }
    
    if(endqct < Object.keys(endQs).length){
        // if not, throw an alert
        alert("Oops it looks like you haven't responded to all questions. Respond to all questions to continue.")
    } else{
        // if yes, move on
        expt.endSurvey = endQs;
        window.scrollTo(0, 0);
        $('#survey').css('display','none');
        $("#demographic").css('display','block');
    }
}

function startDebrief() {
    $('#demographic').css('display','none');
    $("#debrief").css('display','block');
    $('#total-bonus').html(expt.bonus);
}
 
function experimentDone() {
    submitExternal(client);
}
 
 
 