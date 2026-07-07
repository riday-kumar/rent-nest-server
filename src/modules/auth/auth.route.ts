import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();

// register
route.post("/register", authController.registerUser);
// login user
route.post("/login", authController.logInUser);

export const authRoutes = route;
