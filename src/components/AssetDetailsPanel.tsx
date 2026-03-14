import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

const propertyTypes =["Commercial Office", "Residential", "Residential Villa", "Industrial", "Retail", "Mixed Use", "Data Center", "Warehouse"];

// 🌍 ALL COUNTRIES IN THE WORLD
const countries =[
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates (UAE)", "United Kingdom (UK)", "United States of America (USA)", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 125 }, (_, i) => String(currentYear - i));

export interface AssetFormState {
  propertyName: string;
  propertyType: string;
  constructionYear: string;
  country: string;
  energyUsage?: string;
  fuelSource?: string;
}

interface AssetDetailsPanelProps {
  onAnalyze?: (address: string) => void;
  assetValue: string;
  onAssetValueChange: (value: string) => void;
  isAnalyzing?: boolean;
  formState: AssetFormState;
  onFormStateChange: (state: AssetFormState) => void;
}

const DEFAULT_FORM: AssetFormState = { propertyName: "", propertyType: "", constructionYear: "", country: "" };

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
    <motion.div
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
            <SelectContent className="bg-card border-border max-h-60">
              {countries.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ENVIRONMENTAL IMPACT DATA (DOUBLE MATERIALITY) */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
            Environmental Impact Data (Optional)
          </p>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs md:text-sm">Annual Energy Usage (kWh)</Label>
              <Input
                type="number"
                min={0}
                placeholder="e.g. 2,500,000"
                value={formState.energyUsage ?? ""}
                onChange={(e) => update({ energyUsage: e.target.value })}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-11 md:h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs md:text-sm">Primary Fuel Source</Label>
              <Select
                value={formState.fuelSource ?? ""}
                onValueChange={(v) => update({ fuelSource: v })}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground h-11 md:h-10">
                  <SelectValue placeholder="Select fuel source" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Grid Mix">Grid Mix</SelectItem>
                  <SelectItem value="Natural Gas">Natural Gas</SelectItem>
                  <SelectItem value="100% Renewable">100% Renewable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* RE-ADDED: BUILDING STRUCTURAL DETAILS */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs font-semibold text-cyan-400 mb-3 uppercase tracking-wider">Building Structural Details (Optional)</p>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-cyan-500 rounded border-gray-600 bg-[#0A0F1E] focus:ring-cyan-500 focus:ring-offset-gray-900 transition-colors" />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Flood Barriers / Elevated Utilities</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-cyan-500 rounded border-gray-600 bg-[#0A0F1E] focus:ring-cyan-500 focus:ring-offset-gray-900 transition-colors" />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Seismic Retrofitting (Dampers)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-cyan-500 rounded border-gray-600 bg-[#0A0F1E] focus:ring-cyan-500 focus:ring-offset-gray-900 transition-colors" />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Heat-Reflective Glass / Cool Roof</span>
            </label>
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold text-sm md:text-base h-12 transition-all hover:glow-primary-intense"
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