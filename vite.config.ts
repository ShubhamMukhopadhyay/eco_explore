import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig, loadEnv, type Plugin } from "vite";

type ChatMessage = { role?: string; content?: string };

const SYSTEM_PROMPT = `You are EcoExplore, an AI travel concierge specialised in Goa, India.
You help tourists discover beaches, food, hidden gems, heritage spots, eco-friendly options, routes and crowd-aware suggestions across North and South Goa.
Reply concisely (2-5 sentences), warm and practical. Prefer specific place names. When relevant, mention crowd levels, eco impact, best time to visit, and budget tips.
If the user asks you to generate an itinerary in JSON format, respond ONLY with valid JSON and nothing else — no markdown, no code fences, no explanation.
If asked about anything unrelated to travel/Goa, gently steer the conversation back.`;

function json(res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (s: string) => void }, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function completeWithGemini(apiKey: string, incoming: ChatMessage[]) {
  const contents = incoming.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content ?? "") }],
  }));

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7 },
      }),
    },
  );

  const text = await upstream.text();
  if (!upstream.ok) {
    const err = new Error(text.slice(0, 240));
    (err as Error & { status: number }).status = upstream.status;
    throw err;
  }

  const data = JSON.parse(text);
  const reply =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ||
    "Sorry — I didn't catch that.";
  return reply;
}

async function completeWithGrok(apiKey: string, incoming: ChatMessage[]) {
  const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...incoming];
  const upstream = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4-fast-non-reasoning",
      messages,
      temperature: 0.7,
    }),
  });

  const text = await upstream.text();
  if (!upstream.ok) {
    const err = new Error(text.slice(0, 240));
    (err as Error & { status: number }).status = upstream.status;
    throw err;
  }

  const data = JSON.parse(text);
  return data?.choices?.[0]?.message?.content ?? "Sorry — I didn't catch that.";
}

// Inline Vite plugin that serves POST /api/chat during dev.
// In production this would be a serverless function or Express route.
function apiChatPlugin(env: Record<string, string>): Plugin {
  return {
    name: "api-chat",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          json(res, 405, { error: "Method not allowed" });
          return;
        }

        const geminiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        const grokKey = env.XAI_API_KEY || env.GROK_API_KEY || process.env.XAI_API_KEY || process.env.GROK_API_KEY;
        const provider = (env.AI_PROVIDER || process.env.AI_PROVIDER || (grokKey && !geminiKey ? "grok" : "gemini")).toLowerCase();

        if (provider === "grok" && !grokKey) {
          json(res, 500, { error: "Missing XAI_API_KEY. Add a key from https://console.x.ai/ and restart the dev server." });
          return;
        }
        if (provider !== "grok" && !geminiKey) {
          json(res, 500, { error: "Missing GEMINI_API_KEY. Add a free key from https://aistudio.google.com/apikey to .env and restart the dev server." });
          return;
        }

        let body = "";
        for await (const chunk of req) body += chunk;
        let parsed: { messages?: ChatMessage[] };
        try {
          parsed = JSON.parse(body);
        } catch {
          json(res, 400, { error: "Bad JSON" });
          return;
        }

        const incoming = Array.isArray(parsed.messages) ? parsed.messages.slice(-20) : [];

        try {
          const reply =
            provider === "grok"
              ? await completeWithGrok(grokKey as string, incoming)
              : await completeWithGemini(geminiKey as string, incoming);
          json(res, 200, { reply });
        } catch (e: unknown) {
          const err = e as { message?: string; status?: number };
          const status = err.status ?? 500;
          let message = err.message ?? "Upstream error";
          try {
            const parsedErr = JSON.parse(message);
            message = parsedErr?.error?.message ?? parsedErr?.message ?? message;
          } catch { /* keep raw message */ }
          if (status === 429) json(res, 429, { error: "Rate limit reached. Try again in a moment." });
          else json(res, status >= 400 ? status : 500, { error: message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
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
      apiChatPlugin(env),
    ],
  };
});
