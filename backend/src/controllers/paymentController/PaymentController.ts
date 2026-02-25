import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { CACHE_TTL, getPaginationParams } from "src/config/contstanst.ts";
import { PaymentService } from "../../services/paymentServer/paymentServer.ts";
import { useErrorHandler } from "../../hooks/useErrorHandler.ts";
import { ResponseCodes } from "../../config/waafipay.service.responseCodes.ts";
import { PaymentStatus } from "@prisma/client";

const paymentService = new PaymentService();

const CACHE_KEYS = {
  PAYMENT_STATS: (region?: string, city?: string) =>
    `payments:stats:${region || "all"}:${city || "all"}`,
  MY_PAYMENTS: (userId: string) => `payments:my:${userId}`,
  PAYMENT_DETAIL: (id: string) => `payment:detail:${id}`,
  ALL_PAYMENTS: (page: number, limit: number, status?: string) =>
    `payments:all:${page}:${limit}:${status || "all"}`,
};

const getQueryString = (param: any): string | undefined => {
  if (Array.isArray(param)) return param[0];
  if (typeof param === "string") return param;
  return undefined;
};

interface PaymentRequestBody {
  payment?: any;
  userId?: string;
  [key: string]: any;
}

export const createPayment = async (
  req: Request<{}, {}, PaymentRequestBody>,
  res: Response,
) => {
  try {
    const p = req.body?.payment || req.body;
    const userId = p?.userId || (req as any).user?.id;

    if (!p || typeof p !== "object") {
      return res.status(400).json({
        success: false,
        message: "Payment information is required.",
        responseCode: 400,
        key: "MISSING_DATA",
        userFriendly: true,
      });
    }

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing userId in payment object or authentication.",
        responseCode: 400,
        key: "MISSING_USER_ID",
        userFriendly: true,
      });
    }

    const result = await paymentService.processWaafiPayment({ ...p, userId });

    if (!result.success) {
      return res.status(400).json({
        key: result.key || ResponseCodes.PROCESSING_ERROR.key,
        message: result.message || ResponseCodes.PROCESSING_ERROR.message,
        responseCode:
          result.responseCode || ResponseCodes.PROCESSING_ERROR.code,
        amount: result.amount || null,
      });
    }

    await Promise.all([
      cacheManager.deletePattern("payments:*"),
      cacheManager.delete(CACHE_KEYS.MY_PAYMENTS(userId)),
    ]);

    return res.status(201).json({
      key: ResponseCodes.SUCCESS.key,
      message: "Payment processed successfully!",
      responseCode: ResponseCodes.SUCCESS.code,
      amount: result.amount,
      transactionId: result.transactionId,
    });
  } catch (err: any) {
    const handledError = useErrorHandler(err);
    return res.status(500).json(handledError);
  }
};

export const getItemDetail = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const cacheKey = `item:detail:${id}`;

    const item = await cacheManager.withCache(
      cacheKey,
      async () => await paymentService.getItemDetail(id),
      CACHE_TTL.DETAIL,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    return res.json({
      success: true,
      category: item.category,
      data: item.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve item details.",
    });
  }
};

export const getPaymentStats = async (req: Request, res: Response) => {
  try {
    const region = getQueryString(req.query.region);
    const city = getQueryString(req.query.city);

    const cacheKey = CACHE_KEYS.PAYMENT_STATS(region, city);
    const stats = await cacheManager.withCache(
      cacheKey,
      async () => await paymentService.getPaymentStats(region, city),
      CACHE_TTL.STATS,
    );

    return res.json({ success: true, data: stats });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch payment statistics.",
    });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.limit as string,
    );

    const status = getQueryString(req.query.status);
    const paymentMethod = getQueryString(req.query.paymentMethod);

    const cacheKey = CACHE_KEYS.ALL_PAYMENTS(page, limit, status);
    const result = await cacheManager.withCache(
      cacheKey,
      async () => {
        const where: any = {};
        if (status) where.status = status as PaymentStatus;
        if (paymentMethod) where.paymentMethod = paymentMethod;

        const [payments, total] = await Promise.all([
          prisma.payment.findMany({
            where,
            select: {
              id: true,
              totalAmount: true,
              planAmount: true,
              feeAmount: true,
              taxAmount: true,
              platformFee: true,
              currency: true,
              status: true,
              paymentMethod: true,
              transactionId: true,
              createdAt: true,
              user: { select: { id: true, username: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
          }),
          prisma.payment.count({ where }),
        ]);

        return { payments, total };
      },
      CACHE_TTL.LIST,
    );

    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch payments.",
    });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { status, transactionId } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const payment = await prisma.payment.update({
      where: { id },
      data: { status, transactionId, updatedAt: new Date() },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        transactionId: true,
        userId: true,
      },
    });

    await Promise.all([
      cacheManager.deletePattern("payments:*"),
      cacheManager.delete(CACHE_KEYS.MY_PAYMENTS(payment.userId)),
      cacheManager.delete(CACHE_KEYS.PAYMENT_DETAIL(id)),
    ]);

    return res.json({
      success: true,
      message: "Payment updated successfully.",
      data: payment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to update payment.",
    });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const payment = await prisma.payment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    await prisma.payment.delete({ where: { id } });

    await Promise.all([
      cacheManager.deletePattern("payments:*"),
      cacheManager.delete(CACHE_KEYS.MY_PAYMENTS(payment.userId)),
      cacheManager.delete(CACHE_KEYS.PAYMENT_DETAIL(id)),
    ]);

    return res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete payment.",
    });
  }
};

export const searchPayments = async (req: Request, res: Response) => {
  try {
    const query = getQueryString(req.query.query);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const payments = await prisma.payment.findMany({
      where: {
        OR: [{ transactionId: { contains: query, mode: "insensitive" } }],
      },
      select: {
        id: true,
        totalAmount: true,
        planAmount: true,
        feeAmount: true,
        taxAmount: true,
        platformFee: true,
        currency: true,
        status: true,
        paymentMethod: true,
        transactionId: true,
        createdAt: true,
        user: { select: { id: true, username: true, email: true } },
      },
      take: 50,
    });

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to search payments.",
    });
  }
};

export const getMyPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    const cacheKey = CACHE_KEYS.MY_PAYMENTS(userId);
    const payments = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.payment.findMany({
          where: { userId },
          select: {
            id: true,
            totalAmount: true,
            planAmount: true,
            feeAmount: true,
            taxAmount: true,
            platformFee: true,
            currency: true,
            status: true,
            paymentMethod: true,
            transactionId: true,
            createdAt: true,
            boatId: true,
            carId: true,
            marketplaceId: true,
            realEstateId: true,
            motorcycleId: true,
            farmequipmentId: true,
            jobId: true,
            subscriptionId: true,
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
      },
      CACHE_TTL.LIST,
    );

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch your payments.",
    });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const cacheKey = CACHE_KEYS.PAYMENT_DETAIL(id);

    const payment = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.payment.findUnique({
          where: { id },
          select: {
            id: true,
            totalAmount: true,
            planAmount: true,
            feeAmount: true,
            taxAmount: true,
            platformFee: true,
            currency: true,
            status: true,
            paymentMethod: true,
            transactionId: true,
            createdAt: true,
            updatedAt: true,
            paidAt: true,
            boatId: true,
            carId: true,
            marketplaceId: true,
            realEstateId: true,
            motorcycleId: true,
            farmequipmentId: true,
            jobId: true,
            subscriptionId: true,
            user: {
              select: { id: true, username: true, email: true, phone: true },
            },
          },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch payment details.",
    });
  }
};

const paymentController = {
  createPayment,
  getPaymentStats,
  getAllPayments,
  updatePaymentStatus,
  deletePayment,
  searchPayments,
  getMyPayments,
  getItemDetail,
  getPaymentById,
};

export default paymentController;
