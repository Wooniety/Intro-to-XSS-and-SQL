-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)

-- CREATE database sptravel;
--
-- Host: localhost    Database: sptravel
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `itinerary`
--

DROP TABLE IF EXISTS `itinerary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itinerary` (
  `itinerary_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `day` INTEGER NOT NULL,
  `activity` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `fk_travel_id` INTEGER NOT NULL,
  CONSTRAINT `itinerary_ibfk_1` FOREIGN KEY (`fk_travel_id`) REFERENCES `travel_listings` (`travel_id`) ON DELETE CASCADE
)
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itinerary`
--

/*!40000 ALTER TABLE `itinerary` DISABLE KEYS */;
INSERT INTO `itinerary` VALUES (2,2,'Going Fishing','2020-06-23 08:18:18',1),(4,2,'Drink Milo','2020-06-23 08:18:18',3),(12,5,'i go drink milo','2020-08-06 08:08:00',1),(13,1,'yay','2020-08-06 08:10:06',2);
/*!40000 ALTER TABLE `itinerary` ENABLE KEYS */;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `travel_id` INTEGER NOT NULL,
  `content` text CHARACTER NOT NULL,
  `rating` INTEGER NOT NULL,
  `user_id` INTEGER NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`travel_id`) REFERENCES `travel_listings` (`travel_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON DELETE CASCADE
)
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (5,2,'wqdqwd',2,5,'2020-07-19 17:55:20'),(8,1,'konnichiwa',5,5,'2020-07-19 18:03:27'),(9,2,"i don't like this",2,5,'2020-08-06 07:36:52'),(10,1,'i like this so much',4,5,'2020-08-06 08:07:15'),(11,3,'i love this',3,6,'2020-08-10 08:11:40'),(13,2,'very fun!!! recommended!!',5,6,'2020-08-10 08:24:27'),(14,2,'not so fun :(',1,7,'2020-08-10 08:28:32');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;

--
-- Table structure for table `travel_listings`
--

DROP TABLE IF EXISTS `travel_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_listings` (
  `travel_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `price` INTEGER NOT NULL,
  `country` varchar(255),
  `image_url` varchar(255),
  `date_from` date NOT NULL,
  `date_to` date NOT NULL
)
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_listings`
--

/*!40000 ALTER TABLE `travel_listings` DISABLE KEYS */;
INSERT INTO `travel_listings` VALUES (1,'3D2N Tokyo, Japan','Tokyo is a very cool place with lots of very nice buildings. Going there during the sakura season is a plus as you get to eat good food and sit under the sakura trees.',2450,'Japan','tokyo.jpg','2020-08-31','2020-09-12'),(2,'7D6N Pompeii, Italy','Pompeii is a vast archaeological site in southern Italy’s Campania region, near the coast of the Bay of Naples. Once a thriving and sophisticated Roman city, Pompeii was buried under meters of ash and pumice after the catastrophic eruption of Mount Vesuvius in 79 A.D. The preserved site features excavated ruins of streets and houses that visitors can freely explore.',1800,'Italy','pompeii.jpg','2021-01-01','2021-01-07'),(3,'2D1N Bangkok, Thailand','Bangkok, Thailand’s capital, is a large city known for ornate shrines and vibrant street life. The boat-filled Chao Phraya River feeds its network of canals, flowing past the Rattanakosin royal district, home to opulent Grand Palace and its sacred Wat Phra Kaew Temple. Nearby is Wat Pho Temple with an enormous reclining Buddha and, on the opposite shore, Wat Arun Temple with its steep steps and Khmer-style',1400,'Thailand','bangkok.jpg','2018-12-05','2020-01-01');
/*!40000 ALTER TABLE `travel_listings` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_pic_url` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(45) DEFAULT NULL
)
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (5,'bruh','bruh@email.com','bruh','$2b$08$fCg5MKDixGhnPcDAfC3UjujxwNCxRIJ4JpT0ebBtbnsB6GenAu4Yy','$2b$08$fCg5MKDixGhnPcDAfC3Uju','2020-08-10 08:21:49','user'),(6,'admin','admin@email.com','admin','$2b$08$xTJISqPBgFPMOLeNRRR3hOXn0CyQIFA96AcyfC/IwkkxVrhrkYuvq','$2b$08$xTJISqPBgFPMOLeNRRR3hO','2020-08-10 08:25:08','admin'),(7,'test','test@email.com','default','$2b$08$jml1wot3TyyJ4rtONG110u4EgoBEAJB7HVLwMk3l4rJDEjWdgpRgq','$2b$08$jml1wot3TyyJ4rtONG110u','2020-08-10 08:28:15','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-10 16:37:30
