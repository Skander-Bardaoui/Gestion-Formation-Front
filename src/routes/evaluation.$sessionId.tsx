import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Star, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { getSession } from "@/lib/api/sessions";
import { createEvaluation } from "@/lib/api/evaluations";
import { useState } from "react";

export const Route = createFileRoute("/evaluation/$sessionId")({
  head: () => ({ meta: [{ title: "Évaluer — StirForma" }] }),
  component: EvaluerPage,
});

function StarInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded-md p-1 transition-all hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function EvaluerPage() {
  const { sessionId } = Route.useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSession(sessionId),
  });

  const [note, setNote] = useState(0);
  const [noteContenu, setNoteContenu] = useState(0);
  const [notePedagogie, setNotePedagogie] = useState(0);
  const [noteSupports, setNoteSupports] = useState(0);
  const [noteOrganisation, setNoteOrganisation] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [recommande, setRecommande] = useState(false);

  const formateur = session?.formateurs?.[0];

  const mutation = useMutation({
    mutationFn: () => {
      if (!formateur) throw new Error("Aucun formateur trouvé pour cette session");
      if (!user) throw new Error("Utilisateur non connecté");
      return createEvaluation({
        note,
        noteContenu: noteContenu || undefined,
        notePedagogie: notePedagogie || undefined,
        noteSupports: noteSupports || undefined,
        noteOrganisation: noteOrganisation || undefined,
        commentaire: commentaire || undefined,
        recommande,
        dateEvaluation: new Date().toISOString(),
        formateurId: formateur.id,
        sessionId,
        participantId: user.id,
      });
    },
    onSuccess: () => {
      toast.success("Évaluation envoyée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["my-sessions"] });
    },
    onError: (err: any) => {
      try {
        const msg = JSON.parse(err.message);
        toast.error(msg.message || "Erreur lors de l'envoi");
      } catch {
        toast.error("Erreur lors de l'envoi");
      }
    },
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <PageShell>
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        </PageShell>
      </ProtectedRoute>
    );
  }

  if (!session) {
    return (
      <ProtectedRoute>
        <PageShell>
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <p className="text-lg">Session introuvable.</p>
            <Link to="/mes-formations" className="mt-4 inline-block text-primary underline">Retour</Link>
          </div>
        </PageShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageShell>
        <div className="mx-auto max-w-2xl px-6 py-12">
          <Link to="/mes-formations" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Retour à mes formations
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl">Évaluation de la formation</h1>
            <p className="mt-1.5 text-muted-foreground">
              {session.formation?.titre} — {new Date(session.dateDebut).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-base">📚</span>
                Formation
              </h2>
              <div className="space-y-5">
                <StarInput label="Qualité du contenu" value={noteContenu} onChange={setNoteContenu} />
                <div className="border-t border-border/50" />
                <StarInput label="Qualité des supports" value={noteSupports} onChange={setNoteSupports} />
                <div className="border-t border-border/50" />
                <StarInput label="Note générale" value={note} onChange={setNote} />
              </div>
            </section>

            {formateur && (
              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-5 flex items-center gap-2 font-display text-lg">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-base">👤</span>
                  Formateur
                  <span className="ml-auto text-sm font-normal text-muted-foreground">{formateur.prenom} {formateur.nom}</span>
                </h2>
                <StarInput label="Qualité pédagogique" value={notePedagogie} onChange={setNotePedagogie} />
              </section>
            )}

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-base">🏢</span>
                Organisation
              </h2>
              <StarInput label="Organisation" value={noteOrganisation} onChange={setNoteOrganisation} />
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-base">💬</span>
                Commentaire
              </h2>
              <div className="space-y-4">
                <Textarea
                  id="commentaire"
                  placeholder="Partagez votre expérience…"
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="recommande"
                    checked={recommande}
                    onCheckedChange={(v) => setRecommande(v === true)}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="recommande" className="cursor-pointer text-sm font-medium">
                    Je recommanderais cette formation
                  </Label>
                </div>
              </div>
            </section>

            <Button
              onClick={() => mutation.mutate()}
              disabled={note === 0 || mutation.isPending}
              className="w-full h-12 text-base"
            >
              {mutation.isPending ? "Envoi en cours…" : "Envoyer l'évaluation"}
            </Button>
          </div>
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
