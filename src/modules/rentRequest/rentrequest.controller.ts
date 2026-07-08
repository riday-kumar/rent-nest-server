import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentRequestService } from "./rentrequest.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createRentRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req?.user?.id;
    const propertyId = req?.query?.propertyId as string;
    const payload = {
      tenantId,
      propertyId,
    };

    const request = await rentRequestService.createRentRequest(payload);
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Rent Request Created.Wait for landlord approval",
      data: request,
    });
  },
);
const getAllRentRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getRentRequestDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const rentRequestController = {
  createRentRequest,
  getAllRentRequests,
  getRentRequestDetail,
};
