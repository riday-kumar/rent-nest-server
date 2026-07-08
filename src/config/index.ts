import dotenv from "dotenv";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env");

dotenv.config({ path: envPath });

export const config = {
  app_url: process.env.APP_URL!,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL!,
  salt_round: process.env.SALT_ROUND!,
  access_token: process.env.ACCESS_TOKEN!,
  refresh_token: process.env.REFRESH_TOKEN!,
  access_token_expire: process.env.ACCESS_TOKEN_EXPIRES!,
  refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRES!,
  ssl_commerze_store_id: process.env.SSL_COMMERZE_STORE_ID!,
  ssl_commerze_store_password: process.env.SSL_COMMERZE_STORE_PASSWORD!,
  ssl_commerze_success_url: process.env.SSL_COMMERZE_SUCCESS_URL!,
  ssl_commerze_fail_url: process.env.SSL_COMMERZE_FAIL_URL!,
  ssl_commerze_cancel_url: process.env.SSL_COMMERZE_CANCEL_URL!,
};
