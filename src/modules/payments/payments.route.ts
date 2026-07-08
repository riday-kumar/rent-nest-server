import { Router } from "express";
import { paymentController } from "./payments.controller";
import { auth } from "../../middlewares/auth";

const route = Router();
route.post("/create", auth("TENANT"), paymentController.createPayment);
route.post("/", paymentController.verifyPayment);
route.get("/", auth("TENANT"), paymentController.paymentHistory);
route.get("/:id", auth("TENANT"), paymentController.getPaymentDetail);

export const paymentRoute = route;
