import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, ThermometerSun, CloudRain, Activity, ChevronDown, AlertTriangle } from "lucide-react";

const fmt = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

const CARDS = [
  {
    title: "Storm Surge",
    icon: Waves,
    iconColor: "text-primary",
    bg: "bg-cyan-900/10",
    probability: "34%",
    lossPct: 0.28,
    recovery: "18-36 months",
    detail: "Coastal storm surges driven by rising sea levels and intensifying cyclones pose severe structural and financial risk to waterfront assets.",
  },
  {
    title: "Extreme Heat (>50°C)",
    icon: ThermometerSun,
    iconColor: "text-orange-400",
    bg: "bg-orange-900/10",
    probability: "67%",
    lossPct: 0.12,
    recovery: null,
    impact: "Cooling costs +340%",
    detail: "Prolonged extreme heat events degrade building materials, increase energy demand, and reduce worker productivity in affected regions.",
  },
  {
    title: "Flash Flood",
    icon: CloudRain,
    iconColor: "text-blue-400",
    bg: "bg-blue-900/10",
    probability: "45%",
    lossPct: 0.19,
    recovery: "8-14 months",
    detail: "Urban flash flooding caused by overwhelmed drainage systems during extreme rainfall events leads to significant water damage and business interruption.",
  },
  {
    title: "Earthquake",
    icon: Activity,
    iconColor: "text-purple-400",
    bg: "bg-purple-900/10",
    probability: "Zone Dependent",
    lossPct: 0.55,
    recovery: "3-7 years",
    detail: "Seismic events cause catastrophic structural damage. Loss severity is highly dependent on construction standards and proximity to fault lines.",
  },
];

interface DisasterScenariosProps {
  assetValue: string;
}

const DisasterScenarios = ({ assetValue }: DisasterScenariosProps) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const baseValue = useMemo(() => {
    const parsed = parseFloat(assetValue.replace(/[^0-9.]/g, ""));
    return isNaN(parsed) || parsed <= 0 ? 10_000_000 : parsed;
  }, [assetValue]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="h-6 w-6 text-warning" />
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Sudden Climate Disaster Impact Scenarios
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          const loss = baseValue * card.lossPct;
          const isOpen = expanded === i;

          return (
            <div
              key={card.title}
              className={`rounded-lg border border-border bg-card/60 backdrop-blur-md p-5 ${card.bg} transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-secondary/50 p-2.5">
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base">{card.title}</h3>

                  <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs">Probability</span>
                      <p className="text-foreground font-medium">{card.probability}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Asset Loss</span>
                      <p className="text-destructive font-medium">
                        {(card.lossPct * 100).toFixed(0)}% (−{fmt(loss)})
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground text-xs">
                        {card.impact ? "Impact" : "Recovery"}
                      </span>
                      <p className="text-foreground font-medium">
                        {card.impact ?? card.recovery}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpanded(isOpen ? null : i)}
                    className="mt-3 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Learn More
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden text-xs text-muted-foreground leading-relaxed mt-2"
                      >
                        {card.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default DisasterScenarios;
