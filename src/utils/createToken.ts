import jwt, { JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";
export const createToken = (
  payload: JwtPayload,
  token: string,
  expire: StringValue,
) => {
  const createdToken = jwt.sign(payload, token, {
    expiresIn: expire,
  });
  return createdToken;
};
