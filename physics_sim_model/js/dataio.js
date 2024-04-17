
 


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
      error: function(xhr, status, error){
          debugLog('failure saving data');
          debugLog(xhr.responseText);
          debugLog(status);
          debugLog(error);
      }
  });
}

// function writeImgServer(data){
//   if(!expt.debug){
//       $.ajax({
//       type: "POST",
//       url: expt.imgURL,
//       data: { img: data, 
//         name: client.sid},
//       }).done(function(o) {
//         debugLog('success saving image'); 
//       })
//   }
// }
