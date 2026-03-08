import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

const propertyTypes = ["Commercial Office", "Residential", "Industrial", "Retail", "Mixed Use", "Data Center", "Warehouse"];

const countries = [
  "United States", "United Kingdom", "Germany", "France", "Japan", "Australia",
  "Canada", "India", "Brazil", "China", "Netherlands", "Singapore", "UAE",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 125 }, (_, i) => String(currentYear - i));

interface AssetDetailsPanelProps {
  onAnalyze?: (location: { lat: number; lng: number }) => void;
  assetValue: string;
  onAssetValueChange: (value: string) => void;
}

const AssetDetailsPanel = ({ onAnalyze, assetValue, onAssetValueChange }: AssetDetailsPanelProps) => {
  const [propertyName, setPropertyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!propertyName.trim()) {
      toast.error("Please enter a property name or address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(propertyName)}&limit=1`
      );
      const data = await res.json();

      if (data.length === 0) {
        toast.error("Location not found. Try a more specific address.");
        return;
      }

      const { lat, lon } = data[0];
      onAnalyze?.({ lat: parseFloat(lat), lng: parseFloat(lon) });
      toast.success(`Analysis running for: ${data[0].display_name.split(",")[0]}`);
    } catch {
      toast.error("Geocoding failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-lg border border-border bg-card p-6 space-y-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Asset Details</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-sm">Property Name / Address</Label>
          <Input
            placeholder="e.g. Manhattan Tower A or 123 Main St, NYC"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-sm">Asset Value ($)</Label>
          <Input
            placeholder="e.g. 25,000,000"
            value={assetValue}
            onChange={(e) => onAssetValueChange(e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-sm">Property Type</Label>
          <Select>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {propertyTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-sm">Construction Year</Label>
          <Select>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border max-h-60">
              {years.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-sm">Country</Label>
          <Select>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {countries.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold text-base h-12 transition-all hover:glow-primary-intense"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
          {loading ? "Analyzing..." : "Run Climate Risk Analysis"}
        </Button>
      </div>
    </motion.div>
  );
};

export default AssetDetailsPanel;
