import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import KpiSummary from "@/components/KpiSummary";
import AssetDetailsPanel from "@/components/AssetDetailsPanel";
import RiskMap from "@/components/RiskMap";
import FinancialRiskSection from "@/components/FinancialRiskSection";
import DisasterScenarios from "@/components/DisasterScenarios";
import ExportButton from "@/components/ExportButton";

const Index = () => {
  const [analysisLocation, setAnalysisLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [assetValue, setAssetValue] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <main className="container pb-12">
        <KpiSummary assetValue={assetValue} />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <AssetDetailsPanel
              onAnalyze={setAnalysisLocation}
              assetValue={assetValue}
              onAssetValueChange={setAssetValue}
            />
          </div>
          <div className="lg:col-span-3">
            <RiskMap analysisLocation={analysisLocation} />
          </div>
        </div>
        <FinancialRiskSection assetValue={assetValue} />
        <DisasterScenarios assetValue={assetValue} />
        <ExportButton />
      </main>
    </div>
  );
};

export default Index;
