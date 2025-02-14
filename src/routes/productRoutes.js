const express = require("express");
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/", getProducts); // Todos pueden ver productos
router.post("/", protect, isAdmin, createProduct); // Solo admin puede crear
router.put("/:id", protect, isAdmin, updateProduct); // Solo admin puede actualizar
router.delete("/:id", protect, isAdmin, deleteProduct); // Solo admin puede eliminar

module.exports = router;
