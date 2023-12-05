
var tutorinfo = [
    scene0 = [
        {
            text: "this is where the\n"+
            "marble will drop from.\n\n"+
            "click to continue.",
            x: 0.3,
            y: 0.08,
            clickable: true //,
            // condition: noConditions
        }, {
            text: "this is the cup that you\n"+
            "want to drop the marble in.\n\n"+
            "continue.",
            x: 0.3,
            y: 0.46,
            clickable: true //,
            // condition: noConditions
        }, {
            text: "click 'drop ball' and\n"+
            "see what happens.",
            x: 0.62,
            y: 0.05,
            clickable: false//,
            // condition: function(){ drop_button.on( ) },
            // condition: noConditions
        }, {
            text: "the ball appeared and\n"+
            "fell into the cup!\n"+
            "click 'next' to continue.",
            x: 0.85,
            y: 0.1,
            clickable: false//,
            // condition: noConditions
        }
    ], 
    scene1 = [
        {
            text: "in this new round, it’s windy.\n\n"+
            "continue.",
            x: 0.7,
            y: 0.2,
            clickable: true
        }, {
            text: "click 'drop ball' again\n"+
            "and see what happens!",
            x: 0.6,
            y: 0.1,
            clickable: false
        }, {
            text: "the cloud points to the right, so the wind\n"+
            "will blow the ball rightward!\n"+
            "sometimes, the wind blows left too.\n"+
            "pay attention to the cloud direction.\n\n"+
            "continue.",
            x: 0.2,
            y: 0.4,
            clickable: true
        }, {
            text: "this time we’ll need to help\n"+
            "the ball to get to the cup.\n"+
            "try drawing your own line\n"+
            "along this dotted line.",
            x: 0.5,
            y: 0.25,
            clickable: false
        }, {
            text: "click 'drop ball' again\n"+
            "and see what happens!",
            x: 0.6,
            y: 0.1,
            clickable: false
        }, {
            text: "uh oh, that didn’t get the ball\n"+
            "in the cup! let’s try a new line.\n\n"+
            "continue.",
            x: 0.2,
            y: 0.7,
            clickable: true
        }, {
            text: "this button “undos” THE LAST line you drew.\n\n"+
            "continue.",
            x: 0.5,
            y: 0.1,
            clickable: true
        }, {
            text: "this button “clears” ALL lines you drew.\n"+
            "erase your line and draw a new line.",
            x: 0.35,
            y: 0.1,
            clickable: false
        }, {
            text: "click “drop ball” again\n"+
            "and see what happens!",
            x: 0.6,
            y: 0.1,
            clickable: false
        }, {
            text: "the ball rolled along your\n"+
            "track and into the cup!\n"+
            "click “next” to continue.",
            x: 0.85,
            y: 0.2,
            clickable: false
        }
    ], 
    scene2 = [
        {
            text: "here’s the last tutorial round. now, we have\na bigger, heavier ball.\n\n"+
            "AND our environment has changed: we are on\njupiter where the gravity is stronger.\n\n"+
            "try for yourself to get the ball into the cup.\n\n"+
            "remember, you have 5 attempts.",
            x: 0.6,
            y: 0.4,
            clickable: false
        }
    ]
]

var errorText = {
    text: "uh oh, your line needs to be\ncloser to the dotted line.\ntry again!\n\ncontinue.",
    x: 0.8,
    y: 0.5,
    clickable: true
}
