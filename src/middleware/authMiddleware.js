const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;
  
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
          return res.status(401).json({ message: "No autorizado" });
        }
        next();
      } catch (error) {
        res.status(401).json({ message: "Token no válido" });
      }
    } else {
      res.status(401).json({ message: "No autorizado, no hay token" });
    }
  };
  
  const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Acceso denegado, se requiere rol de administrador" });
    }
  };

  const authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      next();
    };
  };
  
  module.exports = { protect, isAdmin, authorize };
