import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/services/apiService";
import { jsPDF } from "jspdf";

interface ExportButtonProps {
  data: AnalysisResult;
  assetValue: string;
}

const ExportButton = ({ data, assetValue }: ExportButtonProps) => {

  // THE NEW REAL PDF GENERATOR
  const handlePDFExport = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // 1. Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(10, 15, 30);
    doc.text("ClimateVault Risk Intelligence Report", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, y);
    y += 15;

    // 2. Asset Overview
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(10, 15, 30);
    doc.text("1. Asset Overview", margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const splitTitle = doc.splitTextToSize(`Property: ${data.location.displayName}`, 170);
    doc.text(splitTitle, margin, y);
    y += (splitTitle.length * 6);
    doc.text(`Estimated Value: $${Number(assetValue).toLocaleString()}`, margin, y);
    y += 15;

    // 3. KPIs
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("2. Key Risk Indicators", margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Overall Risk Score: ${data.overallScore}/100 (${data.riskLevel})`, margin, y);
    y += 6;
    doc.text(`Stranded Asset Year: ${data.strandedYear}`, margin, y);
    y += 15;

    // 4. AI Strategic Guidance
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("3. Strategic Guidance & Adaptation Plan", margin, y);
    y += 10;

    const addGuidance = (title: string, text: string) => {
      if (y > 270) { doc.addPage(); y = margin; } // Move to next page if full
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, y);
      y += 6;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, margin, y);
      y += (lines.length * 6) + 6;
    };

    // Dynamically generate guidance based on their actual risk scores!
    if (data.elevation.score > 50 || data.coastal.score > 50) {
      addGuidance("Flood & Coastal Defense:", "High exposure to inundation. Immediate recommendation: Install deployable flood barriers, elevate critical HVAC and electrical infrastructure above the base flood elevation, and secure specialized water-damage insurance.");
    }
    if (data.climate.score > 50) {
      addGuidance("Heat Stress & Meteorological Risk:", `Asset experiences extreme heat (${data.climate.heatStressDays} days > 35C). Recommendation: Upgrade to high-albedo reflective roofing, install smart HVAC systems, and reinforce grid redundancy to prevent power failure during peak cooling demand.`);
    }
    if (data.earthquake.score > 50) {
      addGuidance("Seismic Retrofitting:", `Detected ${data.earthquake.count} earthquakes nearby. Recommendation: Commission a structural seismic audit, install base isolators, and ensure flexible pipe connections for gas and water lines.`);
    }
    if (data.carbonFine > 0) {
      addGuidance("Transition Risk (Regulatory Fines):", `Projected $${data.carbonFine.toLocaleString()} in annual carbon penalties due to low energy efficiency. Recommendation: Execute a deep energy retrofit (LEDs, smart sensors, insulation) to achieve compliance and avoid fines.`);
    }

    addGuidance("Financial Strategy:", `Investing $${Math.round(Number(assetValue) * data.adaptationCostPercent).toLocaleString()} today yields a projected ROI of +${data.adaptationROI}% by mitigating catastrophic damage and capturing a +${data.greenPremiumPercent}% Green Premium in market valuation.`);

    // Save the PDF!
    doc.save(`ClimateVault_Report.pdf`);
  };

  // CSV Export (Remains the same)
  const handleCSVExport = () => {
    const valueNum = Number(assetValue) || 10000000;
    const headers =["Property,Latitude,Longitude,Asset_Value_USD,Overall_Risk_Score,Risk_Level,Wind_Speed_kmh,Heat_Stress_Days,Earthquakes_25yrs,Elevation_m,Distance_to_Coast_km,Adaptation_ROI_%,Green_Premium_%\n"];
    const row =[`"${data.location.displayName}"`, data.location.lat, data.location.lng, valueNum, data.overallScore, data.riskLevel, data.climate.maxWindSpeed, data.climate.heatStressDays, data.earthquake.count, data.elevation.elevation, data.coastal.distanceKm, data.adaptationROI, data.greenPremiumPercent].join(",");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + headers + row));
    link.setAttribute("download", `ClimateVault_Data_${data.location.lat}.csv`);
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