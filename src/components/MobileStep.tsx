import { useAppDispatch, useAppSelector } from "../app/hooks";
import { sendOtp, setMobileNumber } from "../features/verification/verificationSlice";

export default function MobileStep() {
  const dispatch = useAppDispatch();
  const { mobileNumber, referenceNo, status, error } = useAppSelector((s) => s.verification);

  const isValid = /^\d{10}$/.test(mobileNumber);

  const handleSendOtp = () => {
    if (!isValid || !referenceNo) return;
    dispatch(sendOtp({ mobileNumber, referenceNo }));
  };

  return (
    <div className="step-body">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "var(--forest-deep)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            color: "var(--gold-soft)",
            fontSize: 22,
          }}
        >
          📱
        </div>
        <h2 className="step-heading">Verify your number</h2>
        <p className="step-subtext">We'll text a one-time code to confirm this scan is you</p>

        {error && <div className="error-banner">{error}</div>}

        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
          <span
            style={{
              height: 52,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              border: "1.5px solid var(--clay)",
              borderRadius: 12,
              background: "#fff",
              color: "var(--ink-soft)",
              fontSize: 14,
            }}
          >
            +91
          </span>
          <input
            className="field-input"
            style={{ fontFamily: "var(--font-mono)" }}
            placeholder="10-digit number"
            value={mobileNumber}
            maxLength={10}
            inputMode="numeric"
            onChange={(e) => dispatch(setMobileNumber(e.target.value.replace(/\D/g, "")))}
          />
        </div>
      </div>

      <button className="primary-btn" disabled={!isValid || status === "loading"} onClick={handleSendOtp}>
        {status === "loading" ? "Sending code…" : "Send OTP"}
      </button>
    </div>
  );
}
