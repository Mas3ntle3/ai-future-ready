import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Rocket, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Your dashboard — AI Computer Learning" }],
  }),
  component: Dashboard,
});

type Row = { id: string; created_at: string; status?: string; target_role?: string };

function Dashboard() {
  const [apps, setApps] = useState<Row[]>([]);
  const [cvs, setCvs] = useState<Row[]>([]);
  const [covers, setCovers] = useState<Row[]>([]);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setEmail(u.user?.email ?? "");
      const [a, c, l] = await Promise.all([
        supabase.from("applications").select("id,created_at,status").order("created_at", { ascending: false }),
        supabase.from("cvs").select("id,created_at").order("created_at", { ascending: false }),
        supabase.from("cover_letters").select("id,created_at,target_role").order("created_at", { ascending: false }),
      ]);
      setApps(a.data ?? []);
      setCvs(c.data ?? []);
      setCovers(l.data ?? []);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-extrabold text-foreground">Your dashboard</h1>
        <p className="mt-2 text-muted-foreground">Signed in as <span className="font-medium text-foreground">{email}</span></p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Tile
          icon={FileText}
          title="Applications"
          count={apps.length}
          empty="No applications yet."
          cta={{ to: "/apply", label: "Start application" }}
          items={apps.map((r) => `${new Date(r.created_at).toLocaleDateString()} — ${r.status ?? "draft"}`)}
        />
        <Tile
          icon={Rocket}
          title="CVs"
          count={cvs.length}
          empty="No CVs generated yet."
          cta={{ to: "/cv-builder", label: "Build a CV" }}
          items={cvs.map((r) => new Date(r.created_at).toLocaleDateString())}
        />
        <Tile
          icon={Mail}
          title="Cover letters"
          count={covers.length}
          empty="No cover letters yet."
          cta={{ to: "/cover-letter", label: "Write one" }}
          items={covers.map((r) => `${r.target_role ?? "Role"} — ${new Date(r.created_at).toLocaleDateString()}`)}
        />
      </div>
    </div>
  );
}

function Tile({
  icon: Icon, title, count, items, empty, cta,
}: {
  icon: typeof FileText; title: string; count: number; items: string[]; empty: string;
  cta: { to: "/apply" | "/cv-builder" | "/cover-letter"; label: string };
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base"><Icon className="h-5 w-5 text-primary" /> {title}</CardTitle>
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-primary">{count}</span>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="space-y-1 text-sm text-foreground">
            {items.slice(0, 5).map((it, i) => <li key={i} className="truncate">{it}</li>)}
          </ul>
        )}
        <Button asChild variant="outline" size="sm" className="mt-4 w-full">
          <Link to={cta.to}>{cta.label}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
