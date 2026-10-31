import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navigation, Leaf, Users, Clock, Route as RouteIcon, Sparkles, AlertTriangle, Loader2, Bike } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/maps")({
  head: () => ({
    meta: [
      { title: "Smart Maps & Navigation — EcoExplore" },
      { name: "description", content: "Crowd-aware route suggestions across Goa with live density overlays and eco-friendly alternatives." },
    ],
  }),
  component: MapsPage,
});

const POIS = [
  { id: "baga",    name: "Baga Beach",         lat: 15.5560, lng: 73.7517, crowd: 92, eco: 5.4 },
  { id: "anjuna",  name: "Anjuna Flea Market", lat: 15.5735, lng: 73.7400, crowd: 74, eco: 6.8 },
  { id: "morjim",  name: "Morjim Beach",       lat: 15.6300, lng: 73.7322, crowd: 38, eco: 8.7 },
  { id: "vagator", name: "Vagator Cliffs",     lat: 15.5970, lng: 73.7395, crowd: 54, eco: 8.1 },
  { id: "fontain", name: "Fontainhas Quarter", lat: 15.4969, lng: 73.8330, crowd: 41, eco: 8.4 },
  { id: "oldgoa",  name: "Old Goa Basilica",   lat: 15.5009, lng: 73.9115, crowd: 61, eco: 7.6 },
  { id: "palolem", name: "Palolem Beach",      lat: 15.0100, lng: 74.0233, crowd: 33, eco: 9.0 },
  { id: "dudhsa",  name: "Dudhsagar Falls",    lat: 15.3144, lng: 74.3140, crowd: 88, eco: 7.2 },
  { id: "ashvem",  name: "Ashvem Beach",       lat: 15.6480, lng: 73.7280, crowd: 22, eco: 9.2 },
  { id: "panjim",  name: "Panjim Riverfront",  lat: 15.4989, lng: 73.8278, crowd: 58, eco: 7.8 },
];

type Mode = "fastest" | "eco" | "scenic";

function crowdColor(c: number) {
  if (c >= 75) return "#ef6a55";
  if (c >= 45) return "#e9b949";
  return "#3aa775";
}

// Haversine
function distKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI/180) * Math.cos(b.lat * Math.PI/180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function MapsPage() {
  const [mounted, setMounted] = useState(false);
  const [from, setFrom] = useState("baga");
  const [to, setTo] = useState("morjim");
  const [mode, setMode] = useState<Mode>("eco");
  const [routeInfo, setRouteInfo] = useState<null | { distance: number; duration: number; crowd: number; eco: number; alt: { mode: Mode; saves: string }[]; coords: [number, number][] }>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const a = POIS.find(p => p.id === from)!;
  const b = POIS.find(p => p.id === to)!;

  const findRoute = async () => {
    if (a.id === b.id) return;
    setLoading(true);
    try {
      const profile = mode === "fastest" ? "driving" : mode === "eco" ? "cycling" : "walking";
      // OSRM public demo server — free, no key
      const url = `https://router.project-osrm.org/route/v1/${profile}/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const json = await res.json();
      const r = json.routes?.[0];
      let coords: [number, number][];
      let distance: number, duration: number;
      if (r) {
        coords = r.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
        distance = r.distance; duration = r.duration;
      } else {
        // Fallback: straight line
        coords = [[a.lat, a.lng], [b.lat, b.lng]];
        const km = distKm(a, b);
        distance = km * 1000;
        duration = (km / (mode === "fastest" ? 50 : mode === "eco" ? 18 : 5)) * 3600;
      }
      const avgCrowd = Math.round((a.crowd + b.crowd) / 2 + (mode === "fastest" ? 8 : mode === "eco" ? -14 : -6));
      const ecoBoost = mode === "eco" ? 1.6 : mode === "scenic" ? 0.8 : -0.4;
      const ecoScore = +Math.min(10, Math.max(3, (a.eco + b.eco) / 2 + ecoBoost)).toFixed(1);
      setRouteInfo({
        distance, duration,
        crowd: Math.max(8, Math.min(98, avgCrowd)),
        eco: ecoScore,
        coords,
        alt: ([
          { mode: "fastest", saves: "−12 min" },
          { mode: "eco", saves: "−38% crowd · +1.4 eco" },
          { mode: "scenic", saves: "+3 hidden gems" },
        ] as { mode: Mode; saves: string }[]).filter(o => o.mode !== mode),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-12 pb-20">
      <SectionHeader
        eyebrow="Smart Maps · Live"
        title="Navigate Goa, crowd-aware."
        subtitle="Real-time density across hotspots — let the AI route you around the chaos with a greener footprint."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="bg-card rounded-3xl p-6 shadow-soft border border-border/60 h-fit lg:sticky lg:top-28">
          <h3 className="font-display text-xl flex items-center gap-2 mb-5"><RouteIcon className="size-5 text-primary" /> Plan a route</h3>
          <Field label="From"><Select value={from} onChange={setFrom} /></Field>
          <Field label="To"><Select value={to} onChange={setTo} /></Field>
          <Field label="Routing intent">
            <div className="grid grid-cols-3 gap-2">
              {(["fastest", "eco", "scenic"] as Mode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`rounded-xl py-2.5 text-xs font-medium capitalize transition ${
                    mode === m ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary hover:bg-accent"
                  }`}>{m}</button>
              ))}
            </div>
          </Field>
          <button
            onClick={findRoute}
            disabled={loading || from === to}
            className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-full bg-gradient-eco text-primary-foreground py-3.5 font-medium shadow-glow disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Navigation className="size-4" />} {loading ? "Routing…" : "Find smart route"}
          </button>

          <Link
            to="/rentals"
            className="mt-3 w-full inline-flex justify-center items-center gap-2 rounded-full bg-secondary text-secondary-foreground py-3 font-medium hover:bg-accent transition"
          >
            <Bike className="size-4" /> Book a bike / bicycle
          </Link>

          <div className="mt-6 pt-5 border-t border-border">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Crowd legend</div>
            <div className="space-y-1.5 text-xs">
              <Legend color="#3aa775" label="Calm · under 45%" />
              <Legend color="#e9b949" label="Moderate · 45–75%" />
              <Legend color="#ef6a55" label="Packed · 75%+" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="relative rounded-3xl overflow-hidden shadow-soft border border-border/60 bg-secondary" style={{ height: "560px" }}>
            {mounted ? <LeafletMap pois={POIS} routeCoords={routeInfo?.coords ?? null} mode={mode} /> : (
              <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Loading map…</div>
            )}
          </div>

          <AnimatePresence>
            {routeInfo && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-card rounded-3xl p-6 shadow-soft border border-border/60">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                  <Sparkles className="size-3.5" /> AI route insight
                </div>
                <div className="grid sm:grid-cols-4 gap-4 mb-5">
                  <Metric icon={Clock} label="Duration" value={`${Math.round(routeInfo.duration / 60)} min`} />
                  <Metric icon={RouteIcon} label="Distance" value={`${(routeInfo.distance / 1000).toFixed(1)} km`} />
                  <Metric icon={Users} label="Avg crowd" value={`${routeInfo.crowd}%`} tone={crowdColor(routeInfo.crowd)} />
                  <Metric icon={Leaf} label="Eco score" value={`${routeInfo.eco}/10`} tone="#3aa775" />
                </div>
                <div className={`rounded-2xl p-4 flex gap-3 items-start ${routeInfo.crowd >= 70 ? "bg-coral/10" : "bg-eco/10"}`}>
                  <AlertTriangle className={`size-5 shrink-0 ${routeInfo.crowd >= 70 ? "text-coral" : "text-eco"}`} />
                  <div className="text-sm">
                    {routeInfo.crowd >= 70
                      ? <>This corridor is <b>busy right now</b>. Try the <b>eco</b> alternative — cuts crowd density by ~38% and improves your eco score.</>
                      : <>Smooth sailing. <b>Crowd density is low</b> on this segment; great window to depart in the next 45 minutes.</>}
                  </div>
                </div>
                <div className="mt-5">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Switch route style</div>
                  <div className="flex flex-wrap gap-2">
                    {routeInfo.alt.map(opt => (
                      <button key={opt.mode} onClick={() => { setMode(opt.mode); setTimeout(findRoute, 50); }}
                        className="rounded-full px-4 py-2 text-xs bg-secondary hover:bg-accent">
                        <span className="capitalize font-medium">{opt.mode}</span> <span className="text-muted-foreground">· {opt.saves}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LeafletMap({ pois, routeCoords, mode }: { pois: typeof POIS; routeCoords: [number, number][] | null; mode: Mode }) {
  const [libs, setLibs] = useState<{ RL: any; L: any } | null>(null);

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([RL, L]) => {
      setLibs({ RL, L: L.default ?? L });
    });
  }, []);

  if (!libs) {
    return <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Loading map…</div>;
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, useMap } = libs.RL;
  const L = libs.L;
  const lineColor = mode === "fastest" ? "#ef6a55" : mode === "eco" ? "#3aa775" : "#0f766e";

  function FitBounds({ coords }: { coords: [number, number][] | null }) {
    const map = useMap();
    useEffect(() => {
      if (!coords || coords.length < 2) return;
      map.fitBounds(L.latLngBounds(coords as any), { padding: [50, 50] });
    }, [coords, map]);
    return null;
  }

  return (
    <MapContainer center={[15.45, 73.95]} zoom={9} className="absolute inset-0" style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pois.map((p) => (
        <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={8 + p.crowd / 12}
          pathOptions={{ color: "white", weight: 2, fillColor: crowdColor(p.crowd), fillOpacity: 0.85 }}>
          <Tooltip direction="top" offset={[0, -8]}>
            <div style={{ fontFamily: "Inter, sans-serif" }}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 12 }}>Crowd <b style={{ color: crowdColor(p.crowd) }}>{p.crowd}%</b> · Eco <b>{p.eco}</b></div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
      {routeCoords && routeCoords.length > 1 && (
        <>
          <Polyline positions={routeCoords as any} pathOptions={{ color: lineColor, weight: 5, opacity: 0.9 }} />
          <FitBounds coords={routeCoords} />
        </>
      )}
    </MapContainer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
function Select({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
      {POIS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  );
}
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-3 rounded-full" style={{ background: color }} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
function Metric({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="size-3.5" /> {label}</div>
      <div className="font-display text-2xl mt-1" style={tone ? { color: tone } : undefined}>{value}</div>
    </div>
  );
}
