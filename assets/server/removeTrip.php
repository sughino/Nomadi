<?php 
    include_once 'connect.php';
    session_start();

    $email = $_SESSION['email'];
    $id = $_POST['id'];

    $sql = "DELETE FROM trips WHERE email = '$email' AND id = '$id'";
    if (!($conn->query($sql) === TRUE)) {
        http_response_code(400);
    }
    http_response_code(200);
?>