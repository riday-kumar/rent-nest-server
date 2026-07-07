import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";

const route = Router();
route.get("/users", auth("ADMIN"), adminController.getAllUsers);
route.get("/properties", auth("ADMIN"), adminController.getAllProperties);
route.get("/rentals", auth("ADMIN"), adminController.getAllRentals);
route.patch("/users/:id", auth("ADMIN"), adminController.updateUserStatus);
export const adminRoutes = route;
