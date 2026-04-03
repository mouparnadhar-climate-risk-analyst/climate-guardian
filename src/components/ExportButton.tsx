import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/services/apiService";
import { jsPDF } from "jspdf";

interface ExportButtonProps {
  data: AnalysisResult;
  assetValue: string;
}

const ExportButton = ({ data, assetValue }: ExportButtonProps) => {

  const handlePDFExport = () => {
    const doc = new jsPDF();
    const margin = 20;
    const contentWidth = 170;
    let y = margin;
    let pageNum = 1;

    // Helper: Add Footer
    const addFooter = () => {
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`TerraQuant Confidential ESG Intelligence | Page ${pageNum}`, margin, 285);
    };

    // Helper: Prevent Overlapping Text
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > 270) {
        addFooter();
        doc.addPage();
        pageNum++;
        y = margin;
      }
    };

    // ==========================================
    // PAGE 1: DARK MODE COVER PAGE
    // ==========================================
    doc.setFillColor(10, 15, 30); // Dark Navy
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(0, 212, 255); // Cyan
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("TERRAQUANT", margin, 80);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Institutional ESG & Climate Risk Report", margin, 95);
    doc.text("TCFD & CSRD Aligned Disclosure", margin, 105);

    doc.setDrawColor(0, 212, 255);
    doc.setLineWidth(1);
    doc.line(margin, 115, 210 - margin, 115);

    doc.setFontSize(12);
    const splitTitle = doc.splitTextToSize(`Asset: ${data.location.displayName}`, contentWidth);
    doc.text(splitTitle, margin, 130);
    doc.text(`Declared Value: $${Number(assetValue).toLocaleString()}`, margin, 130 + (splitTitle.length * 6) + 5);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, margin, 130 + (splitTitle.length * 6) + 15);

    // ==========================================
    // PAGE 2+: REPORT CONTENT
    // ==========================================
    doc.addPage();
    pageNum++;
    y = margin;
    doc.setTextColor(10, 15, 30);

    const addSectionHeader = (title: string) => {
      checkPageBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 150, 200);
      doc.text(title, margin, y);
      y += 4;
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.line(margin, y, 210 - margin, y);
      y += 8;
      doc.setTextColor(30, 30, 30);
    };

    const addText = (text: string, isBold = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, contentWidth);
      checkPageBreak(lines.length * 6 + 5);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 4;
    };

    const addMetricRow = (label: string, value: string, severity: string) => {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(label, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, margin + 40, y, { maxWidth: 90 });
      doc.setFont("helvetica", "bold");
      
      // Color code the severity
      if (severity === 'EXTREME' || severity === 'HIGH') doc.setTextColor(220, 50, 50);
      else if (severity === 'MEDIUM') doc.setTextColor(220, 150, 0);
      else doc.setTextColor(0, 150, 50);
      
      doc.text(severity, 210 - margin - 25, y);
      doc.setTextColor(30, 30, 30);
      y += 8;
    };

    // --- 1. EXECUTIVE SUMMARY ---
    addSectionHeader("1. Executive Summary & Financial Horizon");
    addText(`This report outlines the localized environmental and transitional risks for the specified asset, strictly aligned with the Task Force on Climate-related Financial Disclosures (TCFD) and the European Sustainability Reporting Standards (ESRS).`);
    y += 5;
    addText(`OVERALL RISK SCORE: ${data.overallScore}/100 (${data.riskLevel})`, true);
    addText(`STRANDED ASSET YEAR: ${data.strandedYear}`, true);
    addText(`Based on current compounding physical risks and regulatory transition penalties (CRREM pathways), this asset is projected to become uninsurable, unsellable, or commercially obsolete by the year ${data.strandedYear} without immediate deep retrofitting.`);
    y += 10;

    // --- 2. DOUBLE MATERIALITY ---
    addSectionHeader("2. Double Materiality Assessment");
    addText(`In accordance with CSRD, undertakings must disclose both financial materiality (risk to the enterprise) and impact materiality (impact on the environment).`);
    addText(`Financial Materiality (Physical Risk): ${data.overallScore}/100`);
    addText(`Impact Materiality (Carbon Proxy): ${data.carbonFine > 0 ? "HIGH IMPACT (Regulatory Penalties Projected)" : "LOW IMPACT (Provisionally Compliant)"}`);
    y += 10;

    // --- 3. PHYSICAL RISK PROFILE ---
    addSectionHeader("3. Physical Risk Profile (Geospatial Analysis)");
    addMetricRow("Elevation", `${data.elevation.elevation}m above sea level`, data.elevation.severity);
    addMetricRow("Coastal", `${data.coastal.distanceKm}km to coastline`, data.coastal.severity);
    addMetricRow("River/Flood", `${data.river.distanceKm}km to major river`, data.river.severity);
    addMetricRow("Seismic", `${data.earthquake.count} events (M4.0+) in 25yrs`, data.earthquake.severity);
    addMetricRow("Wind/Storm", `${data.climate.maxWindSpeed} km/h peak winds`, data.climate.windSeverity);
    addMetricRow("Heat Stress", `${data.climate.heatStressDays} days >35C (last 90d)`, data.climate.severity);
    y += 5;
    addText("These indicators form the scientific basis of the hazard-adjusted risk score, quantifying exposure to chronic stressors and acute catastrophes.");
    y += 10;

    // --- 4. TRANSITION & SOCIAL RISK ---
    addSectionHeader("4. Transition & Infrastructure Risk");
    addText(`Infrastructure Severance ("Island Effect"):`, true);
    addText(`Probability: ${data.infrastructure.probability}%. There is a risk that while the asset remains intact, surrounding critical infrastructure (power grids, roads, hospitals) fails, rendering the asset isolated during extreme events.`);
    y += 5;
    addText(`Regulatory Carbon Fines (e.g., Local Law 97):`, true);
    addText(data.carbonFine > 0 ? `Projected $${data.carbonFine.toLocaleString()} in annual carbon tax penalties due to age and low energy efficiency.` : `Asset is currently compliant with near-term decarbonization mandates.`);
    y += 10;

    // --- 5. ADAPTATION & ROI ---
    addSectionHeader("5. Strategic Adaptation & Opportunity");
    addText(`Adaptation Return on Investment (ROI): +${data.adaptationROI}%`, true);
    addText(`Investing ${Math.round(data.adaptationCostPercent * 100)}% of the asset value into resilience measures (flood defenses, HVAC modernization) is projected to yield the above ROI by avoiding catastrophic damage.`);
    y += 5;
    addText(`Green Premium (Market Uplift): +${data.greenPremiumPercent}%`, true);
    addText(`Executing a credible decarbonization roadmap positions the asset for a market value uplift compared to local brown peers, attracting ESG-screened capital.`);

    addFooter(); // Add footer to the last page
    doc.save(`TerraQuant_ESG_Report_${data.location.lat}.pdf`);
  };

  const handleCSVExport = () => {
    const valueNum = Number(assetValue) || 10000000;
    const headers =["Property,Latitude,Longitude,Asset_Value_USD,Overall_Risk_Score,Risk_Level,Wind_Speed_kmh,Heat_Stress_Days,Earthquakes_25yrs,Elevation_m,Distance_to_Coast_km,Adaptation_ROI_%,Green_Premium_%\n"];
    const row =[`"${data.location.displayName}"`, data.location.lat, data.location.lng, valueNum, data.overallScore, data.riskLevel, data.climate.maxWindSpeed, data.climate.heatStressDays, data.earthquake.count, data.elevation.elevation, data.coastal.distanceKm, data.adaptationROI, data.greenPremiumPercent].join(",");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + headers + row));
    link.setAttribute("download", `TerraQuant_Data_${data.location.lat}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl mx-auto">
      <Button onClick={handlePDFExport} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-6 rounded-xl shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all">
        <Download className="w-5 h-5 mr-2" /> Download AI Risk Report (PDF)
      </Button>
      <Button onClick={handleCSVExport} variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/20 py-6 rounded-xl transition-all">
        <FileSpreadsheet className="w-5 h-5 mr-2" /> Export Raw Data (CSV)
      </Button>
    </div>
  );
};

export default ExportButton;