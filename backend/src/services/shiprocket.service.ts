import axios from 'axios';

const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

let token: string | null = null;

export const authenticateShiprocket = async () => {
  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    console.warn('Shiprocket credentials missing. Shiprocket service is disabled.');
    return null;
  }
  try {
    const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    token = response.data.token;
    return token;
  } catch (error) {
    console.error('Shiprocket Auth Error:', error);
    return null;
  }
};

export const createShiprocketOrder = async (orderData: any) => {
  if (!token) {
    const newToken = await authenticateShiprocket();
    if (!newToken) throw new Error('Shiprocket is not configured or authenticated.');
    token = newToken;
  }
  try {
    const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Shiprocket Order Creation Error:', error);
    throw error;
  }
};

export const getShiprocketTracking = async (awb: string) => {
  if (!token) {
    const newToken = await authenticateShiprocket();
    if (!newToken) throw new Error('Shiprocket is not configured or authenticated.');
    token = newToken;
  }
  try {
    const response = await axios.get(`${SHIPROCKET_API_URL}/courier/track/awb/${awb}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Shiprocket Tracking Error:', error);
    throw error;
  }
};
