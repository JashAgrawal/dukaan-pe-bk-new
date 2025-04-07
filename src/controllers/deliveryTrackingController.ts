import { Request, Response } from "express";
import mongoose from "mongoose";
import DeliveryTracking, { DeliveryStatusType } from "../models/DeliveryTracking";
import Order from "../models/Order";

/**
 * Get delivery tracking details by order ID
 * @route GET /api/orders/:orderId/tracking
 * @access Private
 */
export const getTrackingByOrderId = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user?.id;

    // Verify order belongs to user (if not admin)
    if (req.user?.role !== "admin") {
      const order = await Order.findOne({
        _id: orderId,
        user: userId,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
    }

    const tracking = await DeliveryTracking.findOne({ order: orderId });

    if (!tracking) {
      return res.status(404).json({ message: "Tracking information not found" });
    }

    return res.status(200).json({
      success: true,
      data: tracking,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to get tracking information",
      error: error.message,
    });
  }
};

/**
 * Update delivery tracking status
 * @route PATCH /api/delivery-tracking/:id
 * @access Private (Seller/Admin)
 */
export const updateTrackingStatus = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const trackingId = req.params.id;
    const { status, description, location, trackingNumber, courierName, courierWebsite, estimatedDeliveryDate } = req.body;

    // Find tracking
    const tracking = await DeliveryTracking.findById(trackingId).session(session);

    if (!tracking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Tracking information not found" });
    }

    // Check if user is authorized to update tracking
    // This would typically check if the user is the store owner or an admin
    // Implementation depends on your authentication system

    // Update tracking details
    if (trackingNumber) tracking.trackingNumber = trackingNumber;
    if (courierName) tracking.courierName = courierName;
    if (courierWebsite) tracking.courierWebsite = courierWebsite;
    if (estimatedDeliveryDate) tracking.estimatedDeliveryDate = new Date(estimatedDeliveryDate);

    // Add status update if provided
    if (status && description) {
      tracking.statusUpdates.push({
        status: status as DeliveryStatusType,
        timestamp: new Date(),
        description,
        location,
      });

      tracking.currentStatus = status as DeliveryStatusType;

      // Update order status based on delivery status
      const order = await Order.findById(tracking.order).session(session);
      if (order) {
        switch (status) {
          case "processing":
            order.orderStatus = "processing";
            break;
          case "shipped":
            order.orderStatus = "shipped";
            break;
          case "delivered":
            order.orderStatus = "delivered";
            break;
          case "cancelled":
            order.orderStatus = "cancelled";
            order.cancelledAt = new Date();
            order.cancelReason = description;
            break;
          case "returned":
            order.orderStatus = "returned";
            break;
        }

        await order.save({ session });
      }
    }

    await tracking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Tracking information updated successfully",
      data: tracking,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Failed to update tracking information",
      error: error.message,
    });
  }
};

/**
 * Add tracking details to an order
 * @route POST /api/orders/:orderId/tracking
 * @access Private (Seller/Admin)
 */
export const addTrackingDetails = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderId = req.params.orderId;
    const { trackingNumber, courierName, courierWebsite, estimatedDeliveryDate, status, description, location } = req.body;

    // Find order
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is authorized to add tracking
    // This would typically check if the user is the store owner or an admin
    // Implementation depends on your authentication system

    // Check if tracking already exists
    let tracking = await DeliveryTracking.findOne({ order: orderId }).session(session);

    if (!tracking) {
      // Create new tracking
      tracking = new DeliveryTracking({
        order: orderId,
        trackingNumber,
        courierName,
        courierWebsite,
        estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : undefined,
        currentStatus: status || "processing",
        statusUpdates: [
          {
            status: status || "processing",
            timestamp: new Date(),
            description: description || "Order is being processed",
            location,
          },
        ],
      });

      await tracking.save({ session });

      // Update order with tracking ID
      order.deliveryTrackingId = tracking._id;
      
      // Update order status if needed
      if (status) {
        switch (status) {
          case "shipped":
            order.orderStatus = "shipped";
            break;
          case "delivered":
            order.orderStatus = "delivered";
            break;
        }
      }
      
      await order.save({ session });
    } else {
      // Update existing tracking
      if (trackingNumber) tracking.trackingNumber = trackingNumber;
      if (courierName) tracking.courierName = courierName;
      if (courierWebsite) tracking.courierWebsite = courierWebsite;
      if (estimatedDeliveryDate) tracking.estimatedDeliveryDate = new Date(estimatedDeliveryDate);

      // Add status update if provided
      if (status && description) {
        tracking.statusUpdates.push({
          status: status as DeliveryStatusType,
          timestamp: new Date(),
          description,
          location,
        });

        tracking.currentStatus = status as DeliveryStatusType;

        // Update order status based on delivery status
        switch (status) {
          case "shipped":
            order.orderStatus = "shipped";
            break;
          case "delivered":
            order.orderStatus = "delivered";
            break;
        }

        await order.save({ session });
      }

      await tracking.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Tracking details added successfully",
      data: tracking,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Failed to add tracking details",
      error: error.message,
    });
  }
};

export default {
  getTrackingByOrderId,
  updateTrackingStatus,
  addTrackingDetails,
};
