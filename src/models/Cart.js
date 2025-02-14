const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    address: { type: String, required: true },
  },
  {
    timestamps: true, // Para agregar las fechas de creación y actualización automáticamente
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
