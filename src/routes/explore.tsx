import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, X, Leaf, Users, Clock, Bike } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import beach from "@/assets/gem-beach.jpg";
import beach2 from "@/assets/gem-beach2.jpg";
import beach3 from "@/assets/gem-beach3.jpg";
import cafe from "@/assets/gem-cafe.jpg";
import heritage from "@/assets/gem-heritage.jpg";
import heritage2 from "@/assets/gem-heritage2.jpg";
import waterfall from "@/assets/gem-waterfall.jpg";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Goa — EcoExplore" },
      { name: "description", content: "Browse curated destinations across North and South Goa with crowd, vibe and eco signals." },
    ],
  }),
  component: Explore,
});

const tags = ["All", "Beaches", "Heritage", "Nature", "Food", "Nightlife", "Wellness"];

type Place = {
  name: string; region: string; img: string; tag: string;
  crowd: "Low" | "Medium" | "High"; eco: number; rating: number; blurb: string;
  about: string; hours: string; bestTime: string; tips: string[];
};

const places: Place[] = [
  { name: "Palolem Beach", region: "South Goa", img: beach, tag: "Beaches", crowd: "Low", eco: 8.4, rating: 4.8,
    blurb: "Crescent of soft sand, calm enough to swim.",
    about: "Palolem is a kilometre-long crescent of golden sand framed by gentle headlands in South Goa. The shallow, calm bay is perfect for swimming, kayaking and sunset dolphin spotting. Beach huts line the shore and the food scene is laid-back and seafood-forward.",
    hours: "Open 24h · best 6am–7pm", bestTime: "Nov – Feb · early mornings",
    tips: ["Rent a kayak from the south end", "Try silent disco at LIV", "Avoid weekends if you want quiet"] },
  { name: "Old Goa Churches", region: "Tiswadi", img: heritage, tag: "Heritage", crowd: "Medium", eco: 9.1, rating: 4.7,
    blurb: "UNESCO-listed Portuguese-era basilicas.",
    about: "The former capital of Portuguese India is now a quiet cluster of grand 16th-century churches and convents, including the Basilica of Bom Jesus that holds the relics of St. Francis Xavier. A UNESCO World Heritage Site that feels like stepping into a Lisbon that never was.",
    hours: "9am – 6:30pm", bestTime: "Weekday mornings",
    tips: ["Dress modestly", "Combine with Se Cathedral", "Hire a local guide for context"] },
  { name: "Dudhsagar Falls", region: "Mollem", img: waterfall, tag: "Nature", crowd: "High", eco: 7.2, rating: 4.6,
    blurb: "India's tallest tiered waterfall in deep jungle.",
    about: "A 310-metre four-tier cascade thundering through the Western Ghats. Reached by jeep through Bhagwan Mahaveer Sanctuary or by trekking along the railway line — both unforgettable in monsoon.",
    hours: "Jeep tours 7am – 4pm", bestTime: "Jun – Oct (full flow)",
    tips: ["Book jeep tickets early", "Wear shoes you don't mind soaking", "Carry cash — no signal inside"] },
  { name: "Assagao Cafés", region: "North Goa", img: cafe, tag: "Food", crowd: "Medium", eco: 8.9, rating: 4.9,
    blurb: "Bohemian eateries hidden in leafy lanes.",
    about: "Assagao is Goa's culinary heart — Portuguese villas turned into farm-to-table restaurants, sourdough bakeries and natural-wine bars hidden behind bougainvillea-covered walls.",
    hours: "Most cafés 9am – 11pm", bestTime: "Sunset & late dinner",
    tips: ["Reserve Gunpowder & Bomras ahead", "Scoot, don't taxi", "Sundays are quiet & lovely"] },
  { name: "Butterfly Beach", region: "Canacona", img: beach2, tag: "Beaches", crowd: "Low", eco: 9.4, rating: 4.7,
    blurb: "Reachable only by boat — quiet, magical.",
    about: "A tiny semicircular cove tucked between forested cliffs, accessible only by a 20-minute boat ride from Palolem or a short jungle trek. Crystal water, dolphins on the way, and almost no crowd.",
    hours: "Boats 8am – 5pm", bestTime: "Oct – Mar mornings",
    tips: ["Negotiate boat fare in groups", "Carry water — no shacks", "Watch for butterflies on the cliffs"] },
  { name: "Fontainhas Quarter", region: "Panjim", img: heritage2, tag: "Heritage", crowd: "Low", eco: 9.0, rating: 4.8,
    blurb: "Latin Quarter of pastel houses and azulejos.",
    about: "A walkable warren of yellow, blue and ochre Portuguese houses, hand-painted street tiles, tiny chapels and corner bakeries. The closest thing to old Lisbon in India.",
    hours: "Open · best 7am – 6pm", bestTime: "Early morning light",
    tips: ["Start at Maruti Temple steps", "Stop at Confeitaria 31 de Janeiro", "Walk slowly — that's the point"] },
];

function Explore() {
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Place | null>(null);
  const filtered = places.filter(p =>
    (active === "All" || p.tag === active) &&
    (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-12 pb-20">
      <SectionHeader
        eyebrow="Explore"
        title="Goa, mapped by mood — not just postcards."
        subtitle="Filter by vibe, see real-time crowd levels and pick what fits your day."
      />

      <div className="mt-10 flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1 glass rounded-full px-5 py-3 flex items-center gap-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search beaches, cafés, heritage…"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <Link
          to="/rentals"
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 bg-gradient-eco text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition whitespace-nowrap"
        >
          <Bike className="size-4" /> Book a bike
        </Link>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                active === t ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.button
            key={p.name + i}
            onClick={() => setOpen(p)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="text-left group bg-card rounded-3xl overflow-hidden shadow-soft border border-border/60 hover:shadow-glow hover:-translate-y-1 transition-all"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={p.img} alt={p.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  p.crowd === "Low" ? "bg-eco text-primary-foreground" :
                  p.crowd === "Medium" ? "bg-sun text-foreground" :
                  "bg-coral text-coral-foreground"
                }`}>{p.crowd} crowd</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium glass-strong">Eco {p.eco}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl">{p.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="size-3" />{p.region}</p>
                </div>
                <div className="flex items-center gap-1 text-sm"><Star className="size-4 fill-sun text-sun" />{p.rating}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.blurb}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="bg-card text-card-foreground rounded-3xl overflow-hidden max-w-2xl w-full shadow-glow border border-border/60 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9]">
                <img src={open.img} alt={open.name} className="size-full object-cover" />
                <button
                  onClick={() => setOpen(null)}
                  className="absolute top-4 right-4 size-10 rounded-full bg-card/90 backdrop-blur grid place-items-center hover:bg-card transition"
                  aria-label="Close"
                ><X className="size-5" /></button>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    open.crowd === "Low" ? "bg-eco text-primary-foreground" :
                    open.crowd === "Medium" ? "bg-sun text-foreground" :
                    "bg-coral text-coral-foreground"
                  }`}>{open.crowd} crowd</span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-card/90 backdrop-blur flex items-center gap-1">
                    <Leaf className="size-3 text-eco" /> Eco {open.eco}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl">{open.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="size-3.5" />{open.region}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium"><Star className="size-4 fill-sun text-sun" />{open.rating}</div>
                </div>
                <p className="mt-4 text-foreground/85 leading-relaxed">{open.about}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-secondary/60 p-4">
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="size-3.5" /> Hours</div>
                    <div className="text-sm font-medium mt-1">{open.hours}</div>
                  </div>
                  <div className="rounded-2xl bg-secondary/60 p-4">
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Users className="size-3.5" /> Best time</div>
                    <div className="text-sm font-medium mt-1">{open.bestTime}</div>
                  </div>
                </div>
                <div className="mt-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Local tips</h4>
                  <ul className="space-y-1.5">
                    {open.tips.map(t => (
                      <li key={t} className="text-sm text-foreground/80 flex gap-2"><span className="text-primary">•</span>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
