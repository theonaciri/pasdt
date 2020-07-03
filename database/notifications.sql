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
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `log` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  `module` varchar(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `seen` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notif_text` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `log`, `company`, `module`, `value`, `seen`, `created_at`, `updated_at`) VALUES
(18, 'TEMP_CRIT_HIGH', 19815, 0, '1850-00082', '85', 0, '2020-06-30 09:35:55', '2020-06-30 09:35:55'),
(19, 'TEMP_DECREASE', 19816, 0, '1850-00082', '45', 1, '2020-06-30 09:36:58', '2020-07-03 04:24:24');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notif_text` FOREIGN KEY (`type`) REFERENCES `notif_text` (`type`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
