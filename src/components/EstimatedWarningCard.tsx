import { AlertTriangle, RotateCw } from "lucide-react";
import type { AnalysisResult } from "@/services/apiService";

interface EstimatedWarningCardProps {
  data: AnalysisResult;
  onRetry: () => void;
}

const EstimatedWarningCard = ({ data, onRetry }: EstimatedWarningCardProps) => {
  const estimated: string[] = [];
  if (data.location.status === "ESTIMATED") estimated.push("Geocoding");
  if (data.elevation.status === "ESTIMATED") estimated.push("Elevation");
  if (data.earthquake.status === "ESTIMATED") estimated.push("Seismic");
  if (data.climate.status === "ESTIMATED") estimated.push("Climate");
  if (data.coastal.status === "ESTIMATED") estimated.push("Coastal Proximity");
  if (data.river.status === "ESTIMATED") estimated.push("River Proximity");

  if (estimated.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-yellow-700/50 bg-yellow-900/10 p-4 flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-yellow-200">
          Live data temporarily unavailable for some metrics. Using regional climate model estimates for{" "}
          <span className="font-semibold">{estimated.join(", ")}</span>.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="shrink-0 inline-flex items-center gap-1.5 border border-yellow-500 hover:bg-yellow-900/30 text-yellow-400 text-sm px-3 py-1 rounded transition-colors"
      >
        <RotateCw className="h-3.5 w-3.5" />
        Retry Live Data
      </button>
    </div>
  );
};

export default EstimatedWarningCard;
