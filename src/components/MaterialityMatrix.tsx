import type { FC } from "react";

interface MaterialityMatrixProps {
  impactScore: number; // vertical axis (Impact on Planet)
  riskScore: number;   // horizontal axis (Risk to Asset)
}

const clamp01 = (value: number) => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
};

const MaterialityMatrix: FC<MaterialityMatrixProps> = ({ impactScore, riskScore }) => {
  const impact = clamp01(impactScore);
  const risk = clamp01(riskScore);

  // Convert scores (0–100) into percentage positions within the square
  const dotLeft = `${risk}%`;
  const dotTop = `${100 - impact}%`; // higher impact -> closer to top

  return (
    <div className="mt-8 bg-[#0B1020]/80 border border-white/10 rounded-2xl p-4 md:p-6 shadow-[0_0_35px_rgba(34,211,238,0.10)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Double Materiality
          </p>
          <h3 className="text-sm md:text-base font-semibold text-foreground">
            Risk vs. Impact Matrix
          </h3>
        </div>
        <div className="text-right text-[10px] md:text-xs text-muted-foreground">
          <div>Horizontal: Risk to Asset</div>
          <div>Vertical: Impact on Planet (CO2e)</div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[360px] aspect-square">
        {/* Grid */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 bg-slate-900/80 rounded-xl overflow-hidden border border-white/10">
          <div className="relative bg-slate-900/70">
            <span className="absolute top-1 left-1 text-[9px] md:text-[10px] font-semibold text-emerald-300">
              Low Risk / High Impact
            </span>
          </div>
          <div className="relative bg-slate-900/70">
            <span className="absolute top-1 right-1 text-[9px] md:text-[10px] font-semibold text-red-300 text-right">
              High Risk / High Impact
            </span>
          </div>
          <div className="relative bg-slate-900/70">
            <span className="absolute bottom-1 left-1 text-[9px] md:text-[10px] font-semibold text-emerald-300">
              Low Risk / Low Impact
            </span>
          </div>
          <div className="relative bg-slate-900/70">
            <span className="absolute bottom-1 right-1 text-[9px] md:text-[10px] font-semibold text-yellow-300 text-right">
              High Risk / Low Impact
            </span>
          </div>
        </div>

        {/* Axes labels */}
        <div className="absolute -left-6 inset-y-0 flex items-center">
          <span className="rotate-[-90deg] text-[10px] md:text-xs text-muted-foreground tracking-wide">
            Impact on Planet
          </span>
        </div>
        <div className="absolute -bottom-5 inset-x-0 flex justify-center">
          <span className="text-[10px] md:text-xs text-muted-foreground tracking-wide">
            Risk to Asset
          </span>
        </div>

        {/* Glowing dot */}
        <div
          className="absolute w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.95)] border border-cyan-200/60"
          style={{
            left: dotLeft,
            top: dotTop,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
};

export default MaterialityMatrix;

