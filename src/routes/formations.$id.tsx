import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { Calendar, MapPin, Users, Star } from "lucide-react";
import { toast } from "sonner";
import { getFormation } from "@/lib/api/formations";
import { enrollInSession } from "@/lib/api/sessions";

export const Route = createFileRoute("/formations/$id")({
  component: FormationPage,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function FormationPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: formation, isLoading } = useQuery({
    queryKey: ["formation", id],
    queryFn: () => getFormation(id),
  });

  const enrollMutation = useMutation({
    mutationFn: (sessionId: string) => enrollInSession(sessionId),
    onSuccess: () => {
      toast.success("Inscription confirmée !");
      queryClient.invalidateQueries({ queryKey: ["formation", id] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Erreur lors de l'inscription");
    },
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
      <PageShell>
        <div className="flex justify-center py-32 text-muted-foreground">Chargement...</div>
      </PageShell>
      </ProtectedRoute>
    );
  }

  if (!formation) throw notFound();

  const sessions = formation.sessions || [];

  const handleEnroll = (sessionId: string) => {
    if (!user) { navigate({ to: "/connexion" }); return; }
    if (user.role !== "participant") { toast.error("Seuls les participants peuvent s'inscrire."); return; }
    enrollMutation.mutate(sessionId);
  };

  return (
    <ProtectedRoute>
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <Link to="/catalogue" className="text-sm text-muted-foreground hover:text-foreground">← Catalogue</Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 aspect-[16/10] flex items-center justify-center">
              {formation.imageUrl ? (
                <img src={`http://localhost:3001${formation.imageUrl}`} alt={formation.titre} className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-6xl text-muted-foreground/20">{formation.titre[0]}</span>
              )}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{formation.categorie || "Général"}</div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">{formation.titre}</h1>
            <p className="mt-4 text-muted-foreground">{formation.description}</p>
            <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-border p-4">
              <div>
                <div className="text-xs text-muted-foreground">Niveau</div>
                <div className="mt-1 text-sm font-medium capitalize">{formation.type}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Durée</div>
                <div className="mt-1 text-sm font-medium">{formation.dureeEnJours} jour{formation.dureeEnJours > 1 ? "s" : ""}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Tarif</div>
                <div className="mt-1 text-sm font-medium">{formation.tarif ? `${formation.tarif} €` : "Sur devis"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-3xl">Prochaines sessions</h2>
        <div className="mt-8 space-y-3">
          {sessions.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Aucune session programmée pour l'instant.
            </div>
          )}
          {sessions.map((s) => {
            const formateur = s.formateurs?.[0];
            const enrolled = s.participants?.some((p: { id: string }) => p.id === user?.id);
            const count = s.participants?.length || 0;
            const full = count >= (formation.capaciteMax || 999);
            return (
              <div key={s.id} className="grid items-center gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-12">
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {fmtDate(s.dateDebut)} → {fmtDate(s.dateFin)}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {s.lieu || "Distanciel"}
                  </div>
                </div>
                <div className="md:col-span-3 text-sm text-muted-foreground">
                  Avec <span className="text-foreground">
                    {formateur ? `${formateur.prenom} ${formateur.nom}` : "Formateur à définir"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {count}/{formation.capaciteMax || "—"}
                  </div>
                </div>
                <div className="md:col-span-1 md:text-right">
                  {enrolled ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-accent text-accent-foreground rounded-full">Inscrit</Badge>
                      <Button variant="outline" size="sm" className="gap-1.5 rounded-full" asChild>
                        <Link to="/evaluation/$sessionId" params={{ sessionId: s.id }}>
                          <Star className="h-4 w-4" /> Évaluer
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      disabled={full || enrollMutation.isPending}
                      onClick={() => handleEnroll(s.id)}
                      className="rounded-full"
                    >
                      {full ? "Complet" : enrollMutation.isPending ? "..." : "S'inscrire"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
    </ProtectedRoute>
  );
}
