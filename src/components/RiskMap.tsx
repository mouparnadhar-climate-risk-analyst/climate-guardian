import { useEffect, useMemo, useRef } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl";
import { circle } from "@turf/circle";
import type { FeatureCollection, Polygon } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibW91cGFybmEyMyIsImEiOiJjbW01MmJmNm8wMjY3MnNzOHk1Z25xeGt5In0.Ub3jY06rWrgwwJGDQV1K9Q";

const DEFAULT_VIEW = {
  longitude: 55.2708,
  latitude: 25.2048,
  zoom: 2,
  pitch: 0,
  bearing: 0,
};

/** Dark space atmosphere (Mapbox GL fog) */
const MAP_FOG = {
  range: [0.8, 8] as [number, number],
  color: "#030a04",
  "high-color": "#000000",
  "space-color": "#000000",
  "star-intensity": 0.8,
};

interface RiskMapProps {
  analysisLocation: { lat: number; lng: number } | null;
}

const MapLegend = () => (
  <div className="absolute bottom-4 right-4 z-[1000] rounded-lg border border-border bg-card/90 backdrop-blur-sm p-2 md:p-3 space-y-1.5 md:space-y-2">
    <p className="text-[10px] md:text-xs font-semibold text-foreground">Risk Zones</p>
    <div className="flex items-center gap-2">
      <span className="block h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-destructive/80" />
      <span className="text-[10px] md:text-xs text-muted-foreground">Extreme (500m)</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="block h-2.5 w-2.5 md:h-3 md:w-3 rounded-full" style={{ background: "hsl(20 100% 60% / 0.8)" }} />
      <span className="text-[10px] md:text-xs text-muted-foreground">High (1.5km)</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="block h-2.5 w-2.5 md:h-3 md:w-3 rounded-full" style={{ background: "hsl(50 100% 50% / 0.8)" }} />
      <span className="text-[10px] md:text-xs text-muted-foreground">Moderate (3km)</span>
    </div>
  </div>
);

const RiskMap = ({ analysisLocation }: RiskMapProps) => {
  const mapRef = useRef<MapRef>(null);

  const riskZonesGeoJson = useMemo<FeatureCollection<Polygon> | null>(() => {
    if (!analysisLocation) return null;
    const center: [number, number] = [analysisLocation.lng, analysisLocation.lat];
    return {
      type: "FeatureCollection",
      features: [
        circle(center, 0.5, { units: "kilometers", steps: 64, properties: { tier: "extreme" } }),
        circle(center, 1.5, { units: "kilometers", steps: 64, properties: { tier: "high" } }),
        circle(center, 3, { units: "kilometers", steps: 64, properties: { tier: "moderate" } }),
      ],
    };
  }, [analysisLocation]);

  useEffect(() => {
    if (!analysisLocation) return;
    mapRef.current?.flyTo({
      center: [analysisLocation.lng, analysisLocation.lat],
      zoom: 13,
      pitch: 60,
      bearing: 20,
      duration: 4000,
      essential: true,
    });
  }, [analysisLocation]);

  return (
    <div className="rounded-lg border border-border overflow-hidden h-[300px] md:h-[500px] relative">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        initialViewState={DEFAULT_VIEW}
        projection="globe"
        fog={MAP_FOG}
        style={{ width: "100%", height: "100%" }}
        reuseMaps
      >
        {analysisLocation && riskZonesGeoJson && (
          <>
            <Source id="risk-zones" type="geojson" data={riskZonesGeoJson}>
              {/* Paint largest ring first (bottom), smallest last (top) */}
              <Layer
                id="risk-moderate"
                type="fill"
                filter={["==", ["get", "tier"], "moderate"]}
                paint={{
                  "fill-color": "hsl(50, 100%, 50%)",
                  "fill-opacity": 0.1,
                }}
              />
              <Layer
                id="risk-high"
                type="fill"
                filter={["==", ["get", "tier"], "high"]}
                paint={{
                  "fill-color": "hsl(20, 100%, 60%)",
                  "fill-opacity": 0.15,
                }}
              />
              <Layer
                id="risk-extreme"
                type="fill"
                filter={["==", ["get", "tier"], "extreme"]}
                paint={{
                  "fill-color": "hsl(0, 84%, 60%)",
                  "fill-opacity": 0.25,
                }}
              />
            </Source>
            <Marker longitude={analysisLocation.lng} latitude={analysisLocation.lat} anchor="center">
              <div
                className="rounded-full border-2 border-white"
                style={{
                  width: 20,
                  height: 20,
                  background: "hsl(190 100% 50%)",
                  boxShadow:
                    "0 0 16px 6px hsl(190 100% 50% / 0.6), 0 0 40px 12px hsl(190 100% 50% / 0.25)",
                }}
              />
            </Marker>
          </>
        )}
      </Map>

      {analysisLocation && <MapLegend />}
    </div>
  );
};

export default RiskMap;
