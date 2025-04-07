import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

// Razorpay configuration
const razorpayConfig = {
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
};

// Create Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret,
});

// Validate Razorpay configuration
if (!razorpayConfig.key_id || !razorpayConfig.key_secret) {
  console.warn(
    "WARNING: Razorpay API keys are not set. Payment functionality will not work."
  );
}

export { razorpayInstance, razorpayConfig };
