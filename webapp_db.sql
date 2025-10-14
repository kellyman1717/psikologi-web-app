-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2025 at 04:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webapp_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Geography'),
(3, 'History'),
(2, 'Science'),
(4, 'Technology');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `category_id`, `question_text`, `status`) VALUES
(1, 1, 'What is the capital of Japan?', 'Active'),
(2, 1, 'Which river is the longest in the world?', 'Active'),
(3, 1, 'What is the largest desert in the world?', 'Active'),
(4, 1, 'Mount Everest is located in which mountain range?', 'Active'),
(5, 1, 'Which country is known as the Land of the Rising Sun?', 'Active'),
(6, 1, 'What is the smallest continent by land area?', 'Inactive'),
(7, 1, 'Which U.S. state is the largest by area?', 'Active'),
(8, 1, 'What is the capital of Australia?', 'Active'),
(9, 1, 'The Great Barrier Reef is located off the coast of which country?', 'Active'),
(10, 1, 'Which two countries share the longest international border?', 'Active'),
(11, 2, 'What is the chemical symbol for water?', 'Active'),
(12, 2, 'Which planet is known as the Red Planet?', 'Active'),
(13, 2, 'What is the powerhouse of the cell?', 'Active'),
(14, 2, 'What force pulls objects toward the center of the Earth?', 'Inactive'),
(15, 2, 'What is the hardest natural substance on Earth?', 'Active'),
(16, 2, 'How many bones are in the adult human body?', 'Active'),
(17, 2, 'What is the speed of light?', 'Active'),
(18, 2, 'What is the main gas found in the air we breathe?', 'Active'),
(19, 2, 'What process do plants use to make their own food?', 'Active'),
(20, 2, 'What is the boiling point of water at sea level in Celsius?', 'Active'),
(21, 3, 'Who was the first President of the United States?', 'Active'),
(22, 3, 'In which year did the Titanic sink?', 'Active'),
(23, 3, 'The ancient city of Rome was built on how many hills?', 'Active'),
(24, 3, 'Who discovered America in 1492?', 'Active'),
(25, 3, 'What was the main cause of World War I?', 'Inactive'),
(26, 3, 'The Renaissance began in which country?', 'Active'),
(27, 3, 'Who wrote the Declaration of Independence?', 'Active'),
(28, 3, 'What ancient civilization built the pyramids?', 'Active'),
(29, 3, 'Who was the famous queen of ancient Egypt?', 'Active'),
(30, 3, 'In which year did World War II end?', 'Active'),
(31, 4, 'Who is credited with inventing the World Wide Web?', 'Active'),
(32, 4, 'What does \"CPU\" stand for?', 'Active'),
(33, 4, 'Which company developed the first commercially successful personal computer?', 'Active'),
(34, 4, 'What does \"URL\" stand for?', 'Active'),
(35, 4, 'In what year was the first iPhone released?', 'Active'),
(36, 4, 'What is the primary function of RAM in a computer?', 'Active'),
(37, 4, 'Who is the co-founder of Microsoft Corporation?', 'Inactive'),
(38, 4, 'What programming language is commonly used for developing Android apps?', 'Active'),
(39, 4, 'What is \"cloud computing\"?', 'Active'),
(40, 4, 'What is the name of the first electronic general-purpose computer?', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin', 'admin@example.com', '$2b$10$ONX96u.47EWt7bn5vJckbOZnMmTN1EDchVOxVo3uATgXrWuM7B0K6', 'admin', '2025-10-13 08:21:10'),
(2, 'John Doe', 'user@example.com', '$2a$10$w.95gP2jL/3t0jO8n.z14e.1wY.Y5l/9kL6fQ3oE7r5fQ2eP4eP5i', 'user', '2025-10-13 09:35:37'),
(4, 'pc01', 'pc01@gmail.com', '$2b$10$6PPyiiBqcRNO968NDrdrxexE4ND/I9cXigiZFl53578P9j.2gHx/.', 'user', '2025-10-13 09:25:16'),
(5, 'budi', 'budi@gmail.com', '$2b$10$mZQkzivI2Oes5ZBvOBE8wuGLwb0A6hi8L8WN5sPkPxMF06sGKmFcK', 'user', '2025-10-13 09:49:53');

-- --------------------------------------------------------

--
-- Table structure for table `user_assignments`
--

CREATE TABLE `user_assignments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_assignments`
--

INSERT INTO `user_assignments` (`id`, `user_id`, `question_id`) VALUES
(17, 4, 1),
(18, 4, 2),
(27, 4, 8),
(23, 4, 12),
(24, 4, 13),
(25, 4, 14),
(26, 4, 15),
(19, 4, 21),
(20, 4, 22),
(21, 4, 23),
(22, 4, 24);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_assignments`
--
ALTER TABLE `user_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_question_unique` (`user_id`,`question_id`),
  ADD KEY `question_id` (`question_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_assignments`
--
ALTER TABLE `user_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_assignments`
--
ALTER TABLE `user_assignments`
  ADD CONSTRAINT `user_assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_assignments_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
