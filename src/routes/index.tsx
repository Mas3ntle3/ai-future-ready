import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Rocket,
  FileText,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Computer Learning — Free classes for Gauteng youth" },
      {
        name: "description",
        content:
          "A free community computer literacy programme for young people in Gauteng, powered by friendly AI helpers.",
      },
    ],
  }),
  component: Home,
});

const features = [
  { icon: ShieldCheck, title: "AI Eligibility Checker", desc: "Find out in seconds if you qualify and what's missing.", to: "/eligibility" },
  { icon: GraduationCap, title: "AI Course Advisor", desc: "Get the right beginner course matched to your goals.", to: "/advisor" },
  { icon: FileText, title: "AI Application Assistant", desc: "Smart form review so nothing gets rejected.", to: "/apply" },
  { icon: Rocket, title: "AI CV Builder", desc: "A polished, ATS-friendly CV in minutes.", to: "/cv-builder" },
] as const;

const sponsors = ["Gauteng Youth Trust", "Sandton Rotary", "Sasol Foundation", "Vodacom NPO", "FNB Community"];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-glow text-primary-foreground">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_60%,white_0,transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Free • AI-assisted • Gauteng
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Learn computers.<br />Unlock opportunity.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              The AI Community Computer Learning Assistant helps young people in Gauteng apply for
              free computer literacy classes — and uses AI to make every step easier, from
              checking eligibility to writing your first CV.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to="/eligibility">
                  Check eligibility <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link to="/about">About the programme</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> 1,200+ learners enrolled</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Joburg • Pretoria • Soweto</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative grid place-items-center"
          >
            <div className="grid w-full max-w-md gap-3 rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur">
              {features.map((f, i) => (
                <Link
                  key={f.to}
                  to={f.to}
                  className="group flex items-start gap-3 rounded-2xl bg-white/95 p-4 text-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 self-center text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              A community-driven path into the digital economy
            </h2>
            <p className="mt-4 text-muted-foreground">
              Run in partnership with libraries, churches, and community centres across Gauteng,
              the programme has helped over a thousand young people get their first email address,
              their first CV, and their first IT internship. We meet you where you are — no
              experience needed.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-foreground">
              <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-primary" /> 100% free for accepted learners — no hidden costs.</li>
              <li className="flex gap-3"><GraduationCap className="mt-0.5 h-5 w-5 text-primary" /> Recognised certificate on completion.</li>
              <li className="flex gap-3"><Rocket className="mt-0.5 h-5 w-5 text-primary" /> CV and internship support built in.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "1,200+", l: "Learners enrolled" },
              { n: "8", l: "Community venues" },
              { n: "92%", l: "Course completion" },
              { n: "340", l: "Placed in internships" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
                <p className="font-display text-3xl font-bold text-primary">{s.n}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Supported by our community sponsors
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {sponsors.map((s) => (
              <div
                key={s}
                className="rounded-full border border-border/60 bg-card px-5 py-2 text-sm font-semibold text-muted-foreground shadow-soft"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-glow p-10 text-center text-primary-foreground shadow-soft">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to start?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Check your eligibility in under a minute, or jump straight into the application.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/eligibility">Check eligibility</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link to="/apply">Start application</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
