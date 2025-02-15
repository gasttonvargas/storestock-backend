const express = require("express");
const router = express.Router();
const { registerUser, loginUser, changeUserRole } = require("../controllers/userController"); // Asegúrate de que se importan correctamente
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Rutas de usuarios
router.post("/register", registerUser);  // Registrar usuario (admin o cliente)
router.post("/login", loginUser);  // Iniciar sesión
router.put("/change-role", protect, isAdmin, changeUserRole);  // Cambiar el rol del usuario (solo admin)

// Exportamos las rutas
module.exports = router;
