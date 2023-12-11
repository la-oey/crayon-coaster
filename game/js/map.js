var clicksMap = {
	"consent": function(){$('#consent').css('display','block')},
	"instructions": startInstructions,
	"tutorial": startTutorial,
	"tutorialsurvey": endTutorial,
	"posttutorial": function(){
		corrTutQ = 6;
		startPostTutorial();
	},
	"game": function(){
		trialOrder = randomizeTrial();
		if(expt.debug & expt.totaltrials != 0){
			// debug using X number of trials
			trialOrder = trialOrder.slice(0, expt.totaltrials);
		} else{
			expt.totaltrials = trialOrder.length;
		}
		startGame();
	},
	"survey": endGame,
	"demographic": startDemographic,
	"debrief": startDebrief
}