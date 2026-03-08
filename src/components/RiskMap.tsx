import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Circle, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoibW91cGFybmEyMyIsImEiOiJjbW01MmJmNm8wMjY3MnNzOHk1Z25xeGt5In0.Ub3jY06rWrgwwJGDQV1K9Q";

const TILE_URL = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`;

const DEFAULT_CENTER: [number, number] = [25.2048, 55.2708];
const DEFAULT_ZOOM = 11;

// Glowing cyan pin icon
const cyanIcon = new L.DivIcon({
  className: "",
  html: `<div style="
    width: 20px; height: 20px; 
    background: hsl(190 100% 50%); 
    border-radius: 50%; 
    box-shadow: 0 0 16px 6px hsl(190 100% 50% / 0.6), 0 0 40px 12px hsl(190 100% 50% / 0.25);
    border: 2px solid white;
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface RiskMapProps {
  analysisLocation: { lat: number; lng: number } | null;
}

function FlyToLocation({ location }: { location: { lat: number; lng: number } }) {
  const map = useMap();
  const hasFlewRef = useRef<string | null>(null);

  useEffect(() => {
    const key = `${location.lat},${location.lng}`;
    if (hasFlewRef.current !== key) {
      hasFlewRef.current = key;
      map.flyTo([location.lat, location.lng], 13, { duration: 2 });
    }
  }, [location, map]);

  return null;
}

const MapLegend = () => (
  <div className="absolute bottom-4 right-4 z-[1000] rounded-lg border border-border bg-card/90 backdrop-blur-sm p-3 space-y-2">
    <p className="text-xs font-semibold text-foreground">Risk Zones</p>
    <div className="flex items-center gap-2">
      <span className="block h-3 w-3 rounded-full bg-destructive/80" />
      <span className="text-xs text-muted-foreground">Extreme (500m)</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="block h-3 w-3 rounded-full" style={{ background: "hsl(20 100% 60% / 0.8)" }} />
      <span className="text-xs text-muted-foreground">High (1.5km)</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="block h-3 w-3 rounded-full" style={{ background: "hsl(50 100% 50% / 0.8)" }} />
      <span className="text-xs text-muted-foreground">Moderate (3km)</span>
    </div>
  </div>
);

const RiskMap = ({ analysisLocation }: RiskMapProps) => {
  return (
    <div className="rounded-lg border border-border overflow-hidden h-full min-h-[400px] md:min-h-[520px] relative">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full min-h-[400px] md:min-h-[520px]"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url={TILE_URL}
          attribution="&copy; Mapbox &copy; OpenStreetMap"
          tileSize={512}
          zoomOffset={-1}
        />

        {analysisLocation && (
          <>
            <FlyToLocation location={analysisLocation} />
            <Marker position={[analysisLocation.lat, analysisLocation.lng]} icon={cyanIcon} />
            <Circle
              center={[analysisLocation.lat, analysisLocation.lng]}
              radius={3000}
              pathOptions={{ color: "hsl(50, 100%, 50%)", fillColor: "hsl(50, 100%, 50%)", fillOpacity: 0.1, weight: 1 }}
            />
            <Circle
              center={[analysisLocation.lat, analysisLocation.lng]}
              radius={1500}
              pathOptions={{ color: "hsl(20, 100%, 60%)", fillColor: "hsl(20, 100%, 60%)", fillOpacity: 0.15, weight: 1 }}
            />
            <Circle
              center={[analysisLocation.lat, analysisLocation.lng]}
              radius={500}
              pathOptions={{ color: "hsl(0, 84%, 60%)", fillColor: "hsl(0, 84%, 60%)", fillOpacity: 0.25, weight: 1 }}
            />
          </>
        )}
      </MapContainer>

      {analysisLocation && <MapLegend />}
    </div>
  );
};

export default RiskMap;
