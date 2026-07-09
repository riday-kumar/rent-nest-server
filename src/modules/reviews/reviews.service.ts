import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./reviews.interface";

const createReview = async (payload: ICreateReview) => {
  const { tenantId, propertyId, review } = payload;
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
