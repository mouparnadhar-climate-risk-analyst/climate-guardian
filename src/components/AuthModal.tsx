import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"signIn" | "signUp" | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setLoading("signIn");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(null);
    if (error) {
      toast.error(error.message || "Sign in failed.");
      return;
    }
    toast.success("Signed in successfully.");
    onOpenChange(false);
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setLoading("signUp");
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(null);
    if (error) {
      toast.error(error.message || "Account creation failed.");
      return;
    }
    toast.success("Account created. Please check your inbox to verify your email.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-white/10 bg-background/70 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Secure Sign-In
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground">
            Access TerraQuant&apos;s institutional ESG analytics. Use your work email to align with your organisation&apos;s
            reporting credentials.
          </p>
          <div className="space-y-2">
            <Label htmlFor="auth-email" className="text-xs text-muted-foreground">
              Email
            </Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@institution.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/70 border-border text-foreground placeholder:text-muted-foreground h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password" className="text-xs text-muted-foreground">
              Password
            </Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary/70 border-border text-foreground placeholder:text-muted-foreground h-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading !== null}
              onClick={handleSignIn}
            >
              {loading === "signIn" ? "Signing In..." : "Sign In"}
            </Button>
            <Button
              className="flex-1 bg-cyan-500/90 text-black hover:bg-cyan-400"
              disabled={loading !== null}
              onClick={handleSignUp}
              variant="outline"
            >
              {loading === "signUp" ? "Creating..." : "Create Account"}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            By continuing you agree to TerraQuant&apos;s terms of use and acknowledge that this report does not constitute
            investment advice.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

