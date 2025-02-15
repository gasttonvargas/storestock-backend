const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware para proteger las rutas que requieren autenticación
const protect = async (req, res, next) => {
  let token;

  // Verificamos si existe el token en los encabezados
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraemos el token del encabezado
      token = req.headers.authorization.split(" ")[1];

      // Verificamos el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario en la base de datos
      req.user = await User.findById(decoded.userId).select("-password");

      next(); // Llamamos al siguiente middleware o controlador
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "No autorizado, token fallido" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No autorizado, no hay token" });
  }
};

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Si es admin, continuamos
  } else {
    res.status(403).json({ message: "No autorizado, solo administradores pueden hacer esto" });
  }
};

// Middleware para verificar roles específicos (admin, empleado, etc.)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Verificar si el rol del usuario está en los roles permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acceso denegado, rol no autorizado" });
    }
    next(); // Si el rol está permitido, continuar
  };
};

module.exports = { protect, isAdmin, authorize };
