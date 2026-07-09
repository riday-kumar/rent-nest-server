import { PaginationOptions } from "../../interfaces/common";
import { prisma } from "../../lib/prisma";

const getAllUsers = async (query: PaginationOptions) => {
  const { limit, page, sortBy, sortOrder } = query;

  const contentLimit = limit ? Number(limit) : 8;
  const pageNo = page ? Number(page) : 1;
  const skip = (pageNo - 1) * contentLimit;

  const sortedBy = sortBy ? sortBy : "createdAt";
  const sortedOrder = sortOrder ? sortOrder : "desc";

  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
    // pagination
    take: contentLimit,
    skip: skip,
    orderBy: {
      [sortedBy]: sortedOrder,
    },
  });
  return users;
};
const getAllProperties = async () => {};
const getAllRentalsReq = async () => {
  const allRentalRequests = await prisma.rentRequest.findMany({
    include: {
      tenant: {
        omit: {
          createdAt: true,
          updatedAt: true,
          password: true,
          role: true,
          isActive: true,
        },
      },
      property: {
        omit: {
          landlordId: true,
          categoryId: true,
        },
      },
    },
  });
  return allRentalRequests;
};
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
  getAllRentalsReq,
  updateUserStatus,
};
