# 🛡️ ClimateVault

> **Institutional-Grade Climate Risk Intelligence & Double Materiality Disclosure.**

![ClimateVault Interface](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

**ClimateVault** is a high-performance ESG (Environmental, Social, and Governance) intelligence platform architected for global real estate institutional fund managers. Designed to meet **2026 ESRS (European Sustainability Reporting Standards)** requirements, it synthesizes real-time geospatial data into actionable financial modeling and carbon impact analysis.

🔗 **[Launch Live Application](https://climate-guardian-blond.vercel.app/)** 

---

## 🚀 Advanced Enterprise Features

### ⚖️ Double Materiality Matrix (CSRD-Aligned)
Automates the mandatory "Double Materiality" assessment. It visualises the asset's position on a 2x2 matrix, comparing **Financial Materiality** (Climate Risk to Asset) against **Impact Materiality** (Carbon Footprint to Planet).

### ⏳ Stranded Asset Countdown
A predictive engine that calculates the exact **Year of Obsolescence**. It identifies the tipping point where compounding physical risks and regulatory decarbonization penalties render an asset uninsurable or commercially non-viable.

### 🏝️ Infrastructure Severance (The "Island Effect")
Goes beyond building-level metrics to analyse neighbourhood resilience. It calculates the probability of isolation, where an asset remains structurally safe, but critical surrounding infrastructure (hospitals, power grids, transport) fails.

### 📈 Multi-Scenario Projections to 2085
Dynamic financial modelling of asset depreciation and insurance premium spikes through a **60-year horizon**, utilising IPCC AR6 (RCP 4.5 and RCP 8.5) trajectories.

### 📄 Institutional ESG Reporting Engine
Generates professional, A4-ready, **7-page Executive Reports** natively. Includes a strategic cover page, detailed physical hazard profiles, transition risk assessments, and an automated Adaptation Roadmap with quantified **ROI** and **Green Premium** metrics.

---

## 📡 Data Architecture & APIs

ClimateVault synthesises real-time data from 6 specialised global sources via a resilient "Fail-Safe" pipeline:

1. **[Nominatim (OSM)](https://nominatim.org/):** Global geocoding and coordinate extraction.
2. **[Open-Meteo Elevation](https://open-meteo.com/):** High-precision topography for inundation modeling.
3. **[USGS Earthquake Hazards](https://earthquake.usgs.gov/):** 25-year historical seismic activity scanning within 200km.
4. **[Open-Meteo Historical](https://open-meteo.com/):** Real-time thermal stress, aridity/water scarcity, and peak wind velocity analysis.
5. **[Overpass API](https://overpass-api.de/):** Advanced geospatial modelling for coastal proximity and critical infrastructure density.
6. **[Supabase](https://supabase.com/):** Backend infrastructure for session persistence and database management.

---

## 💻 Tech Stack

* **Frontend:** React 18, TypeScript, Vite, Framer Motion
* **Styling:** Tailwind CSS, Shadcn UI, Advanced Glassmorphism Design
* **Visualisation:** Recharts (Financial modelling), Mapbox GL (Interactive Mapping)
* **Reporting:** jsPDF & CSS Print Media (7-Page Proportional Layout Engine)
* **PWA:** Fully installable standalone application (Service Worker enabled)

---

## 🛠️ Local Development

Follow these steps to run the ClimateVault engine locally:

**1. Clone the repository and navigate inside:**
```bash
git clone https://github.com/mouparnadhar-climate-risk-analyst/climate-guardian.git
cd climate-guardian
```
2. Install the required dependencies:
```bash
   npm install
```
3. Start the development server:
   ```bash
   
   npm run dev
   ```
**👩‍💻Author**

**Mouparna Dhar**

Climate & Geospatial Risk Analyst | AI-Accelerated Full-Stack Developer\

Bridging the gap between environmental science and global capital markets.
Built during the She Builds Global Hackathon.
