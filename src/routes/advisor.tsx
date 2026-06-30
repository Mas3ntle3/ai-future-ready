import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { recommendCourses } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIResult } from "@/components/ai-result";

export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "AI Course Advisor — AI Computer Learning" },
      { name: "description", content: "Get a personalised course recommendation from our AI advisor." },
    ],
  }),
  component: AdvisorPage,
});

function AdvisorPage() {
  const run = useServerFn(recommendCourses);
  const [interests, setInterests] = useState("");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length < 2 || goals.length < 2) {
      toast.error("Please describe your interests and goals.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await run({ data: { interests, goals } });
      setResult(r.result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          <GraduationCap className="h-3.5 w-3.5" /> AI Course Advisor
        </span>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Which course is right for me?</h1>
        <p className="mt-3 text-muted-foreground">
          Share what you enjoy and where you'd like to go — the AI will suggest 2 or 3 beginner
          courses that fit you best.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
        <div>
          <Label htmlFor="interests">What are you interested in?</Label>
          <Textarea id="interests" rows={4} value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g. I love social media and want to learn how to make websites." />
        </div>
        <div>
          <Label htmlFor="goals">What's your goal?</Label>
          <Textarea id="goals" rows={4} value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="e.g. Get an admin internship within 6 months." />
        </div>
        <Button type="submit" size="lg" disabled={loading} className="w-fit">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking…</> : "Recommend courses"}
        </Button>
      </form>

      {result && <AIResult title="Recommended courses" body={result} />}
    </div>
  );
}
