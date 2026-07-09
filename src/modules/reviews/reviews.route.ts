import { Router } from "express";
import { reviewController } from "./reviews.controller";
import { auth } from "../../middlewares/auth";

const route = Router();
route.post("/", auth("TENANT"), reviewController.createReview);
export const reviewRoute = route;
