import cookieParser from "cookie-parser";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { config } from "./config";
import httpStatus from "http-status";

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

export default app;
