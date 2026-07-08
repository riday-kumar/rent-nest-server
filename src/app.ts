import cookieParser from "cookie-parser";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { config } from "./config";
import httpStatus from "http-status";
import { authRoutes } from "./modules/auth/auth.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { landlordRoute } from "./modules/landlord/landlord.route";
import { categoryRoute } from "./modules/category/category.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { propertyRoute } from "./modules/properties/property.route";

const app: Application = express();
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// routes
app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).send({
    success: true,
    message: "Hello World!",
  });
});

// authentication routes
app.use("/api/auth", authRoutes);
// category routes
app.use("/api/category", categoryRoute);
// landlord routes
app.use("/api/landlord", landlordRoute);
// admin routes
app.use("/api/admin", adminRoutes);
// property routes(Public)
app.use("/api/properties", propertyRoute);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
