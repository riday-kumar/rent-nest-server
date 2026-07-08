import { prisma } from "../../lib/prisma";
import { IRentRequest, IRequestDetail } from "./rentrequest.interface";

const createRentRequest = async (payload: IRentRequest) => {
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

export const rentRequestService = {
  createRentRequest,
  getAllRentRequests,
  getRentRequestDetail,
};
