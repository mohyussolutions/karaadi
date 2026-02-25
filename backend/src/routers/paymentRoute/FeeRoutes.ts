import { Router } from "express";
import * as feeController from "../../controllers/paymentController/FeeController.ts";

const FeeRoutes = Router();

FeeRoutes.post("/marketplace", feeController.createMarketplaceFee);
FeeRoutes.get("/marketplace", feeController.getAllMarketplaceFees);
FeeRoutes.get("/marketplace/:id", feeController.getMarketplaceFeeById);
FeeRoutes.patch("/marketplace/:id", feeController.updateMarketplaceFee);
FeeRoutes.delete("/marketplace/:id", feeController.deleteMarketplaceFee);

FeeRoutes.post("/real-estate", feeController.createRealEstateFee);
FeeRoutes.get("/real-estate", feeController.getAllRealEstateFees);
FeeRoutes.get("/real-estate/:id", feeController.getRealEstateFeeById);
FeeRoutes.patch("/real-estate/:id", feeController.updateRealEstateFee);
FeeRoutes.delete("/real-estate/:id", feeController.deleteRealEstateFee);

FeeRoutes.post("/cars", feeController.createCarFee);
FeeRoutes.get("/cars", feeController.getAllCarFees);
FeeRoutes.get("/cars/:id", feeController.getCarFeeById);
FeeRoutes.patch("/cars/:id", feeController.updateCarFee);
FeeRoutes.delete("/cars/:id", feeController.deleteCarFee);

FeeRoutes.post("/motorcycles", feeController.createMotorcycleFee);
FeeRoutes.get("/motorcycles", feeController.getAllMotorcycleFees);
FeeRoutes.get("/motorcycles/:id", feeController.getMotorcycleFeeById);
FeeRoutes.patch("/motorcycles/:id", feeController.updateMotorcycleFee);
FeeRoutes.delete("/motorcycles/:id", feeController.deleteMotorcycleFee);

FeeRoutes.post("/boats", feeController.createBoatFee);
FeeRoutes.get("/boats", feeController.getAllBoatFees);
FeeRoutes.get("/boats/:id", feeController.getBoatFeeById);
FeeRoutes.patch("/boats/:id", feeController.updateBoatFee);
FeeRoutes.delete("/boats/:id", feeController.deleteBoatFee);

FeeRoutes.post("/equipment", feeController.createEquipmentFee);
FeeRoutes.get("/equipment", feeController.getAllEquipmentFees);
FeeRoutes.get("/equipment/:id", feeController.getEquipmentFeeById);
FeeRoutes.patch("/equipment/:id", feeController.updateEquipmentFee);
FeeRoutes.delete("/equipment/:id", feeController.deleteEquipmentFee);

FeeRoutes.post("/system-config", feeController.createSystemConfig);
FeeRoutes.get("/system-config", feeController.getSystemConfig);
FeeRoutes.patch("/system-config/:id", feeController.updateSystemConfig);
FeeRoutes.delete("/system-config/:id", feeController.deleteSystemConfig);

FeeRoutes.post("/sub-plans", feeController.createSubPlan);
FeeRoutes.get("/sub-plans", feeController.getAllSubPlans);
FeeRoutes.get("/sub-plans/:id", feeController.getSubPlanById);
FeeRoutes.patch("/sub-plans/:id", feeController.updateSubPlan);
FeeRoutes.delete("/sub-plans/:id", feeController.deleteSubPlan);

export default FeeRoutes;
