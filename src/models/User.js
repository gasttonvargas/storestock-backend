const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Esquema del usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Asegura que el email sea único en la base de datos
  },
  password: {
    type: String,
    required: true,
    // Eliminar minlength si deseas permitir contraseñas más cortas
    // minlength: 60  
  },
  role: {
    type: String,
    enum: ["admin", "empleado", "cliente"], // Permite roles definidos
    default: "cliente", // Por defecto es cliente
  },
  roleUpdatedAt: {
    type: Date,  // Guarda la fecha cuando se actualiza el rol
  },
}, {
  timestamps: true,  // Crea campos 'createdAt' y 'updatedAt' automáticamente
});

// Encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (error) {
      return next(error);
    }
  }
  return next(); // No hacer nada si la contraseña no se ha modificado
});

// Método para comparar contraseñas encriptadas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Modelo de Usuario
const User = mongoose.model("User", userSchema);

module.exports = User;
