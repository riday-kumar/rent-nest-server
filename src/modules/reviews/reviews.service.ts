import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./reviews.interface";

const createReview = async (payload: ICreateReview) => {
  const { tenantId, propertyId, review } = payload;

  if (!tenantId || !propertyId || !review) {
    throw new Error("Tenant ID, Property ID, and Review is required");
  }

  const newReview = await prisma.review.create({
    data: {
      tenantId,
      propertyId,
      review,
    },
  });
  return newReview;
};
export const reviewService = { createReview };
