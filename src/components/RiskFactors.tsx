import { Waves, ThermometerSun, CloudRain, Activity, Wind, Navigation, Unplug, Gavel } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/services/apiService";

interface RiskFactorsProps {
  data: AnalysisResult;
}

const RiskFactors = ({ data }: RiskFactorsProps) => {
  // Helper to determine severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "EXTREME": return "bg-red-500 text-white";
      case "HIGH": return "bg-orange-500 text-white";
      case "MEDIUM": return "bg-yellow-600 text-white";
      default: return "bg-emerald-500 text-white";
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-500" />
          Climate Risk Factors
        </h2>
        <Badge variant="outline" className="bg-white/5 border-white/10 text-white px-3 py-1">
          Score: {data.overallScore}/100 — {data.riskLevel}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Elevation Risk Card */}
        <div className="bg-[#131B2E]/40 border border-white/5 p-5 rounded-2xl group hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Navigation className="w-6 h-6 text-cyan-400 rotate-180" />
            </div>
            <Badge variant="outline" className={`${data.elevation.status === 'LIVE' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-yellow-900/20 text-yellow-400'} border-none text-[10px]`}>
              {data.elevation.status === 'LIVE' ? '🟢 LIVE DATA' : '🟡 ESTIMATED'}
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">ELEVATION RISK — {data.elevation.severity}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Real data: <strong>{data.elevation.elevation}m</strong> above sea level. Low-lying assets face significantly higher flood and storm surge exposure.
          </p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: `${data.elevation.score}%` }}></div>
          </div>
        </div>

        {/* 2. Coastal Proximity Card */}
        <div className="bg-[#131B2E]/40 border border-white/5 p-5 rounded-2xl group hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Waves className="w-6 h-6 text-blue-400" />
            </div>
            <Badge variant="outline" className={`${data.coastal.status === 'LIVE' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-yellow-900/20 text-yellow-400'} border-none text-[10px]`}>
              {data.coastal.status === 'LIVE' ? '🟢 LIVE DATA' : '🟡 ESTIMATED'}
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">COASTAL PROXIMITY — {data.coastal.severity}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Distance to coast: <strong>{data.coastal.distanceKm}km</strong>. Proximity to coastline increases exposure to saltwater intrusion and sea-level rise.
          </p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400" style={{ width: `${data.coastal.score}%` }}></div>
          </div>
        </div>

        {/* 3. Seismic Activity Card */}
        <div className="bg-[#131B2E]/40 border border-white/5 p-5 rounded-2xl group hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <Badge variant="outline" className={`${data.earthquake.status === 'LIVE' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-yellow-900/20 text-yellow-400'} border-none text-[10px]`}>
              {data.earthquake.status === 'LIVE' ? '🟢 LIVE DATA' : '🟡 ESTIMATED'}
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">SEISMIC ACTIVITY — {data.earthquake.severity}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Detected <strong>{data.earthquake.count}</strong> earthquakes (Mag 4.0+) within 200km in the last 25 years.
          </p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400" style={{ width: `${data.earthquake.score}%` }}></div>
          </div>
        </div>

        {/* 4. Heat Stress Card */}
        <div className="bg-[#131B2E]/40 border border-white/5 p-5 rounded-2xl group hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <ThermometerSun className="w-6 h-6 text-orange-400" />
            </div>
            <Badge variant="outline" className={`${data.climate.status === 'LIVE' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-yellow-900/20 text-yellow-400'} border-none text-[10px]`}>
              {data.climate.status === 'LIVE' ? '🟢 LIVE DATA' : '🟡 ESTIMATED'}
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">HEAT STRESS — {data.climate.severity}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Average Max Temp: <strong>{data.climate.avgMaxTemp}°C</strong>. {data.climate.heatStressDays} days above 35°C in the last 90 days.
          </p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400" style={{ width: `${data.climate.score}%` }}></div>
          </div>
        </div>

        {/* 5. River Flood Risk Card */}
        <div className="bg-[#131B2E]/40 border border-white/5 p-5 rounded-2xl group hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <CloudRain className="w-6 h-6 text-indigo-400" />
            </div>
            <Badge variant="outline" className={`${data.river.status === 'LIVE' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-yellow-900/20 text-yellow-400'} border-none text-[10px]`}>
              {data.river.status === 'LIVE' ? '🟢 LIVE DATA' : '🟡 ESTIMATED'}
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">RIVER FLOOD RISK — {data.river.severity}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Nearest major river: <strong>{data.river.distanceKm}km</strong>. Flash flooding risk is elevated for assets within drainage basins.
          </p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400" style={{ width: `${data.river.score}%` }}></div>
          </div>
        </div>

        {/* 6. NEW: Wind & Storm Risk Card */}
        <div className="bg-[#131B2E]/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Wind className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex flex-col items-end">
              <Badge variant="outline" className={`${data.climate.status === 'LIVE' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-yellow-900/20 text-yellow-400'} border-none text-[10px] mb-1`}>
                {data.climate.status === 'LIVE' ? '🟢 LIVE DATA' : '🟡 ESTIMATED'}
              </Badge>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getSeverityColor(data.climate.windSeverity)}`}>
                {data.climate.windSeverity}
              </span>
            </div>
          </div>
          <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">WIND & STORM RISK</h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Peak wind speeds of <strong>{data.climate.maxWindSpeed} km/h</strong> detected. High velocity winds threaten structural integrity and increase debris impact risk.
          </p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400 transition-all duration-1000" 
              style={{ width: `${data.climate.maxWindSpeed > 150 ? 100 : (data.climate.maxWindSpeed / 150) * 100}%` }}
            ></div>
          </div>

          {/* NEW: Infrastructure Island Effect Card */}
        <div className="bg-[#131B2E]/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Unplug className="w-6 h-6 text-pink-400" />
            </div>
            <div className="flex flex-col items-end">
              <Badge variant="outline" className={`${data.infrastructure.status === 'LIVE' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-yellow-900/20 text-yellow-400'} border-none text-[10px] mb-1`}>
                {data.infrastructure.status === 'LIVE' ? '🟢 LIVE DATA' : '🟡 ESTIMATED'}
              </Badge>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getSeverityColor(data.infrastructure.severanceRisk)}`}>
                {data.infrastructure.severanceRisk}
              </span>
            </div>
          </div>
          <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Infrastructure Severance</h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            <strong>{data.infrastructure.probability}% probability</strong> of the "Island Effect". Asset may survive an event, but critical surrounding infrastructure (hospitals, power grids, roads) will fail, rendering the asset inaccessible.
          </p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-pink-400" style={{ width: `${data.infrastructure.probability}%` }}></div>
          </div>
        </div>

        {/* NEW: Regulatory Transition Risk Card (Local Law 97) */}
        <div className="bg-[#131B2E]/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Gavel className="w-6 h-6 text-emerald-400" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${data.carbonFine > 0 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {data.carbonFine > 0 ? 'HIGH RISK' : 'COMPLIANT'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Regulatory Transition Risk</h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            {data.carbonFine > 0 ? (
              <>Projected <strong>${data.carbonFine.toLocaleString()}</strong> in annual carbon tax penalties (e.g. NYC Local Law 97) due to property age and low energy efficiency compliance.</>
            ) : (
              <>Asset is currently compliant with imminent decarbonization mandates. No carbon tax penalties projected in the short term.</>
            )}
          </p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: `${data.carbonFine > 0 ? 80 : 10}%` }}></div>
          </div>
        </div>
        </div>

      </div>
    </section>
  );
};

export default RiskFactors;