<?php
require(dirname(__DIR__) . '/../database/connection.php');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', '1');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); 

// Retrieve the session ID from cookie
$sessionId = $_COOKIE['session_id'] ?? null;