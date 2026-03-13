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
  const[assetValue, setAssetValue] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(-1);
  const[isAnalyzing, setIsAnalyzing] = useState(false);
  const [formState, setFormState] = useState<AssetFormState>(INITIAL_FORM);
  const lastAddress = useRef("");

  const handleAnalyze = useCallback(async (address: string) => {
    lastAddress.current = address;
    setIsAnalyzing(true);
    setLoadingStep(-1);

    const result = await runFullAnalysis(address, assetValue, formState.propertyType, formState.constructionYear, (step) => {
  setLoadingStep(step);
});

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
  }, [assetValue]);

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
        
        {/* NEW EXPORT BUTTON LOGIC HERE */}
        {analysisData && (
          <div className="mt-8 flex justify-center gap-4">
            <ExportButton data={analysisData} assetValue={assetValue} />
          </div>
        )}
        {/* END NEW EXPORT BUTTON LOGIC */}

      </main>
      <Footer />
      <MobileStickyBar onAnalyze={handleMobileAnalyze} isAnalyzing={isAnalyzing} />
      <AnalysisLoadingModal open={isAnalyzing} currentStep={loadingStep} />
    </div>
  );
};

export default Index;