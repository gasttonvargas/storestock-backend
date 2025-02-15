const nodemailer = require("nodemailer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Configuración de Nodemailer (Mailtrap)
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Enviar correo de bienvenida
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: "DespensaÑOÑO <no-reply@despensanono.com>",
    to: email,
    subject: "Bienvenido a DespensaÑOÑO",
    text: `¡Hola ${name}!\n\nGracias por registrarte en DespensaÑOÑO. Para tu seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión.\n\nSaludos,\nEl equipo de DespensaÑOÑO`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de bienvenida enviado a:", email);
  } catch (error) {
    console.error("Error al enviar el correo:", error.message);
  }
};

// Registrar usuario
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    // Convertir el email a minúsculas antes de guardarlo
    const emailLowerCase = email.toLowerCase();

    const newUser = new User({
      name,
      email: emailLowerCase, // Guardar en minúsculas
      password: password, // <-- ¡NO HASHEAR AQUÍ!
      role: "cliente", // Rol por defecto
    });

    await newUser.save();
    await sendWelcomeEmail(email, name);

    res.status(201).json({ message: "Usuario registrado con éxito." });
  } catch (error) {
    console.error("Error en registro:", error.message);
    res.status(500).json({ message: "Error al registrar el usuario." });
  }
};

// Iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Correo y contraseña requeridos." });
    }

    // Eliminar espacios en blanco y convertir a minúsculas
    const emailTrimmed = email.trim().toLowerCase();
    const passwordTrimmed = password.trim();

    const user = await User.findOne({ email: emailTrimmed });

    console.log("Usuario encontrado:", user); // Log para depuración

    if (!user) {
      console.log("Usuario no encontrado con el email:", emailTrimmed);
      return res.status(400).json({ message: "Credenciales incorrectas." });
    }

    // Imprimir los valores justo antes de bcrypt.compare()
    console.log("Contraseña ingresada:", passwordTrimmed);
    console.log("Contraseña hasheada almacenada:", user.password);

    // Verificar la contraseña
    const isPasswordCorrect = await bcrypt.compare(passwordTrimmed, user.password);

    console.log("Resultado de bcrypt.compare:", isPasswordCorrect); // Log para depuración

    if (!isPasswordCorrect) {
      console.log("Contraseña incorrecta para el usuario:", emailTrimmed);
      return res.status(400).json({ message: "Credenciales incorrectas." });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Inicio de sesión exitoso.", token });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ message: "Error al iniciar sesión." });
  }
};

// Cambiar rol de usuario (requiere ser admin)
const changeUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const validRoles = ["admin", "empleado", "cliente"];

    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: "Rol no válido." });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          message:
            "Acceso denegado. Solo administradores pueden cambiar roles.",
        });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: "Rol actualizado correctamente." });
  } catch (error) {
    console.error("Error al cambiar el rol:", error.message);
    res.status(500).json({ message: "Error al actualizar el rol." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changeUserRole,
};
