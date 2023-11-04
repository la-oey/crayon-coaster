// experiment settings
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

var trialdata = [];
var strokedata = [];
var strokeStartTime, strokeEndTime;

let sc_width;
let sc_height;

var isOutofBound, isStationary, inGoal;
var allRects, curves;
var cupLoc, marbleLoc;
var marble;
var marbleDist;

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
