# 🛡️ ClimateVault

> **Know Your Asset's Future Before the Market Does.**

![ClimateVault Interface](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

**ClimateVault** is an institutional-grade ESG (Environmental, Social, and Governance) intelligence platform. It conducts deep environmental stress tests on global real estate assets, synthesizing real-time geospatial data to calculate 60-year financial risk projections based on IPCC climate scenarios.

🔗 **[View Live Application](https://climate-guardian-blond.vercel.app/)** 

---

## 🚀 Key Features

* **Real-Time Data Synthesis:** Aggregates live data from 5 global environmental APIs to assess precise localized risk, circumventing the need for static historical datasets.
* **60-Year Financial Modeling:** Calculates asset depreciation, value loss, and insurance premium spikes through the year 2085 using RCP 4.5 and RCP 8.5 climate trajectories.
* **Interactive Geospatial Intelligence:** Features a high-end, dark-mode Mapbox UI that dynamically maps extreme, high, and moderate risk zones (500m to 3km radii) around the asset.
* **Enterprise Reporting Engine:** Generates instant, A4-ready **TCFD/CSRD Executive PDF Reports** natively via CSS Print Media styling, entirely bypassing canvas-taint limitations.
* **Resilience & Fallback Architecture:** Engineered with graceful API error handling. If a third-party server times out, the system injects regional fallback estimates, preserving 100% UI uptime and transparency (`🟢 LIVE` vs `🟡 ESTIMATED` badges).
* **Progressive Web App (PWA):** Fully installable as a standalone native application on both mobile and desktop environments.

---

## 📡 Data Architecture & APIs

ClimateVault relies on a robust data pipeline, pulling from the following live sources:

1. **[Nominatim (OpenStreetMap)](https://nominatim.org/):** Global geocoding and coordinate extraction.
2. **[Open-Elevation](https://open-elevation.com/) / [Open-Meteo](https://open-meteo.com/):** High-precision topographical data for sea-level rise and flood inundation risk.
3. **[USGS Earthquake Hazards Program](https://earthquake.usgs.gov/):** 25-year historical seismic activity scanning within a 200km radius.
4. **[Open-Meteo Historical Weather](https://open-meteo.com/):** 90-day meteorological stress testing (tracking days >35°C and extreme rainfall >50mm).
5. **[Overpass API](https://overpass-api.de/):** Distance calculations to nearest coastlines and major river systems for storm surge modeling.

---

## 💻 Tech Stack

* **Frontend Framework:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS, Shadcn UI, Glassmorphism UI design
* **Geospatial:** Leaflet.js, React-Leaflet, Mapbox Dark Tiles
* **Data Visualization:** Recharts
* **Deployment (CI/CD):** Vercel (Primary), Netlify (Fail-safe Backup)

---

## 🛠️ Local Development

To run ClimateVault locally on your machine:

**1. Clone the repository:**
```bash
git clone https://github.com/mouparnadhar-climate-risk-analyst/climate-guardian.git
