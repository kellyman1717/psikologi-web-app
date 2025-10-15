-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 15, 2025 at 06:23 AM
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
(3, 'Analogi'),
(2, 'Antonim'),
(4, 'Logika Verbal'),
(1, 'Sinonim');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('multiple_choice','essay') NOT NULL DEFAULT 'multiple_choice',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `correct_answer` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `category_id`, `question_text`, `question_type`, `options`, `correct_answer`, `status`) VALUES
(1, 1, 'Gaharu', 'multiple_choice', '[\"Kayu wangi\", \"Pohon langka\", \"Tanaman obat\", \"Bunga hias\"]', 'A', 'Active'),
(2, 1, 'Definisi', 'multiple_choice', '[\"Pengertian\", \"Penjelasan\", \"Uraian\", \"Deskripsi\"]', 'A', 'Active'),
(3, 1, 'Prognosis', 'multiple_choice', '[\"Prakiraan\", \"Diagnosis\", \"Analisis\", \"Kesimpulan\"]', 'A', 'Active'),
(4, 1, 'Insomnia', 'multiple_choice', '[\"Sulit tidur\", \"Mimpi buruk\", \"Lelah\", \"Sakit kepala\"]', 'A', 'Active'),
(5, 1, 'Virtual', 'multiple_choice', '[\"Maya\", \"Nyata\", \"Asli\", \"Palsu\"]', 'A', 'Active'),
(6, 1, 'Friksi', 'multiple_choice', '[\"Gesekan\", \"Perpecahan\", \"Konflik\", \"Masalah\"]', 'A', 'Active'),
(7, 1, 'Bonus', 'multiple_choice', '[\"Insentif\", \"Hadiah\", \"Gaji\", \"Tunjangan\"]', 'A', 'Active'),
(8, 1, 'Citra', 'multiple_choice', '[\"Gambaran\", \"Wajah\", \"Reputasi\", \"Kesan\"]', 'A', 'Active'),
(9, 1, 'Donasi', 'multiple_choice', '[\"Sumbangan\", \"Bantuan\", \"Pemberian\", \"Amal\"]', 'A', 'Active'),
(10, 1, 'Legal', 'multiple_choice', '[\"Sah\", \"Resmi\", \"Benar\", \"Valid\"]', 'A', 'Active'),
(11, 1, 'Absolut', 'multiple_choice', '[\"Mutlak\", \"Pasti\", \"Relatif\", \"Terbatas\"]', 'A', 'Active'),
(12, 1, 'Random', 'multiple_choice', '[\"Acak\", \"Terpilih\", \"Urut\", \"Sistematis\"]', 'A', 'Active'),
(13, 2, 'Abadi', 'multiple_choice', '[\"Fana\", \"Sementara\", \"Lama\", \"Selamanya\"]', 'A', 'Active'),
(14, 2, 'Aktual', 'multiple_choice', '[\"Fiktif\", \"Nyata\", \"Baru\", \"Lama\"]', 'A', 'Active'),
(15, 2, 'Mandiri', 'multiple_choice', '[\"Bergantung\", \"Sendiri\", \"Bebas\", \"Terikat\"]', 'A', 'Active'),
(16, 2, 'Konkret', 'multiple_choice', '[\"Abstrak\", \"Nyata\", \"Jelas\", \"Padat\"]', 'A', 'Active'),
(17, 2, 'Mayor', 'multiple_choice', '[\"Minor\", \"Besar\", \"Kecil\", \"Penting\"]', 'A', 'Active'),
(18, 2, 'Output', 'multiple_choice', '[\"Hasil\", \"Input\", \"Keluaran\", \"Masukan\"]', 'B', 'Active'),
(19, 2, 'Naik', 'multiple_choice', '[\"Turun\", \"Atas\", \"Bawah\", \"Meningkat\"]', 'A', 'Active'),
(20, 2, 'Modern', 'multiple_choice', '[\"Kuno\", \"Tradisional\", \"Baru\", \"Canggih\"]', 'B', 'Active'),
(21, 2, 'Optimis', 'multiple_choice', '[\"Yakin\", \"Pesimis\", \"Ragu\", \"Senang\"]', 'B', 'Active'),
(22, 2, 'Profit', 'multiple_choice', '[\"Rugi\", \"Untung\", \"Laba\", \"Kaya\"]', 'A', 'Active'),
(23, 2, 'Profesional', 'multiple_choice', '[\"Ahli\", \"Mahir\", \"Amatir\", \"Pemula\"]', 'C', 'Active'),
(24, 2, 'Stabil', 'multiple_choice', '[\"Tetap\", \"Labil\", \"Goyah\", \"Konstan\"]', 'B', 'Active'),
(25, 3, 'Mata : Melihat = Telinga : ...', 'multiple_choice', '[\"Mendengar\", \"Berbicara\", \"Mencium\", \"Merasa\"]', 'A', 'Active'),
(26, 3, 'Mobil : Bensin = Manusia : ...', 'multiple_choice', '[\"Makanan\", \"Minuman\", \"Oksigen\", \"Tenaga\"]', 'A', 'Active'),
(27, 3, 'Dingin : Selimut = Hujan : ...', 'multiple_choice', '[\"Payung\", \"Jaket\", \"Topi\", \"Sepatu\"]', 'A', 'Active'),
(28, 3, 'Pisau : Memotong = Pena : ...', 'multiple_choice', '[\"Menulis\", \"Membaca\", \"Menggambar\", \"Menghapus\"]', 'A', 'Active'),
(29, 3, 'Siang : Matahari = Malam : ...', 'multiple_choice', '[\"Bulan\", \"Bintang\", \"Lampu\", \"Gelap\"]', 'A', 'Active'),
(30, 3, 'Air : Haus = Nasi : ...', 'multiple_choice', '[\"Lapar\", \"Kenyang\", \"Lezat\", \"Pulen\"]', 'A', 'Active'),
(31, 3, 'Api : Panas = Es : ...', 'multiple_choice', '[\"Dingin\", \"Beku\", \"Cair\", \"Segar\"]', 'A', 'Active'),
(32, 3, 'Indonesia : Jakarta = Jepang : ...', 'multiple_choice', '[\"Tokyo\", \"Kyoto\", \"Osaka\", \"Seoul\"]', 'A', 'Active'),
(33, 3, 'Dokter : Pasien = Guru : ...', 'multiple_choice', '[\"Murid\", \"Sekolah\", \"Buku\", \"Pelajaran\"]', 'A', 'Active'),
(34, 3, 'Kaki : Sepatu = Kepala : ...', 'multiple_choice', '[\"Topi\", \"Rambut\", \"Otak\", \"Pikiran\"]', 'A', 'Active'),
(35, 3, 'Buku : Halaman = Rumah : ...', 'multiple_choice', '[\"Kamar\", \"Pintu\", \"Jendela\", \"Atap\"]', 'A', 'Active'),
(36, 3, 'Petani : Sawah = Nelayan : ...', 'multiple_choice', '[\"Laut\", \"Kapal\", \"Ikan\", \"Jaring\"]', 'A', 'Active'),
(37, 3, 'Benang : Kain = Kayu : ...', 'multiple_choice', '[\"Meja\", \"Pohon\", \"Hutan\", \"Papan\"]', 'A', 'Active'),
(38, 4, 'Semua mamalia menyusui. Kucing adalah mamalia. Maka...', 'multiple_choice', '[\"Kucing menyusui\", \"Kucing tidak menyusui\", \"Beberapa kucing menyusui\", \"Tidak dapat disimpulkan\"]', 'A', 'Active'),
(39, 4, 'Jika hari ini hujan, maka jalanan basah. Hari ini tidak hujan. Maka...', 'multiple_choice', '[\"Jalanan tidak basah\", \"Jalanan tetap basah\", \"Mungkin basah, mungkin tidak\", \"Tidak dapat disimpulkan\"]', 'D', 'Active'),
(40, 4, 'Semua siswa kelas A pandai matematika. Budi adalah siswa kelas A. Maka...', 'multiple_choice', '[\"Budi pandai matematika\", \"Budi tidak pandai matematika\", \"Budi mungkin pandai matematika\", \"Tidak dapat disimpulkan\"]', 'A', 'Active'),
(41, 4, 'Jika lampu merah, maka kendaraan berhenti. Kendaraan tidak berhenti. Maka...', 'multiple_choice', '[\"Lampu tidak merah\", \"Lampu hijau\", \"Lampu kuning\", \"Lampu mati\"]', 'A', 'Active'),
(42, 4, 'Semua burung bisa terbang. Penguin adalah burung. Maka...', 'multiple_choice', '[\"Pernyataan pertama salah\", \"Penguin bisa terbang\", \"Penguin tidak bisa terbang\", \"Tidak dapat disimpulkan\"]', 'A', 'Active'),
(43, 4, 'Ani lebih tinggi dari Budi. Cici lebih pendek dari Ani. Maka...', 'multiple_choice', '[\"Ani yang paling tinggi\", \"Budi yang paling pendek\", \"Cici lebih tinggi dari Budi\", \"Tidak dapat disimpulkan\"]', 'D', 'Active'),
(44, 4, 'Jika saya belajar, maka saya lulus ujian. Saya tidak lulus ujian. Maka...', 'multiple_choice', '[\"Saya tidak belajar\", \"Saya belajar tapi tidak sungguh-sungguh\", \"Soal ujiannya sulit\", \"Saya kurang beruntung\"]', 'A', 'Active'),
(45, 4, 'Semua bunga mawar berwarna merah. Bunga ini bukan berwarna merah. Maka...', 'multiple_choice', '[\"Bunga ini bukan mawar\", \"Bunga ini mawar putih\", \"Bunga ini layu\", \"Tidak dapat disimpulkan\"]', 'A', 'Active'),
(46, 4, 'Jika A maka B. Jika B maka C. Maka...', 'multiple_choice', '[\"Jika A maka C\", \"Jika C maka A\", \"A dan C tidak berhubungan\", \"Tidak dapat disimpulkan\"]', 'A', 'Active'),
(47, 4, 'Ada lima kotak berderet: 1, 2, 3, 4, 5. Kotak berisi apel ada di sebelah kotak berisi jeruk. Kotak nomor 3 berisi mangga. Kotak jeruk ada di antara mangga dan apel. Di manakah letak kotak apel?', 'multiple_choice', '[\"Nomor 5\", \"Nomor 4\", \"Nomor 2\", \"Nomor 1\"]', 'B', 'Active'),
(48, 4, 'Doni, Eka, dan Feri berlomba lari. Doni lebih cepat dari Eka. Feri lebih lambat dari Doni. Siapakah yang mungkin menjadi juara kedua?', 'multiple_choice', '[\"Eka atau Feri\", \"Hanya Eka\", \"Hanya Feri\", \"Doni\"]', 'A', 'Active'),
(49, 4, 'Semua peserta seminar membawa laptop. Sebagian peserta seminar adalah mahasiswa. Maka...', 'multiple_choice', '[\"Sebagian mahasiswa membawa laptop\", \"Semua mahasiswa membawa laptop\", \"Tidak ada mahasiswa yang membawa laptop\", \"Tidak dapat disimpulkan\"]', 'A', 'Active'),
(50, 4, 'Dalam sebuah keluarga, Ayah lebih tua dari Ibu. Anak pertama lebih muda dari Ibu tetapi lebih tua dari Anak kedua. Siapakah yang paling muda?', 'multiple_choice', '[\"Anak kedua\", \"Anak pertama\", \"Ibu\", \"Ayah\"]', 'A', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `test_answers`
--

CREATE TABLE `test_answers` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_answer` varchar(255) NOT NULL,
  `is_correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test_answers`
--

INSERT INTO `test_answers` (`id`, `session_id`, `question_id`, `user_answer`, `is_correct`) VALUES
(1, 1, 1, '2', 0),
(2, 1, 2, '0', 0),
(3, 1, 3, '2', 0),
(4, 1, 13, '2', 0),
(5, 1, 14, '0', 0),
(6, 1, 15, '0', 0),
(7, 1, 25, '0', 0),
(8, 1, 26, '0', 0),
(9, 1, 27, '0', 0),
(10, 1, 38, '0', 0),
(11, 1, 39, '1', 0),
(12, 1, 40, '1', 0);

-- --------------------------------------------------------

--
-- Table structure for table `test_sessions`
--

CREATE TABLE `test_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test_sessions`
--

INSERT INTO `test_sessions` (`id`, `user_id`, `score`, `created_at`) VALUES
(1, 13, 0, '2025-10-15 03:34:00');

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
  `date_of_birth` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `date_of_birth`, `created_at`) VALUES
(1, 'admin', 'admin@example.com', '$2a$10$bkcCKAdju2kpu2PbBMzH1.Wt5Y.8KeOhZj21mLXhYVR1X7jySZQQu', 'admin', NULL, '2025-10-13 08:21:10'),
(4, 'pc01', 'pc01@gmail.com', '$2b$10$6PPyiiBqcRNO968NDrdrxexE4ND/I9cXigiZFl53578P9j.2gHx/.', 'user', NULL, '2025-10-13 09:25:16'),
(5, 'budi', 'budi@gmail.com', '$2b$10$mZQkzivI2Oes5ZBvOBE8wuGLwb0A6hi8L8WN5sPkPxMF06sGKmFcK', 'user', NULL, '2025-10-13 09:49:53'),
(13, 'user', 'user@user.com', '$2a$10$I6DOdDBRuOe9zHAZo.9AI.J05HrupFgVW3MNStgVUd/DZuZh.0wNC', 'user', '0000-00-00', '2025-10-14 04:11:07');

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
(10, 13, 1),
(11, 13, 2),
(12, 13, 3),
(4, 13, 13),
(5, 13, 14),
(6, 13, 15),
(1, 13, 25),
(2, 13, 26),
(3, 13, 27),
(7, 13, 38),
(8, 13, 39),
(9, 13, 40);

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
-- Indexes for table `test_answers`
--
ALTER TABLE `test_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `test_sessions`
--
ALTER TABLE `test_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `test_answers`
--
ALTER TABLE `test_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `test_sessions`
--
ALTER TABLE `test_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `user_assignments`
--
ALTER TABLE `user_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `test_answers`
--
ALTER TABLE `test_answers`
  ADD CONSTRAINT `test_answers_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `test_sessions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `test_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `test_sessions`
--
ALTER TABLE `test_sessions`
  ADD CONSTRAINT `test_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
