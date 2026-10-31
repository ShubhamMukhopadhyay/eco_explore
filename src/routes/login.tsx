import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

type Search = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — EcoExplore" },
      { name: "description", content: "Sign in to plan smarter, greener trips across Goa." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: (redirect as never) ?? "/" });
  }, [user, authLoading, navigate, redirect]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
            data: { full_name: name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true); setErr(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: typeof window !== "undefined" ? window.location.origin + "/login" : undefined,
    });
    if (result.error) { setErr((result.error as Error).message ?? "Google sign-in failed"); setBusy(false); return; }
    if (result.redirected) return;
  };

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-eco text-primary-foreground p-12 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-sun/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-coral/30 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2">
          <div className="size-9 rounded-xl bg-card/20 backdrop-blur grid place-items-center"><Leaf className="size-5" /></div>
          <span className="font-display text-xl">EcoExplore</span>
        </Link>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-card/15 backdrop-blur rounded-full px-3 py-1.5 text-xs">
            <Sparkles className="size-3.5" /> AI-powered Smart Tourism
          </div>
          <h2 className="font-display text-5xl mt-5 leading-tight">Sign in to plan a smarter, greener Goa.</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">Save itineraries, track your eco score, and unlock the AI assistant that knows every quiet beach.</p>
        </div>
        <div className="relative text-sm text-primary-foreground/70">© {new Date().getFullYear()} EcoExplore</div>
      </div>

      <div className="grid place-items-center px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-eco grid place-items-center"><Leaf className="size-5 text-primary-foreground" /></div>
            <span className="font-display text-xl">EcoExplore</span>
          </div>

          <h1 className="font-display text-3xl">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {mode === "signin" ? "Sign in to continue your trip." : "Start planning your perfect Goa escape."}
          </p>

          <form onSubmit={handleEmail} className="mt-7 space-y-3">
            {mode === "signup" && (
              <Input icon={<Sparkles className="size-4" />} type="text" placeholder="Full name" value={name} onChange={setName} />
            )}
            <Input icon={<Mail className="size-4" />} type="email" placeholder="you@email.com" value={email} onChange={setEmail} required />
            <Input icon={<Lock className="size-4" />} type="password" placeholder="Password (min 6 chars)" value={password} onChange={setPassword} required minLength={6} />

            {err && <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{err}</div>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-medium shadow-glow hover:opacity-95 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-background px-3">or continue with</span></div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background py-3 text-sm font-medium hover:bg-accent transition disabled:opacity-60"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            {mode === "signin" ? "New here? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); }} className="text-primary font-medium hover:underline">
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Input({ icon, value, onChange, ...rest }: any) {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-3 grid place-items-center text-muted-foreground">{icon}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        {...rest}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.42-1.7 4.18-5.5 4.18-3.31 0-6.01-2.74-6.01-6.13S8.69 6.02 12 6.02c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.83 3.46 14.62 2.5 12 2.5 6.99 2.5 2.94 6.55 2.94 11.55S6.99 20.6 12 20.6c6.93 0 8.99-4.86 8.99-8.41 0-.57-.06-1-.14-1.99H12z"/></svg>
  );
}
