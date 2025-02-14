const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  products: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["efectivo", "transferencia"], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sale", saleSchema);
