<?php
require_once(dirname(__DIR__) . '/database/connection.php');
require_once(dirname(__DIR__) . '/utils/email.php');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', '1');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Retrieve the session ID from cookie
$sessionId = $_COOKIE['session_id'] ?? null;

$data = json_decode(file_get_contents("php://input"), true);
$user = $data['username'];
$id = $data['id'];

// Database query to check if the session exists and is not expired
$sessionQuery = "SELECT * FROM sessions WHERE session_id = ? AND expiration_time > NOW()";
$sessionStatement = $mysqli->prepare($sessionQuery);
$sessionStatement->bind_param("s", $sessionId);
$sessionStatement->execute();
$sessionResult = $sessionStatement->get_result();
$session = $sessionResult->fetch_assoc();

if (!$session) {
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'No valid session found.']);
    exit;
}

// SQL query for inserting user data
$sql = "INSERT INTO users 
        (role_id, role_status_id, role_type_id, organization_name, user_name, user_surname, user_email, user_phone, user_lineId,
         user_address, user_city, user_province, user_postcode, user_country, contact_name, contact_surname, contact_email, contact_phone, contact_lineId,
         institution_name, institution_addresss, institution_city, institution_province, institution_postcode, institution_country,
         representative_name, representative_surname, representative_email, representative_phone, representative_lineId,
         alternate_name, alternate_surname, alternate_email, alternate_phone, alternate_lineId,
         receipt_name, receipt_taxNumber, receipt_address, receipt_province, receipt_postcode, receipt_country, receipt_city)
        VALUES 
        (?, '1', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

try {
    $mysqli->begin_transaction();

    $stmt_insert = $mysqli->prepare($sql);
    $stmt_insert->bind_param(
        "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
        $data['role_id'],
        $data['role_status_id'],
        $data['role_type_id'],
        $data['organization_name'],
        $data['user_name'],
        $data['user_surname'],
        $data['user_email'],
        $data['user_phone'],
        $data['user_lineId'],
        $data['user_address'],
        $data['user_city'],
        $data['user_province'],
        $data['user_postcode'],
        $data['user_country'],
        $data['contact_name'],
        $data['contact_surname'],
        $data['contact_email'],
        $data['contact_phone'],
        $data['contact_lineId'],
        $data['institution_name'],
        $data['institution_addresss'],
        $data['institution_city'],
        $data['institution_province'],
        $data['institution_postcode'],
        $data['institution_country'],
        $data['representative_name'],
        $data['representative_surname'],
        $data['representative_email'],
        $data['representative_phone'],
        $data['representative_lineId'],
        $data['alternate_name'],
        $data['alternate_surname'],
        $data['alternate_email'],
        $data['alternate_phone'],
        $data['alternate_lineId'],
        $data['receipt_name'],
        $data['receipt_taxNumber'],
        $data['receipt_address'],
        $data['receipt_province'],
        $data['receipt_postcode'],
        $data['receipt_country'],
        $data['receipt_city']
    );
    $stmt_insert->execute();
    $stmt_insert->close();

    // Commit transaction
    $mysqli->commit();

    echo json_encode(['status' => 'success', 'message' => 'Record inserted successfully']);
} catch (Exception $e) {
    $mysqli->rollback();
    error_log($e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'An error occurred. Please try again later.']);
    exit;
}