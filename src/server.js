import express from 'express';
import mongoose from "mongoose";
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { initMongoDB } from './db/database.js';
import 'dotenv/config'

const app = express();
const PORT = 5000;

// Express configuracion
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());

// Passport Config
initializePassport();
app.use(passport.initialize());

// Routes
app.use('/products', productRouter);
app.use('/carts', cartRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

initMongoDB();

app.listen(PORT, () => console.log(`SERVER UP ON PORT ${PORT}`));

