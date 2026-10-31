import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Travel Assistant — EcoExplore" },
      { name: "description", content: "Chat with an AI that knows Goa — places, food, routes, vibes." },
    ],
  }),
  component: () => <RequireAuth><Assistant /></RequireAuth>,
});

type Msg = { role: "user" | "assistant"; content: string };

const seed: Msg[] = [
  { role: "assistant", content: "Hi! I'm your Goa travel concierge. Ask me anything — best beach for sunset, cheap thali nearby, a quiet corner of Old Goa…" },
];

const suggestions = [
  "Best sunset beach with low crowd?",
  "Cheap authentic Goan thali in Panjim",
  "3-day eco itinerary, no parties",
  "Hidden waterfall trek for monsoon",
];

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data.error ?? "Something went wrong." }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pt-12 pb-12">
      <SectionHeader eyebrow="AI Assistant · Live" title="Your concierge for Goa." subtitle="Powered by Lovable AI — real answers, real time." align="center" />

      <div className="mt-10 bg-card rounded-3xl shadow-soft border border-border/60 overflow-hidden flex flex-col h-[70vh]">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3 bg-secondary/40">
          <div className="size-9 rounded-xl bg-gradient-eco grid place-items-center"><Sparkles className="size-4 text-primary-foreground" /></div>
          <div>
            <div className="font-medium text-sm">EcoExplore AI</div>
            <div className="text-xs text-eco flex items-center gap-1"><span className="size-1.5 rounded-full bg-eco" /> Online</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && <div className="size-8 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0"><Bot className="size-4" /></div>}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-secondary-foreground rounded-bl-sm"
              }`}>{m.content}</div>
              {m.role === "user" && <div className="size-8 rounded-full bg-coral/15 text-coral grid place-items-center shrink-0"><User className="size-4" /></div>}
            </motion.div>
          ))}
          <AnimatePresence>
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                <div className="size-8 rounded-full bg-primary/10 text-primary grid place-items-center"><Bot className="size-4" /></div>
                <div className="bg-secondary rounded-2xl px-4 py-3 flex gap-1">
                  <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:120ms]" />
                  <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:240ms]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-accent transition">
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-4 border-t border-border flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Goa — beaches, food, routes…"
            className="flex-1 bg-secondary rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <button type="submit" disabled={typing} className="size-11 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-soft hover:scale-105 transition disabled:opacity-60">
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
