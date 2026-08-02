import { Router } from "express";
import { landlordController } from "./landlord.controller";
import { auth } from "../../middlewares/auth";

const route = Router();
route.get("/requests", auth("LANDLORD"), landlordController.allRentalRequest);
route.get(
  "/landlord-all-properties",
  auth("LANDLORD"),
  landlordController.allProperties,
);
route.get(
  "/landlord-dashboard",
  auth("LANDLORD"),
  landlordController.landlordDashboard,
);
route.post("/properties", auth("LANDLORD"), landlordController.createProperty);
route.put(
  "/properties/:id",
  auth("LANDLORD"),
  landlordController.updateProperty,
);
route.delete(
  "/properties/:id",
  auth("LANDLORD"),
  landlordController.deleteProperty,
);
route.patch(
  "/requests/:id",
  auth("LANDLORD"),
  landlordController.updateRequestByLandlord,
);

export const landlordRoute = route;
