import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Leaf, Map, Shield, Compass, Bike, HeartHandshake, Mail } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EcoExplore" },
      { name: "description", content: "Why we built EcoExplore: smart, sustainable tourism for Goa." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-16 pb-20">
      <SectionHeader
        title="Designed for a problem worth solving."
        subtitle="Goa welcomes 8 million visitors a year. Most go to the same five places at the same five hours. We thought AI could change that."
      />

      <div className="mt-12 prose prose-lg max-w-none">
        <p className="text-lg text-foreground/90 leading-relaxed">
          EcoExplore is a Smart Tourism platform that blends AI itinerary planning, live crowd intelligence, and a real sustainability score.
          It helps tourists discover the Goa locals love — and helps Goa breathe.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {[
          { icon: Sparkles, t: "Personalised AI", d: "Itineraries written for your budget, vibe and pace — not a template." },
          { icon: Map, t: "Crowd-aware", d: "Real-time signals route you off the beaten beach, onto the better one." },
          { icon: Leaf, t: "Sustainable", d: "An honest Eco Score with concrete ways to lift it." },
          { icon: Shield, t: "Safe by default", d: "Hospitals, alerts and an SOS layer baked into every screen." },
        ].map(x => (
          <div key={x.t} className="bg-card rounded-2xl p-5 border border-border/60 shadow-soft flex gap-4">
            <div className="size-11 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0"><x.icon className="size-5" /></div>
            <div>
              <div className="font-medium">{x.t}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{x.d}</div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl sm:text-4xl">Make the trip your own</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          A great Goa trip isn’t one-size-fits-all. EcoExplore brings useful planning tools and local
          discovery together, so you can shape days around what you enjoy and leave room for
          unexpected stops along the way.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: Compass,
              title: "Find your next stop",
              text: "Browse beaches, heritage spots, cafés, and lesser-known places to add a little discovery to your plans.",
            },
            {
              icon: Bike,
              title: "Plan at your pace",
              text: "Build an itinerary around your interests, travel dates, group, and budget, then adjust it as you go.",
            },
            {
              icon: HeartHandshake,
              title: "Choose thoughtfully",
              text: "Explore practical ideas for lower-impact transport and local experiences that help keep your visit considerate.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 rounded-3xl border border-border/60 bg-secondary/40 p-7 sm:p-9 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="font-display text-3xl">Travel with a lighter footprint</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Small choices can make a visit better for you and the places you came to experience.
            Try a bicycle for a nearby ride, seek out local food, and consider exploring beyond
            the busiest hours. EcoExplore helps bring these ideas into the planning process—not
            as rules, but as simple options for a more mindful journey.
          </p>
        </div>
        <Leaf className="hidden size-16 text-eco md:block" aria-hidden="true" />
      </section>

      <section id="privacy" className="mt-16 scroll-mt-24" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading" className="font-display text-3xl sm:text-4xl">Privacy &amp; your information</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          EcoExplore uses information to provide the features you choose to use. Here’s a simple
          overview of the information involved:
        </p>
        <ul className="mt-5 space-y-3 text-muted-foreground">
          <li className="rounded-xl border border-border/60 bg-card p-4">
            <strong className="text-foreground">Account details:</strong> If you sign in or create an
            account, your email and any profile details you provide are handled through Supabase
            authentication.
          </li>
          <li className="rounded-xl border border-border/60 bg-card p-4">
            <strong className="text-foreground">AI requests:</strong> Prompts and trip preferences
            you submit to the AI planner or assistant are sent to the AI service configured for the
            app so it can generate a response. Avoid including sensitive personal information.
          </li>
          <li className="rounded-xl border border-border/60 bg-card p-4">
            <strong className="text-foreground">Display preference:</strong> Your light or dark
            theme choice is saved in this browser using local storage.
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Supabase and the configured AI provider process information under their own privacy
          terms. Contact us if you have a question about privacy or how to use the app.
        </p>
      </section>

      <section id="contact" className="mt-16 scroll-mt-24 rounded-3xl border border-border/60 bg-card p-7 shadow-soft sm:p-9" aria-labelledby="contact-heading">
        <div className="flex items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Mail className="size-5" />
          </div>
          <div>
            <h2 id="contact-heading" className="font-display text-3xl">Contact EcoExplore</h2>
            <p className="mt-2 text-muted-foreground">
              Have a question, suggestion, or privacy concern? We’d be glad to hear from you.
            </p>
            <a
              href="mailto:ecoexplore4goa@gmail.com"
              className="mt-4 inline-flex font-medium text-primary underline-offset-4 hover:underline"
            >
              ecoexplore4goa@gmail.com
            </a>
          </div>
        </div>
      </section>

      <div className="mt-12 bg-gradient-hero rounded-3xl p-10 text-primary-foreground shadow-glow text-center">
        <h3 className="font-display text-3xl">Try the AI in 12 seconds</h3>
        <p className="mt-2 opacity-90">Sign in, drop a prompt, and watch a beautiful itinerary write itself.</p>
        <Link to="/planner" className="mt-6 inline-flex bg-card text-foreground rounded-full px-6 py-3 font-medium shadow-soft">
          Open the planner
        </Link>
      </div>

    </div>
  );
}
