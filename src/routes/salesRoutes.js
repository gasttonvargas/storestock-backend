const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { createSale, getSalesToday } = require("../controllers/salesController");

// Registrar una venta (Empleado o Admin)
router.post("/", protect, authorize("admin", "empleado"), createSale);

// Obtener ventas del día (Solo Admin)
router.get("/today", protect, authorize("admin"), getSalesToday);

module.exports = router;
