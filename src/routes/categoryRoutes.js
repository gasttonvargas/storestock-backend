const express = require("express");
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require("../controllers/categoryController");

// Rutas CRUD para categorías
router.get("/", getCategories);        // Obtener todas las categorías
router.post("/", createCategory);      // Crear una nueva categoría
router.delete("/:id", deleteCategory); // Eliminar una categoría

module.exports = router;
