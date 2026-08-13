import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { scanQrCode } from "../features/verification/verificationSlice";

// POC NOTE: used only if the camera can't be started (permission denied,
// no camera on the device, etc.) so the flow can still be demoed.
const FALLBACK_REFERENCE_NO = "245436546";
const QR_READER_ELEMENT_ID = "qr-reader";

export default function ScanStep() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.verification);
  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Refs (not state) because these values don't need to trigger re-renders —
  // they're only read once, when the user presses Continue.
  const decodedRef = useRef<string>(FALLBACK_REFERENCE_NO);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  // Guards against re-locking on every subsequent frame — a ref (not state)
  // because it's read inside the success callback, which was created once
  // when the effect ran and would otherwise see a stale `scanned`.
  const lockedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode(QR_READER_ELEMENT_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
          // Lock onto the first clear read — ignore every frame after it.
          // Without this, a continuously-decoding camera keeps firing this
          // callback (and re-freezing/updating state) for as long as the
          // code stays in view, which reads as flickery/uncertain to the
          // user. Locking also freezes the video on the successful frame,
          // giving clear visual confirmation while we wait for Continue.
          if (lockedRef.current) return;
          lockedRef.current = true;

          decodedRef.current = decodedText;
          setScanned(true);
          scannerRef.current?.pause(true);
        },
        () => {
          // per-frame "no QR in view yet" callback — expected noise, ignore
        },
      )
      .catch((err) => {
        console.error("Camera start failed:", err);
        setCameraError(
          "Camera unavailable — you can still continue with the demo code",
        );
      });

    // Stop the camera whenever this step unmounts (Continue pressed, or the
    // user navigates back to it later) so it's never left running silently.
    return () => {
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {
          /* already stopped/never started — nothing to clean up */
        });
    };
  }, []);

  const canContinue = scanned || !!cameraError;

  const handleContinue = () => {
    dispatch(scanQrCode(decodedRef.current));
  };

  return (
    <div
      className="step-body"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <div className="qr-frame">
        <div id={QR_READER_ELEMENT_ID} className="qr-video" />
        <div className="qr-corner qr-corner--tl" />
        <div className="qr-corner qr-corner--tr" />
        <div className="qr-corner qr-corner--bl" />
        <div className="qr-corner qr-corner--br" />
        {/* Loops continuously regardless of detection state. The only thing
            that stops it is this component unmounting on Continue. */}
        <div className="qr-scanline qr-scanline--looping" />
      </div>

      <p className="step-subtext" style={{ marginTop: 18 }}>
        {cameraError
          ? cameraError
          : scanned
            ? "Product code recognised — tap Continue"
            : "Place the QR code within the frame"}
      </p>

      {error && <div className="error-banner">{error}</div>}

      <button
        className="primary-btn"
        style={{ width: "100%", marginTop: 8 }}
        disabled={!canContinue || status === "loading"}
        onClick={handleContinue}
      >
        {status === "loading"
          ? "Checking code…"
          : canContinue
            ? "Continue"
            : "Scanning…"}
      </button>

      <style>{`
        .qr-video {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          overflow: hidden;
        }
        .qr-video video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
        }
        .qr-scanline--looping {
          animation: qr-scan-loop 1.8s ease-in-out infinite;
        }
        @keyframes qr-scan-loop {
          0% { top: 10%; }
          50% { top: 85%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
}
