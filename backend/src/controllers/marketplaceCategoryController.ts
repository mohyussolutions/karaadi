import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.marketplaceCategory.findMany({
      orderBy: { createdAt: "asc" },
      include: { subcategories: { orderBy: { createdAt: "asc" } } },
    });
    res.json(cats);
  } catch {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { nameEn, nameSo } = req.body as { nameEn: string; nameSo: string };
  if (!nameEn?.trim() || !nameSo?.trim())
    return res.status(400).json({ error: "nameEn and nameSo are required" });
  const key = slugify(nameEn);
  try {
    const cat = await prisma.marketplaceCategory.create({
      data: { key, nameEn: nameEn.trim(), nameSo: nameSo.trim() },
      include: { subcategories: true },
    });
    res.status(201).json(cat);
  } catch (err: any) {
    if (err?.code === "P2002")
      return res.status(409).json({ error: "Category key already exists" });
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const key = req.params.key as string;
  const { nameEn, nameSo } = req.body as { nameEn?: string; nameSo?: string };
  try {
    const cat = await prisma.marketplaceCategory.update({
      where: { key },
      data: {
        ...(nameEn?.trim() ? { nameEn: nameEn.trim() } : {}),
        ...(nameSo?.trim() ? { nameSo: nameSo.trim() } : {}),
      },
      include: { subcategories: true },
    });
    res.json(cat);
  } catch {
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const key = req.params.key as string;
  try {
    await prisma.marketplaceCategory.delete({ where: { key } });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

export const createSubcategory = async (req: Request, res: Response) => {
  const categoryKey = req.params.key as string;
  const { nameEn, nameSo } = req.body as { nameEn: string; nameSo: string };
  if (!nameEn?.trim() || !nameSo?.trim())
    return res.status(400).json({ error: "nameEn and nameSo are required" });
  const key = slugify(nameEn);
  try {
    const sub = await prisma.marketplaceSubcategory.create({
      data: { key, nameEn: nameEn.trim(), nameSo: nameSo.trim(), categoryKey },
    });
    res.status(201).json(sub);
  } catch (err: any) {
    if (err?.code === "P2002")
      return res.status(409).json({ error: "Subcategory key already exists in this category" });
    res.status(500).json({ error: "Failed to create subcategory" });
  }
};

export const updateSubcategory = async (req: Request, res: Response) => {
  const subKey = req.params.subKey as string;
  const { nameEn, nameSo } = req.body as { nameEn?: string; nameSo?: string };
  try {
    const sub = await prisma.marketplaceSubcategory.update({
      where: { id: subKey },
      data: {
        ...(nameEn?.trim() ? { nameEn: nameEn.trim() } : {}),
        ...(nameSo?.trim() ? { nameSo: nameSo.trim() } : {}),
      },
    });
    res.json(sub);
  } catch {
    res.status(500).json({ error: "Failed to update subcategory" });
  }
};

export const deleteSubcategory = async (req: Request, res: Response) => {
  const subKey = req.params.subKey as string;
  try {
    await prisma.marketplaceSubcategory.delete({ where: { id: subKey } });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete subcategory" });
  }
};
