import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin-shell";
import { getEvaluations } from "@/lib/api/evaluations";
import { getFormations } from "@/lib/api/formations";
import { getFormateurs } from "@/lib/api/formateurs";
import { Star, Loader2, MessageSquareText, Filter, X } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/admin/evaluations")({
  head: () => ({ meta: [{ title: "Évaluations — StirForma Admin" }] }),
  component: AdminEvaluationsPage,
});

const ratingMeta = [
  { key: "noteContenu", label: "Contenu" },
  { key: "notePedagogie", label: "Pédagogie" },
  { key: "noteSupports", label: "Supports" },
  { key: "noteOrganisation", label: "Organisation" },
];

function StarRating({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${s <= Math.round(value) ? "fill-ochre text-ochre" : "text-muted-foreground/15"}`}
        />
      ))}
    </div>
  );
}

function pct(val: number, total: number) {
  return total ? `${Math.round((val / total) * 100)}%` : "—";
}

function AdminEvaluationsPage() {
  const [formationFilter, setFormationFilter] = useState("");
  const [formateurFilter, setFormateurFilter] = useState("");

  const { data: formations } = useQuery({ queryKey: ["formations"], queryFn: getFormations });
  const { data: formateurs } = useQuery({ queryKey: ["formateurs"], queryFn: getFormateurs });

  const { data: evaluations, isLoading } = useQuery({
    queryKey: ["evaluations", formationFilter, formateurFilter],
    queryFn: () => getEvaluations({ formationId: formationFilter || undefined, formateurId: formateurFilter || undefined }),
  });

  const avg = (vals: (number | undefined | null)[]) => {
    const nums = vals.filter((v): v is number => v != null);
    return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : "—";
  };

  const stats = useMemo(() => {
    if (!evaluations) return null;
    const total = evaluations.length;
    const n4 = evaluations.filter((e) => e.note >= 4).length;
    const recommends = evaluations.filter((e) => e.recommande).length;
    return {
      total,
      successRate: pct(n4, total),
      recommendRate: pct(recommends, total),
      avgNote: avg(evaluations.map((e) => e.note)),
      avgContenu: avg(evaluations.map((e) => e.noteContenu)),
      avgPedagogie: avg(evaluations.map((e) => e.notePedagogie)),
      avgOrganisation: avg(evaluations.map((e) => e.noteOrganisation)),
    };
  }, [evaluations]);

  const formationOpts = useMemo(() => {
    if (!formations || !evaluations) return [];
    const ids = new Set(evaluations.map((e) => e.session?.formation?.id).filter(Boolean));
    return formations.filter((f) => ids.has(f.id));
  }, [formations, evaluations]);

  const formateurOpts = useMemo(() => {
    if (!formateurs || !evaluations) return [];
    const ids = new Set(evaluations.map((e) => e.formateur?.id).filter(Boolean));
    return formateurs.filter((f) => ids.has(f.id));
  }, [formateurs, evaluations]);

  return (
    <AdminShell title="Évaluations" subtitle="Analysez les retours des participants : notes, commentaires et taux de satisfaction pour chaque formation.">
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" /> Filtrer par
            </div>
            <select
              value={formationFilter}
              onChange={(e) => setFormationFilter(e.target.value)}
              className="h-8 rounded-lg border border-border bg-card px-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Toutes les formations</option>
              {formationOpts.map((f) => (
                <option key={f.id} value={f.id}>{f.titre}</option>
              ))}
            </select>
            <select
              value={formateurFilter}
              onChange={(e) => setFormateurFilter(e.target.value)}
              className="h-8 rounded-lg border border-border bg-card px-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Tous les formateurs</option>
              {formateurOpts.map((f) => (
                <option key={f.id} value={f.id}>{f.prenom} {f.nom}</option>
              ))}
            </select>
            {(formationFilter || formateurFilter) && (
              <button
                onClick={() => { setFormationFilter(""); setFormateurFilter(""); }}
                className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-secondary"
              >
                <X className="h-3 w-3" /> Réinitialiser
              </button>
            )}
          </div>

          {stats && (
            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md border-t-[3px] border-t-primary">
                <p className="text-[11px] uppercase tracking-widest text-primary">Évaluations</p>
                <p className="mt-0.5 font-display text-2xl">{stats.total}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md border-t-[3px] border-t-ochre">
                <p className="text-[11px] uppercase tracking-widest text-ochre">Taux de succès</p>
                <p className="mt-0.5 font-display text-2xl">{stats.successRate}</p>
                <p className="text-[10px] text-muted-foreground">Notes ≥ 4/5</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md border-t-[3px] border-t-accent">
                <p className="text-[11px] uppercase tracking-widest text-accent-foreground/70">Recommandation</p>
                <p className="mt-0.5 font-display text-2xl">{stats.recommendRate}</p>
                <p className="text-[10px] text-muted-foreground">Recommandent cette formation</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md border-t-[3px] border-t-primary/50">
                <p className="text-[11px] uppercase tracking-widest text-primary/60">Moy. générale</p>
                <p className="mt-0.5 font-display text-2xl">{stats.avgNote}</p>
                <p className="text-[10px] text-muted-foreground">/5</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md border-t-[3px] border-t-ochre/60">
                <p className="text-[11px] uppercase tracking-widest text-ochre/60">Moy. pédagogie</p>
                <p className="mt-0.5 font-display text-2xl">{stats.avgPedagogie}</p>
                <p className="text-[10px] text-muted-foreground">Qualité du formateur</p>
              </div>
            </div>
          )}

          {!evaluations || evaluations.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
              <MessageSquareText className="h-10 w-10" />
              <p className="text-lg font-medium">Aucune évaluation pour le moment</p>
              <p className="text-sm">Les évaluations des participants apparaîtront ici.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {evaluations.map((e) => (
                <div
                  key={e.id}
                  className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{e.participant?.prenom} {e.participant?.nom}</p>
                      <p className="truncate text-xs text-muted-foreground">{e.session?.formation?.titre || "Formation inconnue"}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StarRating value={e.note} size="md" />
                      <span className="font-display text-lg tabular-nums text-foreground">{e.note}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {ratingMeta.map((r, i) => {
                      const val = (e as any)[r.key];
                      if (val == null) return null;
                      const pct = (val / 5) * 100;
                      return (
                        <div key={r.key}>
                          <p className="text-[11px] text-muted-foreground">{r.label}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                              <div className="h-full rounded-full bg-primary dark:bg-foreground" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs tabular-nums text-muted-foreground">{val}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {e.commentaire && (
                    <p className="mt-3 text-xs italic leading-relaxed text-muted-foreground/70 border-t border-border/50 pt-3">
                      "{e.commentaire}"
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px] text-muted-foreground/50">
                    <span>{new Date(e.dateEvaluation).toLocaleDateString("fr-FR")}</span>
                    <span>
                      {e.formateur?.prenom} {e.formateur?.nom}
                      {e.recommande && <span className="ml-2 text-primary">· Recommandé</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
