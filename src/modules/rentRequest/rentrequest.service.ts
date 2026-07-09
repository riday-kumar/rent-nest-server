import { PaginationOptions } from "../../interfaces/common";
import { prisma } from "../../lib/prisma";
import { IRentRequest, IRequestDetail } from "./rentrequest.interface";

const createRentRequest = async (payload: IRentRequest) => {
  // check property is available or not
  const currentProperty = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

  if (currentProperty?.propertyStatus !== "AVAILABLE") {
    throw new Error("Property is not available");
  }

  // check already tenant has a request for this property
  const existingRequest = await prisma.rentRequest.findFirst({
    where: {
      ...payload,
    },
  });
  if (existingRequest) {
    throw new Error("Tenant already has a request for this property");
  }

  // now create request
  const rentRequest = await prisma.rentRequest.create({
    data: {
      ...payload,
    },
  });
  return rentRequest;
};
const getAllRentRequests = async (tenantId: string) => {
  const allRequests = await prisma.rentRequest.findMany({
    where: {
      tenantId,
    },
  });

  if (allRequests.length === 0) {
    throw new Error("No rent requests found");
  }

  return allRequests;
};
const getRentRequestDetail = async (payload: IRequestDetail) => {
  const request = await prisma.rentRequest.findFirst({
    where: {
      id: payload.requestId,
      tenantId: payload.tenantId,
    },
    include: {
      property: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  if (!request) {
    throw new Error("Rent request not found");
  }
  return request;
};

const getAllMyRents = async (query: PaginationOptions, tenantId: string) => {
  const { limit, page, sortBy, sortOrder } = query;

  const contentLimit = limit ? Number(limit) : 8;
  const pageNo = page ? Number(page) : 1;
  const skip = (pageNo - 1) * contentLimit;

  const sortedBy = sortBy ? sortBy : "createdAt";
  const sortedOrder = sortOrder ? sortOrder : "desc";

  const allRents = await prisma.payment.findMany({
    where: {
      rentRequest: {
        tenantId,
      },
      status: "PAID",
    },

    select: {
      id: true,
      amount: true,
      status: true,
      rentRequest: {
        select: {
          property: true,
        },
      },
    },
    // pagination
    take: contentLimit,
    skip: skip,
    orderBy: {
      [sortedBy]: sortedOrder,
    },
  });

  return allRents;
};

export const rentRequestService = {
  createRentRequest,
  getAllRentRequests,
  getRentRequestDetail,
  getAllMyRents,
};
