CREATE DATABASE NTC;

USE NTC;

CREATE TABLE country(
    id INT NOT NULL AUTO_INCREMENT,
    country_name VARCHAR(255) NOT NULL UNIQUE,
    ISO VARCHAR(3),
    PRIMARY KEY (id)
);

CREATE TABLE address(
    id INT NOT NULL AUTO_INCREMENT,
    unit_number VARCHAR(255),
    street_number INT,
    city VARCHAR(255),
    region VARCHAR(255),
    postal_code VARCHAR(255),
    country_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (country_id) REFERENCES country(id)
);


CREATE TABLE customUser(
    id INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    UUID VARCHAR(255) UNIQUE,
    email VARCHAR(255),
    age VARCHAR(255),
    password VARCHAR(255),
    phoneNum VARCHAR(255),
    sex VARCHAR(255),
    address INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (address) REFERENCES address(id)
);

CREATE TABLE googleUser(
    id INT NOT NULL AUTO_INCREMENT,
    UUID VARCHAR(255) UNIQUE,
    email VARCHAR(255),
    sub INT NOT NULL,
    given_name VARCHAR(255),
    family_name VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE status(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE GUfiles(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    name VARCHAR(255),
    user INT NOT NULL,
    status INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user) REFERENCES googleUser(id),
    FOREIGN KEY (status) REFERENCES status(id)
);
CREATE TABLE CUfiles(
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    name VARCHAR(255),
    user INT NOT NULL,
    status INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user) REFERENCES customUser(id),
    FOREIGN KEY (status) REFERENCES status(id)
);