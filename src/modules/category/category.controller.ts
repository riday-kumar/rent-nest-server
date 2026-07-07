import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryService.getAllCategories();
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "categories retrieved successfully",
      data: categories,
    });
  },
);

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryName } = req.body;
    const category = await categoryService.createCategory(categoryName);
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "category created successfully",
      data: category,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { categoryName } = req.body;
    const category = await categoryService.updateCategory(
      Number(id),
      categoryName,
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "category updated successfully",
      data: category,
    });
  },
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await categoryService.deleteCategory(Number(id));
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "category deleted successfully",
      data: null,
    });
  },
);

export const categoryController = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
