import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { sendOtpRequest, verifyOtpRequest, fetchProductByReference, type Product } from "./verificationAPI";

export type FlowStep = "scan" | "mobile" | "otp" | "result";

interface VerificationState {
  step: FlowStep;
  referenceNo: string | null; // decoded from the scanned QR
  mobileNumber: string;
  otpSent: boolean;
  product: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VerificationState = {
  step: "scan",
  referenceNo: null,
  mobileNumber: "",
  otpSent: false,
  product: null,
  status: "idle",
  error: null,
};

// ---- Thunks: one per backend call the flow needs ----

// Step 1 -> 2: QR decoded, confirm the reference number exists before asking for mobile number
export const scanQrCode = createAsyncThunk(
  "verification/scanQrCode",
  async (referenceNo: string) => {
    const product = await fetchProductByReference(referenceNo);
    return { referenceNo, product };
  }
);

// Step 2 -> 3: user pressed "Send OTP"
export const sendOtp = createAsyncThunk(
  "verification/sendOtp",
  async (payload: { mobileNumber: string; referenceNo: string }) => {
    return sendOtpRequest(payload);
  }
);

// Step 3 -> 4: user entered the OTP and pressed submit
export const verifyOtp = createAsyncThunk(
  "verification/verifyOtp",
  async (
    payload: { mobileNumber: string; referenceNo: string; otpCode: string },
    { getState }
  ) => {
    await verifyOtpRequest(payload);
    // re-use the product already fetched at scan time, or fetch fresh if needed
    const state = getState() as { verification: VerificationState };
    return state.verification.product ?? (await fetchProductByReference(payload.referenceNo));
  }
);

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    setMobileNumber(state, action: PayloadAction<string>) {
      state.mobileNumber = action.payload;
    },
    goToStep(state, action: PayloadAction<FlowStep>) {
      state.step = action.payload;
    },
    resetFlow() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // scan
      .addCase(scanQrCode.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(scanQrCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.referenceNo = action.payload.referenceNo;
        state.product = action.payload.product;
        state.step = "mobile";
      })
      .addCase(scanQrCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not read this QR code";
      })
      // send otp
      .addCase(sendOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = "succeeded";
        state.otpSent = true;
        state.step = "otp";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not send OTP";
      })
      // verify otp
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload;
        state.step = "result";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Incorrect OTP";
      });
  },
});

export const { setMobileNumber, goToStep, resetFlow } = verificationSlice.actions;
export default verificationSlice.reducer;
