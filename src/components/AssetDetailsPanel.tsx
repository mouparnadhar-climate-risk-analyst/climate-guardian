import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

const propertyTypes = ["Commercial Office", "Residential", "Residential Villa", "Industrial", "Retail", "Mixed Use", "Data Center", "Warehouse"];

const countries = [
  "Albania", "Argentina", "Australia", "Austria",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belgium", "Brazil", "Bulgaria",
  "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Dominican Republic",
  "Egypt", "Estonia",
  "Fiji", "Finland", "France",
  "Germany", "Greece",
  "Hong Kong", "Hungary",
  "Iceland", "India", "Indonesia", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kenya", "Kuwait",
  "Latvia", "Lebanon", "Lithuania", "Luxembourg",
  "Malaysia", "Maldives", "Malta", "Mauritius", "Mexico", "Monaco", "Morocco",
  "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway",
  "Oman",
  "Pakistan", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia",
  "Saudi Arabia", "Seychelles", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
  "Taiwan", "Thailand", "Turkey",
  "UAE", "UK", "Ukraine", "USA",
  "Vanuatu", "Vietnam",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 125 }, (_, i) => String(currentYear - i));

export interface ResilienceChecks {
  floodBarriers: boolean;
  seismicRetrofit: boolean;
  heatReflective: boolean;
}

export interface AssetFormState {
  propertyName: string;
  propertyType: string;
  constructionYear: string;
  country: string;
  resilience: ResilienceChecks;
}

interface AssetDetailsPanelProps {
  onAnalyze?: (address: string) => void;
  assetValue: string;
  onAssetValueChange: (value: string) => void;
  isAnalyzing?: boolean;
  formState: AssetFormState;
  onFormStateChange: (state: AssetFormState) => void;
}

const DEFAULT_FORM: AssetFormState = { propertyName: "", propertyType: "", constructionYear: "", country: "", resilience: { floodBarriers: false, seismicRetrofit: false, heatReflective: false } };

const AssetDetailsPanel = ({ onAnalyze, assetValue, onAssetValueChange, isAnalyzing, formState = DEFAULT_FORM, onFormStateChange }: AssetDetailsPanelProps) => {
  const update = (patch: Partial<AssetFormState>) => onFormStateChange?.({ ...formState, ...patch });

  const handleAnalyze = () => {
    if (!formState.propertyName.trim()) {
      toast.error("Please enter a property name or address.");
      return;
    }
    onAnalyze?.(formState.propertyName);
  };

  return (
    <motion.div id="asset-details-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-lg border border-border bg-card p-4 md:p-6 space-y-4 md:space-y-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-base md:text-lg font-semibold text-foreground">Asset Details</h2>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs md:text-sm">Property Name / Address</Label>
          <Input
            placeholder="e.g. Manhattan Tower A or 123 Main St, NYC"
            value={formState.propertyName}
            onChange={(e) => update({ propertyName: e.target.value })}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-11 md:h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs md:text-sm">Asset Value ($)</Label>
          <Input
            placeholder="e.g. 25,000,000"
            value={assetValue}
            onChange={(e) => onAssetValueChange(e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-11 md:h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs md:text-sm">Property Type</Label>
          <Select value={formState.propertyType} onValueChange={(v) => update({ propertyType: v })}>
            <SelectTrigger className="bg-secondary border-border text-foreground h-11 md:h-10">
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
          <Label className="text-muted-foreground text-xs md:text-sm">Construction Year</Label>
          <Select value={formState.constructionYear} onValueChange={(v) => update({ constructionYear: v })}>
            <SelectTrigger className="bg-secondary border-border text-foreground h-11 md:h-10">
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
          <Label className="text-muted-foreground text-xs md:text-sm">Country</Label>
          <Select value={formState.country} onValueChange={(v) => update({ country: v })}>
            <SelectTrigger className="bg-secondary border-border text-foreground h-11 md:h-10">
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
          disabled={isAnalyzing}
          className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold text-sm md:text-base h-12 transition-all hover:glow-primary-intense"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Run Climate Risk Analysis"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default AssetDetailsPanel;
