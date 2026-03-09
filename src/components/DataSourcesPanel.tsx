import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Database } from "lucide-react";
import type { AnalysisResult } from "@/services/apiService";

interface DataSourcesPanelProps {
  data: AnalysisResult;
}

const DataSourcesPanel = ({ data }: DataSourcesPanelProps) => {
  const sources = [
    {
      name: "Geocoding — Nominatim (OpenStreetMap)",
      url: "https://nominatim.openstreetmap.org",
      raw: `lat: ${data.location.lat}, lng: ${data.location.lng}, display: "${data.location.displayName}"`,
    },
    {
      name: `Elevation — ${data.elevation.source}`,
      url: "https://open-meteo.com",
      raw: `elevation: ${data.elevation.elevation}m → severity: ${data.elevation.severity} (score: ${data.elevation.score})`,
    },
    {
      name: `Seismic — ${data.earthquake.source}`,
      url: "https://earthquake.usgs.gov",
      raw: `earthquakes (M4.0+, 2000-2024): ${data.earthquake.count} → severity: ${data.earthquake.severity} (score: ${data.earthquake.score})`,
    },
    {
      name: `Climate — ${data.climate.source}`,
      url: "https://open-meteo.com",
      raw: `avgMaxTemp: ${data.climate.avgMaxTemp}°C, totalPrecip: ${data.climate.totalPrecipitation}mm, heatDays>35°C: ${data.climate.heatStressDays}, extremeRain>50mm: ${data.climate.extremeRainfallDays} → score: ${data.climate.score}`,
    },
    {
      name: `Coastal Proximity — ${data.coastal.source}`,
      url: "https://overpass-api.de",
      raw: `distance: ${data.coastal.distanceKm}km → severity: ${data.coastal.severity} (score: ${data.coastal.score})`,
    },
    {
      name: `River Proximity — ${data.river.source}`,
      url: "https://overpass-api.de",
      raw: `distance: ${data.river.distanceKm}km → severity: ${data.river.severity} (score: ${data.river.score})`,
    },
  ];

  return (
    <div className="mt-10">
      <Accordion type="single" collapsible>
        <AccordionItem value="sources" className="border-border">
          <AccordionTrigger className="text-foreground hover:no-underline">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Data Sources & Raw Values</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {sources.map((s) => (
                <div key={s.name} className="rounded-lg bg-secondary/30 p-3">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Endpoint: <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{s.url}</a>
                  </p>
                  <code className="block mt-1 text-xs text-muted-foreground bg-secondary/50 p-2 rounded font-mono break-all">
                    {s.raw}
                  </code>
                </div>
              ))}
              <p className="text-xs text-muted-foreground/60 mt-2">
                Overall weighted score: {data.overallScore}/100 — Risk level: {data.riskLevel} — Loss/decade: {(data.lossPerDecade * 100).toFixed(0)}%
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DataSourcesPanel;
