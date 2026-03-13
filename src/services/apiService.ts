// ClimateVault API Service — Advanced ESG Analytics

export interface GeoLocation { lat: number; lng: number; displayName: string; status: DataStatus; }
export type DataStatus = "LIVE" | "ESTIMATED";

export interface ElevationResult { elevation: number; severity: string; score: number; source: string; status: DataStatus; }
export interface EarthquakeResult { count: number; severity: string; score: number; source: string; status: DataStatus; }
export interface ClimateResult { avgMaxTemp: number; totalPrecipitation: number; heatStressDays: number; extremeRainfallDays: number; maxWindSpeed: number; windSeverity: string; severity: string; score: number; source: string; status: DataStatus; }
export interface ProximityResult { distanceKm: number; severity: string; score: number; source: string; status: DataStatus; }
export interface InfrastructureResult { criticalCount: number; severanceRisk: string; probability: number; source: string; status: DataStatus; }

export interface AnalysisResult {
  location: GeoLocation; elevation: ElevationResult; earthquake: EarthquakeResult; climate: ClimateResult; coastal: ProximityResult; river: ProximityResult;
  infrastructure: InfrastructureResult; // NEW: Island Effect
  overallScore: number; riskLevel: string; lossPerDecade: number; adaptationCostPercent: number; adaptationROI: number; greenPremiumPercent: number;
  carbonFine: number; // NEW: Transition Risk
  strandedYear: number; // NEW: Stranded Asset Clock
}

const severityToScore: Record<string, number> = { MINIMAL: 10, LOW: 25, MEDIUM: 50, HIGH: 75, EXTREME: 95 };

// ... (Helper functions)
function elevationSeverity(m: number): string { if (m <= 2) return "EXTREME"; if (m <= 5) return "HIGH"; if (m <= 10) return "MEDIUM"; if (m <= 25) return "LOW"; return "MINIMAL"; }
function earthquakeSeverity(count: number): string { if (count === 0) return "MINIMAL"; if (count <= 5) return "LOW"; if (count <= 20) return "MEDIUM"; if (count <= 50) return "HIGH"; return "EXTREME"; }
function coastalSeverity(km: number): string { if (km < 0.5) return "EXTREME"; if (km < 2) return "HIGH"; if (km < 5) return "MEDIUM"; if (km < 10) return "LOW"; return "MINIMAL"; }
function riverSeverity(km: number): string { if (km < 0.5) return "HIGH"; if (km < 2) return "MEDIUM"; if (km < 5) return "LOW"; return "MINIMAL"; }
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number { const R = 6371; const dLat = ((lat2 - lat1) * Math.PI) / 180; const dLon = ((lon2 - lon1) * Math.PI) / 180; const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2; return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); }
function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

export async function geocode(address: string): Promise<GeoLocation> {
  try { const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, { headers: { "User-Agent": "ClimateVault_App" } }); const data = await res.json(); if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), displayName: data[0].display_name, status: "LIVE" }; } catch {}
  return { lat: 25.2048, lng: 55.2708, displayName: "Dubai, UAE (fallback)", status: "ESTIMATED" };
}

export async function fetchElevation(lat: number, lon: number): Promise<ElevationResult> {
  try { const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`, { signal: AbortSignal.timeout(8000) }); const data = await res.json(); const elev: number = data?.elevation?.[0] ?? 3.2; const sev = elevationSeverity(elev); return { elevation: elev, severity: sev, score: severityToScore[sev], source: "Open-Meteo Elevation API", status: "LIVE" }; } catch {}
  return { elevation: 3.2, severity: "HIGH", score: 75, source: "Open-Meteo Elevation API (fallback)", status: "ESTIMATED" };
}

export async function fetchEarthquakes(lat: number, lon: number): Promise<EarthquakeResult> {
  try { const res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradius=2&minmagnitude=4.0&limit=50&starttime=2000-01-01&endtime=2024-12-31`, { signal: AbortSignal.timeout(8000) }); const data = await res.json(); const count = data?.features?.length ?? 0; const sev = earthquakeSeverity(count); return { count, severity: sev, score: severityToScore[sev], source: "USGS Earthquake Catalog", status: "LIVE" }; } catch {}
  return { count: 12, severity: "MEDIUM", score: 50, source: "USGS Earthquake Catalog (fallback)", status: "ESTIMATED" };
}

export async function fetchClimate(lat: number, lon: number): Promise<ClimateResult> {
  try { const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max&timezone=auto&past_days=90`, { signal: AbortSignal.timeout(8000) }); const data = await res.json(); const temps: number[] = (data?.daily?.temperature_2m_max ??[]).filter((t: number | null) => t !== null); const precip: number[] = (data?.daily?.precipitation_sum ??[]).filter((p: number | null) => p !== null); const winds: number[] = (data?.daily?.windspeed_10m_max ??[]).filter((w: number | null) => w !== null);
    const avgMaxTemp = temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 38; const totalPrecipitation = precip.reduce((a, b) => a + b, 0); const heatStressDays = temps.filter((t) => t > 35).length; const extremeRainfallDays = precip.filter((p) => p > 50).length; const maxWindSpeed = winds.length > 0 ? Math.max(...winds) : 45;
    let windSev = "LOW"; let windScore = 25; if (maxWindSpeed > 118) { windSev = "EXTREME"; windScore = 95; } else if (maxWindSpeed > 90) { windSev = "HIGH"; windScore = 75; } else if (maxWindSpeed > 60) { windSev = "MEDIUM"; windScore = 50; }
    const heatScore = heatStressDays > 30 ? 95 : heatStressDays > 14 ? 75 : heatStressDays > 5 ? 50 : 25; const rainScore = extremeRainfallDays > 5 ? 95 : extremeRainfallDays > 2 ? 75 : extremeRainfallDays > 0 ? 50 : 25; const score = Math.round((heatScore + rainScore + windScore) / 3); const severity = score >= 80 ? "EXTREME" : score >= 60 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";
    return { avgMaxTemp: Math.round(avgMaxTemp * 10) / 10, totalPrecipitation: Math.round(totalPrecipitation), heatStressDays, extremeRainfallDays, maxWindSpeed: Math.round(maxWindSpeed), windSeverity: windSev, severity, score, source: "Open-Meteo Climate API", status: "LIVE" };
  } catch {}
  return { avgMaxTemp: 38, totalPrecipitation: 120, heatStressDays: 14, extremeRainfallDays: 2, maxWindSpeed: 45, windSeverity: "LOW", severity: "HIGH", score: 75, source: "Open-Meteo Climate API (fallback)", status: "ESTIMATED" };
}

export async function fetchCoastalProximity(lat: number, lon: number): Promise<ProximityResult> {
  try { const res = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];(way["natural"="coastline"](around:10000,${lat},${lon}););out%20geom%201;`, { signal: AbortSignal.timeout(10000) }); const data = await res.json(); if (data?.elements?.length > 0) { let minDist = Infinity; for (const el of data.elements) { if (el.geometry) { for (const pt of el.geometry) { const d = haversine(lat, lon, pt.lat, pt.lon); if (d < minDist) minDist = d; } } } const km = minDist === Infinity ? 1.2 : Math.round(minDist * 10) / 10; const sev = coastalSeverity(km); return { distanceKm: km, severity: sev, score: severityToScore[sev], source: "Overpass API", status: "LIVE" }; } return { distanceKm: 15, severity: "MINIMAL", score: 10, source: "Overpass API", status: "LIVE" }; } catch {}
  return { distanceKm: 1.2, severity: "HIGH", score: 75, source: "Overpass API (fallback)", status: "ESTIMATED" };
}

export async function fetchRiverProximity(lat: number, lon: number): Promise<ProximityResult> {
  try { const res = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];(way["waterway"="river"](around:10000,${lat},${lon}););out%20geom%201;`, { signal: AbortSignal.timeout(10000) }); const data = await res.json(); if (data?.elements?.length > 0) { let minDist = Infinity; for (const el of data.elements) { if (el.geometry) { for (const pt of el.geometry) { const d = haversine(lat, lon, pt.lat, pt.lon); if (d < minDist) minDist = d; } } } const km = minDist === Infinity ? 4 : Math.round(minDist * 10) / 10; const sev = riverSeverity(km); return { distanceKm: km, severity: sev, score: severityToScore[sev], source: "Overpass API", status: "LIVE" }; } return { distanceKm: 15, severity: "MINIMAL", score: 10, source: "Overpass API", status: "LIVE" }; } catch {}
  return { distanceKm: 4, severity: "LOW", score: 25, source: "Overpass API (fallback)", status: "ESTIMATED" };
}

// NEW: Infrastructure Island Effect Scan
export async function fetchInfrastructure(lat: number, lon: number, floodScore: number): Promise<InfrastructureResult> {
  try {
    const res = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];(nwr["amenity"="hospital"](around:3000,${lat},${lon});nwr["power"~"plant|substation"](around:3000,${lat},${lon}););out count;`, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    const count = data?.elements?.[0]?.tags?.total || data?.elements?.[0]?.tags?.nodes || 0;
    let prob = 15;
    if (count < 2) prob += 35; // Sparse critical infrastructure
    if (floodScore >= 75) prob += 40; // Flood risk isolates the building
    const sev = prob > 75 ? "EXTREME" : prob > 45 ? "HIGH" : "LOW";
    return { criticalCount: Number(count), severanceRisk: sev, probability: Math.min(prob, 99), source: "Overpass API (Infra)", status: "LIVE" };
  } catch {
    return { criticalCount: 1, severanceRisk: "HIGH", probability: 65, source: "Overpass API (fallback)", status: "ESTIMATED" };
  }
}

// NEW: Advanced Analytics passed via parameters
export function computeAdvancedRisk(
  result: Omit<AnalysisResult, "overallScore"| "riskLevel" | "lossPerDecade" | "adaptationCostPercent" | "adaptationROI" | "greenPremiumPercent" | "carbonFine" | "strandedYear">,
  assetValue: string, propertyType: string, constructionYear: string
) {
  const score = Math.round(result.elevation.score * 0.3 + result.coastal.score * 0.25 + result.earthquake.score * 0.2 + result.climate.score * 0.15 + result.river.score * 0.1);
  let riskLevel: string; let lossPerDecade: number; let adaptationCostPercent: number;
  if (score <= 30) { riskLevel = "LOW"; lossPerDecade = 0.03; adaptationCostPercent = 0.02; } else if (score <= 60) { riskLevel = "MEDIUM"; lossPerDecade = 0.08; adaptationCostPercent = 0.05; } else if (score <= 80) { riskLevel = "HIGH"; lossPerDecade = 0.16; adaptationCostPercent = 0.10; } else { riskLevel = "EXTREME"; lossPerDecade = 0.28; adaptationCostPercent = 0.18; }

  const val = Number(assetValue) || 10000000;
  const year = Number(constructionYear) || 2010;
  const type = propertyType || "Commercial Office";

  // TRANSITION RISK: Local Law 97 Carbon Fine
  const sqft = val / 500; // rough estimate of building size
  let carbonFine = 0;
  if (year <= 2010 &&["Commercial Office", "Hotel", "Retail", "Industrial"].includes(type)) {
    // Older commercial buildings exceed the strict CO2 limits
    const excessCarbonTons = sqft * 0.0028; 
    carbonFine = Math.round(excessCarbonTons * 268); // $268 penalty per ton
  }

  // STRANDED ASSET YEAR
  let strandedYear = 2085;
  if (score > 80) strandedYear = new Date().getFullYear() + 14; // Strands very fast
  else if (score > 60) strandedYear = new Date().getFullYear() + 26;
  else if (score > 40) strandedYear = new Date().getFullYear() + 41;

  const adaptationROI = Math.round(((lossPerDecade * 3) / adaptationCostPercent) * 100);
  const greenPremiumPercent = score <= 40 ? 12 : score <= 70 ? 8 : 4;

  return { overallScore: score, riskLevel, lossPerDecade, adaptationCostPercent, adaptationROI, greenPremiumPercent, carbonFine, strandedYear };
}

// Full pipeline
export async function runFullAnalysis(address: string, assetValue: string, propertyType: string, constructionYear: string, onStep: (step: number) => void): Promise<AnalysisResult> {
  const location = await geocode(address); onStep(0); await delay(500);
  const [elevation, earthquake] = await Promise.all([ fetchElevation(location.lat, location.lng), fetchEarthquakes(location.lat, location.lng) ]); onStep(1); await delay(500);
  const climate = await fetchClimate(location.lat, location.lng); onStep(2); await delay(500);
  const[coastal, river] = await Promise.all([ fetchCoastalProximity(location.lat, location.lng), fetchRiverProximity(location.lat, location.lng) ]); onStep(3); await delay(500);
  
  // Fetch Island Effect infrastructure data
  const infrastructure = await fetchInfrastructure(location.lat, location.lng, Math.max(elevation.score, river.score, coastal.score));
  
  const partial = { location, elevation, earthquake, climate, coastal, river, infrastructure };
  const advanced = computeAdvancedRisk(partial, assetValue, propertyType, constructionYear);
  onStep(4);

  return { ...partial, ...advanced };
}