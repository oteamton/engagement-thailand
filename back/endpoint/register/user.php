<?php
require_once(dirname(__DIR__) . '/../database/connection.php');

header('Access-Control-Allow-Origin: http://localhost:3000'); 
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? null;

// Validate the token
if (!$token || strlen($token) !== 32) {
    sendResponse("Invalid token", "error");
    exit;
}

try {
    // Begin transaction
    $mysqli->begin_transaction();

    $stmt = $mysqli->prepare("SELECT * FROM temp_users WHERE token = ? LIMIT 1");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result || $result->num_rows === 0) {
        sendResponse("Invalid verification link or token has expired.", "error");
        exit;
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    $stmt_insert = $mysqli->prepare("INSERT INTO users (username, name, surname, email, password) VALUES (?, ?, ?, ?, ?)");
    $stmt_insert->bind_param("sssss", $user['username'], $user['name'], $user['surname'], $user['email'], $user['password']);
    $stmt_insert->execute();
    $stmt_insert->close();

    // Delete from temp_users
    $stmt_delete = $mysqli->prepare("DELETE FROM temp_users WHERE token = ?");
    $stmt_delete->bind_param("s", $token);
    $stmt_delete->execute();
    $stmt_delete->close();

    // Commit transaction
    $mysqli->commit();
    
} catch (Exception $e) {
    $mysqli->rollback();
    error_log($e->getMessage());
    sendResponse("An error occurred. Please try again later.", "error");
    exit;
}

// Send a success response to the client
sendResponse("User verified successfully!", "success");

$mysqli->close();

function sendResponse($message, $status)
{
    echo json_encode(["message" => $message, "status" => $status]);
    exit;
}

function sendResponseToConsole($message, $status)
{
    echo "<script>console.log('$message - $status');</script>";
}
