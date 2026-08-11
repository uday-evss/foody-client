import { useAppSelector } from "../app/hooks";
import TopBar from "../components/TopBar";
import TraceMarks from "../components/TraceMarks";
import ScanStep from "../components/ScanStep";
import MobileStep from "../components/MobileStep";
import OtpStep from "../components/OtpStep";
import ResultStep from "../components/ResultStep";

export default function VerifyFlow() {
  const step = useAppSelector((s) => s.verification.step);

  return (
    <div className="app-shell">
      <div className="brand-lockup">
        <div className="brand-eyebrow">ORIGINHASH · VERIFY</div>
        <div className="brand-title">Molecule to Market</div>
      </div>

      <div className="phone-shell">
        <TopBar step={step} />
        <TraceMarks step={step} />

        {step === "scan" && <ScanStep />}
        {step === "mobile" && <MobileStep />}
        {step === "otp" && <OtpStep />}
        {step === "result" && <ResultStep />}
      </div>
    </div>
  );
}
