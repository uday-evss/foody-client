import type { FlowStep } from "../features/verification/verificationSlice";

export const STEP_ORDER: FlowStep[] = ["scan", "mobile", "otp", "result"];

export const STEP_LABELS: Record<FlowStep, string> = {
  scan: "Scan",
  mobile: "Mobile number",
  otp: "Verify OTP",
  result: "Verified",
};

export const PREVIOUS_STEP: Record<FlowStep, FlowStep | null> = {
  scan: null,
  mobile: "scan",
  otp: "mobile",
  result: null, // no going back once verified
};
