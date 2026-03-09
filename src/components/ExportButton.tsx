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
        className="whitespace-normal text-sm md:text-base h-auto py-3 leading-snug"
      >
        <Download className="h-5 w-5 mr-2" />
        Download TCFD/CSRD Climate Risk Report (PDF)
      </Button>
    </div>
  );
};

export default ExportButton;
