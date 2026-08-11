import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface Product {
  id: number;
  referenceNo: string;
  producer: string;
  productName: string;
  variant: string;
  batchNo: string;
  imageUrl: string;
}

export async function fetchProductByReference(referenceNo: string): Promise<Product> {
  const { data } = await axios.get(`${API_BASE_URL}/products/${referenceNo}`);
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function sendOtpRequest(payload: { mobileNumber: string; referenceNo: string }) {
  const { data } = await axios.post(`${API_BASE_URL}/auth/send-otp`, payload);
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function verifyOtpRequest(payload: {
  mobileNumber: string;
  referenceNo: string;
  otpCode: string;
}) {
  const { data } = await axios.post(`${API_BASE_URL}/auth/verify-otp`, payload);
  if (!data.success) throw new Error(data.message);
  return data;
}
