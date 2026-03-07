import { Router } from "express";
import { handleHageChat } from "./hageController.ts";

const router = Router();

router.post("/chat", handleHageChat);

export default router;
