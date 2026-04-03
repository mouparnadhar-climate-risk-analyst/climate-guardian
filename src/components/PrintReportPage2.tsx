import type { AnalysisResult } from "@/services/apiService";

const SEVERITY_ORDER: Record<string, number> = {
  EXTREME: 5, HIGH: 4, MEDIUM: 3, LOW: 2, MINIMAL: 1,
};

const IMPACT_TEXT: Record<string, string> = {
  "Elevation Risk": "Low elevation exposes the asset to flooding, storm surges, and waterlogging. Basement infrastructure, ground-floor utilities, and foundation integrity face accelerated degradation from repeated water exposure.",
  "Coastal Proximity": "Proximity to the coastline increases vulnerability to storm surges, saltwater intrusion, and long-term sea-level rise. Structural corrosion and insurance premiums rise significantly for coastal properties.",
  "Seismic Activity": "Seismic events can cause catastrophic structural failure, foundation damage, and prolonged business interruption. Aftershock sequences may compound initial damage over weeks.",
  "Heat Stress": "Prolonged heatwaves increase cooling costs, stress HVAC systems, degrade roofing and facade materials, and reduce overall habitability and worker productivity.",
  "River Flood Risk": "Fluvial flooding from nearby rivers during heavy rainfall can inundate ground floors, damage electrical systems, contaminate water supplies, and require costly remediation.",
};

const ADAPTATION_TEXT: Record<string, string> = {
  "Elevation Risk": "• Install flood barriers, backflow valves, and sump pump systems.\n• Elevate critical electrical and mechanical infrastructure above projected flood levels.\n• Consider flood-resilient building materials for ground-floor renovation.",
  "Coastal Proximity": "• Invest in corrosion-resistant building materials and protective coastal landscaping.\n• Evaluate managed retreat or coastal defense structures for long-term resilience.\n• Secure specialized coastal property insurance coverage.",
  "Seismic Activity": "• Commission a structural seismic assessment and retrofit to modern building codes.\n• Install seismic isolation bearings and flexible utility connections.\n• Develop a business continuity plan with earthquake-specific protocols.",
  "Heat Stress": "• Upgrade to high-albedo reflective roofing and advanced insulation.\n• Install smart HVAC sensors and energy-efficient cooling systems.\n• Implement green roof or shading solutions to reduce urban heat island effects.",
  "River Flood Risk": "• Construct or reinforce flood levees and drainage channels around the property.\n• Install early-warning flood monitoring sensors connected to automated alerts.\n• Ensure comprehensive flood insurance and establish an emergency evacuation plan.",
};

interface PrintReportPage2Props {
  data: AnalysisResult;
  propertyName: string;
}

const PrintReportPage2 = ({ data, propertyName }: PrintReportPage2Props) => {
  const factors = [
    { name: "Elevation Risk", severity: data.elevation.severity },
    { name: "Coastal Proximity", severity: data.coastal.severity },
    { name: "Seismic Activity", severity: data.earthquake.severity },
    { name: "Heat Stress", severity: data.climate.heatStressDays > 14 ? "HIGH" : data.climate.heatStressDays > 5 ? "MEDIUM" : "LOW" },
    { name: "River Flood Risk", severity: data.river.severity },
  ];

  const topRisks = factors
    .sort((a, b) => (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0))
    .slice(0, 2);

  return (
    <div className="hidden print:block print:break-before-page" id="print-page-2">
      <div className="py-6">
        <div className="border-b-2 border-primary/40 pb-4 mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Detailed Risk Impact & Adaptation Strategy
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Property: {propertyName} | Generated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {topRisks.map((risk) => (
          <div key={risk.name} className="mb-8 rounded-lg border border-border bg-card/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-foreground">{risk.name}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${
                risk.severity === "EXTREME" ? "bg-destructive" :
                risk.severity === "HIGH" ? "bg-orange-500" :
                risk.severity === "MEDIUM" ? "bg-yellow-500" :
                "bg-emerald-500"
              }`}>
                {risk.severity}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-primary mb-1">Operational Impact</h3>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {IMPACT_TEXT[risk.name]}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary mb-1">Recommended Actions</h3>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {ADAPTATION_TEXT[risk.name]}
              </p>
            </div>
          </div>
        ))}

        <div className="mt-12 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Page 2 | Generated by TerraQuant Intelligence | {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintReportPage2;
