<?php
    session_start();
    if (isset($_SESSION['email']) || isset($_SESSION['username'])) { 
        echo $_SESSION['username'];
        http_response_code(200);
    } else {
        http_response_code(400);
    }
?>