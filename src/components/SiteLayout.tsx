import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Leaf, Menu, X, MessageCircle, LogOut, User as UserIcon, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";

const nav = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/planner", label: "AI Planner" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/maps", label: "Smart Maps" },
  { to: "/gems", label: "Hidden Gems" },
  { to: "/sustainability", label: "Eco Score" },
  { to: "/about", label: "About" },
] as const;

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
  });

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  return { dark, toggle };
}

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { dark, toggle: toggleDark } = useDarkMode();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 px-4">
        <div className="mx-auto max-w-7xl glass-strong rounded-2xl shadow-soft px-4 sm:px-6 py-3 flex items-center justify-between relative z-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-9 rounded-xl bg-gradient-eco grid place-items-center shadow-glow">
              <Leaf className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl tracking-tight">Eco<span className="text-primary">Explore</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  preload="intent"
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="hidden sm:grid size-9 rounded-full bg-secondary hover:bg-accent place-items-center transition"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              to="/assistant"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-coral text-coral-foreground px-4 py-2 text-sm font-medium shadow-coral hover:opacity-90 transition"
            >
              <MessageCircle className="size-4" /> Ask AI
            </Link>
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="size-9 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-semibold uppercase" title={user.email ?? ""}>
                  {(user.user_metadata?.full_name || user.email || "U").slice(0, 1)}
                </div>
                <button onClick={handleSignOut} title="Sign out" className="size-9 rounded-full bg-secondary hover:bg-accent grid place-items-center">
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition">
                <UserIcon className="size-4" /> Sign in
              </Link>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden size-10 grid place-items-center rounded-xl bg-accent"
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mx-auto max-w-7xl mt-2 glass-strong rounded-2xl p-3 shadow-soft relative z-10">
            <div className="flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  preload="intent"
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm ${
                    pathname === n.to ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/assistant"
                onClick={() => setOpen(false)}
                className="mt-1 px-4 py-2.5 rounded-xl text-sm bg-coral text-coral-foreground text-center"
              >
                Ask the AI Assistant
              </Link>
              {user ? (
                <button onClick={() => { handleSignOut(); setOpen(false); }} className="mt-1 px-4 py-2.5 rounded-xl text-sm bg-secondary text-left">
                  Sign out ({user.email})
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="mt-1 px-4 py-2.5 rounded-xl text-sm border border-border text-center">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
        <Toaster richColors position="bottom-right" />
      </main>

      <footer className="mt-24 border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="size-8 rounded-lg bg-gradient-eco grid place-items-center">
                <Leaf className="size-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg">EcoExplore</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered, sustainability-first travel built for the next generation of Goa.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Discover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/explore" className="hover:text-foreground">Destinations</Link></li>
              <li><Link to="/gems" className="hover:text-foreground">Hidden Gems</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground">Live Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/planner" className="hover:text-foreground">AI Trip Planner</Link></li>
              <li><Link to="/sustainability" className="hover:text-foreground">Eco Score</Link></li>
              <li><Link to="/assistant" className="hover:text-foreground">AI Assistant</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/about" hash="privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link to="/about" hash="contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EcoExplore — Travel smarter, tread lighter.
        </div>
      </footer>
    </div>
  );
}
