CREATE DATABASE nomadi;

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    surname VARCHAR(30) NOT NULL,
    password VARCHAR(15) NOT NULL
);

CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    people VARCHAR(255) NOT NULL,
    hotel VARCHAR(255) NOT NULL,
    hotel_photo TEXT NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);