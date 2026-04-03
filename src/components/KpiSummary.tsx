import { ShieldAlert, TrendingDown, ShieldCheck, FileText, Zap, TrendingUp, Hourglass, Globe2, SunMedium } from "lucide-react";
import type { AnalysisResult } from "@/services/apiService";

interface KpiSummaryProps {
  assetValue: string;
  analysisData: AnalysisResult | null;
}

const KpiSummary = ({ assetValue, analysisData }: KpiSummaryProps) => {
  if (!analysisData) return null;

  const valueNum = Number(assetValue) || 10000000;
  // Calculate 2065 loss based on 4 decades of compounded loss
  const lossPercent2065 = Math.round((1 - Math.pow(1 - analysisData.lossPerDecade, 4)) * 100);
  const valueLoss = Math.round(valueNum * (lossPercent2065 / 100));
  const adaptationBudget = Math.round(valueNum * analysisData.adaptationCostPercent);

  return (
    <>
      {/* 🚨 NEW: STRANDED ASSET COUNTDOWN CLOCK 🚨 */}
      <div className={`mb-6 p-5 md:p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${analysisData.strandedYear < 2050 ? 'bg-red-950/40 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'bg-yellow-950/20 border-yellow-500/30'}`}>
        <div className="max-w-2xl">
          <div className={`flex items-center gap-2 font-bold tracking-widest text-xs md:text-sm mb-2 ${analysisData.strandedYear < 2050 ? 'text-red-400' : 'text-yellow-400'}`}>
            <Hourglass className="w-5 h-5 animate-pulse" />
            STRANDED ASSET COUNTDOWN
          </div>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            Based on current compounding physical risks and regulatory transition penalties (CRREM pathways), this asset is projected to become uninsurable, unsellable, or commercially obsolete by this year without immediate deep retrofitting.
          </p>
        </div>
        <div className={`text-6xl md:text-7xl font-black tracking-tighter font-orbitron tabular-nums ${analysisData.strandedYear < 2050 ? 'text-red-500' : 'text-yellow-500'}`}>
          {analysisData.strandedYear}
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
        <div className="bg-[#131B2E]/50 backdrop-blur-md border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
            <ShieldAlert className="w-3 h-3 text-cyan-400" /> Overall Risk Score
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-orbitron tabular-nums">{analysisData.overallScore}/100</div>
          <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">
            {analysisData.riskLevel} — Monitor periodically
          </div>
        </div>

        <div className="bg-[#131B2E]/50 backdrop-blur-md border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
            <TrendingDown className="w-3 h-3 text-red-400" /> Value Loss by 2065
          </div>
          <div className="text-2xl font-bold text-red-400 font-orbitron tabular-nums">${valueLoss.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">Based on live geospatial analysis</div>
        </div>

        <div className="bg-[#131B2E]/50 backdrop-blur-md border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Adaptation Budget
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-orbitron tabular-nums">${adaptationBudget.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">To reduce risk score to &lt; 45</div>
        </div>

        <div className="bg-[#131B2E]/50 backdrop-blur-md border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
            <FileText className="w-3 h-3 text-orange-400" /> Insurance Premium
          </div>
          <div className="text-2xl font-bold text-orange-400 font-orbitron tabular-nums">+34% by 2035</div>
          <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">Based on trajectory</div>
        </div>

        {/* NEW: ROI CARD */}
        <div className="bg-[#131B2E]/50 backdrop-blur-md border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Adaptation ROI
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-orbitron tabular-nums">+{analysisData.adaptationROI}%</div>
          <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">Return on resilience spend</div>
        </div>

        {/* NEW: GREEN PREMIUM CARD */}
        <div className="bg-[#131B2E]/50 backdrop-blur-md border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
            <Zap className="w-3 h-3 text-cyan-400" /> Green Premium
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-orbitron tabular-nums">+{analysisData.greenPremiumPercent}%</div>
          <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">Market value uplift</div>
        </div>

        {/* NEW: DOUBLE MATERIALITY IMPACT CARD */}
        <div className="bg-[#131B2E]/50 backdrop-blur-md border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
            <Globe2 className="w-3 h-3 text-cyan-300" /> Impact Materiality (CO2e)
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-orbitron tabular-nums">{analysisData.impactScore}/100</div>
          <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">
            Building-on-Planet Impact
          </div>
        </div>

        {/* NEW: SOLAR YIELD OPPORTUNITY CARD */}
        <div className="bg-[#131B2E]/50 backdrop-blur-md border border-white/10 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
              <SunMedium className="w-3 h-3 text-amber-300" /> Solar Yield Potential
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 font-semibold">
              🟢 LIVE DATA
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-300 font-orbitron tabular-nums">
            {analysisData.solarPotential}%</div>
          <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">
            Asset Adaptation Opportunity
          </div>
        </div>
      </div>
    </>
  );
};

export default KpiSummary;