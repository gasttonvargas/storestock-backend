const Sale = require("../models/Sale");

// Crear una nueva venta
const createSale = async (req, res) => {
  try {
    const { products, total, paymentMethod } = req.body;

    if (!products || products.length === 0 || !total || !paymentMethod) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const sale = new Sale({
      products,
      total,
      paymentMethod,
      user: req.user._id
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error registrando la venta" });
  }
};

// Obtener ventas del día
const getSalesToday = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await Sale.find({ createdAt: { $gte: today } }).populate("user", "name");

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ventas del día" });
  }
};

module.exports = { createSale, getSalesToday };
