var clicksMap = {
	"consent": function(){$('#consent').css('display','block')},
	"instructions": startInstructions,
	"instructsurvey": startInstructQuiz,
	"postinstruct": function(){
		corrInstructQ = 4;
		startPostInstruct();
	},
	"ratings": startRating,
	"survey": endRating,
	"demographic": function(){$("#demographic").css('display','block')},
	"debrief": startDebrief
}