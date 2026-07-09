import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./reviews.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      tenantId: req?.user?.id,
      propertyId: req.body.propertyId,
      review: req.body.review,
    };

    const review = await reviewService.createReview(payload);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Review created successfully",
      data: review,
    });
  },
);

export const reviewController = {
  createReview,
};
