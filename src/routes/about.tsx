import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Calendar, FileCheck, GraduationCap, BookOpen, UserCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AI Community Computer Learning Assistant" },
      { name: "description", content: "Programme overview, locations, requirements, courses, and lecturer profiles." },
      { property: "og:title", content: "About the programme" },
      { property: "og:description", content: "Locations, requirements, and the courses we offer across Gauteng." },
    ],
  }),
  component: AboutPage,
});

const locations = [
  { name: "Johannesburg CBD Library", addr: "1 Fraser St, Johannesburg" },
  { name: "Soweto Youth Centre", addr: "Vilakazi St, Orlando West" },
  { name: "Pretoria Tshwane Hub", addr: "Helen Joseph St, Pretoria Central" },
  { name: "Alexandra Skills Hub", addr: "8th Ave, Alexandra" },
  { name: "Sandton Community Library", addr: "Nelson Mandela Sq, Sandton" },
  { name: "Tembisa Resource Centre", addr: "Andrew Mapheto Dr, Tembisa" },
];

const courses = [
  { name: "Digital Foundations", weeks: 4, desc: "Typing, email, internet safety, file basics." },
  { name: "Microsoft Office Essentials", weeks: 8, desc: "Word, Excel, PowerPoint for work." },
  { name: "Web Basics & Social Media", weeks: 6, desc: "Use the web for jobs, brand, and business." },
  { name: "Intro to Coding", weeks: 10, desc: "HTML, CSS and Scratch — your first website." },
  { name: "Data Entry & Admin Skills", weeks: 6, desc: "Spreadsheets, forms, and office workflows." },
  { name: "Smartphone & Mobile Productivity", weeks: 4, desc: "Get more done from your phone." },
];

const lecturers = [
  { name: "Thandi Mokoena", role: "Lead Facilitator — Digital Foundations", bio: "10 years training adult learners across Soweto and Alex." },
  { name: "Sipho Dlamini", role: "Office Essentials Lecturer", bio: "Former corporate trainer at a Big-4 firm; loves Excel pivot tables." },
  { name: "Naledi van Wyk", role: "Coding Mentor", bio: "Self-taught developer turned mentor; builds with HTML, CSS, and JavaScript." },
  { name: "Mandla Khumalo", role: "Career & Placement Coach", bio: "Connects learners with internships and entry-level IT roles." },
];

function Section({ title, icon: Icon, children }: { title: string; icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
        <Icon className="h-6 w-6 text-primary" /> {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-12 max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">About the programme</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The AI Community Computer Learning Assistant is a free, community-run computer literacy
          programme for young people in Gauteng. We combine in-person teaching with friendly AI
          assistants that help with eligibility, applications, CVs, and cover letters.
        </p>
      </header>

      <div className="space-y-14">
        <Section title="Locations" icon={MapPin}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((l) => (
              <Card key={l.name} className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{l.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{l.addr}</CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-5 w-5 text-primary" /> Age requirements</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Open to youth aged <strong className="text-foreground">16 to 35</strong>. Priority is
              given to first-time learners.
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><FileCheck className="h-5 w-5 text-primary" /> Required documents</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              SA ID or passport, proof of address (not older than 3 months), and your highest school
              qualification (Grade 9 or above preferred).
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><GraduationCap className="h-5 w-5 text-primary" /> Course duration</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Courses run for <strong className="text-foreground">4 to 10 weeks</strong>, with
              2 classes per week (morning or evening).
            </CardContent>
          </Card>
        </div>

        <Section title="Courses offered" icon={BookOpen}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Card key={c.name} className="border-border/60 transition hover:-translate-y-0.5 hover:shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{c.weeks} weeks</p>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{c.desc}</CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Lecturer profiles" icon={UserCircle2}>
          <div className="grid gap-4 sm:grid-cols-2">
            {lecturers.map((l) => (
              <Card key={l.name} className="border-border/60">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-lg font-bold text-primary-foreground">
                    {l.name.split(" ").map((p) => p[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base">{l.name}</CardTitle>
                    <p className="text-xs font-medium text-primary">{l.role}</p>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{l.bio}</CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
