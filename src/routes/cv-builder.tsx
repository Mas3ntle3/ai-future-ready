import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Rocket, Loader2, Lock, Download } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { generateCV } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIResult } from "@/components/ai-result";

export const Route = createFileRoute("/cv-builder")({
  head: () => ({
    meta: [
      { title: "AI CV Builder — AI Computer Learning" },
      { name: "description", content: "Build a polished CV with AI for internships and entry-level roles." },
    ],
  }),
  component: CVPage,
});

function CVPage() {
  const run = useServerFn(generateCV);
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const [f, setF] = useState({
    fullName: "", email: "", phone: "", location: "", summary: "",
    education: "", skills: "", experience: "", targetRole: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (authed === false) return <Gate />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const r = await run({ data: f });
      setResult(r.cv);
      toast.success("CV generated and saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${f.fullName || "cv"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          <Rocket className="h-3.5 w-3.5" /> AI CV Builder
        </span>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Build your CV</h1>
        <p className="mt-3 text-muted-foreground">
          Fill in your information — the AI will turn it into a clean, ATS-friendly CV you can
          download and share.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <F label="Full name"><Input required value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} /></F>
          <F label="Target role"><Input required value={f.targetRole} onChange={(e) => setF({ ...f, targetRole: e.target.value })} placeholder="e.g. IT Support Intern" /></F>
          <F label="Email"><Input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></F>
          <F label="Phone"><Input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></F>
          <F label="Location"><Input required value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="e.g. Johannesburg, Gauteng" /></F>
        </div>
        <F label="Professional summary (a few words about you)">
          <Textarea required rows={3} value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} />
        </F>
        <F label="Education">
          <Textarea required rows={3} value={f.education} onChange={(e) => setF({ ...f, education: e.target.value })} placeholder="School, year completed, subjects." />
        </F>
        <F label="Skills">
          <Textarea required rows={3} value={f.skills} onChange={(e) => setF({ ...f, skills: e.target.value })} placeholder="e.g. Typing, MS Word, Email, customer service." />
        </F>
        <F label="Experience (work, volunteering, school projects)">
          <Textarea rows={4} value={f.experience} onChange={(e) => setF({ ...f, experience: e.target.value })} />
        </F>
        <Button type="submit" size="lg" disabled={loading} className="w-fit">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Writing your CV…</> : "Generate CV"}
        </Button>
      </form>

      {result && (
        <>
          <AIResult title="Your generated CV" body={result} />
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={download}><Download className="mr-2 h-4 w-4" /> Download as .md</Button>
          </div>
        </>
      )}
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Gate() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-primary">
        <Lock className="h-7 w-7" />
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold">Sign in to build your CV</h1>
      <p className="mt-2 text-muted-foreground">Your CV is saved so you can edit or download it any time.</p>
      <Button asChild className="mt-6"><Link to="/auth">Sign in or create account</Link></Button>
    </div>
  );
}
