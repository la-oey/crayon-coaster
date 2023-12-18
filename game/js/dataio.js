

function readServer(request){  
  debugLog('initiate server read');
  $.ajax({
      dataType: 'json',
      type: 'POST',
      url: expt.readURL,
      data: { 
        request: JSON.stringify(request)
      },
      beforeSend: function(xhr){
          debugLog('request: ' + JSON.stringify(request));
        },
      success: function(data){
          debugLog('success');
          debugLog(data);

          trial.expt = data['Data']['expt'];
          trial.seed = data['Data']['seed'];
          trial.chain = data['Data']['chain'];
          trial.iter = data['Data']['iter'];
          trial.stimuli = data['Data']['stimuli'];
          startTrial();
        },
      error:function(xhr, status, error){
          debugLog('failure loading data');
          debugLog(xhr.responseText);
          debugLog(status);
          debugLog(error);

          genTrial(expt.default.n);
          startTrial();
        }
      });
}            

// function writeServer(data){
// 	debugLog('initiate server write');
//   $.ajax({
//       dataType: 'json',
//       type: 'POST',
//       url: expt.saveURL,
//       data: { data: JSON.stringify(data)},
//         success: function(data){
//           debugLog('success saving data!');
//         },
//         error:function(xhr, status, error){
//           debugLog('failure saving data');
//           debugLog(xhr.responseText);
//           debugLog(status);
//           debugLog(error);
//         }
//       });
// }

// JS equivalent of PHP's $_GET
// function parseURLParams(url) {
//     var queryStart = url.indexOf("?") + 1,
//         queryEnd   = url.indexOf("#") + 1 || url.length + 1,
//         query = url.slice(queryStart, queryEnd - 1),
//         pairs = query.replace(/\+/g, " ").split("&"),
//         parms = {}, i, n, v, nv;

//     if (query === url || query === "") {
//         return;
//     }

//     for (i = 0; i < pairs.length; i++) {
//         nv = pairs[i].split("=");
//         n = decodeURIComponent(nv[0]);
//         v = decodeURIComponent(nv[1]);

//         if (!parms.hasOwnProperty(n)) {
//             parms[n] = [];
//         }

//         parms[n].push(nv.length === 2 ? v : null);
//     }
//     return parms;
// }

function writeServer(data){
	debugLog('initiate server write');
  $.ajax({
      dataType: 'json',
      type: 'POST',
      url: expt.saveURL,
      data: { data: JSON.stringify(data)},
        success: function(data){
          debugLog('success saving data!');
        },
        error:function(xhr, status, error){
          debugLog('failure saving data');
          debugLog(xhr.responseText);
          debugLog(status);
          debugLog(error);
        }
      });
}

// Natalia's save data function
// function writeServer(data) { 
//   debugLog("attempting to write to server");
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', 'saveData.php');
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.onload = function() {
//       if(xhr.status == 200){
//         debugLog(xhr.responseText);
//       }
//     };
//     xhr.send('['+JSON.stringify(data)+']');
// }

