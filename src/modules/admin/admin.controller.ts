import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await adminService.getAllUsers();
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Users retrieved successfully",
      data: users,
    });
  },
);
const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getAllRentals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.params?.id as string;
    const updatedUser = await adminService.updateUserStatus(userId);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "User status updated successfully",
      data: updatedUser,
    });
  },
);

export const adminController = {
  getAllUsers,
  getAllProperties,
  getAllRentals,
  updateUserStatus,
};
