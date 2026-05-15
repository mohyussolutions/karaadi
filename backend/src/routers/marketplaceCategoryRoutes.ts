import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "src/controllers/marketplaceCategoryController.ts";
import { ProtectRoute, adminAndManager } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const router = Router();

router.get("/", getCategories);

router.post("/", ProtectRoute, adminAndManager, createCategory);
router.put("/:key", ProtectRoute, adminAndManager, updateCategory);
router.delete("/:key", ProtectRoute, adminAndManager, deleteCategory);

router.post("/:key/subcategories", ProtectRoute, adminAndManager, createSubcategory);
router.put("/:key/subcategories/:subKey", ProtectRoute, adminAndManager, updateSubcategory);
router.delete("/:key/subcategories/:subKey", ProtectRoute, adminAndManager, deleteSubcategory);

export default router;
