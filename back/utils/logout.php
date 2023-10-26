<?php
require(dirname(__DIR__) . '/database/connection.php');

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: http://localhost:3000');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

header('Content-Type: application/json');

$sessionId = $_COOKIE['session_id'] ?? null;

session_start();

// Invalidate the session
session_destroy();

http_response_code(200);
echo json_encode(["status" => "success", "message" => "Logged out successfully"]);

function delete_session($sessionId)
{
    global $mysqli;

    // Use prepared statements to prevent SQL injection
    $stmt = $mysqli->prepare("DELETE FROM sessions WHERE session_id = ?");
    $stmt->bind_param("s", $sessionId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $stmt->close();
        $mysqli->close();
        return true;
    }

    $stmt->close();
    $mysqli->close();

    return false;
}
