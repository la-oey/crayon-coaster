// experiment settings
var trialOrder = [];
var thisTrial;

var expt = {
    saveURL: 'submit.simple.php',
    imgURL: 'save.image.php',
    totaltrials: 0,
    maxRunTime: 10000, //fail safe: 10 second max run time per trial
    debug: true,
    run: false
};
var trial = {
    numtrial : 0,
    numattempt : 0,
    maxattempt : 25,
    trialStartTime: 0,
    runTime: 0,
    strokes: [],
    physObj: []
}

var physSettings = {
    planet : [
        // earth = {
        //     gravY: 1,
        //     sky: "#7DF9FF",
        //     ground: "grass",
        //     windcolor: "black"
        // }, 
        jupiter = {
            gravY: 2.5,
            sky: "#00008B",
            ground: "jupiter",
            windcolor: "white"
        }
    ],
    wind : [
        none = {
            gravX: 0,
            label: "none"
        }, 
        left = {
            gravX: -0.25,
            iconflip: true,
            label: "left"
        }, 
        right = {
            gravX: 0.25,
            iconflip: false,
            label: "right"
        }
    ],
    size: [
        small = {
            mass: 1,
            radius: 20    
        } //,
        // big = {
        //     mass: 1000,
        //     radius: 30
        // }
    ],
    bounciness: 1 //[0, 1]
}

var trainingIndices = {};
trainingIndices["wide"] = [0, 1, 3, 7, 8];
trainingIndices["narrow"] = [5, 6, 9, 11, 12];
// var testOrder = [
//     {
//         level: levels[4],
//         wind: physSettings.wind[1]
//     }, {
//         level: levels[13],
//         wind: physSettings.wind[0]
//     }, {
//         level: levels[2],
//         wind: physSettings.wind[1]
//     }, {
//         level: levels[10],
//         wind: physSettings.wind[0]
//     }
// ];


var trialdata = [];
var strokedata = [];
var strokeStartTime, strokeEndTime;
var options;

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
var g;

var client = parseClient();
var trialData = []; // store of all trials
var data;