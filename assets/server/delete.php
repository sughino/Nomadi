<?php 
    include_once 'connect.php';
    session_start();

    $email = $_SESSION['email'];

    $sql = "DELETE FROM Users WHERE Email = '$email'";
    if (!($conn->query($sql) === TRUE)) {
        http_response_code(400);
    }
    session_destroy();
    http_response_code(200);
?>