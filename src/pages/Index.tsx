import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import KpiSummary from "@/components/KpiSummary";
import AssetDetailsPanel, { type AssetFormState, type ResilienceChecks } from "@/components/AssetDetailsPanel";
import RiskMap from "@/components/RiskMap";
import FinancialRiskSection from "@/components/FinancialRiskSection";
import RiskFactors from "@/components/RiskFactors";
import DataSourcesPanel from "@/components/DataSourcesPanel";
import ExportButton from "@/components/ExportButton";
import AnalysisLoadingModal from "@/components/AnalysisLoadingModal";
import EstimatedWarningCard from "@/components/EstimatedWarningCard";
import MobileStickyBar from "@/components/MobileStickyBar";
import Footer from "@/components/Footer";
import DisasterScenarios from "@/components/DisasterScenarios";
import PrintableReport from "@/components/PrintableReport";
import { runFullAnalysis, type AnalysisResult } from "@/services/apiService";
import { saveAnalysisToHistory, type HistoryEntry } from "@/services/historyService";

const INITIAL_FORM: AssetFormState = {
  propertyName: "",
  propertyType: "",
  constructionYear: "",
  country: "",
  resilience: { floodBarriers: false, seismicRetrofit: false, heatReflective: false },
};

function getResilienceReduction(r: ResilienceChecks): number {
  let reduction = 0;
  if (r.floodBarriers) reduction += 5;
  if (r.seismicRetrofit) reduction += 5;
  if (r.heatReflective) reduction += 5;
  return reduction;
}

const Index = () => {
  const [analysisLocation, setAnalysisLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [assetValue, setAssetValue] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(-1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formState, setFormState] = useState<AssetFormState>(INITIAL_FORM);
  const lastAddress = useRef("");

  const handleAnalyze = useCallback(async (address: string) => {
    lastAddress.current = address;
    setIsAnalyzing(true);
    setLoadingStep(-1);

    const result = await runFullAnalysis(address, (step) => {
      setLoadingStep(step);
    });

    // Apply resilience reduction
    const reduction = getResilienceReduction(formState.resilience);
    if (reduction > 0) {
      result.overallScore = Math.max(0, result.overallScore - reduction);
      // Recompute risk level based on adjusted score
      if (result.overallScore <= 30) { result.riskLevel = "LOW"; result.lossPerDecade = 0.03; }
      else if (result.overallScore <= 60) { result.riskLevel = "MEDIUM"; result.lossPerDecade = 0.08; }
      else if (result.overallScore <= 80) { result.riskLevel = "HIGH"; result.lossPerDecade = 0.16; }
      else { result.riskLevel = "EXTREME"; result.lossPerDecade = 0.28; }
    }

    setAnalysisLocation({ lat: result.location.lat, lng: result.location.lng });
    setAnalysisData(result);
    setIsAnalyzing(false);

    // Save to history
    saveAnalysisToHistory({
      propertyName: address,
      assetValue: assetValue,
      riskScore: result.overallScore,
      riskLevel: result.riskLevel,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      document.getElementById("kpi-summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, [formState.resilience, assetValue]);

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
      resilience: { floodBarriers: false, seismicRetrofit: false, heatReflective: false },
    });
    setAssetValue("5000000");
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setFormState((prev) => ({ ...prev, propertyName: entry.propertyName }));
    setAssetValue(entry.assetValue);
    handleAnalyze(entry.propertyName);
  };

  return (
    <div className="min-h-screen bg-transparent pb-16 md:pb-0">
      <Navbar onDemo={handleDemo} onHistorySelect={handleHistorySelect} />
      <HeroSection />
      <main className="container pb-12 px-4 md:px-6">
        <div id="report-capture-area">
          <KpiSummary assetValue={assetValue} analysisData={analysisData} resilience={formState.resilience} />
          {analysisData && (
            <EstimatedWarningCard data={analysisData} onRetry={handleRetry} />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <AssetDetailsPanel
                onAnalyze={handleAnalyze}
                assetValue={assetValue}
                onAssetValueChange={setAssetValue}
                isAnalyzing={isAnalyzing}
                formState={formState}
                onFormStateChange={setFormState}
              />
            </div>
            <div className="lg:col-span-3">
              <RiskMap analysisLocation={analysisLocation} />
            </div>
          </div>
          <FinancialRiskSection assetValue={assetValue} lossPerDecade={analysisData?.lossPerDecade} />
          {analysisData ? (
            <RiskFactors data={analysisData} />
          ) : (
            <DisasterScenarios assetValue={assetValue} />
          )}
          {analysisData && <DataSourcesPanel data={analysisData} />}
        </div>
        <PrintableReport data={analysisData} propertyName={formState.propertyName || "Unknown Property"} assetValue={assetValue} />
        <ExportButton />
      </main>
      <Footer />
      <MobileStickyBar onAnalyze={handleMobileAnalyze} isAnalyzing={isAnalyzing} />
      <AnalysisLoadingModal open={isAnalyzing} currentStep={loadingStep} />
    </div>
  );
};

export default Index;
