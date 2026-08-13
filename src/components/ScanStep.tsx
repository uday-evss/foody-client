// import { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { useAppDispatch } from "../app/hooks";
// import { goToStep } from "../features/verification/verificationSlice";

// const QR_READER_ELEMENT_ID = "qr-reader";

// export default function ScanStep() {
//   const dispatch = useAppDispatch();

//   const [scanned, setScanned] = useState(false);
//   const [cameraError, setCameraError] = useState<string | null>(null);

//   const scannerRef = useRef<Html5Qrcode | null>(null);
//   const lockedRef = useRef(false);

//   useEffect(() => {
//     const scanner = new Html5Qrcode(QR_READER_ELEMENT_ID);
//     scannerRef.current = scanner;

//     scanner
//       .start(
//         { facingMode: "environment" },
//         {
//           fps: 10,
//           qrbox: {
//             width: 200,
//             height: 200,
//           },
//         },
//         () => {
//           // QR detected.
//           // We intentionally do NOT:
//           // - store the QR value
//           // - call any API
//           // - dispatch scanQrCode
//           if (lockedRef.current) return;

//           lockedRef.current = true;
//           setScanned(true);

//           // Pause scanner after QR detection
//           scannerRef.current?.pause(true);
//         },
//         () => {
//           // Ignore continuous QR scanning errors
//         },
//       )
//       .catch((err) => {
//         console.error("Camera start failed:", err);

//         setCameraError("Camera unavailable — you can still continue");
//       });

//     return () => {
//       scannerRef.current
//         ?.stop()
//         .then(() => scannerRef.current?.clear())
//         .catch(() => {});
//     };
//   }, []);

//   const canContinue = scanned || !!cameraError;

//   const handleContinue = () => {
//     if (!canContinue) return;

//     // Only move to the next step.
//     // No QR value is stored.
//     // No API call is made.
//     dispatch(goToStep("mobile"));
//   };

//   return (
//     <div
//       className="step-body"
//       style={{
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <div className="qr-frame">
//         <div id={QR_READER_ELEMENT_ID} className="qr-video" />

//         <div className="qr-corner qr-corner--tl" />
//         <div className="qr-corner qr-corner--tr" />
//         <div className="qr-corner qr-corner--bl" />
//         <div className="qr-corner qr-corner--br" />

//         <div className="qr-scanline qr-scanline--looping" />
//       </div>

//       <p className="step-subtext" style={{ marginTop: 18 }}>
//         {cameraError
//           ? cameraError
//           : scanned
//             ? "Product code recognised — tap Continue"
//             : "Place the QR code within the frame"}
//       </p>

//       <button
//         className="primary-btn"
//         style={{
//           width: "100%",
//           marginTop: 8,
//         }}
//         disabled={!canContinue}
//         onClick={handleContinue}
//       >
//         {canContinue ? "Continue" : "Scanning…"}
//       </button>

//       <style>{`
//         .qr-video {
//           position: absolute;
//           inset: 0;
//           border-radius: 20px;
//           overflow: hidden;
//         }

//         .qr-video video {
//           width: 100% !important;
//           height: 100% !important;
//           object-fit: cover;
//         }

//         .qr-scanline--looping {
//           animation: qr-scan-loop 1.8s ease-in-out infinite;
//         }

//         @keyframes qr-scan-loop {
//           0% {
//             top: 10%;
//           }

//           50% {
//             top: 85%;
//           }

//           100% {
//             top: 10%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAppDispatch } from "../app/hooks";
import { goToStep } from "../features/verification/verificationSlice";

const QR_READER_ELEMENT_ID = "qr-reader";

export default function ScanStep() {
  const dispatch = useAppDispatch();

  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lockedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode(QR_READER_ELEMENT_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 200,
            height: 200,
          },
        },
        () => {
          // QR detected.
          // We intentionally do not store the decoded value.
          if (lockedRef.current) return;

          lockedRef.current = true;
          setScanned(true);

          scannerRef.current?.pause(true);
        },
        () => {
          // Ignore continuous scanning errors
        },
      )
      .catch((err) => {
        console.error("Camera start failed:", err);

        setCameraError("Camera unavailable — you can still continue");
      });

    return () => {
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {});
    };
  }, []);

  const canContinue = scanned || !!cameraError;

  const handleContinue = () => {
    if (!canContinue) return;

    // Only move to MobileStep.
    // No QR value is stored.
    // No product API is called.
    dispatch(goToStep("mobile"));
  };

  return (
    <div
      className="step-body"
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="qr-frame">
        <div id={QR_READER_ELEMENT_ID} className="qr-video" />

        <div className="qr-corner qr-corner--tl" />
        <div className="qr-corner qr-corner--tr" />
        <div className="qr-corner qr-corner--bl" />
        <div className="qr-corner qr-corner--br" />

        <div className="qr-scanline qr-scanline--looping" />
      </div>

      <p className="step-subtext" style={{ marginTop: 18 }}>
        {cameraError
          ? cameraError
          : scanned
            ? "Product code recognised — tap Continue"
            : "Place the QR code within the frame"}
      </p>

      <button
        className="primary-btn"
        style={{
          width: "100%",
          marginTop: 8,
        }}
        disabled={!canContinue}
        onClick={handleContinue}
      >
        {canContinue ? "Continue" : "Scanning…"}
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
          0% {
            top: 10%;
          }

          50% {
            top: 85%;
          }

          100% {
            top: 10%;
          }
        }
      `}</style>
    </div>
  );
}