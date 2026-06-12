import { createFileRoute } from "@tanstack/react-router";
import { Star, MapPin } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { trainers } from "@/lib/data";

export const Route = createFileRoute("/formateurs")({
  head: () => ({
    meta: [
      { title: "Nos formateurs — FormaPro" },
      { name: "description", content: "Découvrez les experts qui animent nos formations." },
    ],
  }),
  component: TrainersPage,
});

function TrainersPage() {
  return (
    <PageShell>
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Formateurs</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">Des experts <em className="text-primary">passionnés</em>.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Nos formateurs combinent expérience terrain et pédagogie active. Chaque session est évaluée par les participants.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainers.map((t) => (
            <article key={t.name} className="rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary font-display text-xl text-primary-foreground">
                  {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h3 className="font-display text-xl">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">{t.expertise}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="flex items-center gap-1 text-ochre-foreground"><Star className="h-4 w-4 fill-ochre text-ochre" /> {t.rating}</span>
                <span className="text-muted-foreground">{t.sessions} sessions</span>
                <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {t.city}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}