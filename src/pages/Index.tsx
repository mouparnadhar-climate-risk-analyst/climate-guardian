import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import KpiSummary from "@/components/KpiSummary";
import AssetDetailsPanel, { type AssetFormState } from "@/components/AssetDetailsPanel";
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
import { runFullAnalysis, type AnalysisResult } from "@/services/apiService";

const INITIAL_FORM: AssetFormState = {
  propertyName: "",
  propertyType: "",
  constructionYear: "",
  country: "",
};

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

    setAnalysisLocation({ lat: result.location.lat, lng: result.location.lng });
    setAnalysisData(result);
    setIsAnalyzing(false);

    // Scroll to KPI section after analysis
    setTimeout(() => {
      document.getElementById("kpi-summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, []);

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
      country: "UAE/Dubai",
    });
    setAssetValue("5000000");
  };

  return (
    <div className="min-h-screen bg-transparent pb-16 md:pb-0">
      <Navbar onDemo={handleDemo} />
      <HeroSection />
      <main className="container pb-12 px-4 md:px-6">
        <div id="report-capture-area">
          <KpiSummary assetValue={assetValue} analysisData={analysisData} />
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
        <ExportButton />
      </main>
      <Footer />
      <MobileStickyBar onAnalyze={handleMobileAnalyze} isAnalyzing={isAnalyzing} />
      <AnalysisLoadingModal open={isAnalyzing} currentStep={loadingStep} />
    </div>
  );
};

export default Index;
