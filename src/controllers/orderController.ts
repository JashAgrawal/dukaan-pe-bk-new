import { Request, Response } from "express";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import Cart from "../models/Cart";
import CartSnapshot from "../models/CartSnapshot";
import Order, { OrderStatusType } from "../models/Order";
import Payment from "../models/Payment";
import DeliveryTracking from "../models/DeliveryTracking";
import Address from "../models/Address";
import { razorpayInstance } from "../config/razorpay";
import { catchAsync } from "../middlewares/errorHandler";

/**
 * Create a new order
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      cartId,
      paymentType,
      deliveryAddressId,
      specialNoteBuyer,
      specialNoteSeller,
    } = req.body;

    const userId = (req as any).user?.id;

    // Validate cart exists and belongs to user
    const cart = await Cart.findOne({
      _id: cartId,
      user: userId,
      state: "active",
    }).session(session);

    if (!cart) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Cart not found" });
    }

    // Validate delivery address exists and belongs to user
    const address = await Address.findOne({
      _id: deliveryAddressId,
      user: userId,
    }).session(session);

    if (!address) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Delivery address not found" });
    }

    // Calculate cart totals
    await cart.calculateItemPrices();

    // Create cart snapshot
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const totalDiscount = cart.items.reduce(
      (sum, item) => sum + item.discountAmt * item.quantity,
      0
    );

    const couponDiscount = cart.items.reduce(
      (sum, item) => sum + item.couponDiscount * item.quantity,
      0
    );

    const offerDiscount = cart.items.reduce(
      (sum, item) => sum + item.offerDiscount * item.quantity,
      0
    );

    // Calculate delivery charges (can be implemented based on business logic)
    const deliveryCharges = 0; // For now, set to 0

    // Calculate payable amount
    const payableAmount =
      cart.items.reduce(
        (sum, item) => sum + item.effectivePrice * item.quantity,
        0
      ) + deliveryCharges;

    const cartSnapshot = new CartSnapshot({
      originalCartId: cart._id,
      user: userId,
      store: cart.store,
      items: cart.items,
      coupon: cart.coupon,
      offer: cart.offer,
      totalAmount,
      totalDiscount,
      couponDiscount,
      offerDiscount,
      deliveryCharges,
      payableAmount,
    });

    await cartSnapshot.save({ session });

    // Create order items from cart items
    const orderItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      discountedPrice: item.effectivePrice,
      totalPrice: item.effectivePrice * item.quantity,
      status: "active",
    }));

    // Create order
    const order = new Order({
      cartSnapshot: cartSnapshot._id,
      user: userId,
      store: cart.store,
      items: orderItems,
      paymentType,
      paymentStatus: paymentType === "cod" ? "pending" : "pending",
      totalWithoutDiscount: totalAmount,
      totalPayableAmount: payableAmount,
      totalDiscount,
      couponDiscount,
      offerDiscount,
      coupon: cart.coupon,
      offer: cart.offer,
      deliveryCharges,
      orderStatus: "pending",
      specialNoteBuyer,
      specialNoteSeller,
      deliveryAddressId,
    });

    await order.save({ session });

    // Create delivery tracking
    const deliveryTracking = new DeliveryTracking({
      order: order._id,
      currentStatus: "pending",
      statusUpdates: [
        {
          status: "pending",
          timestamp: new Date(),
          description: "Order has been placed",
        },
      ],
    });

    await deliveryTracking.save({ session });

    // Update order with delivery tracking ID
    order.deliveryTrackingId = deliveryTracking._id as any;
    await order.save({ session });

    // If payment type is not COD, create Razorpay order
    let razorpayOrder = null;
    if (paymentType !== "cod") {
      razorpayOrder = await razorpayInstance.orders.create({
        amount: Math.round(payableAmount * 100), // Amount in paise
        currency: "INR",
        receipt: order.orderNumber,
        notes: {
          orderId: (order._id as any).toString(),
          userId: userId ? userId.toString() : "",
        },
      });

      // Create payment record
      const payment = new Payment({
        user: userId,
        order: order._id,
        amount: payableAmount,
        currency: "INR",
        razorpayOrderId: razorpayOrder.id,
        paymentMethod: paymentType,
        status: "pending",
      });

      await payment.save({ session });

      // Update order with payment ID
      order.paymentId = payment._id as any;
      await order.save({ session });
    }

    // Update cart state to consumed
    cart.state = "consumed";
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      data: {
        order,
        paymentDetails: razorpayOrder
          ? {
              razorpayOrderId: razorpayOrder.id,
              amount: (razorpayOrder.amount as number) / 100,
              currency: razorpayOrder.currency,
            }
          : null,
      },
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

/**
 * Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const userId = (req as any).user?.id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    })
      .populate("cartSnapshot")
      .populate("deliveryTrackingId")
      .populate("deliveryAddressId")
      .populate("paymentId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
});

/**
 * Get all orders for a user
 * @route GET /api/orders
 * @access Private
 */
export const getUserOrders = catchAsync(async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { status, limit = 10, page = 1 } = req.query;

    const query: any = { user: userId };

    if (status) {
      query.orderStatus = status;
    }

    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: { createdAt: -1 },
      populate: [
        { path: "store", select: "name logo" },
        { path: "deliveryTrackingId", select: "currentStatus" },
      ],
    };

    const orders = await Order.find(query)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string))
      .sort({ createdAt: -1 })
      .populate("store", "name logo")
      .populate("deliveryTrackingId", "currentStatus");

    const total = await Order.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        orders,
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
      message: "Failed to get orders",
      error: error.message,
    });
  }
});

/**
 * Get all orders for a store
 * @route GET /api/stores/:storeId/orders
 * @access Private (Seller/Admin)
 */
export const getStoreOrders = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const storeId = req.params.storeId;
      const { status, limit = 10, page = 1 } = req.query;

      // Check if user is authorized to access store orders
      // This would typically check if the user is the store owner or an admin
      // Implementation depends on your authentication system

      const query: any = { store: storeId };

      if (status) {
        query.orderStatus = status;
      }

      const orders = await Order.find(query)
        .skip((parseInt(page as string) - 1) * parseInt(limit as string))
        .limit(parseInt(limit as string))
        .sort({ createdAt: -1 })
        .populate("user", "name email")
        .populate("deliveryTrackingId", "currentStatus")
        .populate("deliveryAddressId");

      const total = await Order.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: {
          orders,
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
        message: "Failed to get store orders",
        error: error.message,
      });
    }
  }
);

/**
 * Update order status
 * @route PATCH /api/orders/:id/status
 * @access Private (Seller/Admin)
 */
export const updateOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const orderId = req.params.id;
      const { status } = req.body as { status: OrderStatusType };

      // Check if user is authorized to update order status
      // This would typically check if the user is the store owner or an admin
      // Implementation depends on your authentication system

      const order = await Order.findById(orderId).session(session);

      if (!order) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Order not found" });
      }

      // Update order status
      order.orderStatus = status;

      // If order is cancelled, update payment status if applicable
      if (status === "cancelled" && order.paymentStatus === "captured") {
        // Handle refund logic here
        order.paymentStatus = "refunded";
      }

      await order.save({ session });

      // Update delivery tracking
      const deliveryTracking = await DeliveryTracking.findById(
        order.deliveryTrackingId
      ).session(session);

      if (deliveryTracking) {
        let description = "";

        switch (status) {
          case "confirmed":
            description = "Order has been confirmed";
            break;
          case "processing":
            description = "Order is being processed";
            break;
          case "shipped":
            description = "Order has been shipped";
            break;
          case "delivered":
            description = "Order has been delivered";
            break;
          case "cancelled":
            description = "Order has been cancelled";
            break;
          default:
            description = `Order status updated to ${status}`;
        }

        deliveryTracking.statusUpdates.push({
          status: status as any,
          timestamp: new Date(),
          description,
        });

        deliveryTracking.currentStatus = status as any;
        await deliveryTracking.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }
);

/**
 * Cancel order
 * @route POST /api/orders/:id/cancel
 * @access Private
 */
export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderId = req.params.id;
    const userId = (req as any).user?.id;
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order can be cancelled
    const allowedStatusForCancellation = ["pending", "confirmed", "processing"];
    if (!allowedStatusForCancellation.includes(order.orderStatus)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Order cannot be cancelled in its current status",
      });
    }

    // Update order status
    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = reason;

    // Update all items to cancelled
    order.items.forEach((item) => {
      item.status = "cancelled";
      item.cancelledAt = new Date();
      item.cancelReason = reason;
    });

    await order.save({ session });

    // Update delivery tracking
    const deliveryTracking = await DeliveryTracking.findById(
      order.deliveryTrackingId
    ).session(session);

    if (deliveryTracking) {
      deliveryTracking.statusUpdates.push({
        status: "cancelled",
        timestamp: new Date(),
        description: `Order cancelled by customer. Reason: ${reason}`,
      });

      deliveryTracking.currentStatus = "cancelled";
      await deliveryTracking.save({ session });
    }

    // Handle refund if payment was already captured
    if (order.paymentStatus === "captured" && order.paymentId) {
      const payment = await Payment.findById(order.paymentId).session(session);

      if (payment && payment.razorpayPaymentId) {
        try {
          // Initiate refund through Razorpay
          const refund = await razorpayInstance.payments.refund(
            payment.razorpayPaymentId,
            {
              amount: Math.round(payment.amount * 100), // Amount in paise
              notes: {
                orderId: (order._id as any).toString(),
                reason: reason || "Order cancelled by customer",
              },
            }
          );

          // Update payment with refund details
          payment.refundAmount = payment.amount;
          payment.refundReason = reason || "Order cancelled by customer";
          payment.refundId = refund.id;
          payment.refundStatus = refund.status;
          payment.refundedAt = new Date();
          payment.status = "refunded";

          await payment.save({ session });

          // Update order payment status
          order.paymentStatus = "refunded";
          await order.save({ session });
        } catch (refundError: any) {
          console.error("Refund failed:", refundError);
          // Continue with cancellation even if refund fails
          // The refund can be handled manually later
        }
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
});

/**
 * Cancel specific items in an order (partial cancellation)
 * @route POST /api/orders/:id/cancel-items
 * @access Private
 */
export const cancelOrderItems = catchAsync(
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const orderId = req.params.id;
      const userId = (req as any).user?.id;
      const { items, reason } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Please provide items to cancel",
        });
      }

      const order = await Order.findOne({
        _id: orderId,
        user: userId,
      }).session(session);

      if (!order) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if order is in a status that allows cancellation
      const allowedStatusForCancellation = [
        "pending",
        "confirmed",
        "processing",
      ];
      if (!allowedStatusForCancellation.includes(order.orderStatus)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Items cannot be cancelled in the current order status",
        });
      }

      // Calculate refund amount for cancelled items
      let refundAmount = 0;
      let allItemsCancelled = true;

      // Update items status
      order.items.forEach((item, index) => {
        if (items.includes(index) && item.status === "active") {
          item.status = "cancelled";
          item.cancelledAt = new Date();
          item.cancelReason = reason;
          refundAmount += item.totalPrice;
        } else if (item.status === "active") {
          allItemsCancelled = false;
        }
      });

      // Update order status
      if (allItemsCancelled) {
        order.orderStatus = "cancelled";
        order.cancelledAt = new Date();
        order.cancelReason = reason;
      } else {
        order.orderStatus = "partially_cancelled";
      }

      await order.save({ session });

      // Update delivery tracking
      const deliveryTracking = await DeliveryTracking.findById(
        order.deliveryTrackingId
      ).session(session);

      if (deliveryTracking) {
        deliveryTracking.statusUpdates.push({
          status: allItemsCancelled ? "cancelled" : "processing",
          timestamp: new Date(),
          description: allItemsCancelled
            ? `Order cancelled by customer. Reason: ${reason}`
            : `Some items cancelled by customer. Reason: ${reason}`,
        });

        if (allItemsCancelled) {
          deliveryTracking.currentStatus = "cancelled";
        }

        await deliveryTracking.save({ session });
      }

      // Handle partial refund if payment was already captured
      if (
        refundAmount > 0 &&
        order.paymentStatus === "captured" &&
        order.paymentId
      ) {
        const payment = await Payment.findById(order.paymentId).session(
          session
        );

        if (payment && payment.razorpayPaymentId) {
          try {
            // Initiate refund through Razorpay
            const refund = await razorpayInstance.payments.refund(
              payment.razorpayPaymentId,
              {
                amount: Math.round(refundAmount * 100), // Amount in paise
                notes: {
                  orderId: (order._id as any).toString(),
                  reason: reason || "Items cancelled by customer",
                },
              }
            );

            // Update payment with refund details
            payment.refundAmount = refundAmount;
            payment.refundReason = reason || "Items cancelled by customer";
            payment.refundId = refund.id;
            payment.refundStatus = refund.status;
            payment.refundedAt = new Date();
            payment.status = allItemsCancelled
              ? "refunded"
              : "partially_refunded";

            await payment.save({ session });

            // Update order payment status
            order.paymentStatus = allItemsCancelled
              ? "refunded"
              : "partially_refunded";
            await order.save({ session });
          } catch (refundError: any) {
            console.error("Refund failed:", refundError);
            // Continue with cancellation even if refund fails
            // The refund can be handled manually later
          }
        }
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: allItemsCancelled
          ? "Order cancelled successfully"
          : "Items cancelled successfully",
        data: order,
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        success: false,
        message: "Failed to cancel items",
        error: error.message,
      });
    }
  }
);

export default {
  createOrder,
  getOrderById,
  getUserOrders,
  getStoreOrders,
  updateOrderStatus,
  cancelOrder,
  cancelOrderItems,
};
