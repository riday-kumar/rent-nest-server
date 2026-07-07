import { Router } from "express";
import { landlordController } from "./landlord.controller";
import { auth } from "../../middlewares/auth";

const route = Router();
route.get("/requests", landlordController.allRentalRequest);
route.post("/properties", auth("LANDLORD"), landlordController.createProperty);
route.put("/properties/:id", landlordController.updateProperty);
route.delete("/properties/:id", landlordController.deleteProperty);
route.patch("/requests/:id", landlordController.updateRequestByLandlord);

export const landlordRoute = route;
