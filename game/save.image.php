<?php
	header('Access-Control-Allow-Origin: *'); 
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); 
	header('Access-Control-Allow-Methods: Content-Type'); 
	// Ensure that the 'img' and 'name' parameters are set in the POST request
	if (!isset($_POST['img']) || !isset($_POST['name'])) {
	    http_response_code(400);
	    echo "Missing parameters";
	    exit();
	}

	$img = $_POST['img'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);

	// Ensure decoding was successful
	if ($data === false) {
	    http_response_code(500);
	    echo "Failed to decode image data";
	    exit();
	}


	$dataDir = "data/img/" . $_POST['name'] . "/";
	if (!file_exists($dataDir)) {
		// 0755 (directory, permissions mode, recursive = true for creating full path)) 
		if (!mkdir($dataDir, 0777, true)) {	// 0644, 0750, 0755 //0777 for full permissions						
			print_r($_SERVER);
			die("Failed to create directory!\n$dataDir");
		}
		chmod($dataDir, 0777);
		chmod("data/img", 0777);
	} else {
		// print_r("Writing to $dataDir\n");
	}

	$i = 0;
	while(file_exists($upload_name = $dataDir. $_POST['name'] . '_img' . $i . '.png')) {
		$i++;
	}

	if(file_put_contents($upload_name, $data)) {
		http_response_code(200);
    	echo "Image saved successfully";
	} else{
		http_response_code(500);
    	echo "Failed to save image";
	}

?>
