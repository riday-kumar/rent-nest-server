import dotenv from "dotenv";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env");

dotenv.config({ path: envPath });

export const config = {
  app_url: process.env.APP_URL,
  port: process.env.PORT || 3000,
  database_url: process.env.DATABASE_URL,
};
