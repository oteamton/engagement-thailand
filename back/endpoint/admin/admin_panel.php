<?php
require(dirname(__DIR__) . '/../database/connection.php');

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->userId) || !isset($data->role)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request data']);
    exit();
}

$userId = $data->userId;
$role = $data->role;

try {

    $stmt = $mysqli->prepare("UPDATE users SET role_status_id = 1 WHERE id = ? AND role = ?");
    
    $stmt->bind_param("is", $userId, $role);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Role activated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to activate role']);
    }

    $stmt->close();
    
} catch (mysqli_sql_exception $exception) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $exception->getMessage()]);
}