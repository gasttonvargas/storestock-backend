require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db"); 

// Importar rutas
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes"); // Quité la extensión .js, no es necesaria

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
