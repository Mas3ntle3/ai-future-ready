import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Loader2, Lock, Download } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { generateCoverLetter } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIResult } from "@/components/ai-result";

export const Route = createFileRoute("/cover-letter")({
  head: () => ({
    meta: [
      { title: "AI Cover Letter Generator — AI Computer Learning" },
      { name: "description", content: "Generate a personalised cover letter for IT internships and entry-level roles." },
    ],
  }),
  component: CoverPage,
});

function CoverPage() {
  const run = useServerFn(generateCoverLetter);
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const [f, setF] = useState({ fullName: "", targetRole: "", targetCompany: "", background: "", whyThisRole: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (authed === false) return <Gate />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const r = await run({ data: f });
      setResult(r.letter);
      toast.success("Cover letter generated and saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${f.targetRole || "draft"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          <Mail className="h-3.5 w-3.5" /> AI Cover Letter
        </span>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Write your cover letter</h1>
        <p className="mt-3 text-muted-foreground">Tell us about the role — the AI will draft a warm, concise cover letter ready to send.</p>
      </header>

      <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <F label="Your full name"><Input required value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} /></F>
          <F label="Target role"><Input required value={f.targetRole} onChange={(e) => setF({ ...f, targetRole: e.target.value })} placeholder="e.g. Junior Data Capturer" /></F>
          <F label="Company (optional)"><Input value={f.targetCompany} onChange={(e) => setF({ ...f, targetCompany: e.target.value })} /></F>
        </div>
        <F label="Your background (skills, courses, experience)">
          <Textarea required rows={4} value={f.background} onChange={(e) => setF({ ...f, background: e.target.value })} />
        </F>
        <F label="Why this role / company excites you">
          <Textarea required rows={3} value={f.whyThisRole} onChange={(e) => setF({ ...f, whyThisRole: e.target.value })} />
        </F>
        <Button type="submit" size="lg" disabled={loading} className="w-fit">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting…</> : "Generate cover letter"}
        </Button>
      </form>

      {result && (
        <>
          <AIResult title="Your cover letter" body={result} />
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={download}><Download className="mr-2 h-4 w-4" /> Download</Button>
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
      <h1 className="mt-4 font-display text-3xl font-bold">Sign in to write your cover letter</h1>
      <p className="mt-2 text-muted-foreground">It's saved to your account so you can reuse and edit it.</p>
      <Button asChild className="mt-6"><Link to="/auth">Sign in or create account</Link></Button>
    </div>
  );
}
