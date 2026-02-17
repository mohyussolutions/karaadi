import { Request, Response } from "express";
import OpenAI from "openai";
import prisma from "../core/utils/db.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getHageStatus = async (req: Request, res: Response) => {
  try {
    const [cars, boats, realEstate, marketplace] = await Promise.all([
      prisma.car.count({ where: { maGaday: false } }),
      prisma.boat.count({ where: { maGaday: false } }),
      prisma.realEstate.count({ where: { maGaday: false } }),
      prisma.marketplace.count({ where: { maGaday: false } }),
    ]);

    res.json({
      status: "online",
      inventory: { cars, boats, realEstate, marketplace },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch status" });
  }
};

export const handleHageChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const lowerMsg = message.toLowerCase();
    let item = null;
    let itemType = "";

    if (lowerMsg.includes("car") || lowerMsg.includes("gaari")) {
      item = await prisma.car.findFirst({
        where: { maGaday: false },
        orderBy: { createdAt: "desc" },
      });
      itemType = "cars";
    } else if (lowerMsg.includes("boat") || lowerMsg.includes("doon")) {
      item = await prisma.boat.findFirst({
        where: { maGaday: false },
        orderBy: { createdAt: "desc" },
      });
      itemType = "boats";
    } else if (lowerMsg.includes("guri") || lowerMsg.includes("realestate")) {
      item = await prisma.realEstate.findFirst({
        where: { maGaday: false },
        orderBy: { createdAt: "desc" },
      });
      itemType = "real-estate";
    }

    if (item) {
      const link = `http://localhost:3000/storeFront/${itemType}/${item.id}`;
      return res.json({
        reply: `Waxaan kuu helay: ${item.title}\nQiimaha: $${item.price}\nGobolka: ${item.region || item.city}\nLink: ${link}`,
      });
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      });
      return res.json({ reply: response.choices[0].message.content });
    } catch (err: any) {
      const latestAds = await prisma.car.findMany({
        take: 1,
        orderBy: { createdAt: "desc" },
      });
      const adTitle =
        latestAds.length > 0 ? latestAds[0].title : "alaab kale oo cusub";

      return res.json({
        reply: `Waan ka xunnahay, adeegga AI-ga hadda waa nasasho. Laakiin waxaan kuu haynaa: ${adTitle}. Fadlan fiiri menu-ga sare.`,
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
