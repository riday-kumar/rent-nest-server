import { User } from "../../../generated/prisma/client";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

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

export const authService = { registerUser };
