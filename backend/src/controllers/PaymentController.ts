import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { PaymentStatus, type Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";
import { ResponseCodes } from "src/config/waafipay.service.responseCodes.ts";
import { useErrorHandler } from "src/hooks/useErrorHandler.ts";
import { paymentValidation } from "src/validation/payment.validation.ts";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const p = req.body?.payment || req.body;
    const userId = p?.userId || (req as any).user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        key: ResponseCodes.MISSING_FIELDS.key,
        message: "Missing userId in payment object or authentication.",
        responseCode: ResponseCodes.MISSING_FIELDS.code,
      });
    }

    const validation = paymentValidation.safeParse({ ...p, userId });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        key: ResponseCodes.MISSING_FIELDS.key,
        message: ResponseCodes.MISSING_FIELDS.message,
        responseCode: ResponseCodes.MISSING_FIELDS.code,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    if (!validation.data.totalAmount || validation.data.totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        key: ResponseCodes.INVALID_AMOUNT.key,
        message: ResponseCodes.INVALID_AMOUNT.message,
        responseCode: ResponseCodes.INVALID_AMOUNT.code,
      });
    }

    const payment = await prisma.payment.create({
      data: validation.data as Prisma.PaymentUncheckedCreateInput,
    });

    return res.status(201).json({
      success: true,
      key: ResponseCodes.SUCCESS.key,
      message: ResponseCodes.SUCCESS.message,
      responseCode: ResponseCodes.SUCCESS.code,
      amount: payment.totalAmount,
      transactionId: payment.transactionId,
    });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

export const getItemDetail = async (req: Request, res: Response) => {
  try {
    const item = await prisma.payment.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true,
        status: true,
        paymentMethod: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        key: ResponseCodes.TRANSACTION_FAILED.key,
        message: "Item not found.",
        responseCode: ResponseCodes.TRANSACTION_FAILED.code,
      });
    }

    return res.json({
      success: true,
      data: item,
    });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

export const getPaymentStats = async (req: Request, res: Response) => {
  try {
    const _region = req.query.region as string | undefined;
    const _city = req.query.city as string | undefined;

    const [total, successful, pending, failed, revenue] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.count({ where: { status: PaymentStatus.COMPLETED } }),
      prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
      prisma.payment.aggregate({
        _sum: { totalAmount: true },
        where: { status: PaymentStatus.COMPLETED },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        total,
        successful,
        pending,
        failed,
        totalRevenue: revenue._sum.totalAmount ?? 0,
      },
    });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as PaymentStatus | undefined;
    const paymentMethod = req.query.paymentMethod as string | undefined;

    const where: Prisma.PaymentWhereInput = {};
    if (status) where.status = status;
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
          payerPhone: true,
          transactionId: true,
          createdAt: true,
          paidAt: true,
          boatId: true,
          carId: true,
          realEstateId: true,
          motorcycleId: true,
          farmequipmentId: true,
          marketplaceId: true,
          jobId: true,
          subscriptionId: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
              profileImage: true,
            },
          },
          boat: { select: { title: true, images: true } },
          car: { select: { title: true, images: true } },
          realEstate: { select: { title: true, images: true } },
          motorcycle: { select: { title: true, images: true } },
          farmequipment: { select: { title: true, images: true } },
          marketplace: { select: { title: true, images: true } },
          job: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return res.json({
      success: true,
      data: { payments, total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { status, transactionId } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        key: ResponseCodes.MISSING_FIELDS.key,
        message: "Status is required.",
        responseCode: ResponseCodes.MISSING_FIELDS.code,
      });
    }

    const payment = await prisma.payment.update({
      where: { id: req.params.id as string },
      data: { status, transactionId, updatedAt: new Date() },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        transactionId: true,
        userId: true,
      },
    });

    return res.json({
      success: true,
      key: ResponseCodes.SUCCESS.key,
      message: "Payment updated successfully.",
      responseCode: ResponseCodes.SUCCESS.code,
      data: payment,
    });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id as string },
      select: { id: true },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        key: ResponseCodes.TRANSACTION_FAILED.key,
        message: "Payment not found.",
        responseCode: ResponseCodes.TRANSACTION_FAILED.code,
      });
    }

    await prisma.payment.delete({ where: { id: req.params.id as string } });

    return res.json({
      success: true,
      key: ResponseCodes.SUCCESS.key,
      message: "Payment deleted successfully.",
      responseCode: ResponseCodes.SUCCESS.code,
    });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

export const searchPayments = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;

    if (!query) {
      return res.status(400).json({
        success: false,
        key: ResponseCodes.MISSING_FIELDS.key,
        message: "Search query is required.",
        responseCode: ResponseCodes.MISSING_FIELDS.code,
      });
    }

    const payments = await prisma.payment.findMany({
      where: {
        OR: [
          { transactionId: { contains: query, mode: "insensitive" } },
          { user: { email: { contains: query, mode: "insensitive" } } },
          { user: { username: { contains: query, mode: "insensitive" } } },
        ],
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

    return res.json({ success: true, data: payments });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

export const getMyPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        key: ResponseCodes.MISSING_FIELDS.key,
        message: "User authentication required.",
        responseCode: ResponseCodes.MISSING_FIELDS.code,
      });
    }

    const payments = await prisma.payment.findMany({
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

    return res.json({ success: true, data: payments });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id as string },
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

    if (!payment) {
      return res.status(404).json({
        success: false,
        key: ResponseCodes.TRANSACTION_FAILED.key,
        message: "Payment not found.",
        responseCode: ResponseCodes.TRANSACTION_FAILED.code,
      });
    }

    return res.json({ success: true, data: payment });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

export const revenueByMonth = async (_req: Request, res: Response) => {
  try {
    const months = await prisma.payment.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const monthSet = Array.from<string>(
      new Set(
        months.map(
          (p: { createdAt: Date }) =>
            `${p.createdAt.getFullYear()}-${p.createdAt.getMonth() + 1}`,
        ),
      ),
    );

    const results = await Promise.all(
      monthSet.map(async (m) => {
        const [year, month] = m.split("-").map(Number);
        const sum = await prisma.payment.aggregate({
          _sum: { totalAmount: true },
          where: {
            createdAt: {
              gte: startOfMonth(new Date(year, month - 1)),
              lte: endOfMonth(new Date(year, month - 1)),
            },
          },
        });
        return { month: m, revenue: sum._sum?.totalAmount ?? 0 };
      }),
    );

    return res.json({ success: true, data: results });
  } catch (err: unknown) {
    return res.status(500).json(useErrorHandler(err));
  }
};

const paymentController = {
  createPayment,
  getItemDetail,
  getPaymentStats,
  getAllPayments,
  updatePaymentStatus,
  deletePayment,
  searchPayments,
  getMyPayments,
  getPaymentById,
  revenueByMonth,
};

export default paymentController;
