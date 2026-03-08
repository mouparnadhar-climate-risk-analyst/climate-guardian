import type { AnalysisResult } from "@/services/apiService";

const fmt = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

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

interface PrintableReportProps {
  data: AnalysisResult | null;
  propertyName: string;
  assetValue: string;
}

const PrintableReport = ({ data, propertyName, assetValue }: PrintableReportProps) => {
  if (!data) return null;

  const baseValue = (() => {
    const parsed = parseFloat(assetValue.replace(/[^0-9.]/g, ""));
    return isNaN(parsed) || parsed <= 0 ? 10_000_000 : parsed;
  })();

  const rate = data.lossPerDecade ?? 0.10;

  const decades = [
    { year: 2025, scenario: "Baseline", decadesOut: 0 },
    { year: 2035, scenario: "RCP 4.5", decadesOut: 1 },
    { year: 2045, scenario: "RCP 4.5", decadesOut: 2 },
    { year: 2055, scenario: "RCP 8.5", decadesOut: 3 },
    { year: 2065, scenario: "RCP 8.5", decadesOut: 4 },
  ];

  const rows = decades.map((d) => {
    const pct = Math.min(1 - Math.pow(1 - rate, d.decadesOut), 0.99);
    const projected = baseValue * (1 - pct);
    const loss = baseValue * pct;
    return { ...d, pct, projected, loss, risk: pct <= 0.05 ? "LOW" : pct <= 0.15 ? "LOW-MEDIUM" : pct <= 0.30 ? "MEDIUM" : pct <= 0.50 ? "HIGH" : "VERY HIGH" };
  });

  const factors = [
    { name: "Elevation Risk", severity: data.elevation.severity },
    { name: "Coastal Proximity", severity: data.coastal.severity },
    { name: "Seismic Activity", severity: data.earthquake.severity },
    { name: "Heat Stress", severity: data.climate.heatStressDays > 14 ? "HIGH" : data.climate.heatStressDays > 5 ? "MEDIUM" : "LOW" },
    { name: "River Flood Risk", severity: data.river.severity },
  ];

  const topRisks = [...factors]
    .sort((a, b) => (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0))
    .slice(0, 3);

  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="printable-report" style={{ display: "none" }}>
      {/* PAGE 1 — Executive Summary */}
      <div style={{ pageBreakAfter: "always" }}>
        <div style={{ borderBottom: "2px solid hsl(190 100% 50%)", paddingBottom: "16px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>ClimateVault Executive Report</h1>
          <p style={{ fontSize: "13px", color: "#8899AA", marginTop: "6px" }}>
            TCFD / CSRD Climate Risk Assessment | Generated: {dateStr}
          </p>
        </div>

        {/* Asset Summary */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Asset Information</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", color: "#8899AA", width: "200px" }}>Property Name</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", fontWeight: 600 }}>{propertyName || "N/A"}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", color: "#8899AA" }}>Location</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", fontWeight: 600 }}>{data.location.displayName}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", color: "#8899AA" }}>Coordinates</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", fontWeight: 600 }}>{data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", color: "#8899AA" }}>Asset Value</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", fontWeight: 600 }}>{fmt(baseValue)}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", color: "#8899AA" }}>Overall Risk Score</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #1E293B", fontWeight: 700, color: "hsl(190 100% 50%)" }}>{data.overallScore}/100 — {data.riskLevel}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Projections Table */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Financial Risk Projection (10-Year Intervals)</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #1E293B" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "#8899AA", fontWeight: 600 }}>Year</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "#8899AA", fontWeight: 600 }}>Scenario</th>
                <th style={{ padding: "10px 12px", textAlign: "right", color: "#8899AA", fontWeight: 600 }}>Projected Value</th>
                <th style={{ padding: "10px 12px", textAlign: "right", color: "#8899AA", fontWeight: 600 }}>Value Loss</th>
                <th style={{ padding: "10px 12px", textAlign: "right", color: "#8899AA", fontWeight: 600 }}>Loss %</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: "#8899AA", fontWeight: 600 }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} style={{ borderBottom: "1px solid #1E293B" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{r.year}</td>
                  <td style={{ padding: "10px 12px" }}>{r.scenario}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>{fmt(r.projected)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>{r.loss === 0 ? "—" : `-${fmt(r.loss)}`}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>{r.loss === 0 ? "0%" : `-${(r.pct * 100).toFixed(0)}%`}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>{r.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: "11px", color: "#556677", marginTop: "8px" }}>
            Based on IPCC AR6 SSP2-4.5 and SSP5-8.5 projections. Loss rates computed from live geospatial data.
          </p>
        </div>

        {/* Risk Factors Summary */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Risk Factor Summary</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #1E293B" }}>
                <th style={{ padding: "8px 12px", textAlign: "left", color: "#8899AA" }}>Factor</th>
                <th style={{ padding: "8px 12px", textAlign: "center", color: "#8899AA" }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {factors.map((f) => (
                <tr key={f.name} style={{ borderBottom: "1px solid #1E293B" }}>
                  <td style={{ padding: "8px 12px" }}>{f.name}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700 }}>{f.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGE 2 — Detailed Risk Impact & Adaptation Strategy */}
      <div>
        <div style={{ borderBottom: "2px solid hsl(190 100% 50%)", paddingBottom: "16px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>Detailed Risk Impact & Adaptation Strategy</h1>
          <p style={{ fontSize: "13px", color: "#8899AA", marginTop: "6px" }}>
            Property: {propertyName} | Generated: {dateStr}
          </p>
        </div>

        {topRisks.map((risk) => (
          <div key={risk.name} style={{ marginBottom: "28px", border: "1px solid #1E293B", borderRadius: "8px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{risk.name}</h2>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", color: "white", backgroundColor: risk.severity === "EXTREME" ? "#DC2626" : risk.severity === "HIGH" ? "#F97316" : risk.severity === "MEDIUM" ? "#EAB308" : "#22C55E" }}>
                {risk.severity}
              </span>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "hsl(190 100% 50%)", marginBottom: "4px" }}>Operational Impact</h3>
              <p style={{ fontSize: "13px", lineHeight: "1.6" }}>{IMPACT_TEXT[risk.name]}</p>
            </div>
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "hsl(190 100% 50%)", marginBottom: "4px" }}>Recommended Actions</h3>
              <p style={{ fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-line" }}>{ADAPTATION_TEXT[risk.name]}</p>
            </div>
          </div>
        ))}

        <div style={{ marginTop: "40px", paddingTop: "12px", borderTop: "1px solid #1E293B", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "#556677" }}>
            Page 2 | Generated by ClimateVault Intelligence | {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;
