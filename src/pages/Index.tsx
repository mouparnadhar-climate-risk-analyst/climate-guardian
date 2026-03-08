import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import KpiSummary from "@/components/KpiSummary";
import AssetDetailsPanel from "@/components/AssetDetailsPanel";
import RiskMap from "@/components/RiskMap";
import FinancialRiskSection from "@/components/FinancialRiskSection";
import RiskFactors from "@/components/RiskFactors";
import DataSourcesPanel from "@/components/DataSourcesPanel";
import ExportButton from "@/components/ExportButton";
import AnalysisLoadingModal from "@/components/AnalysisLoadingModal";
import { runFullAnalysis, type AnalysisResult } from "@/services/apiService";

const Index = () => {
  const [analysisLocation, setAnalysisLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [assetValue, setAssetValue] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(-1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (address: string) => {
    setIsAnalyzing(true);
    setLoadingStep(-1);

    const result = await runFullAnalysis(address, (step) => {
      setLoadingStep(step);
    });

    setAnalysisLocation({ lat: result.location.lat, lng: result.location.lng });
    setAnalysisData(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <main className="container pb-12">
        <KpiSummary assetValue={assetValue} analysisData={analysisData} />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <AssetDetailsPanel
              onAnalyze={handleAnalyze}
              assetValue={assetValue}
              onAssetValueChange={setAssetValue}
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
          <DisasterScenariosLegacy assetValue={assetValue} />
        )}
        {analysisData && <DataSourcesPanel data={analysisData} />}
        <ExportButton />
      </main>
      <AnalysisLoadingModal open={isAnalyzing} currentStep={loadingStep} />
    </div>
  );
};

// Keep legacy disaster scenarios as fallback before analysis is run
import DisasterScenarios from "@/components/DisasterScenarios";
const DisasterScenariosLegacy = DisasterScenarios;

export default Index;
