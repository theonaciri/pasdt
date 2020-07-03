-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  ven. 03 juil. 2020 à 07:37
-- Version du serveur :  5.7.21-log
-- Version de PHP :  7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `pasdt`
--

-- --------------------------------------------------------

--
-- Structure de la table `notif_text`
--

DROP TABLE IF EXISTS `notif_text`;
CREATE TABLE IF NOT EXISTS `notif_text` (
  `type` varchar(20) NOT NULL,
  `text_fr` varchar(50) NOT NULL,
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `notif_text`
--

INSERT INTO `notif_text` (`type`, `text_fr`) VALUES
('BATTERY_CRIT_HIGH', 'Batterie sous tension critique'),
('BATTERY_CRIT_LOW', 'Batterie critiquement faible'),
('BATTERY_HIGH', 'Batterie sous haute tension'),
('BATTERY_LOW', 'Batterie faible'),
('NO_LOG', 'Perte de données'),
('TEMP_CRIT_HIGH', 'Température critiquement haute'),
('TEMP_CRIT_LOW', 'Température critiquement basse'),
('TEMP_DECREASE', 'Température en chute'),
('TEMP_HIGH', 'Température haute'),
('TEMP_INCREASE', 'Montée de température'),
('TEMP_LOW', 'Témpérature basse');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
