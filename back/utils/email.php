<?php
require_once(dirname(__DIR__) . '/vendor/autoload.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

function sendEmail($email, $subject = "Verify your email address", $messageBody)
{
    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->SMTPDebug = 2; // Enable verbose debug output
        $mail->isSMTP(); // Set mailer to use SMTP
        $mail->Host = 'smtp.gmail.com'; // Specify main and backup SMTP servers
        $mail->Port = 465; // TCP port to connect to
        $mail->SMTPSecure = 'ssl'; // Enable TLS encryption, `ssl` also accepted
        $mail->Username = $_ENV['SMTP_USER']; // SMTP username
        $mail->Password = $_ENV['SMTP_PASS']; // SMTP password  
        $mail->SMTPAuth = true; // Enable SMTP authentication
                      
        //Recipients
        $mail->setFrom($_ENV['SMTP_USER'], $_ENV['SMTP_APP_NAME']);
        $mail->addAddress($email);                                     // Add a recipient

        // Content
        $mail->isHTML(true);                                        // Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body = $messageBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mail sending failed: " . $mail->ErrorInfo);  // Logging the error
        return false;
    }
}
