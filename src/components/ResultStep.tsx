import { useAppDispatch, useAppSelector } from "../app/hooks";
import { resetFlow } from "../features/verification/verificationSlice";

export default function ResultStep() {
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((s) => s.verification);

  if (!product) return null;

  return (
    <div className="step-body" style={{ alignItems: "center", textAlign: "center" }}>
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 999,
          background: "conic-gradient(var(--gold), var(--success), var(--gold))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            background: "var(--cream)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            color: "var(--success)",
          }}
        >
          ✓
        </div>
      </div>

      <h2 className="step-heading">Origin verified</h2>
      <p className="step-subtext">This product is authentic and traced</p>

      <div className="result-card">
        <img src={product.imageUrl} alt={product.productName} />
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: "var(--font-display)" }}>{product.productName}</div>
          <div style={{ color: "var(--ink-soft)", fontSize: 12, marginBottom: 10 }}>{product.variant}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)" }}>
            <Row label="Producer" value={product.producer} />
            <Row label="Batch" value={product.batchNo} />
            <Row label="Reference" value={product.referenceNo} />
          </div>
        </div>
      </div>

      <button className="secondary-btn" style={{ width: "100%", marginTop: 18 }} onClick={() => dispatch(resetFlow())}>
        Scan another product
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>{label}</span>
      <span style={{ color: "var(--ink)" }}>{value}</span>
    </div>
  );
}
