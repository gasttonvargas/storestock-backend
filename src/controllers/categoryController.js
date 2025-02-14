const Category = require("../models/Category");

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo categorías" });
  }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creando categoría" });
  }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando categoría" });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
