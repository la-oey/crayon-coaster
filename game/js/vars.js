// experiment settings
var trialOrder = [];
var thisTrial = {};
var expt = {
    saveURL: 'submit.simple.php',
    totaltrials: 0,
    pilot: false,
    debug: true,
    startTime: Date.now()
};
var trial = {
    exptPart : "trial",
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
            gravY: 1}, 
        jupiter = {
            gravY: 2.5}
    ],
    wind : [
        none = {
            gravX: 0}, 
        left = {
            gravX: -0.5}, 
        right = {
            gravX: 0.5}
    ],
    size: [
        small = {
            mass: 1,
            radius: 15    
        },
        big = {
            mass: 1000,
            radius: 25
        }],
    bounciness: 1 //[0, 1]
}

var trialdata = [];
var strokedata = [];
var strokeStartTime, strokeEndTime;

let sc_width;
let sc_height;

var isOutofBound, isStationary, inGoal;
var allRects, curves;
var cupLoc, marbleLoc;
var marble, marbleEndLoc;
var endMarbleDist, minMarbleDist;
var dists = [];

// line drawing constants
const size = 16;
const stiffness = 1; //0.1
const draw_color = 0x00aa00;

let prevMarble = {
 x: -1,
 y: -1
}
let stationaryTime = 0;

var client = parseClient();
var trialData = []; // store of all trials
var data;
