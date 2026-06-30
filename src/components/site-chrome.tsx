import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, MonitorSmartphone, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/eligibility", label: "Eligibility" },
  { to: "/advisor", label: "Course Advisor" },
  { to: "/apply", label: "Apply" },
  { to: "/cv-builder", label: "CV Builder" },
  { to: "/cover-letter", label: "Cover Letter" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-soft">
            <MonitorSmartphone className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">AI Computer Learning</span>
          <span className="sm:hidden">AICL</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-semibold text-primary bg-accent/60" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {email ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              <Button size="sm" variant="ghost" onClick={signOut}>
                <LogOut className="mr-1 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>

        <button
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
                activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-semibold text-primary bg-accent/60" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-border/60 pt-3">
              {email ? (
                <>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setOpen(false); signOut(); }}>
                    Sign out
                  </Button>
                </>
              ) : (
                <Button asChild size="sm" className="flex-1">
                  <Link to="/auth" onClick={() => setOpen(false)}>Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-bold text-primary">AI Computer Learning</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Free computer literacy classes for young people across Gauteng — supported by community
            sponsors and powered by friendly AI assistants.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About the programme</Link></li>
            <li><Link to="/eligibility" className="hover:text-primary">Check eligibility</Link></li>
            <li><Link to="/apply" className="hover:text-primary">Apply now</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Get in touch</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>hello@aiclassroom.org.za</li>
            <li>+27 (0)11 555 0123</li>
            <li>Johannesburg • Pretoria • Soweto</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AI Community Computer Learning Assistant. All rights reserved.
      </div>
    </footer>
  );
}
