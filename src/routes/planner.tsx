import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, MapPin, Sun, Utensils, Bike, Leaf, Clock, IndianRupee, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import bikeRentalImg from "@/assets/bike-rental.jpg";
import { SectionHeader } from "@/components/SectionHeader";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Trip Planner — EcoExplore" },
      { name: "description", content: "Generate a personalized, sustainable Goa itinerary in seconds." },
    ],
  }),
  component: () => <RequireAuth><Planner /></RequireAuth>,
});

type Day = { day: number; title: string; items: { time: string; icon: typeof Sun; place: string; note: string }[]; eco: number };

const sampleItinerary = (days: number, vibe: string): Day[] => {
  const base = [
    { time: "08:30", icon: Sun, place: "Sunrise at Vagator", note: "Low crowd window, perfect for photos." },
    { time: "11:00", icon: Utensils, place: "Brunch at Bean Me Up", note: "Local, plant-forward, supports neighbourhood." },
    { time: "15:00", icon: Bike, place: "Scooter to Chapora Fort", note: "Avoid taxis — eco bonus +0.4." },
    { time: "19:30", icon: Utensils, place: "Dinner at Gunpowder, Assagao", note: "Coastal South-Indian. Reserve ahead." },
  ];
  return Array.from({ length: days }).map((_, i) => ({
    day: i + 1,
    title: i === 0 ? `Settle in & ${vibe}` : i === days - 1 ? "Slow farewell" : `Explore deeper · day ${i + 1}`,
    items: base,
    eco: +(7.5 + Math.random() * 2).toFixed(1),
  }));
};

function Planner() {
  const [form, setForm] = useState({ days: 5, budget: 25000, vibe: "Beaches & cafés", group: "Couple", food: "Vegetarian" });
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<Day[] | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setTrip(null);
    setAiText(null);
    setError(null);

    const prompt = `Create a ${form.days}-day Goa itinerary.
Budget: ₹${form.budget} total (≈ ₹${Math.round(form.budget / form.days)}/day)
Vibe: ${form.vibe}
Group: ${form.group}
Food preference: ${form.food}

Return ONLY a JSON array (no markdown, no code fences) with this exact shape:
[
  {
    "day": 1,
    "title": "Short day title",
    "items": [
      { "time": "09:00", "place": "Place name", "note": "1-sentence practical tip" },
      { "time": "12:30", "place": "Lunch spot", "note": "Why this place" },
      { "time": "16:00", "place": "Afternoon spot", "note": "Crowd tip" },
      { "time": "19:30", "place": "Dinner spot", "note": "Reservation note" }
    ],
    "eco": 8.2
  }
]
Include ${form.days} days. Eco score 1–10. Use real Goa place names. Prioritise low-crowd, eco-friendly spots aligned with the vibe.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "AI error"); setLoading(false); return; }

      const reply: string = data.reply ?? "";
      // Try to parse JSON from the AI response
      const jsonMatch = reply.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          // Map parsed data, injecting icon refs from known types
          const days: Day[] = parsed.map((d: any) => ({
            day: d.day,
            title: d.title,
            eco: typeof d.eco === "number" ? d.eco : 8.0,
            items: (d.items ?? []).map((it: any, idx: number) => ({
              time: it.time ?? "",
              place: it.place ?? "",
              note: it.note ?? "",
              icon: [Sun, Utensils, Bike, MapPin][idx % 4],
            })),
          }));
          setTrip(days);
        } catch {
          // Fallback: show raw AI text
          setAiText(reply);
        }
      } else {
        setAiText(reply);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-12 pb-24">
      <SectionHeader
        eyebrow="AI Planner"
        title="Your trip, written by an AI that respects Goa."
        subtitle="Tell us how you travel. We'll write a balanced day-by-day plan in seconds."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* FORM */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-soft border border-border/60 h-fit lg:sticky lg:top-28">
          <div className="space-y-5">
            <Field label="Days">
              <input type="range" min={2} max={14} value={form.days}
                onChange={e => setForm({ ...form, days: +e.target.value })}
                className="w-full accent-primary" />
              <div className="text-sm text-muted-foreground mt-1">{form.days} days</div>
            </Field>

            <Field label="Budget (₹ total)">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">₹</span>
                <input
                  type="number"
                  min={0}
                  step={500}
                  inputMode="numeric"
                  value={form.budget}
                  onChange={e => setForm({ ...form, budget: Math.max(0, +e.target.value || 0) })}
                  placeholder="25000"
                  className="w-full rounded-full bg-secondary/60 border border-border pl-8 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card transition tabular-nums"
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">
                ≈ ₹{Math.round(form.budget / Math.max(1, form.days)).toLocaleString("en-IN")} / day
              </div>
            </Field>

            <Field label="Vibe">
              <Pills value={form.vibe} onChange={v => setForm({ ...form, vibe: v })} options={["Beaches & cafés", "Heritage", "Nature", "Nightlife", "Wellness"]} />
            </Field>

            <Field label="Group">
              <Pills value={form.group} onChange={v => setForm({ ...form, group: v })} options={["Solo", "Couple", "Family", "Friends"]} />
            </Field>

            <Field label="Food">
              <Pills value={form.food} onChange={v => setForm({ ...form, food: v })} options={["Anything", "Vegetarian", "Vegan", "Seafood"]} />
            </Field>

            <button onClick={generate} disabled={loading}
              className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground py-3.5 font-medium shadow-glow hover:translate-y-[-1px] transition disabled:opacity-60">
              {loading ? <><Loader2 className="size-4 animate-spin" /> Composing…</> : <><Sparkles className="size-4" /> Generate itinerary</>}
            </button>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="space-y-5">
          <AnimatePresence mode="wait">
            {!trip && !loading && !aiText && !error && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-secondary/50 rounded-3xl p-12 text-center border border-dashed border-border">
                <Sparkles className="size-8 mx-auto text-primary mb-3" />
                <p className="text-muted-foreground">Your AI-crafted plan will appear here.</p>
              </motion.div>
            )}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-card rounded-3xl p-12 text-center shadow-soft">
                <Loader2 className="size-8 mx-auto text-primary animate-spin mb-3" />
                <p>Routing through 240 spots, 12 weather signals, your vibe…</p>
                <p className="text-xs text-muted-foreground mt-2">Powered by Gemini AI · ~10 seconds</p>
              </motion.div>
            )}
            {error && !loading && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-destructive/10 border border-destructive/30 rounded-3xl p-8 text-center">
                <p className="text-destructive font-medium">{error}</p>
                <p className="text-sm text-muted-foreground mt-1">Check that the AI API key is configured, then try again.</p>
              </motion.div>
            )}
            {aiText && !loading && (
              <motion.div key="aitext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-card rounded-3xl p-8 shadow-soft border border-border/60">
                <div className="flex items-center gap-2 text-primary mb-4 text-sm font-semibold">
                  <Sparkles className="size-4" /> AI Itinerary
                </div>
                <pre className="whitespace-pre-wrap text-sm text-foreground/85 leading-relaxed font-sans">{aiText}</pre>
              </motion.div>
            )}
            {trip && !loading && trip.map((d, i) => (
              <motion.div key={d.day} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="relative bg-card rounded-3xl shadow-soft border border-border/60 overflow-hidden hover:shadow-glow transition-all">
                {/* Decorative gradient header */}
                <div className="relative bg-gradient-to-br from-primary/12 via-eco/10 to-sun/15 px-6 sm:px-7 pt-6 pb-5 border-b border-border/60">
                  <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-eco text-primary-foreground grid place-items-center shadow-glow shrink-0">
                        <div className="text-center leading-tight">
                          <div className="text-[9px] uppercase tracking-widest opacity-80">Day</div>
                          <div className="font-display text-xl">{d.day}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl text-foreground leading-tight">{d.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{d.items.length} stops · curated by AI</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-card/80 backdrop-blur text-eco rounded-full px-3 py-1.5 text-sm font-semibold shadow-soft border border-eco/20 shrink-0">
                      <Leaf className="size-3.5" /> {d.eco}
                    </span>
                  </div>
                </div>
                <ol className="p-6 sm:p-7 space-y-1">
                  {d.items.map((it, j) => (
                    <li key={j} className="flex gap-4 group relative">
                      <div className="text-xs font-semibold text-primary w-14 pt-3 tabular-nums shrink-0">{it.time}</div>
                      <div className="relative flex flex-col items-center shrink-0">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-secondary to-accent grid place-items-center text-primary shadow-soft group-hover:scale-110 group-hover:shadow-glow transition">
                          <it.icon className="size-4" />
                        </div>
                        {j < d.items.length - 1 && (
                          <div className="w-px flex-1 bg-gradient-to-b from-border to-transparent my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-5 pt-2">
                        <div className="font-medium text-foreground flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-primary" />{it.place}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{it.note}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <BikeRentalSection />
    </div>
  );
}

const bikes = [
  { name: "City Cruiser", desc: "Comfy upright ride for beach roads & cafés.", tag: "Most popular" },
  { name: "Mountain Hybrid", desc: "Geared & sturdy for hills like Chapora & Divar Island.", tag: "All-terrain" },
  { name: "E-Bike Pedal Assist", desc: "Effortless long rides — perfect for South Goa coastlines.", tag: "Electric" },
];

const plans = [
  { label: "Hourly", price: 50, unit: "/ hour", note: "Min. 2 hours" },
  { label: "Half Day", price: 250, unit: "/ 5 hrs", note: "Helmet + lock included", featured: true },
  { label: "Full Day", price: 450, unit: "/ 24 hrs", note: "Free delivery to your stay" },
];

const benefits = [
  "Zero emissions — keep Goa's air & beaches clean",
  "Reach hidden lanes cars can't squeeze into",
  "Skip traffic, park anywhere, save on fuel",
  "Burn calories while you sightsee — guilt-free feni later",
];

function BikeRentalSection() {
  return (
    <section className="mt-24">
      <SectionHeader
        eyebrow="Rent a Bike"
        title="Pedal through Goa, the slow & sustainable way."
        subtitle="Skip the scooter rush. Rent a bicycle by the hour or day and discover beaches, banyan-lined lanes, and quiet villages on two wheels."
      />

      <div className="mt-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 items-stretch">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-soft border border-border/60 min-h-[380px] group"
        >
          <img src={bikeRentalImg} alt="Bicycles parked on a Goa coastal road at sunset" loading="lazy" width={1280} height={768}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-7 text-primary-foreground">
            <span className="inline-flex items-center gap-1.5 bg-eco/90 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold w-fit">
              <Leaf className="size-3.5" /> Eco bonus +1.2
            </span>
            <h3 className="font-display text-3xl mt-3 leading-tight">Two wheels.<br/>Zero carbon.</h3>
            <p className="text-sm text-primary-foreground/85 mt-2 max-w-md">Local rentals, helmets, locks & a pocket map of safe cycling routes — delivered free to your doorstep.</p>
            <button className="mt-5 inline-flex items-center gap-2 bg-card text-foreground rounded-full px-5 py-2.5 text-sm font-medium w-fit hover:translate-y-[-2px] transition shadow-glow">
              <Bike className="size-4" /> Book a bike <ArrowRight className="size-4" />
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
          {plans.map((p, i) => (
            <motion.div key={p.label}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl p-5 border transition hover:shadow-glow ${
                p.featured ? "bg-gradient-to-br from-primary to-eco text-primary-foreground border-transparent shadow-glow" : "bg-card border-border/60"
              }`}>
              {p.featured && <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-card/20 backdrop-blur px-2 py-0.5 rounded-full">Best value</span>}
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80"><Clock className="size-3.5" /> {p.label}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <IndianRupee className="size-5 opacity-80" />
                <span className="font-display text-4xl tabular-nums">{p.price}</span>
                <span className="text-xs opacity-75">{p.unit}</span>
              </div>
              <p className={`text-xs mt-2 ${p.featured ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{p.note}</p>
              <button className={`mt-4 w-full rounded-full py-2 text-sm font-medium transition ${
                p.featured ? "bg-card text-foreground hover:opacity-95" : "bg-secondary hover:bg-accent"
              }`}>Book now</button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bike types & benefits */}
      <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {bikes.map((b, i) => (
            <motion.div key={b.name}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-5 border border-border/60 shadow-soft hover:shadow-glow hover:-translate-y-1 transition">
              <div className="size-10 rounded-xl bg-gradient-to-br from-secondary to-accent grid place-items-center text-primary"><Bike className="size-5" /></div>
              <div className="mt-3 text-[10px] uppercase tracking-widest text-primary font-semibold">{b.tag}</div>
              <div className="font-display text-lg mt-0.5">{b.name}</div>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-eco/10 via-primary/10 to-sun/10 rounded-2xl p-6 border border-border/60">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-eco font-semibold"><Leaf className="size-4" /> Why pedal?</div>
          <h4 className="font-display text-2xl mt-2 leading-snug">Travel light. Travel kind.</h4>
          <ul className="mt-4 space-y-2.5">
            {benefits.map(b => (
              <li key={b} className="flex gap-2.5 text-sm text-foreground/85">
                <CheckCircle2 className="size-4 text-eco mt-0.5 shrink-0" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Pills({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-3.5 py-1.5 rounded-full text-sm transition ${
            value === o ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary hover:bg-accent"
          }`}>{o}</button>
      ))}
    </div>
  );
}
