import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.query);
    const location = req?.query?.location as string;
    const price = Number(req?.query?.price);
    const type = Number(req?.query?.type);
    const properties = await propertyService.allProperties(
      location,
      price,
      type,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Properties retrieved successfully",
      data: properties,
    });
  },
);

const getPropertyDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const propertyController = { getAllProperties, getPropertyDetail };
