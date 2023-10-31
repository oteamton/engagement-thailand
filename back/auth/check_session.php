<?php
require(dirname(__DIR__) . '/database/connection.php');

session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Check if the session cookie is set
if (isset($_COOKIE['session_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'No session found.']);
    exit;
}

$sessionId = $_COOKIE['session_id'];

// Database query to check if the session exists
$stmt = $mysqli->prepare("SELECT user_id FROM sessions WHERE session_id = ?");
$stmt->bind_param("s", $sessionId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Session is valid
    echo json_encode(['status' => 'valid', 'message' => 'Session is active.']);
} else {
    // Session is not valid
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'Session is not active.']);
}

$stmt->close();
$mysqli->close();