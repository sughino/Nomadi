<?php
    include_once 'connect.php';
    
    $email= $_POST['email'];
    $psw = $_POST['psw'];

    $email = mysqli_real_escape_string($conn, $email);
    $psw = mysqli_real_escape_string($conn, $psw);

    $query_check = "SELECT * FROM users WHERE email = '$email' AND password = '$psw'";
    $result_check = $conn->query($query_check);
    
    if ($result_check->num_rows == 0) {
        $query_check = "SELECT * FROM users WHERE email = '$email'";
        $result_check = $conn->query($query_check);
        if ($result_check->num_rows == 0) {
            echo "Error, the user does not exist";
            http_response_code(400);
        } else {
            echo "Error, wrong email or password";
            http_response_code(400);
        }
    } else {
        http_response_code(200);
        session_start();
        $sql = "SELECT name, surname FROM users WHERE email = '$email'";
        $result = mysqli_query($conn, $sql);
        while ($row = mysqli_fetch_assoc($result)) {
            $_SESSION['username'] = $row['name'] . " " . $row['surname'];
            echo $_SESSION['username'];
        }
        $_SESSION['email'] = $email;
    }
?>