const Product = require("../models/Product");

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo productos" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    
    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const newProduct = new Product({ name, category, price, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error en createProduct:", error);
    res.status(500).json({ message: "Error creando el producto", error: error.message });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando el producto" });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando el producto" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
