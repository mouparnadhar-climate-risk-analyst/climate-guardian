import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const RiskMapPlaceholder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-lg border border-border bg-card h-full min-h-[400px] md:min-h-[520px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="animate-pulse-glow">
          <MapPin className="h-12 w-12 text-primary" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground text-sm font-medium">Interactive Risk Map</span>
        </div>
        <span className="text-muted-foreground/60 text-xs">Map Loading...</span>
      </div>
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(190 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(190 100% 50%) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
    </motion.div>
  );
};

export default RiskMapPlaceholder;
