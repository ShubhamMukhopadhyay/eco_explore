import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Map, Leaf, Shield, Compass, ArrowRight, Star, Wind, Users, TrendingUp } from "lucide-react";
import heroImg from "@/assets/hero-goa.jpg";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoExplore — AI-Powered Smart Tourism for Goa" },
      { name: "description", content: "Plan smarter, greener trips with AI itineraries, live crowd intelligence and hidden gems across Goa." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Sparkles, title: "AI Itineraries", desc: "Personalized day-by-day plans tuned to your budget, vibe and pace.", tone: "primary" },
  { icon: Map, title: "Live Crowd Maps", desc: "Real-time density signals route you away from overrun beaches.", tone: "ocean" },
  { icon: Leaf, title: "Eco Score", desc: "Every trip earns a sustainability rating you can actually act on.", tone: "leaf" },
  { icon: Compass, title: "Hidden Gems", desc: "Discover quiet coves, family-run shacks and heritage you'd otherwise miss.", tone: "coral" },
  { icon: Shield, title: "Safety Layer", desc: "One-tap SOS, hospital lookup and weather alerts — always close.", tone: "primary" },
  { icon: Wind, title: "Smart Routing", desc: "Traffic-aware paths that prefer EVs, ferries and walkable lanes.", tone: "ocean" },
];

const stats = [
  { n: "12k+", l: "Trips planned" },
  { n: "240", l: "Curated spots" },
  { n: "38%", l: "Less time in traffic" },
  { n: "4.9★", l: "Traveller rating" },
];

const testimonials = [
  { name: "Priya & Arjun", trip: "5 days · Couple", quote: "It sent us to a tiny beach in Canacona we'd never have found. Best sunset of our lives." },
  { name: "The Mehta family", trip: "7 days · Family", quote: "The crowd map was magic — we hit Baga at the perfect hour and skipped every queue." },
  { name: "Lukas, solo backpacker", trip: "10 days · Solo", quote: "I followed the eco itinerary entirely by scooter and ferry. Felt good. Looked great." },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Aerial view of a Goan coast" className="size-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-32 sm:pt-28 sm:pb-40">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 glass-strong rounded-full px-3 py-1.5 text-xs font-medium">
              <span className="size-1.5 rounded-full bg-eco animate-pulse" />
              Live in Goa · Monsoon-aware AI
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-7xl leading-[1.02] tracking-tight">
              Travel <em className="not-italic text-gradient-hero">Goa</em>
              <br />the smarter, gentler way.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl">
              EcoExplore turns the chaos of a million tourists into a calm, personal trip — AI itineraries, live crowd intelligence, and hidden gems the algorithm actually means.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/planner" className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 font-medium shadow-glow hover:translate-y-[-2px] transition">
                Plan my trip with AI <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/explore" className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3.5 font-medium hover:bg-card transition">
                Explore destinations
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {stats.map((s) => (
                <div key={s.l} className="glass rounded-2xl p-4">
                  <div className="font-display text-2xl text-foreground">{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader
          eyebrow="What makes it work"
          title="An entire travel ops team, packed into your pocket."
          subtitle="Every feature is wired to the same goal: a richer trip that's easier on Goa."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group relative bg-card rounded-3xl p-7 shadow-soft hover:shadow-glow transition-all border border-border/60 hover:-translate-y-1"
            >
              <div className={`size-12 rounded-2xl grid place-items-center mb-5 ${
                f.tone === "primary" ? "bg-primary/10 text-primary" :
                f.tone === "ocean" ? "bg-ocean/15 text-ocean" :
                f.tone === "leaf" ? "bg-leaf/15 text-leaf" :
                "bg-coral/15 text-coral"
              }`}>
                <f.icon className="size-6" />
              </div>
              <h3 className="font-display text-2xl mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SPLIT */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-hero p-10 sm:p-16 shadow-glow">
          <div className="absolute -top-32 -right-32 size-96 rounded-full bg-sun/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-coral/30 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="text-primary-foreground">
              <h2 className="font-display text-4xl sm:text-5xl leading-tight">
                One prompt. A whole itinerary in 12 seconds.
              </h2>
              <p className="mt-4 text-primary-foreground/80 text-lg max-w-md">
                Tell the AI your vibe — sleepy beach, Portuguese heritage, full-throttle nightlife — and watch a tuned plan write itself.
              </p>
              <Link to="/planner" className="mt-7 inline-flex items-center gap-2 bg-card text-foreground rounded-full px-6 py-3.5 font-medium shadow-soft hover:translate-y-[-2px] transition">
                Try the AI Planner <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="glass-strong rounded-2xl p-5 text-sm text-foreground">
              <div className="flex items-center gap-2 mb-3 text-primary">
                <Sparkles className="size-4" /> <span className="font-semibold">EcoExplore AI</span>
              </div>
              <div className="space-y-3">
                <div className="bg-secondary rounded-xl p-3">"5 days, mid-budget, beaches + cafes, no parties, two adults"</div>
                <div className="bg-primary text-primary-foreground rounded-xl p-3">
                  Day 1 — Settle in Assagao, sunset at Vagator (low crowd, score 9.1). Dinner at Gunpowder.
                  <br />Day 2 — Morning ferry to Divar Island. Heritage walk + lunch at a Portuguese-era home.
                  <br />Day 3 — Hidden cove south of Palolem...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader
          eyebrow="Loved by travellers"
          title="Real trips. Real reviews."
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-3xl p-7 shadow-soft border border-border/60"
            >
              <div className="flex gap-0.5 text-sun mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} className="size-4 fill-current" />)}
              </div>
              <p className="text-foreground/90 leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 pt-5 border-t border-border">
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.trip}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* IMPACT STRIP */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Users, k: "Distributed crowds", v: "across 38 lesser-known spots" },
            { icon: TrendingUp, k: "Local businesses", v: "+62% bookings via Eco picks" },
            { icon: Leaf, k: "Carbon avoided", v: "≈ 4.2 tonnes CO₂ this season" },
          ].map((x) => (
            <div key={x.k} className="bg-secondary/60 rounded-2xl p-6 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-eco/15 text-eco grid place-items-center"><x.icon className="size-6" /></div>
              <div>
                <div className="font-medium">{x.k}</div>
                <div className="text-sm text-muted-foreground">{x.v}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
