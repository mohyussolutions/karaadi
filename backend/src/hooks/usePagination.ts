import { Request } from "express";

export function getPageAndSkip(query: any) {
  const { page = "1", pageSize = "20" } = query;
  const pageNum = parseInt(page as string, 10) || 1;
  const sizeNum = parseInt(pageSize as string, 10) || 20;
  const skip = (pageNum - 1) * sizeNum;
  return { pageNum, sizeNum, skip };
}
