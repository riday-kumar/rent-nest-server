import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();

// register
route.post("/register", authController.registerUser);
// login user
route.post("/login", authController.logInUser);
// create access token using refresh token
route.post("/refresh-token", authController.refreshToken);
export const authRoutes = route;
