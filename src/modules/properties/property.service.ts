import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const allProperties = async (location: string, price: number, type: number) => {
  const andCondition: PropertyWhereInput[] = [];

  if (location) {
    andCondition.push({
      OR: [
        {
          address: { contains: location, mode: "insensitive" },
        },
        {
          city: { contains: location, mode: "insensitive" },
        },
        {
          district: { contains: location, mode: "insensitive" },
        },
        {
          division: { contains: location, mode: "insensitive" },
        },
      ],
    });
  }

  if (price) {
    const getPrice = Number(price);
    andCondition.push({
      rentAmount: getPrice,
    });
  }

  if (type) {
    andCondition.push({
      categoryId: type,
    });
  }

  const properties = await prisma.property.findMany({
    where: {
      AND: andCondition,
    },
    include: {
      category: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return properties;
};
const propertyDetail = async (id: string) => {};

export const propertyService = { allProperties, propertyDetail };
