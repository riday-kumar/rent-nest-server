import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payments.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { config } from "../../config";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      reqId: req.body.reqId,
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
    };

    const paymentUrl = await paymentService.initiatePayment(payload);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Payment initiated successfully",
      data: paymentUrl,
    });
  },
);
const verifyPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reqId, tran_id, status } = req.query;
    const payload = req.body;
    // console.log("from verify payment", req.body, reqId, tran_id, status);

    const response = await paymentService.verifyPayment(
      reqId as string,
      tran_id as string,
      status as string,
      payload,
    );

    if (response == "success") {
      res.redirect(config.ssl_commerze_success_url);
    } else if (response == "fail") {
      res.redirect(config.ssl_commerze_fail_url);
    } else if (response == "cancel") {
      res.redirect(config.ssl_commerze_cancel_url);
    }
  },
);
const paymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.user.id;
    const paymentHistory = await paymentService.paymentHistory(
      req.query,
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Payment history found successfully",
      data: paymentHistory,
    });
  },
);
const getPaymentDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req?.params?.id as string;
    const userId = req?.user.id;

    const paymentDetails = await paymentService.getPaymentDetail(
      paymentId,
      userId,
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Payment detail found successfully",
      data: paymentDetails,
    });
  },
);

export const paymentController = {
  createPayment,
  verifyPayment,
  paymentHistory,
  getPaymentDetail,
};
