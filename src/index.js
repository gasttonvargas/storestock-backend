require("dotenv").config();

// Importar dependencias principales
const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db");

// Importar rutas
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const salesRoutes = require("./routes/salesRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Inicializar la app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Habilito CORS para permitir peticiones desde el frontend
app.use(express.json()); // Permito recibir JSON en las peticiones

// Conectar a MongoDB
connectDB();

// Definir rutas de la API
app.use("/api/products", productRoutes); // Rutas de productos
app.use("/api/categories", categoryRoutes); // Rutas de categorías
app.use("/api/users", userRoutes); // Rutas de usuarios (registro, login)
app.use("/api/sales", salesRoutes); // Rutas de ventas (empleados y admin)
app.use("/api/cart", cartRoutes); // Rutas del carrito de compras (clientes)

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});