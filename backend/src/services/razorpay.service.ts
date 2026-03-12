import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpay: any = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn('Razorpay keys missing. Razorpay service is disabled.');
  }
} catch (error) {
  console.error('Razorpay Initialization Error:', error);
}

export const createRazorpayOrder = async (amount: number, currency: string = 'INR', receipt: string) => {
  if (!razorpay) {
    throw new Error('Razorpay is not configured. Please check your environment variables.');
  }
  const options = {
    amount: Math.round(amount * 100), // convert to paisa
    currency,
    receipt,
  };
  return await razorpay.orders.create(options);
};

export const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string) => {
  if (!process.env.RAZORPAY_KEY_SECRET) return false;
  const text = orderId + "|" + paymentId;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest("hex");
  return generated_signature === signature;
};
