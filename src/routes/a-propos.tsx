import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — StirForma" },
      { name: "description", content: "Notre mission : simplifier la gestion de la formation professionnelle." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">À propos</p>
        <h1 className="mt-2 font-display text-5xl md:text-7xl">Nous croyons qu'apprendre <em className="text-primary">change le travail</em>.</h1>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>StirForma est née en 2022 d'un constat simple : les services formation passent plus de temps à gérer des fichiers Excel qu'à imaginer des parcours pédagogiques utiles.</p>
          <p>Notre plateforme rassemble — dans une interface claire et soignée — toute la matière nécessaire au pilotage de la formation : sessions, formateurs, participants, certificats, conformité.</p>
          <p>Aujourd'hui, plus de 120 entreprises françaises font confiance à StirForma pour piloter plus de 4 000 sessions par an.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { k: "2022", v: "Fondation à Paris" },
            { k: "120+", v: "Entreprises clientes" },
            { k: "4 000", v: "Sessions par an" },
          ].map((s) => (
            <div key={s.v} className="rounded-xl border border-border bg-card p-6">
              <div className="font-display text-4xl text-primary">{s.k}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}