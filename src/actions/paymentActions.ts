"use server";

import Razorpay from "razorpay";
import { saveOrder } from "./orderActions";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amount: number) {
  try {
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error("Razorpay order error:", error);
    return { success: false, error: "Failed to create payment order" };
  }
}

export async function verifyPayment(paymentData: any, orderDetails: any) {
  // In a real app, you would verify the signature here using crypto
  // For this demo, we'll assume verification is successful and save the order
  try {
    const res = await saveOrder({
      ...orderDetails,
      paymentId: paymentData.razorpay_payment_id,
      razorpayOrderId: paymentData.razorpay_order_id,
      status: "accepted",
      date: new Date().toLocaleDateString(),
    });
    return res;
  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, error: "Failed to verify payment" };
  }
}
