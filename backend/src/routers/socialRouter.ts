import { Router, Request, Response } from "express";

const socialRouter = Router();

socialRouter.post("/post", async (req: Request, res: Response) => {
  const { itemId, itemTitle, platforms } = req.body;

  if (!itemId) {
    return res.status(400).json({ error: "itemId is required" });
  }

  const selected = Object.entries(platforms || {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  console.log(
    `[Social] Post queued — item: ${itemId} "${itemTitle}" → ${selected.join(", ") || "none"}`,
  );

  // ...existing code...

  return res.json({ queued: true, platforms: selected });
});

export default socialRouter;
