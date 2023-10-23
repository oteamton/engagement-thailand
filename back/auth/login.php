<?php

$username = $_POST['username'];
$password = $_POST['password'];

// Authenticate the user against the database.
$user = authenticate_user($username, $password);

if ($user['authenticated']) {
    // Generate a session ID.
    $sessionId = generate_session_id();

    // Set the session ID in a cookie.
    setcookie('session_id', $sessionId, time() + 60 * 60 * 24, '/', '.example.com');

    // Respond with the session ID and the user's role.
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'session_id' => $sessionId,
        'role' => $user['role']
    ]);
} else {
    // Respond with an error message.
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid username or password.'
    ]);
}

function authenticate_user($username, $password)
{
    global $mysqli;

    $stmt = $mysqli->prepare("SELECT id, password, role FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($userId, $hashed_password, $role);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            return [
                'authenticated' => true,
                'id' => $userId,
                'role' => $role
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
