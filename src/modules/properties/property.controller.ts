import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.query);

    const properties = await propertyService.allProperties(req.query);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Properties retrieved successfully",
      data: properties,
    });
  },
);

const getPropertyDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const property = await propertyService.propertyDetail(id as string);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Property retrieved successfully",
      data: property,
    });
  },
);

export const propertyController = { getAllProperties, getPropertyDetail };
