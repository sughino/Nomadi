<?php
    session_start();
    unset($_SESSION['username']);
    unset($_SESSION['email']);
    session_destroy();
    http_response_code(200);
?>