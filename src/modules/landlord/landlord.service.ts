import { Property, ROLE } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createProperty = async (landlordId: string, payload: Property) => {
  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
  });
};
const updateProperty = async () => {};
const deleteProperty = async () => {};
const allRentalRequest = async () => {};
const updateRequestByLandlord = async () => {};

export const landlordService = {
  createProperty,
  updateProperty,
  deleteProperty,
  allRentalRequest,
  updateRequestByLandlord,
};
