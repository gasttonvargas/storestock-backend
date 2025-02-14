const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { addToCart, checkout } = require("../controllers/cartController");

router.post("/add", protect, authorize("cliente"), addToCart);
router.post("/whatsapp", protect, authorize("cliente"), checkout); // Aquí usa checkout para WhatsApp
router.post("/checkout", protect, authorize("cliente"), checkout);

module.exports = router;
