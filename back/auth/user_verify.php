<?php
require_once '../../database/connection.php';
require_once '../../utils/email.php';

header('Access-Control-Allow-Origin: *'); // You might want to limit this to specific domains
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Generate a unique token for the user
$token = bin2hex(random_bytes(16));

// Insert the user's data into a temporary table
$sql = "INSERT INTO temp_users (username, name, surname, email, password, token) VALUES ('{$data->username}', '{$data->name}', '{$data->surname}', '{$data->email}', '{$data->password}', '$token')";

if ($conn->query($sql) === TRUE) {
    // Send an email to the user with the verification link
    $verificationLink = "http://localhost:8000/endpoints/auth/user_verify.php?token=" . $token;
    $messageBody = "Click on this link to verify your email: " . $verificationLink;

    sendEmail($data->email, "Verify your email address", $messageBody);

    echo json_encode(["message" => "User registered successfully. Check your email for activation."]);
} else {
    echo json_encode(["message" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>
