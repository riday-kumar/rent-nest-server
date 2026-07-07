import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();

// register
route.post("/register", authController.registerUser);

export const authRoutes = route;
