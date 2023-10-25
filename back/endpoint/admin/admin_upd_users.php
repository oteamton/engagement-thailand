<?php
require(dirname(__DIR__) . '/../database/connection.php');

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$input = json_decode(file_get_contents('php://input'), true);

if(isset($input['user_id']) && isset($input['role_status_id'])) {
  $userId = $input['user_id'];
  $newStatusRoleId = $input['role_status_id'];

  $stmt = $mysqli->prepare("UPDATE users SET role_status_id = ? WHERE id = ?");
  $stmt->bind_param("ii", $newStatusRoleId, $userId);

  if($stmt->execute()) {
    echo json_encode(['status' => 'success']);
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Could not update role']);
  }
} else {
  echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
}
