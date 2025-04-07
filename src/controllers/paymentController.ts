import { Request, Response } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import { razorpayInstance, razorpayConfig } from "../config/razorpay";
import Payment from "../models/Payment";
import Order from "../models/Order";
import DeliveryTracking from "../models/DeliveryTracking";

/**
 * Create a Razorpay order
 * @route POST /api/payments/create-razorpay-order
 * @access Private
 */
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, currency = "INR" } = req.body;
    const userId = req.user?.id;

    // Validate order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({
      order: orderId,
      status: { $nin: ["failed"] },
    });

    if (existingPayment && existingPayment.razorpayOrderId) {
      return res.status(200).json({
        success: true,
        data: {
          razorpayOrderId: existingPayment.razorpayOrderId,
          amount: existingPayment.amount,
          currency: existingPayment.currency,
          key: razorpayConfig.key_id,
        },
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    // Create or update payment record
    let payment;
    if (existingPayment) {
      existingPayment.razorpayOrderId = razorpayOrder.id;
      payment = await existingPayment.save();
    } else {
      payment = await Payment.create({
        user: userId,
        order: orderId,
        amount,
        currency,
        razorpayOrderId: razorpayOrder.id,
        paymentMethod: order.paymentType,
        status: "pending",
      });

      // Update order with payment ID
      await Order.findByIdAndUpdate(orderId, { paymentId: payment._id });
    }

    return res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount / 100,
        currency: razorpayOrder.currency,
        key: razorpayConfig.key_id,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

/**
 * Verify Razorpay payment
 * @route POST /api/payments/verify
 * @access Private
 */
export const verifyPayment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", razorpayConfig.key_secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Find payment by Razorpay order ID
    const payment = await Payment.findOne({
      razorpayOrderId,
    }).session(session);

    if (!payment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment details
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = "captured";
    await payment.save({ session });

    // Update order payment status
    const order = await Order.findById(payment.order).session(session);
    if (order) {
      order.paymentStatus = "captured";
      
      // If order was pending, update to confirmed
      if (order.orderStatus === "pending") {
        order.orderStatus = "confirmed";
      }
      
      await order.save({ session });

      // Update delivery tracking
      if (order.deliveryTrackingId) {
        const deliveryTracking = await DeliveryTracking.findById(
          order.deliveryTrackingId
        ).session(session);

        if (deliveryTracking) {
          deliveryTracking.statusUpdates.push({
            status: "processing",
            timestamp: new Date(),
            description: "Payment received, order confirmed",
          });

          deliveryTracking.currentStatus = "processing";
          await deliveryTracking.save({ session });
        }
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId: payment.order,
        paymentId: payment._id,
        status: payment.status,
      },
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

/**
 * Process refund
 * @route POST /api/payments/:id/refund
 * @access Private (Admin)
 */
export const processRefund = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const paymentId = req.params.id;
    const { amount, reason } = req.body;

    // Find payment
    const payment = await Payment.findById(paymentId).session(session);

    if (!payment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check if payment can be refunded
    if (payment.status !== "captured") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Payment cannot be refunded in its current status",
      });
    }

    // Check if refund amount is valid
    const refundAmount = amount || payment.amount;
    if (refundAmount <= 0 || refundAmount > payment.amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Invalid refund amount",
      });
    }

    // Process refund through Razorpay
    const refund = await razorpayInstance.payments.refund(
      payment.razorpayPaymentId as string,
      {
        amount: Math.round(refundAmount * 100), // Amount in paise
        notes: {
          reason: reason || "Refund requested",
        },
      }
    );

    // Update payment with refund details
    payment.refundAmount = refundAmount;
    payment.refundReason = reason || "Refund requested";
    payment.refundId = refund.id;
    payment.refundStatus = refund.status;
    payment.refundedAt = new Date();
    payment.status =
      refundAmount === payment.amount ? "refunded" : "partially_refunded";

    await payment.save({ session });

    // Update order payment status
    const order = await Order.findById(payment.order).session(session);
    if (order) {
      order.paymentStatus =
        refundAmount === payment.amount ? "refunded" : "partially_refunded";
      await order.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: {
        payment,
        refund,
      },
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: error.message,
    });
  }
};

/**
 * Razorpay webhook handler
 * @route POST /api/payments/webhook
 * @access Public
 */
export const webhookHandler = async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verify webhook signature if secret is set
    if (webhookSecret) {
      const webhookSignature = req.headers["x-razorpay-signature"] as string;
      
      if (!webhookSignature) {
        return res.status(400).json({
          success: false,
          message: "Webhook signature missing",
        });
      }
      
      const generatedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");
        
      if (generatedSignature !== webhookSignature) {
        return res.status(400).json({
          success: false,
          message: "Invalid webhook signature",
        });
      }
    }
    
    const event = req.body.event;
    const payload = req.body.payload;
    
    // Handle different webhook events
    switch (event) {
      case "payment.authorized":
        await handlePaymentAuthorized(payload);
        break;
        
      case "payment.captured":
        await handlePaymentCaptured(payload);
        break;
        
      case "payment.failed":
        await handlePaymentFailed(payload);
        break;
        
      case "refund.processed":
        await handleRefundProcessed(payload);
        break;
        
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
    
    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process webhook",
      error: error.message,
    });
  }
};

// Helper functions for webhook handler
async function handlePaymentAuthorized(payload: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { payment } = payload;
    const razorpayOrderId = payment.order_id;
    
    // Find payment by Razorpay order ID
    const paymentRecord = await Payment.findOne({
      razorpayOrderId,
    }).session(session);
    
    if (!paymentRecord) {
      await session.abortTransaction();
      session.endSession();
      return;
    }
    
    // Update payment details
    paymentRecord.razorpayPaymentId = payment.id;
    paymentRecord.status = "authorized";
    paymentRecord.paymentResponse = payment;
    await paymentRecord.save({ session });
    
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function handlePaymentCaptured(payload: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { payment } = payload;
    const razorpayPaymentId = payment.id;
    
    // Find payment by Razorpay payment ID
    const paymentRecord = await Payment.findOne({
      razorpayPaymentId,
    }).session(session);
    
    if (!paymentRecord) {
      await session.abortTransaction();
      session.endSession();
      return;
    }
    
    // Update payment details
    paymentRecord.status = "captured";
    paymentRecord.paymentResponse = payment;
    await paymentRecord.save({ session });
    
    // Update order payment status
    const order = await Order.findById(paymentRecord.order).session(session);
    if (order) {
      order.paymentStatus = "captured";
      
      // If order was pending, update to confirmed
      if (order.orderStatus === "pending") {
        order.orderStatus = "confirmed";
      }
      
      await order.save({ session });
      
      // Update delivery tracking
      if (order.deliveryTrackingId) {
        const deliveryTracking = await DeliveryTracking.findById(
          order.deliveryTrackingId
        ).session(session);
        
        if (deliveryTracking) {
          deliveryTracking.statusUpdates.push({
            status: "processing",
            timestamp: new Date(),
            description: "Payment received, order confirmed",
          });
          
          deliveryTracking.currentStatus = "processing";
          await deliveryTracking.save({ session });
        }
      }
    }
    
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function handlePaymentFailed(payload: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { payment } = payload;
    const razorpayOrderId = payment.order_id;
    
    // Find payment by Razorpay order ID
    const paymentRecord = await Payment.findOne({
      razorpayOrderId,
    }).session(session);
    
    if (!paymentRecord) {
      await session.abortTransaction();
      session.endSession();
      return;
    }
    
    // Update payment details
    paymentRecord.razorpayPaymentId = payment.id;
    paymentRecord.status = "failed";
    paymentRecord.paymentResponse = payment;
    await paymentRecord.save({ session });
    
    // Update order payment status
    const order = await Order.findById(paymentRecord.order).session(session);
    if (order) {
      order.paymentStatus = "failed";
      await order.save({ session });
    }
    
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function handleRefundProcessed(payload: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { refund } = payload;
    const razorpayPaymentId = refund.payment_id;
    
    // Find payment by Razorpay payment ID
    const paymentRecord = await Payment.findOne({
      razorpayPaymentId,
    }).session(session);
    
    if (!paymentRecord) {
      await session.abortTransaction();
      session.endSession();
      return;
    }
    
    // Update payment with refund details
    const refundAmount = refund.amount / 100; // Convert from paise to rupees
    
    paymentRecord.refundAmount = refundAmount;
    paymentRecord.refundId = refund.id;
    paymentRecord.refundStatus = refund.status;
    paymentRecord.refundedAt = new Date();
    paymentRecord.status =
      refundAmount === paymentRecord.amount ? "refunded" : "partially_refunded";
      
    await paymentRecord.save({ session });
    
    // Update order payment status
    const order = await Order.findById(paymentRecord.order).session(session);
    if (order) {
      order.paymentStatus =
        refundAmount === paymentRecord.amount ? "refunded" : "partially_refunded";
      await order.save({ session });
    }
    
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export default {
  createRazorpayOrder,
  verifyPayment,
  processRefund,
  webhookHandler,
};
