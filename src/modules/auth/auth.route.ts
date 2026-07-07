import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const route = Router();

// register
route.post("/register", authController.registerUser);
// login user
route.post("/login", authController.logInUser);
// create access token using refresh token
route.post("/refresh-token", authController.refreshToken);
// get current authenticated user
route.get("/me", auth(), authController.currentUser);

export const authRoutes = route;
