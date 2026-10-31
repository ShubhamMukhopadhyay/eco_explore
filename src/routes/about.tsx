import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Leaf, Map, Shield } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EcoExplore" },
      { name: "description", content: "Why we built EcoExplore: smart, sustainable tourism for Goa." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-16 pb-20">
      <SectionHeader
        eyebrow="About the project"
        title="Built for a hackathon. Designed for a problem worth solving."
        subtitle="Goa welcomes 8 million visitors a year. Most go to the same five places at the same five hours. We thought AI could change that."
      />

      <div className="mt-12 prose prose-lg max-w-none">
        <p className="text-lg text-foreground/90 leading-relaxed">
          EcoExplore is a Smart Tourism platform that blends AI itinerary planning, live crowd intelligence, and a real sustainability score.
          It helps tourists discover the Goa locals love — and helps Goa breathe.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {[
          { icon: Sparkles, t: "Personalised AI", d: "Itineraries written for your budget, vibe and pace — not a template." },
          { icon: Map, t: "Crowd-aware", d: "Real-time signals route you off the beaten beach, onto the better one." },
          { icon: Leaf, t: "Sustainable", d: "An honest Eco Score with concrete ways to lift it." },
          { icon: Shield, t: "Safe by default", d: "Hospitals, alerts and an SOS layer baked into every screen." },
        ].map(x => (
          <div key={x.t} className="bg-card rounded-2xl p-5 border border-border/60 shadow-soft flex gap-4">
            <div className="size-11 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0"><x.icon className="size-5" /></div>
            <div>
              <div className="font-medium">{x.t}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{x.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-hero rounded-3xl p-10 text-primary-foreground shadow-glow text-center">
        <h3 className="font-display text-3xl">Try the AI in 12 seconds</h3>
        <p className="mt-2 opacity-90">Sign in, drop a prompt, and watch a beautiful itinerary write itself.</p>
        <Link to="/planner" className="mt-6 inline-flex bg-card text-foreground rounded-full px-6 py-3 font-medium shadow-soft">
          Open the planner
        </Link>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <p><strong>Stack:</strong> React · TanStack Start · Tailwind v4 · Framer Motion · Recharts · Gemini (optional Grok).</p>
        <p className="mt-2"><strong>Track:</strong> Smart Tourism — Revolutionize how millions experience Goa.</p>
      </div>
    </div>
  );
}
