import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
  return users;
};
const getAllProperties = async () => {};
const getAllRentals = async () => {};
const updateUserStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive: !user.isActive,
    },
    omit: {
      password: true,
    },
  });
  return updatedUser;
};

export const adminService = {
  getAllUsers,
  getAllProperties,
  getAllRentals,
  updateUserStatus,
};
