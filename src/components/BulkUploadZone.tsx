import { Upload } from "lucide-react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";

export interface BulkUploadRecord {
  propertyName: string;
  assetValue: string;
  propertyType: string;
  constructionYear: string;
  energyUsage?: string;
  fuelSource?: string;
}

interface BulkUploadZoneProps {
  disabled?: boolean;
  onRecordsParsed: (records: BulkUploadRecord[]) => void;
}

// Case-insensitive and variant-aware column lookup (handles "AssetValue", "Asset Value", "assetvalue", etc.)
function getCell(raw: Record<string, unknown>, ...candidates: string[]): string {
  if (!raw || typeof raw !== "object") return "";
  const keys = Object.keys(raw);
  for (const candidate of candidates) {
    const exact = raw[candidate];
    if (exact !== undefined && exact !== null && String(exact).trim() !== "") return String(exact).trim();
    const lower = candidate.toLowerCase().replace(/\s/g, "");
    for (const k of keys) {
      if (k.toLowerCase().replace(/\s/g, "") === lower) {
        const v = raw[k];
        if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
      }
    }
  }
  return "";
}

const BulkUploadZone = ({ disabled, onRecordsParsed }: BulkUploadZoneProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      complete: (results) => {
        const rows: BulkUploadRecord[] = [];
        const data = (results.data || []) as Record<string, unknown>[];
        for (const raw of data) {
          if (!raw) continue;
          const propertyName = getCell(raw, "PropertyName", "Property Name");
          const assetValue = getCell(raw, "AssetValue", "Asset Value");
          const propertyType = getCell(raw, "PropertyType", "Property Type");
          const constructionYear = getCell(raw, "ConstructionYear", "Construction Year");
          const energyUsage = getCell(raw, "EnergyUsage", "Energy Usage");
          const fuelSource = getCell(raw, "FuelSource", "Fuel Source");
          const record: BulkUploadRecord = {
            propertyName,
            assetValue,
            propertyType,
            constructionYear,
            energyUsage: energyUsage || undefined,
            fuelSource: fuelSource || undefined,
          };
          if (record.propertyName) {
            rows.push(record);
          }
        }
        onRecordsParsed(rows);
      },
    });
  };

  return (
    <div className="border border-dashed border-border rounded-xl p-4 md:p-5 bg-secondary/40">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Bulk Upload (Enterprise CSV)</p>
          <p className="text-xs text-muted-foreground">
            Upload a CSV with columns: PropertyName, AssetValue, PropertyType, ConstructionYear, EnergyUsage, FuelSource.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={disabled}
          className="text-xs text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-accent"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          className="text-[11px] h-7 px-2 border-dashed border-border text-muted-foreground"
        >
          Sample template available soon
        </Button>
      </div>
    </div>
  );
};

export default BulkUploadZone;

