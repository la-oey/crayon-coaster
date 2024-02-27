// experiment settings
var trialOrder = [];
var rateDims = ["cool", "unique", "feasible"];

var expt = {
    saveURL: 'submit.simple.php',
    rateDim: "", 
    totaltrials: 0,
    successtrials: 0,
    maxInstruct: 2,
    pilot: false,
    debug: false,
    instructSurvey: [],
    endSurvey: null,
    demographic: null
};
var trial = {
    numtrial : 0,
    ratedtrial: "",
    rating: -1,
    trialStartTime: 0,
    duration: 0
}

var physSettings = {
    planet : [
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
        }
    ],
    bounciness: 1 //[0, 1]
}

var trainingIndices = {};
trainingIndices["wide"] = [0, 1, 3, 7, 8];
trainingIndices["narrow"] = [5, 6, 9, 11, 12];

var startPage = "consent"; //"consent";
var client = parseClient();
var trialdata = []; // store all trial data
var data; // store all data, including trial data
var surveyseconds = 20; //shortened from 30 seconds