import { Button } from "@/components/ui/button";

const VaultLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="32" height="32" rx="4" stroke="white" strokeWidth="2" fill="none" />
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="hsl(190, 100%, 50%)" fontSize="18" fontWeight="700" fontFamily="Inter">C</text>
  </svg>
);

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <VaultLogo />
          <span className="text-lg font-bold tracking-wider text-foreground">CLIMATEVAULT</span>
        </div>
        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
          Try Demo
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
