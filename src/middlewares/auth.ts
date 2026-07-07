import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { prisma } from "../lib/prisma";
import { ROLE } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

export const auth = (...requiredRole: ROLE[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!accessToken) {
      throw new Error("token is not provided");
    }

    const verifyToken = jwt.verify(
      accessToken,
      config.access_token,
    ) as JwtPayload;

    const { id, email, role } = verifyToken;

    // check user role
    if (requiredRole.length > 0 && !requiredRole.includes(role)) {
      throw new Error("Forbidden Access!");
    }

    // check user
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new Error("user not found!");
    }

    if (user.email !== email) {
      throw new Error("email is not matched!");
    }

    if (user.role !== role) {
      throw new Error("forbidden access");
    }

    if (!user.isActive) {
      throw new Error("User is inactive. please contact support");
    }

    req.user = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    };

    next();
  });
};
