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
		expt.totaltrials = gameTotalTrials;
		trialOrder = trialOrder.slice(0, expt.totaltrials);
		startGame();
	},
	"survey": endGame,
	"demographic": function(){$("#demographic").css('display','block')},
	"debrief": startDebrief
}