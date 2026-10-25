-- ==============================================================================
-- STAYVIA DATABASE SCHEMA (MySQL 8.0+)
-- Hostel & PG Finder – Student Accommodation and Mess Management Platform
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS stayvia_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stayvia_db;

-- ------------------------------------------------------------------------------
-- 1. Users Table
-- Stores Students, Accommodation Owners, Mess Providers, and Administrators
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'owner', 'mess_provider', 'admin') NOT NULL DEFAULT 'student',
  phone VARCHAR(20) NULL,
  college_or_company VARCHAR(150) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 2. Accommodations Table
-- Hostels, Paying Guest (PG) facilities, and shared student flats
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  tagline VARCHAR(255) NULL,
  description TEXT NULL,
  property_type ENUM('Hostel', 'PG', 'Flat') NOT NULL DEFAULT 'PG',
  gender_category ENUM('Boys', 'Girls', 'Co-ed') NOT NULL DEFAULT 'Co-ed',
  address VARCHAR(255) NOT NULL,
  area VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  nearby_college VARCHAR(150) NOT NULL,
  distance_to_campus VARCHAR(100) NOT NULL,
  monthly_rent DECIMAL(10, 2) NOT NULL,
  security_deposit DECIMAL(10, 2) NOT NULL,
  deposit_note VARCHAR(100) DEFAULT '1 Month Security Deposit',
  occupancy_types VARCHAR(150) DEFAULT 'Single, Double Sharing',
  facilities JSON NULL,
  house_rules JSON NULL,
  image_url VARCHAR(500) NULL,
  available_rooms INT DEFAULT 1,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  reviews_count INT DEFAULT 0,
  status ENUM('active', 'pending_approval', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_acc_city_area (city, area),
  INDEX idx_acc_type (property_type),
  INDEX idx_acc_rent (monthly_rent),
  INDEX idx_acc_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 3. Mess Services Table
-- Meal providers, monthly mess subscriptions, and student tiffins
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mess_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  cuisine VARCHAR(100) NOT NULL,
  diet_type ENUM('Pure Vegetarian', 'Veg & Non-Veg', 'Jain Option Available') NOT NULL DEFAULT 'Pure Vegetarian',
  coverage_areas VARCHAR(255) NOT NULL,
  monthly_starting_price DECIMAL(10, 2) NOT NULL,
  delivery_available BOOLEAN DEFAULT TRUE,
  trial_available BOOLEAN DEFAULT TRUE,
  sample_menu JSON NULL,
  highlights JSON NULL,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  reviews_count INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_mess_diet (diet_type),
  INDEX idx_mess_price (monthly_starting_price)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 4. Inquiries / Tour Bookings Table
-- Connects prospective students with hostel/PG owners
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  accommodation_id INT NOT NULL,
  student_id INT NULL,
  student_name VARCHAR(120) NOT NULL,
  student_email VARCHAR(160) NOT NULL,
  student_phone VARCHAR(20) NOT NULL,
  preferred_visit_date DATE NULL,
  message TEXT NULL,
  status ENUM('new', 'contacted', 'scheduled', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_inquiry_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 5. Accommodation Reviews Table
-- Verified reviews and ratings left by students
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  accommodation_id INT NOT NULL,
  student_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_review (accommodation_id, student_id)
) ENGINE=InnoDB;
