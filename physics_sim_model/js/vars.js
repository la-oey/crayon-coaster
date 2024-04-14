// experiment settings
var trialOrder = [];
var simTypeNum = 0;
var thisTrial;
var sd_position = 10;
var sd_mass = 0.3;
var sd_radius = 3;
var sd_gravX = 0.1;
var sd_gravY = 1;
var ogMass, ogRadius, ogBounce, ogGravX, ogGravY;
var levelwind;

//"tweak marble x", "tweak marble y", "tweak bounce", "tweak mass", "tweak radius", "tweak wind", "tweak gravity"

// imgURL: 'save.image.php',
var expt = {
    saveURL: 'submit.simple.php',
    levelid: null,
    level: null,
    windid: null,
    wind: null,
    imageid: null,
    image: null,
    typeSims: ["ground truth", "tweak marble x", "tweak marble y", "tweak bounce", "tweak mass", "tweak radius", "tweak wind", "tweak gravity"], 
    groundtruthruns: 3,
    runs: 1000, //switch to 1000
    maxRunTime: 8000, //fail safe: shortened from 10 seconds in original game
    starttime: null,
    debug: false,
    running: true
};
var trial = {
    type: "",
    numrun : 0,
    startTime: 0,
    runTime: 0,
    strokes: [],
    physObj: [],
    marbleX: 0,
    marbleY: 0,
    bounce: 0,
    mass: 0,
    radius: 0,
    wind: 0,
    gravity: 0
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
    wind : {
        "none" : {
            gravX: 0
        }, 
        "left" : {
            gravX: -0.25,
            iconflip: true
        }, 
        "right" : {
            gravX: 0.25,
            iconflip: false
        }
    },
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

var trialData = []; // store of all trials
var data;