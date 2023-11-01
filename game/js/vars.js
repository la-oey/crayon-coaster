// experiment settings
var expt = {
   totaltrials: 0,
   pilot: false,
   debug: true
};
var trial = {
   exptPart : "trial",
   numtrial : 0,
   numattempt : 0,
   maxattempt : 5,
   trialStartTime: 0,
   drawEndTime: 0,
   drawTime: 0,
   runTime: 0
}

var trialdata = [];
var strokeAction = {};
var strokedata = [];

let sc_width;
let sc_height;

var isOutofBound, isStationary, inGoal;
var allRects;
var cupLoc, marbleLoc;
var marble;
var marbleDist;


let prevMarble = {
   x: -1,
   y: -1
}
let stationaryTime = 0;

var client = parseClient();
var trialData = []; // store of all trials
var data;
