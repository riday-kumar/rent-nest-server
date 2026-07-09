import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status";

// 404 not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, {
    success: false,
    statusCode: status.NOT_FOUND,
    message: `Can't find ${req.originalUrl} on this server!`,
    data: Date(),
  });
};
