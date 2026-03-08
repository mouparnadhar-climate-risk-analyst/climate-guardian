import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  "Fetching elevation data...",
  "Analysing seismic history...",
  "Retrieving climate records...",
  "Scanning coastal & river proximity...",
  "Computing financial projections...",
];

interface AnalysisLoadingModalProps {
  open: boolean;
  currentStep: number; // -1 = not started, 0-4 = completed steps
}

const AnalysisLoadingModal = ({ open, currentStep }: AnalysisLoadingModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-card border-border" onInteractOutside={(e) => e.preventDefault()}>
        <DialogTitle className="text-foreground text-lg font-semibold text-center">
          Running Climate Risk Analysis
        </DialogTitle>
        <div className="space-y-3 py-4">
          <AnimatePresence>
            {STEPS.map((label, i) => {
              const done = i <= currentStep;
              const active = i === currentStep + 1;
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  {done ? (
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                  ) : active ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-border" />
                  )}
                  <span className={`text-sm ${done ? "text-primary" : active ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisLoadingModal;
