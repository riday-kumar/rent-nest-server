import { PropertyStatus } from "../../../generated/prisma/enums";
import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPropQuery } from "./property.interface";

const allProperties = async (query: IPropQuery) => {
  const { location, price, type, propStatus, limit, page, sortBy, sortOrder } =
    query;

  const contentLimit = limit ? Number(limit) : 8;
  const pageNo = page ? Number(page) : 1;
  const skip = (pageNo - 1) * contentLimit;

  const sortedBy = sortBy ? sortBy : "createdAt";
  const sortedOrder = sortOrder ? sortOrder : "desc";

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
      categoryId: Number(type),
    });
  }

  if (propStatus) {
    andCondition.push({
      propertyStatus: propStatus as PropertyStatus,
    });
  }

  const properties = await prisma.property.findMany({
    where: {
      AND: andCondition,
      // propertyStatus: "AVAILABLE",
    },
    // pagination
    take: contentLimit,
    skip: skip,
    orderBy: {
      [sortedBy]: sortedOrder,
    },
    include: {
      category: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
      review: {
        select: {
          review: true,
        },
      },
    },
  });

  if (properties.length === 0) {
    throw new Error("Property is not available");
  }

  const totalPropertiesCount = await prisma.property.count({
    where: {
      AND: andCondition,
      // propertyStatus: "AVAILABLE",
    },
  });

  return {
    data: properties,
    meta: {
      total: totalPropertiesCount,
      limit: contentLimit,
      page: pageNo,
      totalPages: Math.ceil(totalPropertiesCount / contentLimit),
    },
  };
};
const propertyDetail = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      category: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
      landlord: {
        omit: {
          password: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
        },
      },
      review: {
        select: {
          review: true,
        },
      },
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }
  return property;
};

export const propertyService = { allProperties, propertyDetail };
