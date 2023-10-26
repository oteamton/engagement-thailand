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

if ($sessionId) {
    $userData = get_user_data_by_session_id($sessionId);
    if ($userData) {
        echo json_encode([
            'status' => 'success',
            'username' => $userData['username'],
            'email' => $userData['email'],
            'name' => $userData['name'],
            'surname' => $userData['surname'],
            'role' => $userData['role'],
            'role_status' => $userData['status']
        ]);
        exit;
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid session.'
        ]);
        exit;
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'No session provided.'
    ]);
    exit;
}

function get_user_data_by_session_id($sessionId)
{
    global $mysqli;
    $stmt = $mysqli->prepare("
        SELECT users.username, users.email, users.name, users.surname, users_roles.role_name, users_roles_status.status_name
        FROM sessions 
        JOIN users ON sessions.user_id = users.id 
        JOIN users_roles ON users.role_id = users_roles.id   -- Join with user_role table
        JOIN users_roles_status ON users.role_status_id = users_roles_status.id -- Join with user_status table
        WHERE sessions.session_id = ?
    ");

    $stmt->bind_param("s", $sessionId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($username, $email, $name, $surname, $role, $role_status);
        $stmt->fetch();
        $stmt->close();

        return [
            'username' => $username,
            'email' => $email,
            'name' => $name,
            'surname' => $surname,
            'role' => $role,
            'status' => $role_status
        ];
    }

    $stmt->close();
    return false;
}
