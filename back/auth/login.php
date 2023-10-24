<?php
require(dirname(__DIR__) . '/database/connection.php');

session_start();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = $data['password'];


$user = authenticate_user($mysqli, $username, $password);

if ($user['authenticated']) {
    // Generate a session ID.
    $sessionId = generate_session_id();

    // Store session ID in the database with the user's ID
    store_session_id($sessionId, $user['id']);

    // Set the session ID in a cookie.
    setcookie('session_id', $sessionId, time() + 60 * 60 * 24, '/', 'localhost');

    // Respond with the session ID and the user's role.
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'session_id' => $sessionId,
        'username' => $username,
        'role' => $user['role_id']
    ]);
} else {
    // Respond with an error message.
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid username or password.'
    ]);
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
                'role_id' => $role
            ];
        }
    }

    return [
        'authenticated' => false,
        'id' => null,
        'role' => null
    ];
}

function generate_session_id()
{
    $bytes = openssl_random_pseudo_bytes(32);
    return bin2hex($bytes);
}

/**
 * Stores the session ID in the session store.
 * 
 * @param string $sessionId The generated session ID.
 * @param int $userId The ID of the authenticated user.
 * @return bool Indicates whether the session ID was stored successfully.
 */
function store_session_id($sessionId, $userId)
{
    global $mysqli;

    // First, check if a session already exists for this user, and if so, update it.
    // This ensures that a user doesn't accumulate a large number of session entries in the table.
    $stmt = $mysqli->prepare("SELECT session_id FROM sessions WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->close();

        // Update the existing session entry for the user.
        $update_stmt = $mysqli->prepare("UPDATE sessions SET session_id = ? WHERE user_id = ?");
        $update_stmt->bind_param("si", $sessionId, $userId);
        $update_stmt->execute();

        // If at least one row was affected, the update was successful.
        $success = $update_stmt->affected_rows > 0;
        $update_stmt->close();
        return $success;
    }

    $stmt->close();

    // If no existing session entry for the user was found, create a new one.
    $insert_stmt = $mysqli->prepare("INSERT INTO sessions (session_id, user_id) VALUES (?, ?)");
    $insert_stmt->bind_param("si", $sessionId, $userId);
    $insert_stmt->execute();

    // If at least one row was affected, the insertion was successful.
    $success = $insert_stmt->affected_rows > 0;
    $insert_stmt->close();

    return $success;
}
