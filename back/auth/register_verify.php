<?php
require_once(dirname(__DIR__) . '/database/connection.php');
require_once(dirname(__DIR__) . '/utils/email.php');

header('Access-Control-Allow-Origin: *'); // You might want to limit this to specific domains
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->username, $data->name, $data->surname, $data->email, $data->password)) {
    echo json_encode(["message" => "Invalid input"]);
    exit();
}

// Hash the password using bcrypt
$hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);

// Generate a unique token for the user
$token = bin2hex(random_bytes(16));

$stmt = $conn->prepare("INSERT INTO temp_users (username, name, surname, email, password, token) VALUES (?, ?, ?, ?, ?, ?)");

$stmt->bind_param("ssssss", $data->username, $data->name, $data->surname, $data->email, $hashedPassword, $token);

if ($stmt->execute()) {
    // Send an email to the user with the verification link
    $verificationLink = "http://localhost:3000/thanks?token=" . $token;
    $subject = "Please verify your email";
    $messageBody = "Click on this link to verify your email: " . $verificationLink;

    sendEmail($data->email, $subject, $messageBody);
    echo json_encode(["message" => "User registered successfully. Check your email for activation."]);
} else {
    echo json_encode(["message" => "User registration failed. Please try again."]);
    // Detailed error
    error_log("Error: " . $stmt->error);
}

$conn->close();
