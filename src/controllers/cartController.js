const Cart = require("../models/Cart");
const User = require("../models/User");

// Agregar productos al carrito
const addToCart = async (req, res) => {
  const { products, address } = req.body;
  const userId = req.user.id; // Asumimos que el middleware `protect` ya puso el id del usuario en `req.user`

  if (!products || products.length === 0 || !address) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Buscar si el usuario ya tiene un carrito
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Si ya tiene un carrito, agregar los productos
      cart.products = cart.products.concat(products);
      cart.address = address;
      await cart.save();
    } else {
      // Si no tiene carrito, crear uno nuevo
      cart = new Cart({
        userId,
        products,
        address
      });
      await cart.save();
    }

    res.status(200).json({ message: "Productos agregados al carrito", cart });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al agregar al carrito", error: error.message });
  }
};

// Realizar el checkout
const checkout = async (req, res) => {
  const userId = req.user.id; // De nuevo, asumimos que `req.user` tiene el id del usuario

  try {
    // Buscar el carrito del usuario
    let cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    const message = `Hola, quiero hacer un pedido:\n${cart.products
      .map((p) => `- ${p.name} (x${p.quantity})`)
      .join("\n")}\nTotal: $${cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0)}\nDirección: ${cart.address}`;

    const whatsappLink = `https://wa.me/+33759860578?text=${encodeURIComponent(message)}`;

    // Limpiar el carrito después de realizar el pedido
    await Cart.deleteOne({ userId });

    res.json({ message: "Pedido generado", link: whatsappLink });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al procesar el pedido", error: error.message });
  }
};

module.exports = { addToCart, checkout };
