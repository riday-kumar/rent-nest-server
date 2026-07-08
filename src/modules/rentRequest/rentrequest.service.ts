import { prisma } from "../../lib/prisma";
import { IRentRequest } from "./rentrequest.interface";

const createRentRequest = async (payload: IRentRequest) => {
  // check already tenant has a request for this property
  const existingRequest = await prisma.rentRequest.findFirst({
    where: {
      ...payload,
    },
  });
  if (existingRequest) {
    throw new Error("Tenant already has a request for this property", 400);
  }

  // now create request
  const rentRequest = await prisma.rentRequest.create({
    data: {
      ...payload,
    },
  });
  return rentRequest;
};
const getAllRentRequests = async () => {};
const getRentRequestDetail = async () => {};

export const rentRequestService = {
  createRentRequest,
  getAllRentRequests,
  getRentRequestDetail,
};
