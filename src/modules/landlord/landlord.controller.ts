import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { RentRequestStatus } from "../../../generated/prisma/enums";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user.id;
    const payload = req.body;
    const property = await landlordService.createProperty(landlordId, payload);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Property created successfully",
      data: property,
    });
  },
);

const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
    const payload = req.body;
    const userId = req.user.id;
    const property = await landlordService.updateProperty(
      propertyId as string,
      payload,
      userId,
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Property updated successfully",
      data: property,
    });
  },
);

const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
    const userId = req.user.id;
    await landlordService.deleteProperty(propertyId as string, userId);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Property deleted successfully",
      data: null,
    });
  },
);

const allRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req?.user?.id;
    const allRentalRequests = await landlordService.allRentalRequest(
      landlordId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "All rental requests retrieved successfully",
      data: allRentalRequests,
    });
  },
);

const updateRequestByLandlord = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqId = req.params.id;
    const statusMsg = req.body.status;
    const userId = req.user.id;
    const updateStatus = await landlordService.updateRequestByLandlord(
      reqId as string,
      statusMsg as RentRequestStatus,
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Rental request status updated successfully",
      data: updateStatus,
    });
  },
);

export const landlordController = {
  createProperty,
  updateProperty,
  deleteProperty,
  allRentalRequest,
  updateRequestByLandlord,
};
