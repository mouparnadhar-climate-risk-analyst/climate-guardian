import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Wand2, Download, History, Trash2 } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { getHistory, clearHistory, type HistoryEntry } from "@/services/historyService";
import { Badge } from "@/components/ui/badge";

const VaultLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="32" height="32" rx="4" stroke="white" strokeWidth="2" fill="none" />
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="hsl(190, 100%, 50%)" fontSize="18" fontWeight="700" fontFamily="Inter">C</text>
  </svg>
);

interface NavbarProps {
  onDemo?: () => void;
  onHistorySelect?: (entry: HistoryEntry) => void;
}

function riskColor(level: string) {
  if (level === "LOW") return "bg-green-600";
  if (level === "MEDIUM") return "bg-yellow-600";
  if (level === "HIGH") return "bg-orange-600";
  return "bg-destructive";
}

const Navbar = ({ onDemo, onHistorySelect }: NavbarProps) => {
  const { canInstall, install } = usePwaInstall();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const refreshHistory = () => setHistory(getHistory());

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* FIXED: Changed h-14 to min-h-[3.5rem] and added py-2 to allow expanding on mobile */}
      <div className="container flex min-h-[3.5rem] md:min-h-[4rem] py-2 md:py-0 items-center justify-between flex-wrap gap-y-2">
        
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <VaultLogo />
          <span className="text-base md:text-lg font-bold tracking-wider text-foreground">CLIMATEVAULT</span>
        </div>

        {/* FIXED: Added flex-wrap and justify-end here */}
        <div className="flex flex-wrap justify-end items-center gap-1.5 md:gap-2">
          <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (v) refreshHistory(); }}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-all text-[11px] md:text-sm h-8 md:h-9 px-2 md:px-4"
              >
                <History className="h-3.5 w-3.5 mr-1" />
                History
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-border w-80">
              <SheetHeader>
                <SheetTitle className="text-foreground flex items-center justify-between">
                  Recent Analyses
                  {history.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-destructive h-7 px-2">
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No analyses yet. Run your first analysis to see it here.</p>
                ) : (
                  history.map((entry, i) => (
                    <button
                      key={`${entry.propertyName}-${entry.timestamp}`}
                      className="w-full text-left rounded-lg border border-border bg-secondary/50 p-3 hover:bg-secondary transition-colors"
                      onClick={() => { onHistorySelect?.(entry); setOpen(false); }}
                    >
                      <p className="text-sm font-medium text-foreground truncate">{entry.propertyName}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">
                          {entry.assetValue ? `$${Number(entry.assetValue).toLocaleString()}` : "No value"}
                        </span>
                        <Badge variant="outline" className={`${riskColor(entry.riskLevel)} text-white border-none text-[10px] px-1.5 py-0`}>
                          {entry.riskScore}/100
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {canInstall && (
            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all text-[11px] md:text-sm h-8 md:h-9 px-2 md:px-4"
              onClick={install}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Install
            </Button>
          )}

          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all text-[11px] md:text-sm h-8 md:h-9 px-2 md:px-4"
            onClick={onDemo}
          >
            <Wand2 className="h-3.5 w-3.5 mr-1" />
            Demo Mode
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;