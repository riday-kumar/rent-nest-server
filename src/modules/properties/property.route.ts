import { Router } from "express";
import { propertyController } from "./property.controller";

const route = Router();
route.get("/", propertyController.getAllProperties);
route.get("/:id", propertyController.getPropertyDetail);

export const propertyRoute = route;
