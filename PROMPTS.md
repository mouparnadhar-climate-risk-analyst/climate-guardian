# 🧠 ClimateVault: Prompt Engineering Library

This document outlines the detailed prompts used to architect, build, and refine the **ClimateVault** platform. It serves as a blueprint for the logic, API integrations, and design decisions made during the build.

---

## 🏗️ Phase 1: The Foundation & UI Design
> "Build a React web app called 'ClimateVault' with the tagline 'Know Your Asset's Future Before the Market Does.' Use a premium dark theme: background #0A0F1E (very dark navy), cards #131B2E, accent color #00D4FF (electric cyan), warning color #FF6B35 (orange-red), text white. The layout should be: A top navigation bar with a minimalist logo (White square vault outline with a glowing Cyan 'C' inside) and a 'Try Demo' button. Below that, a two-column layout: LEFT COLUMN (40%) for Asset Details inputs (Value, Type, Year, Country) and RIGHT COLUMN (60%) for an Interactive Risk Map placeholder with a pulse animation. Make it fully mobile responsive."

---

## 🗺️ Phase 2: Geospatial Intelligence
> "Replace the map placeholder with a real interactive map using 'mapbox-gl' and 'react-map-gl'. Use my Mapbox credentials for the TileLayer: `mapbox://styles/mapbox/dark-v11`. Default center to Dubai at zoom level 11. When the user types an address and clicks analyze, use OpenStreetMap Nominatim API to find and fly to that location. Drop a glowing cyan pin and draw three concentric circles: Red (500m Extreme Risk), Orange (1500m High Risk), and Yellow (3000m Moderate Risk). Add a map legend in the bottom right corner."

---

## 📈 Phase 3: Financial Risk Modeling
> "Add a 'Financial Risk Projection' section with a data table showing 10-year intervals from 2025 to 2085. Columns: Year, Climate Scenario, Projected Asset Value, Value Loss ($), Value Loss (%), and Risk Level. Populate with compounded dummy data based on user input. Add a Recharts line chart showing 'Asset Value Over Time' with two lines: 'Business as Usual' (declining) vs. 'With Adaptation Investment' (stable). Color code Risk Levels: Green, Yellow, Orange, Red, Dark Red."

---

## 📡 Phase 4: The "Brain" (Multi-API Integration)
> "Architect an `apiService.ts` to handle live data fetching from 5 global environmental databases. CRITICAL RULE: If ANY API fails, it must FAIL SILENTLY and return realistic fallback data so the UI NEVER crashes. When the user clicks 'Run Analysis', execute:
> 1. **Geocoding:** Use Nominatim to get lat/lon.
> 2. **Elevation:** Fetch from Open-Meteo Elevation API (0-2m: EXTREME, 2-5m: HIGH).
> 3. **Earthquake:** Fetch from USGS Earthquake Catalog. Count Mag 4.0+ in 200km over 25 years.
> 4. **Climate:** Fetch temperature and windspeed from Open-Meteo. Count heat stress days (>35°C).
> 5. **Coastal/River:** Fetch from Overpass API (OSM). Coast/River <500m: EXTREME/HIGH risk.
> 6. **Dynamic UI:** Replace static cards with dynamic Risk Factor cards showing '🟢 LIVE DATA' or '🟡 ESTIMATED' badges based on API success."

---

## 📄 Phase 5: Enterprise Reporting & PWA
> "Convert the app into a fully installable Progressive Web App (PWA) with a manifest and service worker. Replace the browser print method with a pure CSS Print Media engine for a professional PDF. When 'Download Report' is clicked, hide all UI elements (Navbar, Inputs, Buttons) and show ONLY a hidden 'PrintableReport' component. This component must generate a clean, white-paper Executive Brief including 'AI Strategic Guidance' text based on the specific risk factors detected."

---

## 🚀 Phase 6: The "Billion Dollar" Features (Differentiation)
> "Upgrade the logic to add three advanced analytics features:
> 1. **Stranded Asset Year:** Calculate the year of obsolescence based on risk score tipping points (e.g., if risk > 60, asset strands in ~26 years). Show this in a massive 'Countdown Clock' banner.
> 2. **Infrastructure Severance (Island Effect):** Use Overpass API to scan for critical infrastructure (hospitals, power plants) within 3km. Calculate probability of isolation.
> 3. **Regulatory Transition Risk:** If the building is commercial and pre-2010, calculate projected annual carbon tax penalties (Local Law 97) based on square footage and a $268/ton penalty."

---

## 🏁 Summary of API Sources
* **Geocoding:** Nominatim (OpenStreetMap)
* **Elevation:** Open-Meteo
* **Seismic:** USGS Earthquake Hazards Program
* **Weather/Wind:** Open-Meteo Historical
* **Infrastructure/Water:** Overpass API (OSM)
* **Database/Auth:** Supabase