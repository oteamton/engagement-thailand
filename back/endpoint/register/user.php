<?php
require_once(dirname(__DIR__) . '/../database/connection.php');

header('Access-Control-Allow-Origin: *'); // You might want to limit this to specific domains
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($_GET['token'])) {
    $token = $_GET['token'];
    echo $token;
} else {
    // Handle the case where the token is not set
    die("Token not provided");
}

// Use prepared statements to avoid SQL injection
$stmt = $conn->prepare("SELECT * FROM temp_users WHERE token = ?");
$stmt->bind_param("s", $token);  // 's' specifies the variable type => 'string'

$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    $stmt_insert = $conn->prepare("INSERT INTO users (username, name, surname, email, password) VALUES (?, ?, ?, ?, ?)");
    $stmt_insert->bind_param("sssss", $user['username'], $user['name'], $user['surname'], $user['email'], $user['password']);

    if ($stmt_insert->execute()) {
        // Delete the token and temporary user data
        $stmt_delete = $conn->prepare("DELETE FROM temp_users WHERE token = ?");
        $stmt_delete->bind_param("s", $token);
        $stmt_delete->execute();

        echo "User verified successfully!";
    } else {
        echo "Error verifying the user.";
    }
} else {
    echo "Invalid verification link or token has expired.";
}

$conn->close();
