<?php 
    include_once 'connect.php';
    session_start();

    $email = $_SESSION['email'];
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $psw = $_POST['psw'];

    $name = mysqli_real_escape_string($conn, $name);
    $surname = mysqli_real_escape_string($conn, $surname);
    $password = mysqli_real_escape_string($conn, $psw);

    $query_check = "UPDATE users
                    SET name = '$name', surname = '$surname', password = '$psw'
                    WHERE email = '$email'";
    $result_check = $conn->query($query_check);
    $_SESSION['username'] = $name . " " . $surname;
    echo $_SESSION['username'];
    http_response_code(200);
?>