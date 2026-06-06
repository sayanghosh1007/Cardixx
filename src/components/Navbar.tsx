import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CardixLogo from "@/components/CardixLogo";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-glass-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/">
          <CardixLogo size="sm" />
        </Link>

        {isLanding && (
          <>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="hero" size="sm" asChild>
                <Link to="/dashboard">Open App</Link>
              </Button>
            </div>

            <button
              className="md:hidden text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {mobileOpen && (
              <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-glass-border p-4 md:hidden animate-fade-in">
                <div className="flex flex-col gap-3">
                  <a href="#features" className="text-sm text-muted-foreground py-2">Features</a>
                  <a href="#how-it-works" className="text-sm text-muted-foreground py-2">How It Works</a>
                  <Button variant="hero" size="sm" asChild>
                    <Link to="/dashboard">Open App</Link>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
