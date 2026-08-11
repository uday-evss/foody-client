import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { verifyOtp } from "../features/verification/verificationSlice";

const OTP_LENGTH = 6;

export default function OtpStep() {
  const dispatch = useAppDispatch();
  const { mobileNumber, referenceNo, status, error } = useAppSelector((s) => s.verification);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const otpCode = digits.join("");
  const isComplete = otpCode.length === OTP_LENGTH;

  const handleDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < OTP_LENGTH - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = () => {
    if (!isComplete || !referenceNo) return;
    dispatch(verifyOtp({ mobileNumber, referenceNo, otpCode }));
  };

  return (
    <div className="step-body">
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 className="step-heading">Enter the code</h2>
        <p className="step-subtext">Sent to +91 {mobileNumber}</p>

        {error && <div className="error-banner">{error}</div>}
        <p style={{ color: "var(--ink-soft)", fontSize: 12 }}>
          Enter 624103
        </p>

        <div className="otp-grid">
          {digits.map((d, i) => (
            <input
              key={i}
              id={`otp-input-${i}`}
              value={d}
              maxLength={1}
              inputMode="numeric"
              className={`otp-input ${d ? "otp-input--filled" : ""}`}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>
        <p style={{ color: "var(--ink-soft)", fontSize: 12 }}>
          Resend code in 24s
        </p>
      </div>

      <button
        className="primary-btn"
        disabled={!isComplete || status === "loading"}
        onClick={handleSubmit}
      >
        {status === "loading" ? "Verifying…" : "Verify and continue"}
      </button>
    </div>
  );
}
