import { Router } from "express";
import { rentRequestController } from "./rentrequest.controller";
import { auth } from "../../middlewares/auth";

const route = Router();
// create rental request
route.post("/", auth("TENANT"), rentRequestController.createRentRequest);
// get tenant's rental requests
route.get("/", auth("TENANT"), rentRequestController.getAllRentRequests);
// get rental request detail
route.get("/:id", auth("TENANT"), rentRequestController.getRentRequestDetail);
export const rentRequestRoute = route;
