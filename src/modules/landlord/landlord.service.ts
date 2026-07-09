import {
  Property,
  RentRequestStatus,
  ROLE,
} from "../../../generated/prisma/client";
import { PaginationOptions } from "../../interfaces/common";
import { prisma } from "../../lib/prisma";

const createProperty = async (landlordId: string, payload: Property) => {
  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
    include: {
      category: {
        omit: {
          createdAt: true,
          updatedAt: true,
          id: true,
        },
      },
    },
  });
  return property;
};
const updateProperty = async (
  propertyId: string,
  payload: Property,
  userId: string,
) => {
  // find property
  const findProperty = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!findProperty) {
    throw new Error("Property not found");
  }

  if (findProperty?.landlordId !== userId) {
    throw new Error("You are not the landlord of this property");
  }

  const updateProperty = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: payload,
  });
  return updateProperty;
};
const deleteProperty = async (propertyId: string, userId: string) => {
  // find property
  const findProperty = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!findProperty) {
    throw new Error("Property not found");
  }

  if (findProperty?.landlordId !== userId) {
    throw new Error("You are not the landlord of this property");
  }

  const deleteProperty = await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });
  return deleteProperty;
};
const allRentalRequest = async (
  query: PaginationOptions,
  landlordId: string,
) => {
  const { limit, page, sortBy, sortOrder } = query;

  const contentLimit = limit ? Number(limit) : 8;
  const pageNo = page ? Number(page) : 1;
  const skip = (pageNo - 1) * contentLimit;

  const sortedBy = sortBy ? sortBy : "createdAt";
  const sortedOrder = sortOrder ? sortOrder : "desc";

  const allRentalRequests = await prisma.rentRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    // pagination
    take: contentLimit,
    skip: skip,
    orderBy: {
      [sortedBy]: sortedOrder,
    },
    include: {
      tenant: {
        select: {
          name: true,
          email: true,
        },
      },
      property: true,
    },
  });

  if (allRentalRequests.length === 0) {
    throw new Error("No rental request found");
  }

  return allRentalRequests;
};
const updateRequestByLandlord = async (
  reqId: string,
  status: RentRequestStatus,
  userId: string,
) => {
  const findRequest = await prisma.rentRequest.findUnique({
    where: {
      id: reqId,
    },
  });

  if (!findRequest || findRequest.rentStatus !== "PENDING") {
    throw new Error("Rental request not found or not pending");
  }

  const findProperty = await prisma.property.findUniqueOrThrow({
    where: {
      id: findRequest.propertyId,
    },
  });

  if (findProperty?.landlordId !== userId) {
    throw new Error("You are not the landlord of this property");
  }

  if (status !== "APPROVED" && status !== "REJECTED") {
    throw new Error("Invalid status");
  }

  const updateTransaction = await prisma.$transaction(async (tx) => {
    // approve or reject current req
    await tx.rentRequest.update({
      where: {
        id: reqId,
      },
      data: {
        rentStatus: status,
      },
    });

    if (status === "APPROVED") {
      // reject all pending requests in the same property
      await tx.rentRequest.updateMany({
        where: {
          NOT: {
            id: reqId,
          },
          AND: {
            propertyId: findRequest.propertyId,
            rentStatus: "PENDING",
          },
        },
        data: {
          rentStatus: "REJECTED",
        },
      });
    }
  });

  return updateTransaction;
};

export const landlordService = {
  createProperty,
  updateProperty,
  deleteProperty,
  allRentalRequest,
  updateRequestByLandlord,
};
