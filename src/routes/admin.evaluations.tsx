import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin-shell";
import { getEvaluations } from "@/lib/api/evaluations";
import { Star, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/evaluations")({
  head: () => ({ meta: [{ title: "Évaluations — StirForma Admin" }] }),
  component: AdminEvaluationsPage,
});

function StarDisplay({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.round(value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`}
        />
      ))}
    </div>
  );
}

function AdminEvaluationsPage() {
  const { data: evaluations, isLoading } = useQuery({
    queryKey: ["evaluations"],
    queryFn: getEvaluations,
  });

  const avg = (vals: (number | undefined | null)[]) => {
    const nums = vals.filter((v): v is number => v != null);
    return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : "—";
  };

  const total = evaluations?.length || 0;
  const avgNote = avg(evaluations?.map((e) => e.note) || []);
  const avgContenu = avg(evaluations?.map((e) => e.noteContenu) || []);
  const avgPedagogie = avg(evaluations?.map((e) => e.notePedagogie) || []);
  const avgOrganisation = avg(evaluations?.map((e) => e.noteOrganisation) || []);

  return (
    <AdminShell title="Évaluations" subtitle="Consultez les évaluations des participants.">
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Total" value={String(total)} />
            <StatCard label="Note générale" value={avgNote} />
            <StatCard label="Contenu" value={avgContenu} />
            <StatCard label="Pédagogie" value={avgPedagogie} />
            <StatCard label="Organisation" value={avgOrganisation} />
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Formation</th>
                  <th className="px-4 py-3">Formateur</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Général</th>
                  <th className="px-4 py-3">Contenu</th>
                  <th className="px-4 py-3">Pédagogie</th>
                  <th className="px-4 py-3">Organisation</th>
                  <th className="px-4 py-3">Recommande</th>
                  <th className="px-4 py-3">Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {(!evaluations || evaluations.length === 0) && (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">Aucune évaluation pour le moment.</td></tr>
                )}
                {evaluations?.map((e) => (
                  <tr key={e.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-3 font-medium">{e.participant?.prenom} {e.participant?.nom}</td>
                    <td className="px-4 py-3">{e.session?.formation?.titre || "—"}</td>
                    <td className="px-4 py-3">{e.formateur?.prenom} {e.formateur?.nom}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(e.dateEvaluation).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3"><StarDisplay value={e.note} /></td>
                    <td className="px-4 py-3">{e.noteContenu != null ? <StarDisplay value={e.noteContenu} /> : "—"}</td>
                    <td className="px-4 py-3">{e.notePedagogie != null ? <StarDisplay value={e.notePedagogie} /> : "—"}</td>
                    <td className="px-4 py-3">{e.noteOrganisation != null ? <StarDisplay value={e.noteOrganisation} /> : "—"}</td>
                    <td className="px-4 py-3">{e.recommande ? "✅ Oui" : "❌ Non"}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground" title={e.commentaire || ""}>
                      {e.commentaire || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}
