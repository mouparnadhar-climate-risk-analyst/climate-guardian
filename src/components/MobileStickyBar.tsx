import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface MobileStickyBarProps {
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const MobileStickyBar = ({ onAnalyze, isAnalyzing }: MobileStickyBarProps) => {
  return (
    <div data-mobile-sticky className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/90 backdrop-blur-xl p-3">
      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold text-sm h-12"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Run Climate Risk Analysis"
        )}
      </Button>
    </div>
  );
};

export default MobileStickyBar;
