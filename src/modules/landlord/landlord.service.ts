import { Property, ROLE } from "../../../generated/prisma/client";
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
const updateProperty = async (propertyId: string, payload: Property) => {
  const property = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: payload,
  });
  return property;
};
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
