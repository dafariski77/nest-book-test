-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS book;

-- Create the user if it doesn't exist
CREATE USER IF NOT EXISTS 'mysqluser'@'%' IDENTIFIED BY 'mysqlpassword';

-- Grant all privileges including the ability to create databases
GRANT ALL PRIVILEGES ON *.* TO 'mysqluser'@'%' WITH GRANT OPTION;

-- Apply the changes
FLUSH PRIVILEGES;