import type { FlowStep } from "../features/verification/verificationSlice";
import { STEP_ORDER } from "./stepMeta";

export default function TraceMarks({ step }: { step: FlowStep }) {
  const activeIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="trace-marks">
      {STEP_ORDER.map((s, i) => (
        <div
          key={s}
          className={
            "trace-mark " +
            (i === activeIndex ? "trace-mark--active" : i < activeIndex ? "trace-mark--done" : "trace-mark--todo")
          }
        />
      ))}
    </div>
  );
}
