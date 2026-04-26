<?php
    include_once 'connect.php';
    session_start();

    $email = $_SESSION['email'];
    $hotel = $_POST['hotel'];
    $place = $_POST['place'];
    $start= $_POST['start'];
    $end = $_POST['end'];
    $people = $_POST['people'];
    $photo = $_POST['photo'];

    $photo = mysqli_real_escape_string($conn, $photo);

    $query_check = "SELECT * FROM users WHERE email = '$email'";
    $result_check = $conn->query($query_check);
    
    $sql = "INSERT INTO trips (email, location, start_date, end_date, people, hotel, hotel_photo)
            VALUES ('$email', '$place', '$start', '$end', '$people', '$hotel', '$photo')";
    $conn->query($sql);
    http_response_code(200);
?>