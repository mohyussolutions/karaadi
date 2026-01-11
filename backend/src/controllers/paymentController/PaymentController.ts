import { Request, Response } from "express";
import prisma from "core/utils/db.ts";
import { ItemCategory, PaymentMethod, ListingType } from "types/payment.ts";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "config/contstanst.ts";
import { processWaafiPayment } from "core/strategies/waafipay.strategy.ts";
export const createPayment = async (req: Request, res: Response) => {
  try {
    const p = req.body?.payment;
    if (!p) {
      return res
        .status(400)
        .json({ success: false, error: "Missing payment object" });
    }

    const userId = p.userId;
    const itemCategory = p.itemCategory as ItemCategory;
    const itemId = p.itemId;
    const paymentMethod = p.paymentMethod as PaymentMethod;
    const accountNo = p.accountNo || "";

    const feeAmount = Number(p.feeAmount || 0);
    const baseFee = Number(p.baseFee || 0);
    const taxAmount = Number(p.taxAmount || 0);
    const platformFee = Number(p.platformFee || 0);
    const totalAmount = feeAmount + baseFee + taxAmount + platformFee;

    const result = await processWaafiPayment(
      userId,
      itemCategory,
      itemId,
      p.listingType || ListingType.FEE,
      paymentMethod,
      accountNo,
      totalAmount,
      taxAmount,
      platformFee,
      p.description || "Payment",
      baseFee,
      feeAmount,
      p.currency || "USD"
    );

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message,
        transactionId: result.transactionId,
        payment: result.payment,
        waafiResponseCode: result.details?.waafiResponseCode,
      });
    }

    return res.status(400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const {
      page = DEFAULT_PAGE.toString(),
      limit = DEFAULT_PAGE_SIZE.toString(),
      status,
      paymentMethod,
      itemCategory,
      userId,
      startDate,
      endDate,
      transactionId,
      minAmount,
      maxAmount,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (userId) where.userId = userId;
    if (transactionId) where.transactionId = transactionId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    if (minAmount || maxAmount) {
      where.totalAmount = {};
      if (minAmount) where.totalAmount.gte = parseFloat(minAmount as string);
      if (maxAmount) where.totalAmount.lte = parseFloat(maxAmount as string);
    }

    if (itemCategory) {
      const categoryFieldMap: Record<string, string> = {
        [ItemCategory.CAR]: "carId",
        [ItemCategory.BOAT]: "boatId",
        [ItemCategory.REAL_ESTATE]: "realEstateId",
        [ItemCategory.MOTORCYCLE]: "motorcycleId",
        [ItemCategory.TRAKTOR]: "traktorId",
        [ItemCategory.MARKETPLACE]: "marketplaceId",
        [ItemCategory.SUBSCRIPTION]: "subscriptionId",
      };

      const categoryField = categoryFieldMap[itemCategory as string];
      if (categoryField) {
        where[categoryField] = { not: null };
      }
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNextPage: pageNum * limitNum < total,
          hasPreviousPage: pageNum > 1,
        },
      },
    });
  } catch (error: any) {
    console.error("Get all payments error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payments",
      message: error.message,
    });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        car: true,
        realEstate: true,
        boat: true,
        motorcycle: true,
        traktor: true,
        marketplace: true,
        subscription: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    res.json({
      success: true,
      data: { payment },
    });
  } catch (error: any) {
    console.error("Get payment by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment",
      message: error.message,
    });
  }
};

export const getPaymentsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status, limit, startDate, endDate } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const where: any = { userId };
    if (status) where.status = status;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit as string, 10) : undefined,
    });

    const totalAmount = payments.reduce(
      (sum, payment) => sum + payment.totalAmount,
      0
    );

    const statusSummary = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const paymentMethodSummary = payments.reduce((acc, payment) => {
      const method = payment.paymentMethod || "UNKNOWN";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        user,
        payments,
        summary: {
          totalPayments: payments.length,
          totalAmount,
          averageAmount:
            payments.length > 0 ? totalAmount / payments.length : 0,
          statusSummary,
          paymentMethodSummary,
        },
      },
    });
  } catch (error: any) {
    console.error("Get payments by user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user payments",
      message: error.message,
    });
  }
};

export const getPaymentStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, userId } = req.query;

    const where: any = {};

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (userId) where.userId = userId;

    const stats = await prisma.payment.aggregate({
      where,
      _sum: {
        totalAmount: true,
        taxAmount: true,
        platformFee: true,
        baseFee: true,
        feeAmount: true,
      },
      _count: { id: true },
      _avg: { totalAmount: true },
      _min: { totalAmount: true },
      _max: { totalAmount: true },
    });

    const statusBreakdown = await prisma.payment.groupBy({
      by: ["status"],
      where,
      _count: { id: true },
      _sum: { totalAmount: true },
    });

    const methodBreakdown = await prisma.payment.groupBy({
      by: ["paymentMethod"],
      where,
      _count: { id: true },
      _sum: { totalAmount: true },
    });

    // Get payments to manually calculate category breakdown
    const paymentsForCategories = await prisma.payment.findMany({
      where,
      select: {
        id: true,
        totalAmount: true,
        carId: true,
        boatId: true,
        realEstateId: true,
        motorcycleId: true,
        traktorId: true,
        marketplaceId: true,
        subscriptionId: true,
      },
    });

    // Manually group by category based on which ID field is populated
    const categoryMap = {
      carId: ItemCategory.CAR,
      boatId: ItemCategory.BOAT,
      realEstateId: ItemCategory.REAL_ESTATE,
      motorcycleId: ItemCategory.MOTORCYCLE,
      traktorId: ItemCategory.TRAKTOR,
      marketplaceId: ItemCategory.MARKETPLACE,
      subscriptionId: ItemCategory.SUBSCRIPTION,
    };

    const categoryBreakdown = paymentsForCategories.reduce((acc, payment) => {
      let foundCategory = "UNKNOWN";

      // Check which ID field is not null
      for (const [field, category] of Object.entries(categoryMap)) {
        if (payment[field as keyof typeof payment]) {
          foundCategory = category;
          break;
        }
      }

      if (!acc[foundCategory]) {
        acc[foundCategory] = {
          _count: { id: 0 },
          _sum: { totalAmount: 0 },
        };
      }

      acc[foundCategory]._count.id++;
      acc[foundCategory]._sum.totalAmount += payment.totalAmount;

      return acc;
    }, {} as Record<string, { _count: { id: number }; _sum: { totalAmount: number } }>);

    // Convert to array format
    const categoryBreakdownArray = Object.entries(categoryBreakdown).map(
      ([itemCategory, data]) => ({
        itemCategory,
        _count: data._count,
        _sum: data._sum,
      })
    );

    const trendStartDate = startDate
      ? new Date(startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const dailyTrends = await prisma.payment.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: trendStartDate,
        },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
      orderBy: { createdAt: "asc" },
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalAmount: stats._sum.totalAmount || 0,
          totalPayments: stats._count.id,
          averagePayment: stats._avg.totalAmount || 0,
          minPayment: stats._min.totalAmount || 0,
          maxPayment: stats._max.totalAmount || 0,
          totalTax: stats._sum.taxAmount || 0,
          totalPlatformFee: stats._sum.platformFee || 0,
          totalBaseFee: stats._sum.baseFee || 0,
          totalFee: stats._sum.feeAmount || 0,
        },
        breakdown: {
          status: statusBreakdown,
          paymentMethods: methodBreakdown,
          categories: categoryBreakdownArray,
        },
        trends: {
          daily: dailyTrends,
        },
      },
    });
  } catch (error: any) {
    console.error("Get payment stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment statistics",
      message: error.message,
    });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, transactionId, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const validStatuses = [
      "PENDING",
      "COMPLETED",
      "FAILED",
      "REFUNDED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Valid statuses: ${validStatuses.join(", ")}`,
      });
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    if (status === "COMPLETED") {
      updateData.paidAt = new Date();
      if (transactionId) updateData.transactionId = transactionId;
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (status === "COMPLETED") {
      let itemCategory = "";
      let itemId = "";

      if (payment.carId) {
        itemCategory = ItemCategory.CAR;
        itemId = payment.carId;
      } else if (payment.realEstateId) {
        itemCategory = ItemCategory.REAL_ESTATE;
        itemId = payment.realEstateId;
      } else if (payment.boatId) {
        itemCategory = ItemCategory.BOAT;
        itemId = payment.boatId;
      } else if (payment.motorcycleId) {
        itemCategory = ItemCategory.MOTORCYCLE;
        itemId = payment.motorcycleId;
      } else if (payment.traktorId) {
        itemCategory = ItemCategory.TRAKTOR;
        itemId = payment.traktorId;
      } else if (payment.marketplaceId) {
        itemCategory = ItemCategory.MARKETPLACE;
        itemId = payment.marketplaceId;
      } else if (payment.subscriptionId) {
        itemCategory = ItemCategory.SUBSCRIPTION;
        itemId = payment.subscriptionId;
      }

      if (itemCategory && itemId) {
        const { updateItemStatus } = await import(
          "../../core/strategies/paymentHelpers.ts"
        );
        await updateItemStatus(itemCategory as ItemCategory, itemId, true);
      }
    }

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: { payment },
    });
  } catch (error: any) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update payment status",
      message: error.message,
    });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    if (payment.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        error: "Cannot delete completed payments",
      });
    }

    await prisma.payment.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Payment deleted successfully",
      data: {
        deletedPayment: {
          id: payment.id,
          amount: payment.totalAmount,
          status: payment.status,
          createdAt: payment.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error("Delete payment error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete payment",
      message: error.message,
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { transactionId, paymentMethod, paymentId } = req.body;

    if (!transactionId && !paymentId) {
      return res.status(400).json({
        success: false,
        error: "Missing transactionId or paymentId",
      });
    }

    const where: any = {};
    if (transactionId) {
      where.transactionId = transactionId;
    }
    if (paymentId) {
      where.id = paymentId;
    }
    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    const payment = await prisma.payment.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Payment not found",
      });
    }

    if (payment.status !== "COMPLETED") {
      return res.json({
        success: true,
        valid: false,
        message: `Payment is ${payment.status.toLowerCase()}`,
        data: { payment },
      });
    }

    res.json({
      success: true,
      valid: true,
      message: "Payment verified successfully",
      data: { payment },
    });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to verify payment",
      message: error.message,
    });
  }
};

export const getRecentPayments = async (req: Request, res: Response) => {
  try {
    const { limit = "10", days = "7" } = req.query;
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const daysNum = Math.min(365, Math.max(1, parseInt(days as string, 10)));

    const recentPayments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: "desc" },
      take: limitNum,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        payments: recentPayments,
        timeframe: `Last ${daysNum} days`,
        count: recentPayments.length,
      },
    });
  } catch (error: any) {
    console.error("Get recent payments error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recent payments",
      message: error.message,
    });
  }
};

export const createBulkPayments = async (req: Request, res: Response) => {
  try {
    const { payments } = req.body;

    if (!Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Payments array is required and must not be empty",
      });
    }

    const results = [];
    const errors = [];

    for (const paymentData of payments) {
      try {
        const {
          userId,
          itemCategory,
          itemId,
          listingType = ListingType.FEE,
          paymentMethod,
          accountNo = "",
          description = "Payment",
          feeAmount = 0,
          baseFee = 0,
          taxAmount = 0,
          platformFee = 0,
          currency = "USD",
        } = paymentData;

        const finalFeeAmount = parseFloat(feeAmount.toString());
        const finalBaseFee = parseFloat(baseFee.toString());
        const finalTaxAmount = parseFloat(taxAmount.toString());
        const finalPlatformFee = parseFloat(platformFee.toString());

        const totalAmount =
          finalFeeAmount + finalBaseFee + finalTaxAmount + finalPlatformFee;

        const result = await processWaafiPayment(
          userId,
          itemCategory as ItemCategory,
          itemId,
          listingType,
          paymentMethod as PaymentMethod,
          accountNo,
          totalAmount,
          finalTaxAmount,
          finalPlatformFee,
          description,
          finalBaseFee,
          finalFeeAmount,
          currency
        );

        if (result.success) {
          results.push({
            success: true,
            payment: result.payment,
            transactionId: result.transactionId,
          });
        } else {
          errors.push({
            paymentData,
            error: result.error,
            details: result.details,
          });
        }
      } catch (error: any) {
        errors.push({
          paymentData,
          error: "Failed to process payment",
          details: error.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Processed ${results.length} payments successfully, ${errors.length} failed`,
      data: {
        successful: results,
        failed: errors,
        summary: {
          total: payments.length,
          successful: results.length,
          failed: errors.length,
        },
      },
    });
  } catch (error: any) {
    console.error("Create bulk payments error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create bulk payments",
      message: error.message,
    });
  }
};

export const searchPayments = async (req: Request, res: Response) => {
  try {
    const {
      query,
      field = "all",
      status,
      paymentMethod,
      startDate,
      endDate,
      minAmount,
      maxAmount,
    } = req.query;

    const where: any = {};

    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    if (minAmount || maxAmount) {
      where.totalAmount = {};
      if (minAmount) where.totalAmount.gte = parseFloat(minAmount as string);
      if (maxAmount) where.totalAmount.lte = parseFloat(maxAmount as string);
    }

    if (query) {
      const searchQuery = `%${query}%`;

      if (field === "all" || field === "transactionId") {
        where.OR = [
          { transactionId: { contains: query as string, mode: "insensitive" } },
          { id: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
        ];
      } else if (field === "userId") {
        where.userId = query;
      } else if (field === "description") {
        where.description = { contains: query as string, mode: "insensitive" };
      }
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({
      success: true,
      data: {
        payments,
        count: payments.length,
        searchParams: { query, field, status, paymentMethod },
      },
    });
  } catch (error: any) {
    console.error("Search payments error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search payments",
      message: error.message,
    });
  }
};

const paymentController = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByUser,
  getPaymentStats,
  updatePaymentStatus,
  deletePayment,
  verifyPayment,
  getRecentPayments,
  createBulkPayments,
  searchPayments,
};

export default paymentController;
