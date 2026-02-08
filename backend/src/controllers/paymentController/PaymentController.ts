import { Request, Response } from "express";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../../config/contstanst.ts";
import { PaymentService } from "../../services/paymentServer/paymentServer.ts";
import prisma from "../../core/utils/db.ts";
import { useErrorHandler } from "../../hooks/useErrorHandler.ts";
import { ResponseCodes } from "../../config/waafipay.service.responseCodes.ts";
const paymentService = new PaymentService();

export const createPayment = async (req: Request, res: Response) => {
  try {
    const p = req.body?.payment || req.body;
    const userId = p?.userId || (req as any).user?.id;

    if (!p || !userId) {
      return res.status(400).json({
        success: false,
        message: "Payment information is required.",
        responseCode: 400,
        key: "MISSING_DATA",
        userFriendly: true,
      });
    }

    const result = await paymentService.processWaafiPayment({
      ...p,
      userId,
    });

    if (!result.success) {
      return res.status(400).json({
        key: result.key || ResponseCodes.PROCESSING_ERROR.key,
        message: result.message || ResponseCodes.PROCESSING_ERROR.message,
        responseCode:
          result.responseCode || ResponseCodes.PROCESSING_ERROR.code,
        amount: result.amount || null,
      });
    }

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
    const { id } = req.params;
    const item = await paymentService.getItemDetail(id);

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
    const { region, city } = req.query;
    const stats = await paymentService.getPaymentStats(
      region as string,
      city as string,
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
    const {
      page = DEFAULT_PAGE.toString(),
      limit = DEFAULT_PAGE_SIZE.toString(),
      status,
      paymentMethod,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, parseInt(limit as string));

    const where: any = {};
    if (status) where.status = status as any;
    if (paymentMethod) where.paymentMethod = paymentMethod as any;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: { select: { id: true, username: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.payment.count({ where }),
    ]);

    return res.json({ success: true, data: { payments, total } });
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

    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status, transactionId, updatedAt: new Date() },
    });

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
    await prisma.payment.delete({ where: { id: req.params.id } });
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
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const payments = await prisma.payment.findMany({
      where: {
        OR: [
          { transactionId: { contains: query as string, mode: "insensitive" } },
          { region: { contains: query as string, mode: "insensitive" } as any },
          { city: { contains: query as string, mode: "insensitive" } as any },
        ],
      },
      include: { user: { select: { id: true, username: true, email: true } } },
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
      return res.status(400).json({
        success: false,
        message: "User authentication required.",
      });
    }

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: { user: { select: { id: true, username: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

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

const paymentController = {
  createPayment,
  getPaymentStats,
  getAllPayments,
  updatePaymentStatus,
  deletePayment,
  searchPayments,
  getMyPayments,
  getItemDetail,
};

export default paymentController;
