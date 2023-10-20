<?php
require(dirname(__DIR__) . '/vendor/autoload.php');

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$servername = $_ENV['SERVER_NAME'];
$username = $_ENV['SERVER_USER'];
$password = '';
$dbname = $_ENV['SERVER_DB_NAME'];

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Successfully connected to the database!";
}
