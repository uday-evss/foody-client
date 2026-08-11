import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { scanQrCode } from "../features/verification/verificationSlice";

// POC NOTE: real camera-based QR scanning (e.g. via a library like
// `@zxing/browser` or `react-qr-reader`) would populate this same value.
// For the demo it's a static reference number so the flow can be shown
// end-to-end without a camera.
const DEMO_REFERENCE_NO = "245436546";

export default function ScanStep() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.verification);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setScanned(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // IMPORTANT: scanning only *reveals* the Continue button. The step only
  // advances (via the scanQrCode thunk, which flips state.step to "mobile")
  // when the user explicitly presses it — never automatically.
  const handleContinue = () => {
    dispatch(scanQrCode(DEMO_REFERENCE_NO));
  };

  return (
    <div className="step-body" style={{ alignItems: "center", justifyContent: "center" }}>
      <div className="qr-frame">
        <div className="qr-corner qr-corner--tl" />
        <div className="qr-corner qr-corner--tr" />
        <div className="qr-corner qr-corner--bl" />
        <div className="qr-corner qr-corner--br" />
        <div className="qr-scanline" style={{ top: scanned ? "50%" : "10%" }} />
      </div>

      <p className="step-subtext" style={{ marginTop: 18 }}>
        {scanned ? "Product code recognised" : "Place the QR code within the frame"}
      </p>

      {error && <div className="error-banner">{error}</div>}

      <button
        className="primary-btn"
        style={{ width: "100%", marginTop: 8 }}
        disabled={!scanned || status === "loading"}
        onClick={handleContinue}
      >
        {status === "loading" ? "Checking code…" : scanned ? "Continue" : "Scanning…"}
      </button>
    </div>
  );
}
