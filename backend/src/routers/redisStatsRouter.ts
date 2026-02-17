import { Router } from "express";
import redisServer from "../services/redisserver/redisServer.ts";

const router = Router();

router.get("/memory", async (req, res) => {
  try {
    const status = await redisServer.getStatus();
    res.json({
      used_memory: status.memoryUsage.used_memory,
      used_memory_human: status.memoryUsage.used_memory_human,
      used_memory_peak: status.memoryUsage.used_memory_peak,
      used_memory_peak_human: status.memoryUsage.used_memory_peak_human,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get Redis memory usage" });
  }
});

export default router;
