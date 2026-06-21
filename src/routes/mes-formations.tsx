import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ArrowRight, Loader2, BookOpen, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { getMySessions } from "@/lib/api/sessions";

export const Route = createFileRoute("/mes-formations")({
  head: () => ({
    meta: [{ title: "Mes formations — StirForma" }],
  }),
  component: MesFormationsPage,
});

function MesFormationsPage() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["my-sessions"],
    queryFn: getMySessions,
  });

  return (
    <ProtectedRoute>
      <PageShell>
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="font-display text-4xl">Mes formations</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Retrouvez toutes les sessions auxquelles vous êtes inscrit.
          </p>

          {isLoading ? (
            <div className="mt-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : sessions && sessions.length > 0 ? (
            <div className="mt-8 space-y-4">
              {sessions.map((s: any) => {
                const d = new Date(s.dateDebut);
                return (
                  <div key={s.id} className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl">{s.formation?.titre || "Formation"}</h2>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-primary" />
                            {d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                          {s.lieu && <span>📍 {s.lieu}</span>}
                          {s.formateurs?.map((f: any) => (
                            <span key={f.id}>👤 {f.prenom} {f.nom}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5" asChild>
                          <Link
                            to="/evaluation/$sessionId"
                            params={{ sessionId: s.id }}
                          >
                            <Star className="h-4 w-4" /> Évaluer
                          </Link>
                        </Button>
                        <Link
                          to="/formations/$id"
                          params={{ id: s.formation?.id }}
                          className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Détails <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-12 rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">Vous n'êtes inscrit à aucune formation</p>
              <p className="mt-1 text-sm text-muted-foreground">Parcourez le catalogue pour trouver une formation qui vous intéresse.</p>
              <Link
                to="/catalogue"
                className="mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Parcourir le catalogue
              </Link>
            </div>
          )}
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
