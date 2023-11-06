-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 06, 2023 at 12:31 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sky_survey_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `certificate_data` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ResponseId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `certificate_data`, `createdAt`, `updatedAt`, `ResponseId`) VALUES
(1, 'uploads/CertificateOfCompletion_Learning SQL Programming.pdf', '2023-11-06 11:11:06', '2023-11-06 11:11:06', 1),
(2, 'uploads/Owen\'s CV.pdf', '2023-11-06 11:11:06', '2023-11-06 11:11:06', 1),
(3, 'uploads/Zuri Training Certificate.pdf', '2023-11-06 11:11:06', '2023-11-06 11:11:06', 1),
(4, 'uploads/Data Analysis Certificate.pdf', '2023-11-06 11:12:11', '2023-11-06 11:12:11', 2),
(5, 'uploads/Data Analysis Certificate.pdf', '2023-11-06 11:14:07', '2023-11-06 11:14:07', 3),
(6, 'uploads/Sky World Limited - Software Engineering Pre-Interview Task (1).pdf', '2023-11-06 11:14:07', '2023-11-06 11:14:07', 3),
(7, 'uploads/Sky World Limited - Software Engineering Pre-Interview Task (1).pdf', '2023-11-06 11:14:47', '2023-11-06 11:14:47', 4),
(8, 'uploads/Data Analysis Certificate.pdf', '2023-11-06 11:23:30', '2023-11-06 11:23:30', 5),
(9, 'uploads/Sky World Limited - Software Engineering Pre-Interview Task (1).pdf', '2023-11-06 11:24:12', '2023-11-06 11:24:12', 6);

-- --------------------------------------------------------

--
-- Table structure for table `responses`
--

CREATE TABLE `responses` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `gender` varchar(255) NOT NULL,
  `programming_stack` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `responses`
--

INSERT INTO `responses` (`id`, `full_name`, `email_address`, `description`, `gender`, `programming_stack`, `createdAt`, `updatedAt`) VALUES
(1, 'Owen Miano Kabugi', 'owenmiash90@gmail.com', 'I am a full stack developer, who can design and develop software on the server side and has expertise in logic and databases. That is to ensure a software can run as it should.', 'Male', 'REACT,SQL,MYSQL', '2023-11-06 11:11:06', '2023-11-06 11:11:06'),
(2, 'Maryanne Muthoni Soni', 'mary90@gmail.com', 'I am very professional in backend development', 'Female', 'ANGULAR,VUE,SQL', '2023-11-06 11:12:11', '2023-11-06 11:12:11'),
(3, 'John Doe Mwangi', 'johndoe90@gmail.com', 'I am very professional in frontend development', 'Male', 'ANGULAR,Java,PHP', '2023-11-06 11:14:07', '2023-11-06 11:14:07'),
(4, 'June Akisha Mueni', 'june90@gmail.com', 'I am very professional in backend development', 'Female', 'ANGULAR', '2023-11-06 11:14:47', '2023-11-06 11:14:47'),
(5, 'Carol Wambui', 'carol90@gmail.com', 'I am very professional in mobile development', 'Female', 'REACT,SQL', '2023-11-06 11:23:30', '2023-11-06 11:23:30'),
(6, 'James Agwambo', 'agwambo90@gmail.com', 'I am very professional in backend development', 'Male', 'VUE,Java,GO', '2023-11-06 11:24:12', '2023-11-06 11:24:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ResponseId` (`ResponseId`);

--
-- Indexes for table `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `responses`
--
ALTER TABLE `responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`ResponseId`) REFERENCES `responses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
