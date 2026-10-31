import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig, type Plugin } from "vite";

// Inline Vite plugin that serves POST /api/chat during dev.
// In production this would be a serverless function or Express route.
function apiChatPlugin(): Plugin {
  const SYSTEM_PROMPT = `You are EcoExplore, an AI travel concierge specialised in Goa, India.
You help tourists discover beaches, food, hidden gems, heritage spots, eco-friendly options, routes and crowd-aware suggestions across North and South Goa.
Reply concisely (2-5 sentences), warm and practical. Prefer specific place names. When relevant, mention crowd levels, eco impact, best time to visit, and budget tips.
If the user asks you to generate an itinerary in JSON format, respond ONLY with valid JSON and nothing else — no markdown, no code fences, no explanation.
If asked about anything unrelated to travel/Goa, gently steer the conversation back.`;

  return {
    name: "api-chat",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }));
          return;
        }

        let body = "";
        for await (const chunk of req) body += chunk;
        let parsed: any;
        try {
          parsed = JSON.parse(body);
        } catch {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Bad JSON" }));
          return;
        }

        const incoming = Array.isArray(parsed.messages) ? parsed.messages.slice(-20) : [];
        const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...incoming];

        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages }),
          });

          if (!upstream.ok) {
            const text = await upstream.text();
            res.statusCode = upstream.status;
            res.setHeader("Content-Type", "application/json");
            if (upstream.status === 429) res.end(JSON.stringify({ error: "Rate limit reached. Try again in a moment." }));
            else if (upstream.status === 402) res.end(JSON.stringify({ error: "AI credits exhausted." }));
            else res.end(JSON.stringify({ error: `AI gateway error: ${text.slice(0, 200)}` }));
            return;
          }

          const data = await upstream.json();
          const reply = data?.choices?.[0]?.message?.content ?? "Sorry — I didn't catch that.";
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ reply }));
        } catch (e: any) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: e.message ?? "Upstream error" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    // 1. TanStack Router — file-based route generation (client-side only)
    tanstackRouter({
      target: "react",
      autoCodeSplitting: false,
    }),

    // 2. React Fast Refresh + JSX transform
    react(),

    // 3. Tailwind CSS v4 via the official Vite plugin
    tailwindcss(),

    // 4. Resolve tsconfig path aliases (e.g. "@/components/…")
    tsConfigPaths(),

    // 5. Dev-only API handler for /api/chat
    apiChatPlugin(),
  ],
});
