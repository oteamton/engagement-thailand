<?php
require(dirname(__DIR__) . '/../database/connection.php');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

try {
    global $mysqli;

    $stmt = $mysqli->prepare("
        SELECT users.id, users.username, users.email, users_roles.role_name, users_roles_status.status_name 
        FROM users
        JOIN users_roles ON users.role_id = users_roles.id
        JOIN users_roles_status ON users.role_status_id = users_roles_status.id
    ");

    $stmt->execute();
    $stmt->store_result();
    
    $users = [];

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $username, $email, $role_name, $status_name);
        while ($stmt->fetch()) {
            $users[] = [
                'id' => $id,
                'username' => $username,
                'email' => $email,
                'role' => $role_name,
                'role_status' => $status_name
            ];
        }
    }

    $stmt->close();
    echo json_encode(['status' => 'success', 'data' => $users]);

} catch (mysqli_sql_exception $exception) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $exception->getMessage()]);
}
