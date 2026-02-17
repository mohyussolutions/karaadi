import { Router } from "express";
import { getHageStatus, handleHageChat } from "../AI/hageController.ts";

const router = Router();

router.get("/", getHageStatus);
router.post("/", handleHageChat);

export default router;
