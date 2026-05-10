import { Router } from "express";
import * as feeController from "src/controllers/FeeController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const FeeRoutes = Router();

FeeRoutes.get("/all", feeController.getAllFeeConfigs);

FeeRoutes.post("/marketplace", ProtectRoute, adminAndManager, feeController.createMarketplaceFee);
FeeRoutes.get("/marketplace", feeController.getAllMarketplaceFees);
FeeRoutes.get("/marketplace/:id", feeController.getMarketplaceFeeById);
FeeRoutes.patch("/marketplace/:id", ProtectRoute, feeController.updateMarketplaceFee);
FeeRoutes.delete("/marketplace/:id", ProtectRoute, adminAndManager, feeController.deleteMarketplaceFee);

FeeRoutes.post("/real-estate", ProtectRoute, adminAndManager, feeController.createRealEstateFee);
FeeRoutes.get("/real-estate", feeController.getAllRealEstateFees);
FeeRoutes.get("/real-estate/:id", feeController.getRealEstateFeeById);
FeeRoutes.patch("/real-estate/:id", ProtectRoute, feeController.updateRealEstateFee);
FeeRoutes.delete("/real-estate/:id", ProtectRoute, adminAndManager, feeController.deleteRealEstateFee);

FeeRoutes.post("/cars", ProtectRoute, adminAndManager, feeController.createCarFee);
FeeRoutes.get("/cars", feeController.getAllCarFees);
FeeRoutes.get("/cars/:id", feeController.getCarFeeById);
FeeRoutes.patch("/cars/:id", ProtectRoute, feeController.updateCarFee);
FeeRoutes.delete("/cars/:id", ProtectRoute, adminAndManager, feeController.deleteCarFee);

FeeRoutes.post("/motorcycles", ProtectRoute, adminAndManager, feeController.createMotorcycleFee);
FeeRoutes.get("/motorcycles", feeController.getAllMotorcycleFees);
FeeRoutes.get("/motorcycles/:id", feeController.getMotorcycleFeeById);
FeeRoutes.patch("/motorcycles/:id", ProtectRoute, feeController.updateMotorcycleFee);
FeeRoutes.delete("/motorcycles/:id", ProtectRoute, adminAndManager, feeController.deleteMotorcycleFee);

FeeRoutes.post("/boats", ProtectRoute, adminAndManager, feeController.createBoatFee);
FeeRoutes.get("/boats", feeController.getAllBoatFees);
FeeRoutes.get("/boats/:id", feeController.getBoatFeeById);
FeeRoutes.patch("/boats/:id", ProtectRoute, feeController.updateBoatFee);
FeeRoutes.delete("/boats/:id", ProtectRoute, adminAndManager, feeController.deleteBoatFee);

FeeRoutes.post("/equipment", ProtectRoute, adminAndManager, feeController.createEquipmentFee);
FeeRoutes.get("/equipment", feeController.getAllEquipmentFees);
FeeRoutes.get("/equipment/:id", feeController.getEquipmentFeeById);
FeeRoutes.patch("/equipment/:id", ProtectRoute, feeController.updateEquipmentFee);
FeeRoutes.delete("/equipment/:id", ProtectRoute, adminAndManager, feeController.deleteEquipmentFee);

FeeRoutes.post("/system-config", ProtectRoute, adminAndManager, feeController.createSystemConfig);
FeeRoutes.get("/system-config", feeController.getSystemConfig);
FeeRoutes.patch("/system-config/:id", ProtectRoute, feeController.updateSystemConfig);
FeeRoutes.delete("/system-config/:id", ProtectRoute, adminAndManager, feeController.deleteSystemConfig);

FeeRoutes.post("/sub-plans", ProtectRoute, adminAndManager, feeController.createSubPlan);
FeeRoutes.get("/sub-plans", feeController.getAllSubPlans);
FeeRoutes.get("/sub-plans/:id", feeController.getSubPlanById);
FeeRoutes.patch("/sub-plans/:id", ProtectRoute, feeController.updateSubPlan);
FeeRoutes.delete("/sub-plans/:id", ProtectRoute, adminAndManager, feeController.deleteSubPlan);

FeeRoutes.get("/business-plans", feeController.getBusinessPlanFees);
FeeRoutes.post("/business-plans", ProtectRoute, adminAndManager, feeController.createBusinessPlanFees);
FeeRoutes.patch("/business-plans/:id", ProtectRoute, adminAndManager, feeController.updateBusinessPlanFees);

export default FeeRoutes;
