import { Request, Response } from "express";
import mongoose from "mongoose";
import Payout from "../models/Payout";
import Order from "../models/Order";
import Store from "../models/Store";
import { catchAsync } from "../middlewares/errorHandler";

/**
 * Generate payouts for a store
 * @route POST /api/payouts/generate
 * @access Private (Admin)
 */
export const generatePayout = catchAsync(
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { storeId, orderIds, platformFeePercentage = 10 } = req.body;

      // Validate store exists
      const store = await Store.findById(storeId).session(session);
      if (!store) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Store not found" });
      }

      // Get orders that are not already in a payout
      const ordersInPayouts = await Payout.distinct("items.order", {
        store: storeId,
      }).session(session);

      // Validate orders exist and belong to the store
      const orders = await Order.find({
        _id: {
          $in: orderIds,
          $nin: ordersInPayouts,
        },
        store: storeId,
        orderStatus: { $in: ["delivered"] },
        paymentStatus: { $in: ["captured"] },
      }).session(session);

      if (orders.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "No eligible orders found for payout",
        });
      }

      // Calculate payout amounts
      const payoutItems = orders.map((order) => {
        const amount = order.totalPayableAmount;
        const platformFee = (amount * platformFeePercentage) / 100;
        const tax = 0; // Calculate tax if needed
        const netAmount = amount - platformFee - tax;

        return {
          order: order._id,
          amount,
          platformFee,
          tax,
          netAmount,
        };
      });

      const totalAmount = payoutItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      const totalPlatformFee = payoutItems.reduce(
        (sum, item) => sum + item.platformFee,
        0
      );
      const totalTax = payoutItems.reduce((sum, item) => sum + item.tax, 0);
      const netPayoutAmount = totalAmount - totalPlatformFee - totalTax;

      // Create payout
      const payout = new Payout({
        store: storeId,
        payoutBatch: "", // Will be generated in pre-save hook
        items: payoutItems,
        totalAmount,
        totalPlatformFee,
        totalTax,
        netPayoutAmount,
        status: "pending",
      });

      await payout.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        success: true,
        message: "Payout generated successfully",
        data: payout,
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        success: false,
        message: "Failed to generate payout",
        error: error.message,
      });
    }
  }
);

/**
 * Process a payout (mark as completed)
 * @route POST /api/payouts/:id/process
 * @access Private (Admin)
 */
export const processPayout = catchAsync(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payoutId = req.params.id;
    const { transactionId, transactionReference, notes } = req.body;

    // Find payout
    const payout = await Payout.findById(payoutId).session(session);

    if (!payout) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Payout not found" });
    }

    // Check if payout can be processed
    if (payout.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Payout cannot be processed in its current status",
      });
    }

    // Update payout
    payout.status = "completed";
    payout.payoutDate = new Date();
    payout.transactionId = transactionId;
    payout.transactionReference = transactionReference;
    payout.notes = notes;

    await payout.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Payout processed successfully",
      data: payout,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Failed to process payout",
      error: error.message,
    });
  }
});

/**
 * Get all payouts for a store
 * @route GET /api/stores/:storeId/payouts
 * @access Private (Seller/Admin)
 */
export const getStorePayouts = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const storeId = req.params.storeId;
      const { status, limit = 10, page = 1 } = req.query;

      // Check if user is authorized to access store payouts
      // This would typically check if the user is the store owner or an admin
      // Implementation depends on your authentication system

      const query: any = { store: storeId };

      if (status) {
        query.status = status;
      }

      const payouts = await Payout.find(query)
        .skip((parseInt(page as string) - 1) * parseInt(limit as string))
        .limit(parseInt(limit as string))
        .sort({ createdAt: -1 });

      const total = await Payout.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: {
          payouts,
          pagination: {
            total,
            page: parseInt(page as string),
            pages: Math.ceil(total / parseInt(limit as string)),
          },
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to get store payouts",
        error: error.message,
      });
    }
  }
);

/**
 * Get payout details by ID
 * @route GET /api/payouts/:id
 * @access Private (Admin/Seller)
 */
export const getPayoutById = catchAsync(async (req: Request, res: Response) => {
  try {
    const payoutId = req.params.id;

    const payout = await Payout.findById(payoutId).populate({
      path: "items.order",
      select: "orderNumber totalPayableAmount orderStatus createdAt",
    });

    if (!payout) {
      return res.status(404).json({ message: "Payout not found" });
    }

    // Check if user is authorized to access this payout
    // This would typically check if the user is the store owner or an admin
    // Implementation depends on your authentication system

    return res.status(200).json({
      success: true,
      data: payout,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to get payout",
      error: error.message,
    });
  }
});

/**
 * Get payout summary for a store
 * @route GET /api/stores/:storeId/payout-summary
 * @access Private (Seller/Admin)
 */
export const getPayoutSummary = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const storeId = req.params.storeId;
      const { startDate, endDate } = req.query;

      // Check if user is authorized to access store payout summary
      // This would typically check if the user is the store owner or an admin
      // Implementation depends on your authentication system

      const query: any = { store: storeId };

      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      // Get total payout stats
      const totalStats = await Payout.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalPayouts: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
            totalPlatformFee: { $sum: "$totalPlatformFee" },
            totalTax: { $sum: "$totalTax" },
            netPayoutAmount: { $sum: "$netPayoutAmount" },
          },
        },
      ]);

      // Get stats by status
      const statsByStatus = await Payout.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            amount: { $sum: "$netPayoutAmount" },
          },
        },
      ]);

      // Get monthly stats
      const monthlyStats = await Payout.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            amount: { $sum: "$netPayoutAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      return res.status(200).json({
        success: true,
        data: {
          totalStats: totalStats[0] || {
            totalPayouts: 0,
            totalAmount: 0,
            totalPlatformFee: 0,
            totalTax: 0,
            netPayoutAmount: 0,
          },
          statsByStatus: statsByStatus.reduce((acc: any, curr) => {
            acc[curr._id] = {
              count: curr.count,
              amount: curr.amount,
            };
            return acc;
          }, {}),
          monthlyStats: monthlyStats.map((stat) => ({
            year: stat._id.year,
            month: stat._id.month,
            count: stat.count,
            amount: stat.amount,
          })),
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to get payout summary",
        error: error.message,
      });
    }
  }
);

export default {
  generatePayout,
  processPayout,
  getStorePayouts,
  getPayoutById,
  getPayoutSummary,
};
