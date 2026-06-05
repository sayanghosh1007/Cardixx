import { Link, useLocation } from "react-router-dom";
import HexonLogo from "@/components/HexonLogo";
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  User,
  Sparkles,
  Library,
  Target,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Sparkles, label: "Generate", path: "/generate" },
  { icon: Library, label: "My Decks", path: "/decks" },
  { icon: BookOpen, label: "Study", path: "/study" },
  { icon: Brain, label: "Quiz", path: "/quiz" },
  { icon: Target, label: "Planner", path: "/planner" },
  
  { icon: User, label: "Profile", path: "/profile" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-glass-border bg-background/90 backdrop-blur-xl px-4 lg:hidden">
        <HexonLogo size="sm" />
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-glass-border bg-background/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center px-6 border-b border-glass-border">
          <HexonLogo size="sm" />
        </div>
        <nav className="flex flex-col gap-1 p-3 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary neon-glow-blue"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-glass-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-background/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 pt-14 lg:pt-0 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
