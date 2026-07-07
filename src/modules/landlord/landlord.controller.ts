import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";

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
    const property = await landlordService.updateProperty(
      propertyId as string,
      payload,
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
  async (req: Request, res: Response, next: NextFunction) => {},
);

const allRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateRequestByLandlord = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const landlordController = {
  createProperty,
  updateProperty,
  deleteProperty,
  allRentalRequest,
  updateRequestByLandlord,
};
