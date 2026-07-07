import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
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
