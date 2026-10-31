import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bike, Clock, IndianRupee, CheckCircle2, Leaf, MapPin, Phone, Mail, User, ArrowLeft, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { toast } from "sonner";
import bikeRentalImg from "@/assets/bike-rental.jpg";

export const Route = createFileRoute("/rentals")({
  head: () => ({
    meta: [
      { title: "Bike Rentals — EcoExplore" },
      { name: "description", content: "Rent a bicycle in Goa by the hour, half-day or full-day. Eco-friendly and easy booking." },
    ],
  }),
  component: RentalsPage,
});

const BIKES = [
  { id: "city",     name: "City Cruiser",      desc: "Comfy upright frame, perfect for cafés & beaches.", price: 50 },
  { id: "mountain", name: "Mountain Hybrid",   desc: "Sturdy tyres for hills, forts and trails.",         price: 80 },
  { id: "ebike",    name: "E-Bike Pedal-Assist", desc: "Effortless range, ideal for longer South Goa loops.", price: 150 },
];

const PLANS = [
  { id: "hour",   label: "Hourly",    hours: 1,  multiplier: 1,    note: "Min 2 hours" },
  { id: "half",   label: "Half Day",  hours: 5,  multiplier: 4.2,  note: "Helmet + lock included" },
  { id: "full",   label: "Full Day",  hours: 24, multiplier: 7.5,  note: "Free delivery in North Goa" },
];

const PICKUPS = ["Anjuna", "Vagator", "Assagao", "Panjim", "Palolem", "Morjim"];

function RentalsPage() {
  const [bikeId, setBikeId] = useState("city");
  const [planId, setPlanId] = useState("half");
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState("");
  const [pickup, setPickup] = useState(PICKUPS[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState<null | { ref: string; total: number }>(null);

  const bike = BIKES.find(b => b.id === bikeId)!;
  const plan = PLANS.find(p => p.id === planId)!;
  const total = useMemo(() => Math.round(bike.price * plan.multiplier * qty), [bike, plan, qty]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) {
      toast.error("Please fill name, phone and pickup date.");
      return;
    }
    const ref = "EX-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setConfirmed({ ref, total });
    toast.success(`Booking confirmed · ${ref}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-12 pb-20">
      <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-4">
        <ArrowLeft className="size-4" /> Back
      </Link>

      <SectionHeader
        eyebrow="Bike Rentals"
        title="Pedal Goa, the slow-travel way."
        subtitle="Pick a bike, choose your hours and we'll meet you at the pickup point. Eco-bonus added to your trip score."
      />

      <div className="mt-10 relative overflow-hidden rounded-3xl shadow-glow border border-border/60">
        <img src={bikeRentalImg} alt="Bicycles by the Goa coast" className="w-full h-64 sm:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-foreground/70 via-foreground/30 to-transparent" />
        <div className="absolute inset-0 p-8 flex flex-col justify-end text-background">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-90"><Leaf className="size-3.5" /> Zero-emission travel</div>
          <h2 className="font-display text-3xl sm:text-4xl mt-2 max-w-xl">From ₹50/hour. Helmets, locks & maps included.</h2>
        </div>
      </div>

      {confirmed ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mt-10 bg-card border border-border/60 rounded-3xl p-8 sm:p-12 text-center shadow-soft"
        >
          <div className="size-16 mx-auto rounded-full bg-eco/15 grid place-items-center">
            <CheckCircle2 className="size-8 text-eco" />
          </div>
          <h3 className="font-display text-3xl mt-5">You're booked!</h3>
          <p className="text-muted-foreground mt-2">Confirmation reference <span className="font-mono font-semibold text-foreground">{confirmed.ref}</span></p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
            <Detail label="Bike" value={`${bike.name} × ${qty}`} />
            <Detail label="Plan" value={`${plan.label} (${plan.hours}h)`} />
            <Detail label="Pickup" value={`${pickup} · ${date}`} />
            <Detail label="Total" value={`₹${confirmed.total}`} />
          </div>
          <p className="text-sm text-muted-foreground mt-6">A WhatsApp confirmation will reach you on {phone} shortly.</p>
          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <button onClick={() => setConfirmed(null)} className="px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-accent transition">Book another</button>
            <Link to="/maps" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm shadow-soft hover:opacity-90 transition">Plan your ride</Link>
          </div>
        </motion.div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Selection */}
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-xl mb-3">Choose your bike</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {BIKES.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBikeId(b.id)}
                    className={`text-left p-4 rounded-2xl border transition ${
                      bikeId === b.id ? "border-primary bg-primary/5 shadow-soft" : "border-border/60 bg-card hover:border-primary/40"
                    }`}
                  >
                    <Bike className="size-5 text-primary" />
                    <div className="font-medium mt-2">{b.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{b.desc}</div>
                    <div className="text-sm mt-2 flex items-center gap-0.5"><IndianRupee className="size-3.5" />{b.price}<span className="text-muted-foreground">/hr</span></div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl mb-3">Rental duration</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {PLANS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlanId(p.id)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      planId === p.id ? "border-primary bg-primary/5 shadow-soft" : "border-border/60 bg-card hover:border-primary/40"
                    }`}
                  >
                    <Clock className="size-5 text-primary" />
                    <div className="font-medium mt-2">{p.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{p.hours}h · {p.note}</div>
                    <div className="text-sm mt-2 flex items-center gap-0.5"><IndianRupee className="size-3.5" />{Math.round(bike.price * p.multiplier)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h4 className="font-display text-lg mb-2 flex items-center gap-2"><Leaf className="size-4 text-eco" /> Why pedal?</h4>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-foreground/80">
                <li className="flex gap-2"><span className="text-eco">•</span> Zero emissions, +0.6 to your eco-score</li>
                <li className="flex gap-2"><span className="text-eco">•</span> Skip traffic on Goa's lanes</li>
                <li className="flex gap-2"><span className="text-eco">•</span> Park anywhere, explore everywhere</li>
                <li className="flex gap-2"><span className="text-eco">•</span> Discover hidden cafés & viewpoints</li>
              </ul>
            </div>
          </div>

          {/* Booking form */}
          <form onSubmit={submit} className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft h-fit lg:sticky lg:top-24">
            <h3 className="font-display text-xl">Booking details</h3>

            <Field icon={User} label="Full name">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Riya Sharma" className="bg-transparent outline-none flex-1 text-sm" />
            </Field>
            <Field icon={Phone} label="Phone">
              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+91 ..." className="bg-transparent outline-none flex-1 text-sm" />
            </Field>
            <Field icon={Mail} label="Email (optional)">
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="bg-transparent outline-none flex-1 text-sm" />
            </Field>
            <Field icon={Calendar} label="Pickup date">
              <input value={date} onChange={e => setDate(e.target.value)} type="date" className="bg-transparent outline-none flex-1 text-sm" />
            </Field>
            <Field icon={MapPin} label="Pickup point">
              <select value={pickup} onChange={e => setPickup(e.target.value)} className="bg-transparent outline-none flex-1 text-sm">
                {PICKUPS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field icon={Bike} label="Quantity">
              <input value={qty} onChange={e => setQty(Math.max(1, Math.min(10, +e.target.value || 1)))} type="number" min={1} max={10} className="bg-transparent outline-none flex-1 text-sm" />
            </Field>

            <div className="mt-5 rounded-2xl bg-secondary/60 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Estimated total</div>
                <div className="font-display text-2xl flex items-center"><IndianRupee className="size-5" />{total}</div>
              </div>
              <div className="text-xs text-right text-muted-foreground">
                {bike.name}<br />{plan.label} × {qty}
              </div>
            </div>

            <button type="submit" className="mt-5 w-full px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition">
              Confirm booking
            </button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">Pay on pickup · Free cancellation up to 2 hrs before</p>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof User; label: string; children: React.ReactNode }) {
  return (
    <label className="block mt-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border/60 bg-background/50 focus-within:border-primary transition">
        <Icon className="size-4 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}
