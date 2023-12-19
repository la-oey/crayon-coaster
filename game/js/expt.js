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
    s = 0;
    t = 0;
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
        q: "Which environment has stronger gravity?",
        corr: "jupiter",
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

function updateRadio(dict, q){
    dict[q].a = $('input[name='+q+']:checked').val();
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
            updateRadio(tutorialQs, k);
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
        if(tutorialQs[c].a != null){
            currCt++;
        }
    }
    return(currCt == tutQlen);
}

var minTutSurveyCorr = 4;
function submitTutorialSurvey(){
    //saves tutorial survey data
    debugLog(tutorialQs);
    expt.tutorialSurvey.push(tutorialQs); //LO TO DO double check this is being pushed to data
    pushDataToServer();

    //returns number of incorrect answers
    debugLog("# correct answers = " + corrTutQ);
    return(corrTutQ);
}
 
function startPostTutorial() {
    $("#tutorialSurvey").css('display','none');
    if(submitTutorialSurvey() >= minTutSurveyCorr){
        $("#postTutorial").css('display','block');
        trialOrder = randomizeTrial();
        // X number of trials
        expt.totaltrials = gameTotalTrials;
        trialOrder = trialOrder.slice(0, expt.totaltrials);
        // expt.totaltrials = trialOrder.length; //if running on full conditions
        $("#gamerounds").html(expt.totaltrials);
    } else{
        if(expt.tutorialSurvey.length == 1){
            //asks to repeat tutorial if <4 correct
            alert("Oops you got fewer than 4 correct answers, so we'd like you to read the instruction and complete the tutorial again.");
            // resets tutorial survey form
            $("form").trigger('reset');
            // restart at instructions
            startInstructions();
        } else{
            alert("Oops you got fewer than 4 correct answers for a second time, so we cannot let you complete the HIT.");
            experimentDone();
        }
    }
}
 
function startGame() {
    $("#postTutorial").css('display','none');
    $("#game").css('display','block');
    
    trial.exptPart = "test";
    trial.numtrial = 0;
    trial.numattempt = 0;
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
    describe: {
        q: "In 1-2 sentences, please describe the HIT you just completed.",
        a: null
    },
    approach: {
        q: "What was your overarching approach to solve each level?",
        a: null
    },
    issues: {
        q: "Did you experience any technical issues while playing the game? If so, describe.",
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
        pushDataToServer();
        window.scrollTo(0, 0);
        $('#survey').css('display','none');
        $("#demographic").css('display','block');
    }
}

var demodata = {
    "survey-instructions": {
        type: "radio",
        q: "Did you read the instructions, and do you think you did the task correctly?",
        a: null
    },
    "survey-gender": {
        type: "radio+",
        q: "Gender",
        a: null
    },
    "survey-age": {
        type: "freeresponse",
        q: "Age",
        a: null
    },
    "survey-education": {
        type: "radio",
        q: "What is the highest degree or level of education you have completed?",
        a: null
    },
    "survey-language": {
        type: "freeresponse",
        q: "Native language",
        a: null
    },
    "survey-enjoy": {
        type: "radio",
        q: "How much did you enjoy the HIT?",
        a: null
    },
    "survey-comments": {
        type: "freeresponse",
        q: "We would be interested in any comments you have about this study or how you think we might be able to improve it. Please type them here:",
        a: null
    }
}

function saveDemographic() {
    for(let d of Object.keys(demodata)){
        if(demodata[d].type == "radio"){
            updateRadio(demodata, d);
        } else if(demodata[d].type == "radio+"){
            if($('input[name='+d+']:checked').val() == "o"){
                demodata[d].a = $("#gender-other").val();
            } else{
                updateRadio(demodata, d);
            }
        } else if(demodata[d].type == "freeresponse"){
            demodata[d].a = $("#"+d).val();
        }
    }
    expt.demographic = demodata;
    pushDataToServer();
}

function startDebrief() {
    saveDemographic();
    $('#demographic').css('display','none');
    $("#debrief").css('display','block');
    $('#total-bonus').html(client.bonus);
}
 
function experimentDone() {
    submitExternal(client);
}
 
 
 