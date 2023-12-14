// experiment settings
var trialOrder = [];
var thisTrial;
var expt = {
    saveURL: 'submit.simple.php',
    totaltrials: 5,
    maxRunTime: 10000, //fail safe: 10 second max run time per trial
    pilot: false,
    debug: true,
    bonus: 0,
    startTime: Date.now(),
    tutorialSurvey: [],
    endSurvey: []
};
var trial = {
    exptPart : "tutorial",
    numtrial : 0,
    numattempt : 0,
    maxattempt : 5,
    trialStartTime: 0,
    drawEndTime: 0,
    drawTime: 0,
    runTime: 0,
    strokes: [],
    physObj: []
}
var stroke = {
    exptPart : "tutorial",
    numtrial : 0,
    numattempt : 0,
    graphic : null,
    physObj : null,
    action: "NA",
    startTime: 0,
    endTime: 0,
    duration: 0
}

var physSettings = {
    planet : [
        earth = {
            gravY: 1,
            sky: "#7DF9FF",
            ground: "grass",
            windcolor: "black"
        }, 
        jupiter = {
            gravY: 2.5,
            sky: "#00008B",
            ground: "jupiter",
            windcolor: "white"
        }
    ],
    wind : [
        none = {gravX: 0}, 
        left = {
            gravX: -0.25,
            iconflip: true
    }, 
        right = {
            gravX: 0.25,
            iconflip: false
        }
    ],
    size: [
        small = {
            mass: 1,
            radius: 20    
        },
        big = {
            mass: 1000,
            radius: 30
        }],
    bounciness: 1 //[0, 1]
}

var tutorialOrder = [
    {
        level: tutoriallevels[0],
        planet: physSettings.planet[0],
        wind: physSettings.wind[0],
        size: physSettings.size[0]
    }, {
        level: tutoriallevels[1],
        planet: physSettings.planet[0],
        wind: physSettings.wind[2],
        size: physSettings.size[0]
    }, {
        level: levels[0],
        planet: physSettings.planet[1],
        wind: physSettings.wind[0],
        size: physSettings.size[1]
    }
];

var trialdata = [];
var strokedata = [];
var strokeStartTime, strokeEndTime;

let sc_width;
let sc_height;
let toolheight;

var isOutofBound, isStationary, inGoal;
var allRects, curves;
var cupLoc, marbleLoc;
var marble, marbleEndLoc;
var endMarbleDist, minMarbleDist;
var dists = [];
var marbleCoords = [];

// line drawing constants
const size = 16;
const stiffness = 1; //0.1
const draw_color = 0x00aa00;

let prevMarble = {
 x: -1,
 y: -1
}
let stationaryTime = 0;
var drawingEnabled = true;
var currentTutButton = null;
var currentErrButton = null;
var s = 0;
var t = 0;
var g;
var guideline;

var startPage = "consent"; //"consent";
var client = parseClient();
var trialData = []; // store of all trials
var data;
var surveyseconds = 60;