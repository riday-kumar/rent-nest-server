import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentRequestService } from "./rentrequest.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { IRequestDetail } from "./rentrequest.interface";

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
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req?.user?.id;
    const allRequests = await rentRequestService.getAllRentRequests(tenantId);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "All Rent Requests Fetched",
      data: allRequests,
    });
  },
);
const getRentRequestDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req?.user?.id as string;
    const requestId = req?.params?.id as string;
    const payLoad: IRequestDetail = { tenantId, requestId };
    const request = await rentRequestService.getRentRequestDetail(payLoad);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Rent Request Fetched",
      data: request,
    });
  },
);

const getAllMyRents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req?.user?.id as string;
    const allRents = await rentRequestService.getAllMyRents(
      req.query,
      tenantId,
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "All Rents Fetched",
      data: allRents,
    });
  },
);

export const rentRequestController = {
  createRentRequest,
  getAllRentRequests,
  getRentRequestDetail,
  getAllMyRents,
};
