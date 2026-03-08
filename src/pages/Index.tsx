import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AssetDetailsPanel from "@/components/AssetDetailsPanel";
import RiskMap from "@/components/RiskMap";
import FinancialRiskSection from "@/components/FinancialRiskSection";
import DisasterScenarios from "@/components/DisasterScenarios";

const Index = () => {
  const [analysisLocation, setAnalysisLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [assetValue, setAssetValue] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <main className="container pb-12">
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
      </main>
    </div>
  );
};

export default Index;
