import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPin, Calendar, Clock } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { categories, formations } from "@/lib/data";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "Catalogue de formations — FormaPro" },
      { name: "description", content: "Parcourez toutes les formations FormaPro : management, IT, bureautique, juridique, soft skills." },
      { property: "og:title", content: "Catalogue de formations — FormaPro" },
      { property: "og:description", content: "Plus de 240 formations professionnelles disponibles." },
    ],
  }),
  component: CataloguePage,
});

function CataloguePage() {
  return (
    <PageShell>
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Catalogue</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">Trouvez la formation qu'il vous faut.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Recherchez par mot-clé, filtrez par catégorie, format ou ville. Toutes les sessions sont accompagnées d'un certificat signé.
          </p>

          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-background p-3 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-secondary px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Rechercher une formation, un formateur, un thème…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option>Toutes catégories</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option>Tous formats</option>
              <option>Intra</option><option>Inter</option><option>Catalogue</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Tous", ...categories].map((c, i) => (
              <button
                key={c}
                className={
                  i === 0
                    ? "rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
                    : "rounded-full border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary"
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>{formations.length} formations trouvées</span>
          <span>Trier par : <strong className="text-foreground">Prochaine session</strong></span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {formations.map((f) => (
            <Link
              key={f.id}
              to="/formations/$id"
              params={{ id: f.id }}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-md bg-secondary px-2 py-1 font-medium">{f.category}</span>
                <span className={
                  f.type === "Intra" ? "rounded-md bg-ochre/20 px-2 py-1 text-ochre-foreground" :
                  f.type === "Inter" ? "rounded-md bg-primary/10 px-2 py-1 text-primary" :
                  "rounded-md bg-muted px-2 py-1 text-muted-foreground"
                }>{f.type}</span>
              </div>
              <h3 className="mt-4 font-display text-2xl leading-tight group-hover:text-primary">{f.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{f.description}</p>
              <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {f.nextDate}</div>
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {f.duration} · {f.level}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {f.location}</div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">{f.enrolled}/{f.seats} inscrits</span>
                <span className="font-display text-xl text-primary">{f.price} €</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}