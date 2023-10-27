<?php
require_once(dirname(__DIR__) . '/database/connection.php');
require_once(dirname(__DIR__) . '/utils/email.php');

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->username, $data->name, $data->surname, $data->email, $data->password)) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Invalid input"]);
    exit();
}

// Validate and sanitize user inputs
$username = filter_var($data->username, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$name = filter_var($data->name, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$surname = filter_var($data->surname, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email = filter_var($data->email, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Password policy requirements
$password = $data->password; // Add your password policy checks here

// Hash the password using bcrypt
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Generate a unique token for the user
$token = bin2hex(random_bytes(16));

// Prepare email content
$verificationLink = "http://localhost:3000/thanks?token=" . $token; // Replace with your domain
$subject = "Please verify your email";
$messageBody = "Click on this link to verify your email: " . $verificationLink;

// Try sending the email first
if (sendEmail($email, $subject, $messageBody)) {

    $stmt = $mysqli->prepare("INSERT INTO temp_users (username, name, surname, email, password, token) VALUES (?, ?, ?, ?, ?, ?)");

    if ($stmt) {
        $stmt->bind_param("ssssss", $username, $name, $surname, $email, $hashedPassword, $token);

        if ($stmt->execute()) {
            http_response_code(201); // Created
            echo json_encode(["message" => "User registered successfully. Check your email for activation."]);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(["message" => "User registration failed. Please try again."]);
            // Detailed error
            error_log("Error: " . $stmt->error);
        }

        $stmt->close();
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["message" => "Database error. Please try again later."]);
    }
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Failed to send verification email."]);
}

$mysqli->close();
