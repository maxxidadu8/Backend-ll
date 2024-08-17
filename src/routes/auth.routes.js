import { Router } from "express";
import { userModel } from "../daos/mongodb/models/user.model.js";
import { validate } from "../middlewares/validation.middleware.js";
import { authDto } from "../dtos/auth.dto.js";
import { userDto } from "../dtos/user.dto.js";
import { createHash } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";

// Crea una nueva instancia del enrutador de Express
const router = Router();

// Ruta para iniciar sesión
router.post("/login",
    // Middleware para validar los datos de autenticación
    validate(authDto),
    // Middleware de Passport para autenticar al usuario
    passport.authenticate("login", {
        session: false,
        failureRedirect: "/api/auth/login-error",
    }),
    // Controlador para manejar la lógica después de la autenticación
    async (req, res) => {
        try {
            // Crea el payload para el token JWT con los datos del usuario autenticado
            const payload = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                role: req.user.role,
            };

            // Genera el token JWT
            const token = generateToken(payload);

            // Establece una cookie con el token JWT
            res.cookie("token", token, { 
                httpOnly: true, 
                maxAge: 100000 
            });

            // Responde con un mensaje de éxito y el token
            res.status(200).json({
                message: "Autenticado",
                token,
            });
        } catch (error) {
            // Manejo de errores al iniciar sesión
            res.status(500).json({ error: "Error al iniciar sesión", details: error.message });
        }
    }
);

// Ruta para manejar los errores de inicio de sesión
router.get('/login-error', (req, res) => {
    res.status(401).json({ message: "No autorizado" });
});

// Ruta para registrar un nuevo usuario
router.post("/register", 
    // Middleware para validar los datos del usuario
    validate(userDto),
    // Controlador para manejar la lógica de registro de usuario
    async (req, res) => {
        const { first_name, last_name, email, age, role, password, cart } = req.body;

        // Verifica si faltan datos obligatorios
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        try {
            // Crea un hash de la contraseña
            const hashPassword = await createHash(password);

            // Crea un nuevo usuario en la base de datos
            const user = await userModel.create({
                first_name,
                last_name,
                email,
                age,
                password: hashPassword,
                role,
                cart,
            });

            // Responde con el usuario creado
            res.status(201).json(user);

        } catch (error) {
            // Manejo de errores al registrar usuario
            res.status(500).json({ message: "Error al registrar usuario", details: error.message });
        }
    }
);

// Ruta para obtener el usuario autenticado actual
router.get("/current", 
    // Middleware de Passport para autenticar al usuario con JWT
    passport.authenticate("jwt", { session: false }), 
    // Controlador para manejar la lógica después de la autenticación
    (req, res) => {
        try {
            // Responde con el usuario autenticado
            res.status(200).json({
                message: "Bienvenido",
                user: req.user,
            });
        } catch (error) {
            // Manejo de errores al obtener el usuario
            res.status(500).json({ error: "Error al obtener el usuario", details: error.message });
        }
    }
);

export default router;
