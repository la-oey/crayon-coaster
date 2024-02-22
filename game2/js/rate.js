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
            var val = $('#slider').prop('value');

            $('#slider').removeClass('inactiveSlider');
            $('#slider').addClass('activeSlider');
            $('#ratebutton').css('display','block');
        });
}

function restartTrial() {
    trial.ratedtrial = trialOrder[trial.numtrial];

    $('#round').text("Round " + (trial.numtrial+1) + " of " + expt.totaltrials);

    // pick image from folder
    $('#imageToRate').attr("src","assets/stim/" + trial.ratedtrial);

    $('#slider').addClass('inactiveSlider');
    $('#slider').removeClass('activeSlider');
    $('#ratebutton').css('display','none');
}

function nextTrial(){
    ++trial.numtrial;
    restartTrial();
}