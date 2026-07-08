import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";

const route = Router();
route.get("/all-categories", categoryController.getAllCategories);
route.post(
  "/create-category",
  auth("ADMIN"),
  categoryController.createCategory,
);
route.put(
  "/update-category/:id",
  auth("ADMIN"),
  categoryController.updateCategory,
);
route.delete(
  "/delete-category/:id",
  auth("ADMIN"),
  categoryController.deleteCategory,
);

export const categoryRoute = route;
