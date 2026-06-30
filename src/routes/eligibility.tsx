import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { checkEligibility } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AIResult } from "@/components/ai-result";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "AI Eligibility Checker — AI Computer Learning" },
      { name: "description", content: "Find out if you qualify for our free computer literacy programme." },
    ],
  }),
  component: EligibilityPage,
});

const PROVINCES = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Mpumalanga", "Limpopo", "North West", "Northern Cape"];
const EDUCATION = ["No formal schooling", "Primary (Grade 1-7)", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Matric (Grade 12)", "Certificate / Diploma", "Degree"];
const DOCS = ["SA ID / Passport", "Proof of address", "Highest school qualification", "Reference letter"];

function EligibilityPage() {
  const run = useServerFn(checkEligibility);
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [province, setProvince] = useState("");
  const [docs, setDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const toggle = (d: string) =>
    setDocs((arr) => (arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = Number(age);
    if (!ageNum || !education || !province) {
      toast.error("Please fill in age, education, and province.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await run({ data: { age: ageNum, education, province, documents: docs } });
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
          <ShieldCheck className="h-3.5 w-3.5" /> AI Eligibility Checker
        </span>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Do I qualify?</h1>
        <p className="mt-3 text-muted-foreground">
          Tell us a little about yourself and our AI will let you know if you can apply — and what
          to do if anything's missing.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 19" min={5} max={100} />
          </div>
          <div>
            <Label>Province</Label>
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Highest education</Label>
          <Select value={education} onValueChange={setEducation}>
            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>
              {EDUCATION.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Documents you have</Label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {DOCS.map((d) => (
              <label key={d} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-background p-3 text-sm hover:border-primary/40">
                <Checkbox checked={docs.includes(d)} onCheckedChange={() => toggle(d)} />
                {d}
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" size="lg" disabled={loading} className="mt-2 w-fit">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking…</> : "Check eligibility"}
        </Button>
      </form>

      {result && <AIResult title="Your AI assessment" body={result} />}
    </div>
  );
}
