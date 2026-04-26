<?php
    include_once 'connect.php';
    session_start();

    $email = $_SESSION['email'];
    $query_check = "SELECT * FROM users WHERE email = '$email'";
    $result_check = $conn->query($query_check);

    if ($result_check) {
        $user_data = $result_check->fetch_assoc();
        $json_data = json_encode($user_data);
        header('Content-Type: application/json');
        echo $json_data;
    }

?>