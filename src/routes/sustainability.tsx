import { createFileRoute } from "@tanstack/react-router";
import { Leaf, TreePine, Bike, HeartHandshake, TrendingUp, Award, Sparkles } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Eco Score — EcoExplore" },
      { name: "description", content: "See your trip's sustainability score and how to improve it." },
    ],
  }),
  component: Sustainability,
});

const breakdown = [
  { name: "Transport", value: 32, color: "oklch(0.46 0.11 190)" },
  { name: "Stay", value: 24, color: "oklch(0.62 0.14 150)" },
  { name: "Food", value: 22, color: "oklch(0.82 0.15 80)" },
  { name: "Activities", value: 22, color: "oklch(0.72 0.18 35)" },
];

const tips = [
  { icon: Bike, title: "Swap one taxi for a scooter", impact: "+0.6 score · −2.4 kg CO₂", tone: "primary" },
  { icon: TreePine, title: "Stay one extra night in a homestay", impact: "+0.4 score · supports local family", tone: "eco" },
  { icon: HeartHandshake, title: "Eat at 2 family-run shacks", impact: "+0.3 score · keeps money in Goa", tone: "coral" },
];

const milestones = [
  { label: "CO₂ saved", v: "−14 kg", icon: Leaf },
  { label: "Local spend", v: "62%", icon: HeartHandshake },
  { label: "Crowd impact", v: "Low", icon: TrendingUp },
];

function Sustainability() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-12 pb-20">
      <SectionHeader eyebrow="Eco Score" title="Travel that gives back, measurably." subtitle="Every itinerary gets a single, honest number — and concrete ways to raise it." />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* HERO SCORE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-eco rounded-3xl p-8 sm:p-10 text-primary-foreground shadow-glow"
        >
          <div className="absolute -top-32 -right-32 size-96 rounded-full bg-sun/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-coral/25 blur-3xl" />
          {/* Subtle orbital rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[140%] rounded-full border border-primary-foreground/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[110%] rounded-full border border-primary-foreground/15 pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="text-sm uppercase tracking-widest opacity-90 flex items-center gap-2">
                <Leaf className="size-4" /> Your trip
              </div>
              <div className="inline-flex items-center gap-1.5 bg-card/15 backdrop-blur rounded-full px-3 py-1 text-xs font-medium">
                <Award className="size-3.5" /> Top 22%
              </div>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <motion.span
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
                className="font-display text-[7rem] sm:text-[8.5rem] leading-[0.85] tracking-tight"
              >8.4</motion.span>
              <span className="opacity-90 mb-4 text-lg">/ 10</span>
            </div>

            {/* Score progress bar */}
            <div className="mt-4 h-2 rounded-full bg-card/15 overflow-hidden max-w-md">
              <motion.div
                initial={{ width: 0 }} animate={{ width: "84%" }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-sun via-card to-card/80"
              />
            </div>

            <p className="mt-5 max-w-md opacity-95 leading-relaxed">
              Better than 78% of trips of similar length. You're avoiding the 3 most-crowded hours and using ferries on day 4. Nice.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-3 max-w-md">
              {milestones.map(s => (
                <div key={s.label} className="bg-card/15 backdrop-blur rounded-2xl p-3.5 text-center hover:bg-card/25 transition group">
                  <s.icon className="size-4 mx-auto opacity-80 mb-1.5 group-hover:scale-110 transition" />
                  <div className="font-display text-xl">{s.v}</div>
                  <div className="text-[11px] opacity-85 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* BREAKDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 sm:p-7 shadow-soft border border-border/60"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-2xl">Where your impact comes from</h3>
              <p className="text-sm text-muted-foreground mt-1">Breakdown across your 5-day plan</p>
            </div>
            <Sparkles className="size-5 text-primary" />
          </div>
          <div className="mt-6 grid grid-cols-[1fr_1.2fr] items-center gap-4">
            <div className="relative h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} dataKey="value" innerRadius={55} outerRadius={88} paddingAngle={4} stroke="none">
                    {breakdown.map(b => <Cell key={b.name} fill={b.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="text-center">
                  <div className="font-display text-3xl text-foreground">100%</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">balanced</div>
                </div>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm">
              {breakdown.map(b => (
                <li key={b.name} className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-secondary/60 transition">
                  <span className="size-3 rounded-full shrink-0" style={{ background: b.color }} />
                  <span className="flex-1 font-medium text-foreground">{b.name}</span>
                  <span className="text-foreground/70 tabular-nums">{b.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* TIPS */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mt-6 bg-card rounded-3xl p-6 sm:p-8 shadow-soft border border-border/60"
      >
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-display text-2xl">Lift your score in 3 small moves</h3>
            <p className="text-muted-foreground text-sm mt-1">Each suggestion is doable today. We've already checked the logistics.</p>
          </div>
          <div className="text-xs font-semibold text-eco bg-eco/10 px-3 py-1.5 rounded-full">Potential: 8.4 → 9.7</div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {tips.map((t, i) => {
            const toneCls =
              t.tone === "primary" ? "from-primary/15 to-primary/0 text-primary" :
              t.tone === "eco" ? "from-eco/15 to-eco/0 text-eco" :
              "from-coral/15 to-coral/0 text-coral";
            return (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border border-border bg-gradient-to-br ${toneCls} p-5 hover:border-primary/40 hover:-translate-y-1 hover:shadow-glow transition-all overflow-hidden`}
              >
                <div className="size-12 rounded-xl bg-card grid place-items-center mb-3 shadow-soft">
                  <t.icon className="size-5" />
                </div>
                <div className="font-medium text-foreground leading-snug">{t.title}</div>
                <div className="text-xs mt-2 font-semibold">{t.impact}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
