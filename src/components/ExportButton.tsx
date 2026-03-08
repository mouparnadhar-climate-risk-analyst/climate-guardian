import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ExportButton = () => {
  const handleExport = () => {
    toast("Preparing print preview...");
    setTimeout(() => window.print(), 300);
  };

  return (
    <div className="mt-12 flex justify-center print:hidden">
      <Button
        onClick={handleExport}
        className="w-full max-w-md bg-primary hover:bg-primary/85 text-primary-foreground font-bold py-4 h-14 rounded-xl text-base glow-primary-intense transition-all"
      >
        <Download className="h-5 w-5 mr-2" />
        Download TCFD/CSRD Climate Risk Report (PDF)
      </Button>
    </div>
  );
};

export default ExportButton;
