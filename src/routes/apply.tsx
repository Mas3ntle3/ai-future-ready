import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { reviewApplication } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AIResult } from "@/components/ai-result";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "AI Application Assistant — AI Computer Learning" },
      { name: "description", content: "Complete your application with AI help. Saved to your account." },
    ],
  }),
  component: ApplyPage,
});

const PROVINCES = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Mpumalanga", "Limpopo", "North West", "Northern Cape"];
const COURSES = ["Digital Foundations", "Microsoft Office Essentials", "Web Basics & Social Media", "Intro to Coding", "Data Entry & Admin Skills", "Smartphone & Mobile Productivity"];
const DOCS = ["SA ID / Passport", "Proof of address", "Highest school qualification", "Reference letter"];

function ApplyPage() {
  const run = useServerFn(reviewApplication);
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const [f, setF] = useState({
    fullName: "", age: "", province: "", city: "", education: "",
    motivation: "", preferredCourse: "", phone: "", email: "",
  });
  const [docs, setDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (authed === false) return <SignInGate />;

  const toggle = (d: string) =>
    setDocs((arr) => (arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const r = await run({
        data: {
          ...f,
          age: Number(f.age) || 0,
          documents: docs,
        },
      });
      setResult(r.feedback);
      toast.success("Application reviewed and saved to your dashboard.");
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
          <FileText className="h-3.5 w-3.5" /> AI Application Assistant
        </span>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Apply for free classes</h1>
        <p className="mt-3 text-muted-foreground">
          Fill in your details — the AI will review for missing info, polish your motivation, and
          save everything to your account.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name"><Input required value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} /></Field>
          <Field label="Age"><Input required type="number" min={5} max={100} value={f.age} onChange={(e) => setF({ ...f, age: e.target.value })} /></Field>
          <Field label="Province">
            <Select value={f.province} onValueChange={(v) => setF({ ...f, province: v })}>
              <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
              <SelectContent>{PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Town / city"><Input required value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></Field>
          <Field label="Highest education"><Input required value={f.education} onChange={(e) => setF({ ...f, education: e.target.value })} placeholder="e.g. Matric (Grade 12)" /></Field>
          <Field label="Preferred course">
            <Select value={f.preferredCourse} onValueChange={(v) => setF({ ...f, preferredCourse: v })}>
              <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
              <SelectContent>{COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Phone"><Input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Field label="Email"><Input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        </div>
        <Field label="Why do you want to join?">
          <Textarea required rows={5} value={f.motivation} onChange={(e) => setF({ ...f, motivation: e.target.value })} placeholder="Share your story in a few sentences." />
        </Field>
        <div>
          <Label>Documents available</Label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {DOCS.map((d) => (
              <label key={d} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-background p-3 text-sm hover:border-primary/40">
                <Checkbox checked={docs.includes(d)} onCheckedChange={() => toggle(d)} />
                {d}
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" size="lg" disabled={loading} className="w-fit">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reviewing…</> : "Submit for AI review"}
        </Button>
      </form>

      {result && <AIResult title="AI feedback on your application" body={result} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function SignInGate() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="grid place-items-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-primary">
          <Lock className="h-7 w-7" />
        </span>
      </div>
      <h1 className="mt-4 font-display text-3xl font-bold text-foreground">Sign in to apply</h1>
      <p className="mt-2 text-muted-foreground">
        Your application is saved to your account so you can come back to it any time.
      </p>
      <Button asChild className="mt-6"><Link to="/auth">Sign in or create account</Link></Button>
    </div>
  );
}
