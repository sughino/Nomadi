<?php
    include_once 'connect.php';
    session_start();

    $email = $_SESSION['email'];
    $query_check = "SELECT t.* FROM users u JOIN trips t ON u.email = t.email WHERE u.email = '$email'";
    $result_check = $conn->query($query_check);

    $hotels_data = [];

    if ($result_check) {
        $num_rows = $result_check->num_rows;

        if ($num_rows > 0) {
            while ($row = $result_check->fetch_assoc()) {
            $hotels_data[] = $row;
            }
            $json_data = json_encode($hotels_data);
            header('Content-Type: application/json');
            echo $json_data;
        } else {
            http_response_code(400);
        }
    } else {
        http_response_code(400);
    }
?>