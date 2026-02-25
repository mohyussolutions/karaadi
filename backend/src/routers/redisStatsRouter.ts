import { Router } from "express";
import redisServer from "src/services/redisserver/redisServer.ts";

const router = Router();

router.get("/memory", async (req, res) => {
  try {
    const status = await redisServer.getStatus();
    const mem = status.memoryUsage as any;

    res.json({
      used_memory: mem.used_memory,
      used_memory_human: mem.used_memory_human,
      used_memory_peak: mem.used_memory_peak,
      used_memory_peak_human: mem.used_memory_peak_human,
      total_system_memory: mem.total_system_memory_human || "N/A",
      mem_fragmentation_ratio: mem.mem_fragmentation_ratio,
      maxmemory_human: mem.maxmemory_human || "0 (unlimited)",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get Redis memory usage" });
  }
});

export default router;
