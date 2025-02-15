const nodemailer = require("nodemailer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Configuración de Nodemailer para enviar correos electrónicos usando Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Función para enviar el correo de bienvenida al usuario
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: "DespensaÑOÑO <no-reply@despensanono.com>", // Remitente ficticio
    to: email, // Correo del usuario
    subject: "Bienvenido a DespensaÑOÑO",
    text: `¡Hola ${name}!\n\nGracias por registrarte en DespensaÑOÑO. Para tu seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión.\n\n¡Bienvenido a nuestra comunidad!\n\nSaludos,\nEl equipo de DespensaÑOÑO`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de bienvenida enviado");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de bienvenida.");
  }
};

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación de los campos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Por favor ingresa todos los campos requeridos." });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Enviar el correo de bienvenida
    await sendWelcomeEmail(email, name);

    res.status(201).json({ message: "Usuario registrado exitosamente, se ha enviado un correo con las credenciales." });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: `Ocurrió un error al registrar el usuario: ${error.message}` });
  }
};

// Iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Recibiendo datos para login:", { email, password });

    // Verificar que el correo y la contraseña estén presentes
    if (!email || !password) {
      return res.status(400).json({ message: "Correo o contraseña no proporcionados." });
    }

    // Buscar el usuario por correo
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // Verificar la contraseña con bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    console.log("Contraseña ingresada:", password);
    console.log("Contraseña almacenada en DB:", user.password);
    console.log("Comparación de contraseñas:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log("Contraseña incorrecta");
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // Crear el token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Responder con el token y un mensaje de éxito
    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Ocurrió un error al iniciar sesión" });
  }
};

// Cambiar el rol de un usuario (solo admin)
const changeUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    // Verificar que el rol proporcionado sea válido
    if (!["admin", "empleado", "cliente"].includes(newRole)) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    // Verificar que el usuario que hace la solicitud sea un admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Solo un administrador puede hacer esto" });
    }

    // Buscar el usuario por ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Cambiar el rol del usuario
    user.role = newRole;
    await user.save();

    res.status(200).json({ message: "Rol actualizado exitosamente" });
  } catch (error) {
    console.error("Error al cambiar el rol:", error);
    res.status(500).json({ message: "Ocurrió un error al cambiar el rol del usuario" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changeUserRole,
};
