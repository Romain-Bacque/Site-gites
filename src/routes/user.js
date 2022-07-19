const express = require("express");

// import du Router
const router = express.Router();

// // Créer les différentes routes pour l'authentification de l'utilisateur

// Route Login
router.router("/login");

// Route Register
router.router("/register");

// Route Logout
router.router("/logout");

export default router;
