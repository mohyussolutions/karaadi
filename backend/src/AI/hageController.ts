import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
//
export const handleHageChat = async (req: Request, res: Response) => {
  const { message, city, maxPrice, category } = req.body;

  try {
    const contextData = await (prisma as any)[category || "car"].findMany({
      where: {
        region: { contains: city, mode: "insensitive" },
        price: { lte: Number(maxPrice) || 1000000 },
        maGaday: false,
      },
      select: {
        title_en: true,
        title_so: true,
        price: true,
        region: true,
        id: true,
      },
      take: 10,
    });

    const systemPrompt = `Context: ${JSON.stringify(contextData)}`;

    const endpoint = process.env.AI_AGENCY_API;
    if (!endpoint) {
      return res
        .status(500)
        .json({ error: "AI_AGENCY_API endpoint not configured." });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        userMessage: message,
      }),
    });

    const data: any = await response.json();
    if (!data.reply) {
      return res.status(500).json({ error: "AI response invalid or empty." });
    }
    res.json({ reply: data.reply });
  } catch (error) {
    res.status(500).json({ error: "Hage is offline." });
  }
};
