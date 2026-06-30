import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AI Community Computer Learning Assistant" },
      { name: "description", content: "Reach the AI Computer Learning team in Gauteng. Phone, email, map, and FAQ." },
      { property: "og:title", content: "Contact AI Computer Learning" },
      { property: "og:description", content: "Get in touch — phone, email, map, and frequently asked questions." },
    ],
  }),
  component: ContactPage,
});

const FAQ = [
  { q: "Is the programme really free?", a: "Yes. Tuition, materials, and certification are fully covered by our community sponsors." },
  { q: "What if I don't have my own laptop?", a: "Computers are provided at every venue during class hours." },
  { q: "How long until I can start?", a: "New cohorts begin every 6 weeks. After applying, you'll hear from us within 7 working days." },
  { q: "Will I get a certificate?", a: "Yes — every completed course earns a recognised certificate of competence." },
  { q: "Can I attend more than one course?", a: "Absolutely. Most learners stack 2–3 short courses to grow their skills." },
];

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">Contact us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We'd love to hear from you. Drop by one of our venues, or use the contact details below.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary"><MapPin className="h-5 w-5" /></span>
            <div>
              <h3 className="font-display text-base font-bold">Main office</h3>
              <p className="text-sm text-muted-foreground">1 Fraser Street, Johannesburg CBD, 2001</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary"><Mail className="h-5 w-5" /></span>
            <div>
              <h3 className="font-display text-base font-bold">Email</h3>
              <a href="mailto:hello@aiclassroom.org.za" className="text-sm text-primary hover:underline">hello@aiclassroom.org.za</a>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary"><Phone className="h-5 w-5" /></span>
            <div>
              <h3 className="font-display text-base font-bold">Phone</h3>
              <a href="tel:+27115550123" className="text-sm text-primary hover:underline">+27 (0)11 555 0123</a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/60 shadow-soft">
          <iframe
            title="Map of Johannesburg CBD"
            src="https://www.google.com/maps?q=Johannesburg%20CBD%20Library&output=embed"
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold text-foreground">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-6 rounded-2xl border border-border/60 bg-card px-4 shadow-soft">
          {FAQ.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
