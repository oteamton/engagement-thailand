<?php
require(dirname(__DIR__) . '/database/connection.php');

session_start();

header('Access-Control-Allow-Origin: http://localhost:3000'); // When deplay need to change this
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true'); // For cookies
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data['username'] || !$data['password']) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
    exit;
}

$username = filter_var($data['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$password = $data['password'];

$user = authenticate_user($mysqli, $username, $password);

if ($user['authenticated']) {
    $sessionId = generate_session_id();
    if (store_session_id($mysqli, $sessionId, $user['id'])) {
        setcookie('session_id', $sessionId, [
            'expires' => time() + 3600, // 1 hour
            'path' => '/',
            'domain' => 'localhost',
            // 'secure' => true,
            'httponly' => true,
            'samesite' => 'strict'
        ]);
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'session_id' => $sessionId,
            'username' => $username,
            'role' => $user['role_id']
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Session storage failed."]);
    }
} else {
    if (!$user['user_found']) {
        // User not found in database
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "User not found."]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    }
}

function authenticate_user($mysqli, $username, $password)
{
    $stmt = $mysqli->prepare("SELECT id, password, role_id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    $userId = null;
    $hashed_password = null;
    $role = null;

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($userId, $hashed_password, $role);
        $stmt->fetch();

        if ($hashed_password && password_verify($password, $hashed_password)) {
            return [
                'authenticated' => true,
                'id' => $userId,
                'role_id' => $role,
                'user_found' => true
            ];
        }
    }

    return [
        'authenticated' => false,
        'id' => null,
        'role' => null,
        'user_found' => $stmt->num_rows > 0 // User found or not
    ];
}

function generate_session_id()
{
    $bytes = openssl_random_pseudo_bytes(32);
    return bin2hex($bytes);
}

function store_session_id(mysqli $mysqli, string $sessionId, int $userId): bool
{
    // Use prepared statements to prevent SQL injection
    $stmt = $mysqli->prepare("SELECT session_id FROM sessions WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->store_result();

    $success = false; // To hold the status of session storage

    if ($stmt->num_rows > 0) {
        $stmt->close(); // Close the previous statement
        // Update the existing session entry for the user
        $update_stmt = $mysqli->prepare("UPDATE sessions SET session_id = ?, created_at = current_timestamp() WHERE user_id = ?");
        $update_stmt->bind_param("si", $sessionId, $userId);
        $update_stmt->execute();
        $success = $update_stmt->affected_rows > 0;
        $update_stmt->close();
    } else {
        $stmt->close(); // Close the previous statement
        // Create a new session entry for the user
        $insert_stmt = $mysqli->prepare("INSERT INTO sessions (session_id, user_id) VALUES (?, ?)");
        $insert_stmt->bind_param("si", $sessionId, $userId);
        $insert_stmt->execute();
        $success = $insert_stmt->affected_rows > 0;
        $insert_stmt->close();
    }

    // Close the database connection
    $mysqli->close();
    return $success;
}

// Handle session expiration.
function handle_session_expiry($mysqli, $userId)
{
    $stmt = $mysqli->prepare("DELETE FROM sessions WHERE user_id = ? AND created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->close();
}
