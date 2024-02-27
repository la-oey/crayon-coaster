
var jsonImgData;
function pageLoad() {
    $("#consentText").load("consent.html"); 
    $("#instructText").load("instructions.html");
    $("#instructSurveyText").load("instructsurvey.html");
    $("#surveyText").load("survey.html");
    $("#demographicText").load("demographic.html");
    $("#debriefText").load("debrief.html");


    expt.rateDim = sample(rateDims);
    trialOrder = randomizeTrial();

    

    // attempt to fetch data from json, also tried async
    // fetch("assets/imagesRate.json")
    //     .then(response => {return response.json()})
    //     .then(result => {jsonImgData = result});

    
 
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

    $(".instructRateDim").html(expt.rateDim);
    $("#solutionLen").html(trialOrder.length);
    window.scrollTo(0, 0);
}



var instructQs = {
    wind: {
        q: "Which direction does the wind push the marble if this is the icon you see?",
        corr: "right",
        a: null
    },
    marble: {
        q: "Which icon shows where the marble will drop from?",
        corr: "circle",
        a: null
    },
    goal: {
        q: "Which icon shows the goal location?",
        corr: "cup",
        a: null
    },
    obstacle: {
        q: "What happens when the marble interacts with a black block like this?",
        corr: "bounce",
        a: null
    },
};
var corrInstructQ = 0;
var instrQlen = Object.keys(instructQs).length;

function startInstructQuiz(){
    $('#instructions').css('display','none');
    $("#instructSurvey").css('display','block');
    window.scrollTo(0, 0);

    //refresh answers in case of repeat
    corrInstructQ = 0;
    instructQs.wind.a = null;
    instructQs.marble.a = null;
    instructQs.goal.a = null;
    instructQs.obstacle.a = null;
    $("#instrsurvey-button").prop('disabled', true);

    for(let k of Object.keys(instructQs)){
        $(document).on("change","input[name="+k+"]", function(){
            updateRadio(instructQs, k);
            if(checkInstructSurvey()){
                $("#instrsurvey-button").prop('disabled', false);
            } else{
                $("#instrsurvey-button").prop('disabled', true);
            }
        });
    }
}

function checkInstructSurvey(){
    let currCt = 0;
    for(let c of Object.keys(instructQs)){
        if(instructQs[c].a != null){
            currCt++;
        }
    }
    return(currCt == instrQlen);
}

var minInstrSurveyCorr = 4;
function submitInstructSurvey(){
    //saves instruct survey data
    debugLog(instructQs);
    expt.instructSurvey.push(JSON.parse(JSON.stringify(instructQs))); //push shallow copy of dict
    pushDataToServer();

    for(let k of Object.keys(instructQs)){
        if(instructQs[k].a == instructQs[k].corr){
            corrInstructQ++;
        }
    }

    return(corrInstructQ);
}
 
function startPostInstruct() {
    $("#instructSurvey").css('display','none');
    let numcorrect = submitInstructSurvey();
    //participant fails instruction survey on first attempt
    if(numcorrect < minInstrSurveyCorr && expt.instructSurvey.length == 1){
        //asks to repeat instruction if <min correct
        alert("Oops you got fewer than " + minInstrSurveyCorr + " correct answers, so we'd like you to read the instruction again.");
        // resets instruction survey form
        $("form").trigger('reset');
        window.scrollTo(0, 0);
        // restart at instructions
        startInstructions();
    } else{ //participant succeeds or fails more than once
        $("#postinstruct").css('display','block');
        $("#gamerounds").html(expt.totaltrials);
    }
}
 
 
function startRating() {
    $("#postinstruct").css('display','none');
    $("#rating").css('display','block');

    rate();
}




function endRating() {
    pushDataToServer();
    $('#rating').css('display','none');
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
    // let bonusamt = expt.successtrials * .25;
    // bonus = "$"+bonusamt.toFixed(2);
    // $('#total-bonus').html(bonus);
    // pushDataToServer();
}
 
 
 