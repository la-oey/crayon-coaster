<?php

// this path should point to your configuration file.
include('database_config.php');

function ajax_error($code, $message){
	header('content-type: application/json; charset=utf-8');
	header("access-control-allow-origin: *");
	$output = array('Success' => false,
			   		'Error' => $code,
			   		'Message' => $message);
	echo json_encode($output);
	die();
}


function ajax_return($contents){
	header('content-type: application/json; charset=utf-8');
	header("access-control-allow-origin: *");
	$output = array('Success' => true,
			   		'Data' => $contents);
	echo json_encode($output);
	die();
}


	$data = json_decode($_REQUEST['data'], true);

	$rawfile = sprintf('%s/%s/%s.json', 'data', 'json', $data['client']['sid']);
	$fp = fopen($rawfile, 'w');
	fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
	fclose($fp);

	ajax_return('success');

