
var jsonImgData;
function pageLoad() {
    $("#consentText").load("consent.html"); 
    $("#instructText").load("instructions.html");
    // $("#tutorialSurveyText").load("tutorialsurvey.html");
    $("#surveyText").load("survey.html");
    $("#demographicText").load("demographic.html");
    $("#debriefText").load("debrief.html");

    // attempt to fetch data from json, also tried async
    // fetch("assets/imagesRate.json")
    //     .then(response => {return response.json()})
    //     .then(result => {jsonImgData = result});

    expt.rateDim = sample(rateDims);
    trialOrder = randomizeTrial();
 
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

 
function startInstructions() {
    $('#consent').css('display','none');
    $('#instructions').css('display','block');
}
 
 
function startRating() {
    $("#postinstruct").css('display','none');
    $("#rating").css('display','block');
    
    trial.numtrial = 0;

    rate();
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
    let bonusamt = expt.successtrials * .25;
    bonus = "$"+bonusamt.toFixed(2);
    $('#total-bonus').html(bonus);
    pushDataToServer();
}
 
 
 