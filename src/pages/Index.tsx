import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AssetDetailsPanel from "@/components/AssetDetailsPanel";
import RiskMapPlaceholder from "@/components/RiskMapPlaceholder";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <main className="container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <AssetDetailsPanel />
          </div>
          <div className="lg:col-span-3">
            <RiskMapPlaceholder />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
