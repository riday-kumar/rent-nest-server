import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { PaginationOptions } from "../../interfaces/common";

const initiatePayment = async (payload: any) => {
  if (!payload.reqId) {
    throw new Error("Request ID is required");
  }

  const isRequestExist = await prisma.rentRequest.findUniqueOrThrow({
    where: {
      id: payload.reqId,
    },
  });

  if (isRequestExist.rentStatus !== "APPROVED") {
    throw new Error("Request is not approved");
  }

  const { rentAmount } = await prisma.property.findUniqueOrThrow({
    where: {
      id: isRequestExist.propertyId,
    },
  });

  const tran_id = uuidv4();

  // payment related work
  const paymentData = {
    store_id: config.ssl_commerze_store_id,
    store_passwd: config.ssl_commerze_store_password,
    total_amount: rentAmount,
    currency: "BDT",
    tran_id: tran_id,
    success_url: `${config.app_url}/api/payments?reqId=${payload.reqId}&tran_id=${tran_id}&status=success`,
    fail_url: `${config.app_url}/api/payments?reqId=${payload.reqId}&tran_id=${tran_id}&status=fail`,
    cancel_url: `${config.app_url}/api/payments?reqId=${payload.reqId}&tran_id=${tran_id}&status=cancel`,
    cus_name: payload.userName,
    cus_email: payload.userEmail,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",

    // value_a: "ref001_A",
  };

  const response = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    paymentData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const data = await response.data;
  //   console.log("data", data);

  // check successfully payment already exists or not
  const isSuccessPayment = await prisma.payment.findFirst({
    where: {
      rentRequestId: payload.reqId,
      status: "PAID",
    },
  });

  if (isSuccessPayment) {
    throw new Error("already paid");
  }

  // create payment
  await prisma.payment.create({
    data: {
      transactionId: tran_id,
      rentRequestId: payload.reqId,
      amount: Number(rentAmount),
    },
  });

  const GatewayPageURL = data.GatewayPageURL;

  return GatewayPageURL;
};

const verifyPayment = async (
  reqId: string,
  tran_id: string,
  status: string,
  payload: any,
) => {
  if (!reqId || !tran_id || !status) {
    throw new Error("Request ID, Transaction ID, and Status is required");
  }

  const response = await axios.post(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${payload.val_id}&store_id=${config.ssl_commerze_store_id}&store_passwd=${config.ssl_commerze_store_password}&format=json`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  //   console.log("api response", response);
  const data = await response.data;

  if (data.status === "VALID") {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          transactionId: tran_id,
        },
        data: {
          status: "PAID",
          meta: payload,
        },
      });
      //   find property id
      const propertyId = await prisma.rentRequest.findUniqueOrThrow({
        where: {
          id: reqId,
        },
      });

      await prisma.property.update({
        where: {
          id: propertyId.propertyId,
        },
        data: {
          propertyStatus: "RENTED",
        },
      });
    });
  } else if (data.status === "FAILED") {
    await prisma.payment.update({
      where: {
        transactionId: tran_id,
      },
      data: {
        status: "FAILED",
        meta: payload,
      },
    });
  }

  return status;
};
const paymentHistory = async (query: PaginationOptions, userId: string) => {
  const { limit, page, sortBy, sortOrder } = query;

  const contentLimit = limit ? Number(limit) : 8;
  const pageNo = page ? Number(page) : 1;
  const skip = (pageNo - 1) * contentLimit;

  const sortedBy = sortBy ? sortBy : "createdAt";
  const sortedOrder = sortOrder ? sortOrder : "desc";

  const paymentHistory = await prisma.payment.findMany({
    where: {
      rentRequest: {
        tenantId: userId,
      },
    },
    omit: {
      meta: true,
    },
    // pagination
    take: contentLimit,
    skip: skip,
    orderBy: {
      [sortedBy]: sortedOrder,
    },
  });

  if (paymentHistory.length === 0) {
    throw new Error("No payment history found");
  }

  const totalPaymentHistoryCount = await prisma.payment.count({
    where: {
      rentRequest: {
        tenantId: userId,
      },
    },
  });

  return {
    data: paymentHistory,
    meta: {
      total: totalPaymentHistoryCount,
      limit: contentLimit,
      page: pageNo,
      totalPages: Math.ceil(totalPaymentHistoryCount / contentLimit),
    },
  };
};
const getPaymentDetail = async (paymentId: string, userId: string) => {
  const paymentDetails = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      rentRequest: {
        omit: {
          id: true,
        },
        include: {
          property: true,
        },
      },
    },
  });

  if (paymentDetails?.rentRequest.tenantId !== userId) {
    throw new Error("This is not Your Payment detail");
  }

  return paymentDetails;
};

export const paymentService = {
  initiatePayment,
  verifyPayment,
  paymentHistory,
  getPaymentDetail,
};
