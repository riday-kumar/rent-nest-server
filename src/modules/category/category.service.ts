import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

const createCategory = async (categoryName: string) => {
  if (!categoryName?.trim()) {
    throw new Error("Category Name is required");
  }

  const category = await prisma.category.create({
    data: {
      categoryName,
    },
  });
  return category;
};
const updateCategory = async (categoryId: number, categoryName: string) => {
  const updateCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      categoryName,
    },
  });
  return updateCategory;
};
const deleteCategory = async (categoryId: number) => {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
