function rate() {
    restartTrial();

    // text prompt
    if(expt.rateDim == "feasible") {
        $('#rateText').html("Rate how <b>likely this solution is to succeed</b>.")
        $('#minTxt, #maxTxt').append("likely");

    } else {
        $('#rateText').html("Rate how <b>" + expt.rateDim + "</b> this solution is.")
        $('#minTxt, #maxTxt').append(expt.rateDim);
    }
    
    // slider scale
    $('#slider').on('click input',
        function(){
            // save slider scale value to data
            trial.rating = $('#slider').prop('value');

            // hide default slider features
            $('#slider').removeClass('inactiveSlider');
            $('#slider').addClass('activeSlider');

            // show next round button
            $('#ratebutton').css('display','block');
        });
}

function restartTrial() {
    // set trial image to next trial
    trial.ratedtrial = trialOrder[trial.numtrial];
    // reset rating value
    trial.rating = -1;

    trial.trialStartTime = Date.now();
    trial.duration = 0;
    $('#round').text("Round " + (trial.numtrial+1) + " of " + expt.totaltrials);

    // pick image from folder
    $('#imageToRate').attr("src","assets/stim/" + trial.ratedtrial);

    $('#slider').addClass('inactiveSlider');
    $('#slider').removeClass('activeSlider');
    $('#ratebutton').css('display','none');
}

function nextTrial(){
    trial.duration = Date.now() - trial.trialStartTime;
    recordData();
    ++trial.numtrial;

    if(trial.numtrial < expt.totaltrials){
        restartTrial();
    } else{
        endRating();
    }
}