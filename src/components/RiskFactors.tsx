import { motion } from "framer-motion";
import { Mountain, Waves, Activity, ThermometerSun, Droplets, AlertTriangle } from "lucide-react";
import type { AnalysisResult } from "@/services/apiService";

const SEVERITY_COLORS: Record<string, string> = {
  MINIMAL: "bg-green-500",
  LOW: "bg-emerald-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-orange-500",
  EXTREME: "bg-destructive",
};

const SEVERITY_WIDTH: Record<string, string> = {
  MINIMAL: "w-[10%]",
  LOW: "w-[25%]",
  MEDIUM: "w-[50%]",
  HIGH: "w-[75%]",
  EXTREME: "w-[95%]",
};

interface RiskFactorsProps {
  data: AnalysisResult;
}

const RiskFactors = ({ data }: RiskFactorsProps) => {
  const factors = [
    {
      icon: Mountain,
      iconColor: "text-amber-400",
      name: "Elevation Risk",
      severity: data.elevation.severity,
      detail: `Elevation: ${data.elevation.elevation}m above sea level`,
      explanation: "Low-lying assets face significantly higher flood and storm surge exposure.",
      source: data.elevation.source,
    },
    {
      icon: Waves,
      iconColor: "text-primary",
      name: "Coastal Proximity",
      severity: data.coastal.severity,
      detail: `Distance to coast: ${data.coastal.distanceKm}km`,
      explanation: "Proximity to coastline increases exposure to storm surges, saltwater intrusion, and sea-level rise.",
      source: data.coastal.source,
    },
    {
      icon: Activity,
      iconColor: "text-purple-400",
      name: "Seismic Activity",
      severity: data.earthquake.severity,
      detail: `${data.earthquake.count} significant earthquakes (M4.0+) since 2000`,
      explanation: "Seismic history indicates structural risk from tectonic activity in the region.",
      source: data.earthquake.source,
    },
    {
      icon: ThermometerSun,
      iconColor: "text-orange-400",
      name: "Heat Stress",
      severity: data.climate.heatStressDays > 14 ? "HIGH" : data.climate.heatStressDays > 5 ? "MEDIUM" : "LOW",
      detail: `${data.climate.heatStressDays} days >35°C in last 90 days (avg max: ${data.climate.avgMaxTemp}°C)`,
      explanation: "Extreme heat degrades infrastructure, increases cooling costs, and reduces asset lifespan.",
      source: data.climate.source,
    },
    {
      icon: Droplets,
      iconColor: "text-blue-400",
      name: "River Flood Risk",
      severity: data.river.severity,
      detail: `Distance to nearest river: ${data.river.distanceKm}km`,
      explanation: "Proximity to rivers increases risk of fluvial flooding events during heavy rainfall.",
      source: data.river.source,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="h-6 w-6 text-warning" />
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Climate Risk Factors
        </h2>
        <span className="ml-auto text-sm font-semibold px-3 py-1 rounded-full bg-card border border-border text-foreground">
          Score: {data.overallScore}/100 — {data.riskLevel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.name}
              className="rounded-lg border border-border bg-card/60 backdrop-blur-md p-5"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-secondary/50 p-2.5">
                  <Icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground text-base">{f.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${SEVERITY_COLORS[f.severity]} text-white`}>
                      {f.severity}
                    </span>
                  </div>

                  {/* Severity bar */}
                  <div className="mt-3 h-2 w-full rounded-full bg-secondary/50 overflow-hidden">
                    <div className={`h-full rounded-full ${SEVERITY_COLORS[f.severity]} ${SEVERITY_WIDTH[f.severity]} transition-all duration-700`} />
                  </div>

                  <p className="mt-3 text-sm text-foreground">{f.detail}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.explanation}</p>
                  <p className="text-xs text-muted-foreground/50 mt-1 italic">Source: {f.source}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default RiskFactors;
