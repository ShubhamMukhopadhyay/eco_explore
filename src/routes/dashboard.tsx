import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, Users, AlertTriangle, Leaf, TrendingUp, Calendar, Sparkles, MapPin, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Live Tourism Dashboard — EcoExplore" },
      { name: "description", content: "Real-time crowd levels, weather, alerts and sustainability across Goa." },
    ],
  }),
  component: Dashboard,
});

const crowdData = [
  { h: "06", v: 12 }, { h: "08", v: 28 }, { h: "10", v: 56 }, { h: "12", v: 78 },
  { h: "14", v: 86 }, { h: "16", v: 72 }, { h: "18", v: 64 }, { h: "20", v: 38 }, { h: "22", v: 22 },
];

const popular = [
  { name: "Baga Beach", crowd: 92, trend: "+12%" },
  { name: "Anjuna Flea Market", crowd: 74, trend: "+5%" },
  { name: "Old Goa Basilica", crowd: 41, trend: "-3%" },
  { name: "Palolem", crowd: 33, trend: "-9%" },
  { name: "Dudhsagar", crowd: 88, trend: "+18%" },
];

const events = [
  { date: "Sat", title: "Saturday Night Market", place: "Arpora", tag: "Culture" },
  { date: "Sun", title: "Heritage Walk · Fontainhas", place: "Panjim", tag: "Heritage" },
  { date: "Mon", title: "Sunset Yoga", place: "Ashvem Beach", tag: "Wellness" },
];

const alerts = [
  { tone: "coral", title: "Heavy traffic on NH66", desc: "Calangute → Baga · expect +25 min until 4pm" },
  { tone: "sun", title: "Monsoon shower at 5pm", desc: "Plan indoor stops in Panjim" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-12 pb-20">
      <SectionHeader eyebrow="Live · Updated 2 min ago" title="Goa, in real time." subtitle="The signals worth watching, all in one calm view." />

      {/* HERO STATS */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10 grid gap-5 lg:grid-cols-4">
        <Stat icon={Users} label="Tourists active now" value="48,210" delta="+6.2% vs yesterday" tone="primary" />
        <Stat icon={CloudSun} label="Weather · Panjim" value="29° clear" delta="UV 7 · humidity 72%" tone="sun" />
        <Stat icon={Leaf} label="Avg eco score" value="8.1 / 10" delta="+0.3 this week" tone="eco" />
        <Stat icon={AlertTriangle} label="Active alerts" value="2" delta="2 watchlist items" tone="coral" />
      </motion.div>

      {/* MAIN GRID */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-soft border border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-2xl">Crowd density · today</h3>
              <p className="text-sm text-foreground/70">North Goa beach belt average</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-coral/15 text-coral font-medium">Peak 14:00</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crowdData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.46 0.11 190)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.46 0.11 190)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.92 0.02 180)" vertical={false} />
                <XAxis dataKey="h" stroke="oklch(0.5 0.025 200)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.5 0.025 200)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.9 0.02 180)" }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.46 0.11 190)" strokeWidth={3} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ECO GAUGE */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-eco/15 via-card to-card rounded-3xl p-6 shadow-soft border border-border/60 flex flex-col">
          <h3 className="font-display text-2xl">Region eco score</h3>
          <p className="text-sm text-foreground/70">Sustainability index across Goa</p>
          <div className="flex-1 grid place-items-center -my-4">
            <div className="relative size-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="75%" outerRadius="100%" data={[{ name: "eco", value: 81, fill: "oklch(0.66 0.14 160)" }]} startAngle={210} endAngle={-30}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="font-display text-5xl text-eco">8.1</div>
                  <div className="text-xs text-foreground/70 mt-1">/ 10 · Healthy</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <Mini label="Air" value="Good" tone="eco" />
            <Mini label="Water" value="Fair" tone="sun" />
            <Mini label="Crowds" value="High" tone="coral" />
          </div>
        </motion.div>
      </div>

      {/* TRENDING + ALERTS */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-soft border border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-2xl">Trending spots</h3>
              <p className="text-sm text-foreground/70">Live crowd index — last 30 minutes</p>
            </div>
          </div>
          <ul className="space-y-4">
            {popular.map(p => (
              <li key={p.name} className="group">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium flex items-center gap-2"><MapPin className="size-3.5 text-foreground/70" /> {p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={p.trend.startsWith("+") ? "text-coral text-xs font-medium" : "text-eco text-xs font-medium"}>{p.trend}</span>
                    <span className="text-xs text-foreground/70 tabular-nums w-9 text-right">{p.crowd}%</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.crowd}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${p.crowd > 70 ? "bg-coral" : p.crowd > 45 ? "bg-sun" : "bg-eco"}`} />
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card rounded-3xl p-6 shadow-soft border border-border/60">
          <h3 className="font-display text-2xl mb-1 flex items-center gap-2"><AlertTriangle className="size-5 text-coral" /> Live alerts</h3>
          <p className="text-sm text-foreground/70 mb-4">Fresh signals from the field</p>
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li key={a.title} className={`rounded-2xl p-4 ${a.tone === "coral" ? "bg-coral/10" : "bg-sun/15"}`}>
                <div className="font-medium text-sm">{a.title}</div>
                <div className="text-xs text-foreground/70 mt-0.5">{a.desc}</div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* AI REC + EVENTS */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 relative overflow-hidden bg-gradient-eco rounded-3xl p-7 shadow-glow text-primary-foreground">
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-sun/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-coral/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm opacity-90"><Sparkles className="size-4" /> AI Recommendation</div>
            <h3 className="font-display text-3xl mt-3 leading-tight max-w-2xl">
              Skip Baga between 1–4pm. Try <em className="not-italic">Morjim</em> — same vibe, 38% less crowd, eco score 8.7.
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 bg-card text-foreground rounded-full px-5 py-2.5 text-sm font-medium hover:translate-y-[-2px] transition">
                Add to my plan <ArrowUpRight className="size-4" />
              </button>
              <button className="inline-flex items-center gap-2 bg-card/15 backdrop-blur rounded-full px-5 py-2.5 text-sm font-medium hover:bg-card/25 transition">
                <TrendingUp className="size-4" /> See trend
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card rounded-3xl p-6 shadow-soft border border-border/60">
          <h3 className="font-display text-2xl mb-4 flex items-center gap-2"><Calendar className="size-5 text-primary" /> Nearby events</h3>
          <ul className="space-y-3">
            {events.map(e => (
              <li key={e.title} className="flex gap-3 items-start group hover:bg-secondary/50 rounded-2xl p-2 -m-2 transition">
                <div className="size-11 rounded-xl bg-gradient-to-br from-primary/20 to-eco/20 grid place-items-center text-xs font-semibold text-primary">{e.date}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{e.title}</div>
                  <div className="text-xs text-foreground/70">{e.place} · {e.tag}</div>
                </div>
                <ArrowUpRight className="size-4 text-foreground/70 opacity-0 group-hover:opacity-100 transition" />
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delta, tone }: any) {
  const toneCls =
    tone === "primary" ? "bg-primary/10 text-primary" :
    tone === "sun" ? "bg-sun/25 text-foreground" :
    tone === "eco" ? "bg-eco/15 text-eco" :
    "bg-coral/15 text-coral";
  return (
    <div className="bg-card rounded-3xl p-5 shadow-soft border border-border/60 flex items-center gap-4 hover:shadow-glow transition group">
      <div className={`size-14 rounded-2xl grid place-items-center ${toneCls} group-hover:scale-105 transition`}><Icon className="size-7" /></div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">{label}</div>
        <div className="font-display text-2xl text-foreground truncate">{value}</div>
        <div className="text-xs text-foreground/65">{delta}</div>
      </div>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone: "eco" | "sun" | "coral" }) {
  const c = tone === "eco" ? "text-eco" : tone === "sun" ? "text-foreground" : "text-coral";
  return (
    <div className="rounded-xl bg-secondary/60 py-2">
      <div className="text-[10px] uppercase tracking-wider text-foreground/65 font-semibold">{label}</div>
      <div className={`text-sm font-semibold ${c}`}>{value}</div>
    </div>
  );
}
