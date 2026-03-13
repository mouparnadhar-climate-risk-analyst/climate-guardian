# 🛡️ ClimateVault

> **Institutional-Grade Climate Risk Intelligence & Financial Modeling.**

![ClimateVault Interface](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

**ClimateVault** is a professional ESG intelligence platform designed for global real estate investors and institutional fund managers. It translates complex environmental science into actionable financial data, conducting deep stress tests to project asset viability through a 60-year climate horizon.

🔗 **[Launch Live Application](https://climate-guardian-blond.vercel.app/)** 

---

## 🚀 Advanced Enterprise Features

### ⏳ Stranded Asset Countdown
A predictive engine that calculates the exact **Year of Obsolescence**. It identifies the tipping point where compounding physical risks and regulatory penalties render an asset uninsurable or commercially non-viable.

### 🏝️ Infrastructure Severance (The "Island Effect")
Goes beyond the building to analyse the neighbourhood. Uses geospatial intelligence to calculate the probability of isolation—where an asset remains safe, but the surrounding critical infrastructure (hospitals, power grids, roads) fails.

### ⚖️ Regulatory Transition Risk (Local Law 97)
Predicts financial exposure to emerging global decarbonization mandates. It calculates estimated annual carbon tax penalties based on property age, type, and square footage.

### 📈 Multi-Scenario Financial Projections
Dynamic modelling of asset depreciation and insurance premium spikes through **2085**, utilising IPCC AR6 (RCP 4.5 and RCP 8.5) trajectories.

### 📄 Institutional Export Engine
* **AI Strategic Reports:** Generates clean, white-paper PDF executive summaries with site-specific adaptation strategies.
* **Raw Data Export:** Instant CSV generation for integration into proprietary institutional financial models.

---

## 📡 Data Architecture & APIs

ClimateVault synthesises real-time data from 6 specialised global sources:

1. **[Nominatim (OSM)](https://nominatim.org/):** Global geocoding and coordinate extraction.
2. **[Open-Meteo Elevation](https://open-meteo.com/):** High-precision topography for inundation modeling.
3. **[USGS Earthquake Hazards](https://earthquake.usgs.gov/):** 25-year historical seismic activity scanning.
4. **[Open-Meteo Historical Weather](https://open-meteo.com/):** Thermal stress and wind velocity analysis (Hurricane force detection).
5. **[Overpass API](https://overpass-api.de/):** Distance modelling for coastal/river proximity and critical infrastructure density.
6. **[Supabase](https://supabase.com/):** Backend infrastructure for session persistence and data handling.

---

## 💻 Tech Stack

* **Frontend:** React 18, TypeScript, Vite, Framer Motion
* **Styling:** Tailwind CSS, Shadcn UI, Advanced Glassmorphism Design
* **Visualization:** Recharts (Financial Modeling), Mapbox GL (Geospatial Mapping)
* **Reporting:** jsPDF & CSS Print Media (Native Document Generation)
* **Deployment:** Vercel (Production), Netlify (Fail-safe Backup)

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
Bridging the gap between climate science and global capital markets.
Built during the She Builds Global Hackathon.
