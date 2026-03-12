import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const createRazorpayOrder = async (amount: number, currency: string = 'INR', receipt: string) => {
  const options = {
    amount: Math.round(amount * 100), // convert to paisa
    currency,
    receipt,
  };
  return await razorpay.orders.create(options);
};

export const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string) => {
  const text = orderId + "|" + paymentId;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
    .update(text)
    .digest("hex");
  return generated_signature === signature;
};
