import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import { NextFunction, Request, Response } from "express";
import { config } from "../../config";

const registerUser = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const result = await authService.registerUser(payload);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "user registered successfully",
    data: result,
  });
});

const logInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = await authService.loginUserIntoDB(
      req.body,
    );

    // save access & refresh token to the cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Login Successful",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const getRefreshToken = req.cookies.refreshToken;

    const { accessToken } =
      await authService.createAccessTokenUsingRefreshToken(getRefreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Access Token Created",
      data: {
        accessToken,
      },
    });
  },
);

const currentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.currentUser(req?.user.id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "current user data",
      data: user,
    });
  },
);

export const authController = {
  registerUser,
  logInUser,
  refreshToken,
  currentUser,
};
