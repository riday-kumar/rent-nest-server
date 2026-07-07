import { StringValue } from "ms";
import { User } from "../../../generated/prisma/client";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createToken } from "../../utils/createToken";

const registerUser = async (
  payload: Pick<User, "name" | "email" | "password" | "role">,
) => {
  const { name, email, password, role } = payload;
  const saltRound = Number(config.salt_round);
  const hashPassword = await bcrypt.hash(password, saltRound);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const loginUserIntoDB = async (payload: Pick<User, "email" | "password">) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User Not Found");
  }

  // verify password
  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    throw new Error("Invalid Password");
  }

  const userPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  } as JwtPayload;

  // create access token
  const accessToken = createToken(
    userPayload,
    config.access_token,
    config.access_token_expire as StringValue,
  );

  // create refresh token
  const refreshToken = createToken(
    userPayload,
    config.refresh_token,
    config.refresh_token_expire as StringValue,
  );
  return { accessToken, refreshToken };
};

const createAccessTokenUsingRefreshToken = async (refreshToken: string) => {
  const verifyToken = jwt.verify(
    refreshToken,
    config.refresh_token,
  ) as JwtPayload;
  const { id, email, isActive } = verifyToken;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user || !user.isActive) {
    throw new Error("user not found or user is not active");
  }

  const userPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  } as JwtPayload;

  // create access token
  const accessToken = createToken(
    userPayload,
    config.access_token,
    config.access_token_expire as StringValue,
  );

  return { accessToken };
};

const currentUser = async (id: string) => {
  const data = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });

  return data;
};

export const authService = {
  registerUser,
  loginUserIntoDB,
  createAccessTokenUsingRefreshToken,
  currentUser,
};
