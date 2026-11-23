CREATE DATABASE IF NOT EXISTS suedo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'suedo_user'@'localhost' IDENTIFIED BY 'SuedoPass123!';
GRANT ALL PRIVILEGES ON suedo_db.* TO 'suedo_user'@'localhost';
FLUSH PRIVILEGES;