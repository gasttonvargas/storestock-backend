const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile } = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/register", registerUser); // Registrar usuario (admin o cliente)
router.post("/login", loginUser); // Iniciar sesión
router.get("/profile", protect, getProfile); // Obtener perfil del usuario

module.exports = router;
