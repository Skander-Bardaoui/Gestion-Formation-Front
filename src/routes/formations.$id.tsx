import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Check, Clock, MapPin, Users, Award, FileText } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { formations } from "@/lib/data";

export const Route = createFileRoute("/formations/$id")({
  loader: ({ params }) => {
    const formation = formations.find((f) => f.id === params.id);
    if (!formation) throw notFound();
    return { formation };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.formation.title ?? "Formation"} — FormaPro` },
      { name: "description", content: loaderData?.formation.description ?? "Formation FormaPro" },
    ],
  }),
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-5xl">Formation introuvable</h1>
        <Link to="/catalogue" className="mt-6 inline-block text-primary hover:underline">← Retour au catalogue</Link>
      </div>
    </PageShell>
  ),
  errorComponent: () => <PageShell><div className="p-16 text-center">Erreur de chargement.</div></PageShell>,
  component: FormationPage,
});

function FormationPage() {
  const { formation: f } = Route.useLoaderData();
  return (
    <PageShell>
      <article className="mx-auto max-w-5xl px-6 py-12">
        <Link to="/catalogue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour au catalogue
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-secondary px-2 py-1 font-medium">{f.category}</span>
            <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">{f.type}</span>
            <span className="rounded-md bg-ochre/20 px-2 py-1 text-ochre-foreground">{f.level}</span>
          </div>
          <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">{f.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{f.description}</p>
        </header>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div className="space-y-10 md:col-span-2">
            <section>
              <h2 className="font-display text-3xl">Objectifs pédagogiques</h2>
              <ul className="mt-4 space-y-3">
                {f.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{o}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-3xl">Prérequis</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {f.prerequisites.map((p) => <li key={p}>· {p}</li>)}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-3xl">Programme détaillé</h2>
              <ol className="mt-4 space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="rounded-lg border border-border bg-card p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-sm font-medium text-primary-foreground">{n}</span>
                      <h3 className="font-display text-xl">Module {n} — Sujet clé</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Contenu pédagogique combinant théorie, études de cas et exercices pratiques en groupe.
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-lg font-display text-primary-foreground">
                  {f.trainer.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Animée par</p>
                  <p className="font-display text-xl">{f.trainer}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Consultant·e senior, plus de 10 ans d'expérience auprès d'entreprises françaises et internationales.
              </p>
            </section>
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <div className="font-display text-4xl text-primary">{f.price} €<span className="text-sm text-muted-foreground"> HT / pers.</span></div>
              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {f.nextDate}</li>
                <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {f.duration}</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {f.location}</li>
                <li className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {f.enrolled}/{f.seats} inscrits</li>
              </ul>
              <button className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                S'inscrire à cette session
              </button>
              <button className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary">
                Demander un devis intra
              </button>
              <div className="mt-6 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Award className="h-3.5 w-3.5" /> Certificat signé électroniquement</div>
                <div className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> Support PDF inclus</div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </PageShell>
  );
}