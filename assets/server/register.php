<?php
    include_once 'connect.php';
    
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $email= $_POST['email'];
    $psw = $_POST['psw'];

    $name = mysqli_real_escape_string($conn, $name);
    $surname = mysqli_real_escape_string($conn, $surname);
    $email = mysqli_real_escape_string($conn, $email);
    $psw = mysqli_real_escape_string($conn, $psw);

    $query_check = "SELECT * FROM users WHERE email = '$email'";
    $result_check = $conn->query($query_check);
    
    if ($result_check->num_rows == 0) {
        $sql = "INSERT INTO users (email, name, surname, password)
            VALUES ('$email', '$name', '$surname', '$psw');";
        $conn->query($sql);
        http_response_code(200);
        session_start();
        $_SESSION['email'] = $email;
        $_SESSION['username'] = $name . " " . $surname;
        echo $_SESSION['username'];
    } else {
        echo "Error user already signed";
        http_response_code(400);
    }
?>