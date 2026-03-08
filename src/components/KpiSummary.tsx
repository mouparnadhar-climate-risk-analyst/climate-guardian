import { useMemo } from "react";
import { ShieldAlert, TrendingDown, ShieldCheck, FileText } from "lucide-react";
import type { AnalysisResult } from "@/services/apiService";

const fmt = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

interface KpiSummaryProps {
  assetValue: string;
  analysisData?: AnalysisResult | null;
}

const KpiSummary = ({ assetValue, analysisData }: KpiSummaryProps) => {
  const baseValue = useMemo(() => {
    const parsed = parseFloat(assetValue.replace(/[^0-9.]/g, ""));
    return isNaN(parsed) || parsed <= 0 ? 10_000_000 : parsed;
  }, [assetValue]);

  const riskScore = analysisData?.overallScore ?? 73;
  const lossRate = analysisData?.lossPerDecade ?? 0.10;
  const loss2065 = 1 - Math.pow(1 - lossRate, 4);

  const cards = [
    {
      title: "Overall Risk Score",
      value: `${riskScore}/100`,
      valueClass: "text-primary",
      subtitle: analysisData
        ? `${analysisData.riskLevel} — ${riskScore > 60 ? "Immediate action recommended" : "Monitor periodically"}`
        : "HIGH RISK — Immediate action recommended",
      icon: ShieldAlert,
    },
    {
      title: "Value Loss by 2065",
      value: fmt(baseValue * loss2065),
      valueClass: "text-destructive",
      subtitle: analysisData ? "Based on live geospatial analysis" : "Under RCP 8.5 scenario",
      icon: TrendingDown,
    },
    {
      title: "Adaptation Budget",
      value: fmt(baseValue * 0.08),
      valueClass: "text-emerald-400",
      subtitle: "To reduce risk score to < 45",
      icon: ShieldCheck,
    },
    {
      title: "Insurance Premium",
      value: "+34% by 2035",
      valueClass: "text-warning",
      subtitle: "Based on trajectory",
      icon: FileText,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-lg border border-border bg-card/60 backdrop-blur-md p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">{card.title}</span>
            </div>
            <p className={`text-2xl font-bold ${card.valueClass}`}>{card.value}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
};

export default KpiSummary;
