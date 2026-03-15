import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import KpiSummary from "@/components/KpiSummary";
import AssetDetailsPanel, { type AssetFormState } from "@/components/AssetDetailsPanel";
import type { BulkUploadRecord } from "@/components/BulkUploadZone";
import RiskMap from "@/components/RiskMap";
import FinancialRiskSection from "@/components/FinancialRiskSection";
import MaterialityMatrix from "@/components/MaterialityMatrix";
import RiskFactors from "@/components/RiskFactors";
import DataSourcesPanel from "@/components/DataSourcesPanel";
import ExportButton from "@/components/ExportButton";
import AnalysisLoadingModal from "@/components/AnalysisLoadingModal";
import EstimatedWarningCard from "@/components/EstimatedWarningCard";
import MobileStickyBar from "@/components/MobileStickyBar";
import Footer from "@/components/Footer";
import DisasterScenarios from "@/components/DisasterScenarios";
import { runFullAnalysis, type AnalysisResult } from "@/services/apiService";

const INITIAL_FORM: AssetFormState = {
  propertyName: "",
  propertyType: "",
  constructionYear: "",
  country: "",
};

const Index = () => {
  const [analysisLocation, setAnalysisLocation] = useState<{ lat: number; lng: number } | null>(null);
  const[assetValue, setAssetValue] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(-1);
  const[isAnalyzing, setIsAnalyzing] = useState(false);
  const [formState, setFormState] = useState<AssetFormState>(INITIAL_FORM);
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [bulkRecords, setBulkRecords] = useState<BulkUploadRecord[]>([]);
  const [bulkProgress, setBulkProgress] = useState<string | null>(null);
  const [bulkProgressPercent, setBulkProgressPercent] = useState<number>(0);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkResults, setBulkResults] = useState<
    { input: BulkUploadRecord; result: AnalysisResult }[]
  >([]);
  const lastAddress = useRef("");

  const handleAnalyze = useCallback(async (address: string) => {
    lastAddress.current = address;
    setIsAnalyzing(true);
    setLoadingStep(-1);

    const result = await runFullAnalysis(
      address,
      assetValue,
      formState.propertyType,
      formState.constructionYear,
      formState.energyUsage,
      formState.fuelSource,
      (step) => {
        setLoadingStep(step);
      }
    );

    setAnalysisLocation({ lat: result.location.lat, lng: result.location.lng });
    setAnalysisData(result);
    setIsAnalyzing(false);

    // Save to LocalStorage so the History Button works
    try {
      const historyStr = localStorage.getItem("climateVaultHistory");
      let historyArr = historyStr ? JSON.parse(historyStr) :[];
      const newEntry = {
        propertyName: address,
        assetValue: assetValue,
        riskScore: result.overallScore,
        riskLevel: result.riskLevel,
        timestamp: Date.now(),
      };
      // Keep the last 10 searches, remove duplicates
      historyArr =[newEntry, ...historyArr.filter((h: any) => h.propertyName !== address)].slice(0, 10);
      localStorage.setItem("climateVaultHistory", JSON.stringify(historyArr));
    } catch (e) {
      console.error("History save failed", e);
    }

    // Scroll to KPI section after analysis
    setTimeout(() => {
      document.getElementById("kpi-summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, [assetValue, formState.propertyType, formState.constructionYear, formState.energyUsage, formState.fuelSource]);

  const handleBulkRecordsParsed = (records: BulkUploadRecord[]) => {
    setBulkRecords(records);
    setBulkResults([]);
    if (records.length === 0) {
      setBulkProgress("No valid rows detected in CSV.");
      setBulkProgressPercent(0);
    } else {
      setBulkProgress(`Loaded ${records.length} properties. Click 'Run Bulk Analysis' to begin.`);
      setBulkProgressPercent(0);
    }
  };

  const handleBulkAnalysis = useCallback(async () => {
    if (!bulkRecords.length) {
      setBulkProgress("Please upload a CSV before running bulk analysis.");
      return;
    }
    setBulkRunning(true);
    setBulkResults([]);
    const results: { input: BulkUploadRecord; result: AnalysisResult }[] = [];

    for (let i = 0; i < bulkRecords.length; i += 1) {
      const record = bulkRecords[i];
      const indexLabel = i + 1;
      setBulkProgress(`Processing ${indexLabel} of ${bulkRecords.length}...`);
      setBulkProgressPercent((indexLabel / bulkRecords.length) * 100);

      try {
        const result = await runFullAnalysis(
          record.propertyName,
          record.assetValue,
          record.propertyType,
          record.constructionYear,
          record.energyUsage,
          record.fuelSource,
          () => {}
        );
        results.push({ input: record, result });
      } catch (e) {
        console.error("Bulk analysis failed for record", record, e);
      }

      if (i < bulkRecords.length - 1) {
        // Geocoding (Nominatim) rate limit: 2.5s between requests to avoid fallback to Dubai
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 2500));
      }
    }

    setBulkResults(results);
    setBulkRunning(false);
    setBulkProgress(`Completed bulk analysis for ${results.length} properties.`);
    setBulkProgressPercent(100);
  }, [bulkRecords]);

  const handleDownloadMasterCsv = () => {
    if (!bulkResults.length) return;
    const headers = [
      "PropertyName",
      "AssetValue",
      "PropertyType",
      "ConstructionYear",
      "Latitude",
      "Longitude",
      "OverallRiskScore",
      "RiskLevel",
      "Elevation_m",
      "DistanceToCoast_km",
      "DistanceToRiver_km",
      "Earthquakes_25yrs",
      "HeatStressDays",
      "MaxWindSpeed",
      "InfrastructureSeverance_%",
      "CarbonFine_USD",
      "StrandedYear",
      "AdaptationROI_%",
      "GreenPremium_%",
    ];
    const escape = (v: string) => (v.includes(",") || v.includes('"') ? `"${String(v).replace(/"/g, '""')}"` : v);
    const rows = bulkResults.map(({ input, result }) => [
      escape(input.propertyName),
      input.assetValue,
      escape(input.propertyType),
      input.constructionYear,
      result.location.lat,
      result.location.lng,
      result.overallScore,
      result.riskLevel,
      result.elevation.elevation,
      result.coastal.distanceKm,
      result.river.distanceKm,
      result.earthquake.count,
      result.climate.heatStressDays,
      result.climate.maxWindSpeed,
      result.infrastructure.probability,
      result.carbonFine,
      result.strandedYear,
      result.adaptationROI,
      result.greenPremiumPercent,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => (typeof c === "string" ? c : String(c))).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ClimateVault_BulkResults_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRetry = () => {
    if (lastAddress.current) {
      handleAnalyze(lastAddress.current);
    }
  };

  const handleMobileAnalyze = () => {
    if (formState.propertyName.trim()) {
      handleAnalyze(formState.propertyName);
    }
  };

  const handleDemo = () => {
    setFormState({
      propertyName: "Palm Jumeirah Villa, Dubai",
      propertyType: "Residential Villa",
      constructionYear: "2005",
      country: "UAE",
    });
    setAssetValue("5000000");
  };

  // Handle clicking a history item
  const handleHistorySelect = (entry: any) => {
    setFormState({
      propertyName: entry.propertyName,
      propertyType: "Commercial Office",
      constructionYear: "2015",
      country: "",
    });
    setAssetValue(entry.assetValue || "10000000");
    handleAnalyze(entry.propertyName);
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar onDemo={handleDemo} onHistorySelect={handleHistorySelect} />
      <HeroSection />
      <main className="container pb-12 px-4 md:px-6">
        <div id="kpi-summary">
          <KpiSummary assetValue={assetValue} analysisData={analysisData} />
        </div>
        
        {analysisData && (
          <EstimatedWarningCard data={analysisData} onRetry={handleRetry} />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 mt-6">
          <div className="lg:col-span-2">
            <AssetDetailsPanel
              onAnalyze={handleAnalyze}
              assetValue={assetValue}
              onAssetValueChange={setAssetValue}
              isAnalyzing={isAnalyzing}
              formState={formState}
              onFormStateChange={setFormState}
              mode={mode}
              onModeChange={setMode}
              onBulkRecordsParsed={handleBulkRecordsParsed}
              bulkProgress={bulkProgress}
              bulkProgressPercent={bulkProgressPercent}
              bulkRunning={bulkRunning}
              onStartBulkAnalysis={handleBulkAnalysis}
            />
          </div>
          <div className="lg:col-span-3">
            <RiskMap analysisLocation={analysisLocation} />
          </div>
        </div>
        
        <FinancialRiskSection assetValue={assetValue} lossPerDecade={analysisData?.lossPerDecade} />

        {analysisData && (
          <MaterialityMatrix
            impactScore={analysisData.impactScore}
            riskScore={analysisData.overallScore}
          />
        )}
        
        {analysisData ? (
          <RiskFactors data={analysisData} />
        ) : (
          <DisasterScenarios assetValue={assetValue} />
        )}
        
        {analysisData && <DataSourcesPanel data={analysisData} />}
        
        {/* EXPORT BUTTONS */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {analysisData && (
            <div className="flex justify-center gap-4 w-full">
              <ExportButton data={analysisData} assetValue={assetValue} />
            </div>
          )}
          {bulkResults.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadMasterCsv}
              className="text-xs md:text-sm text-primary underline underline-offset-4"
            >
              Download Master CSV for Bulk Analysis ({bulkResults.length} properties)
            </button>
          )}
        </div>

      </main>
      <Footer />
      <MobileStickyBar onAnalyze={handleMobileAnalyze} isAnalyzing={isAnalyzing} />
      <AnalysisLoadingModal open={isAnalyzing} currentStep={loadingStep} />
    </div>
  );
};

export default Index;