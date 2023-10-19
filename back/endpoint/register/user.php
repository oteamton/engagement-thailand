<?php
require_once '../../database/connection.php';

$token = $_GET['token'];

// Get the user's data using the token
$sql = "SELECT * FROM temp_users WHERE token = '$token'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Insert the user into the main users table
    $sql_insert = "INSERT INTO users (username, name, surname, email, password) VALUES ('{$user['username']}', '{$user['name']}', '{$user['surname']}', '{$user['email']}', '{$user['password']}')";
    
    if ($conn->query($sql_insert) === TRUE) {
        // Delete the token and temporary user data
        $conn->query("DELETE FROM temp_users WHERE token = '$token'");
        echo "User verified successfully!";
    } else {
        echo "Error verifying the user.";
    }
} else {
    echo "Invalid verification link or token has expired.";
}

$conn->close();
?>
