import { useAppDispatch } from "../app/hooks";
import { goToStep, type FlowStep } from "../features/verification/verificationSlice";
import { STEP_LABELS, PREVIOUS_STEP } from "./stepMeta";

export default function TopBar({ step }: { step: FlowStep }) {
  const dispatch = useAppDispatch();
  const previous = PREVIOUS_STEP[step];

  return (
    <div className="phone-topbar">
      <button
        className="phone-back"
        disabled={!previous}
        onClick={() => previous && dispatch(goToStep(previous))}
        aria-label="Go back"
      >
        ←
      </button>
      <span className="phone-topbar__label">{STEP_LABELS[step]}</span>
      <span style={{ width: 20 }} />
    </div>
  );
}
