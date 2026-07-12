import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  GraduationCap,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CabinetShell } from "@/components/cabinet-shell";
import { getFormations } from "@/lib/api/formations";
import { getSessions } from "@/lib/api/sessions";
import { getFormateurs } from "@/lib/api/formateurs";

export const Route = createFileRoute("/cabinet/")({
  component: CabinetDashboard,
});

function CabinetDashboard() {
  const { data: formations } = useQuery({
    queryKey: ["cabinet-formations"],
    queryFn: getFormations,
  });
  const { data: sessions } = useQuery({ queryKey: ["cabinet-sessions"], queryFn: getSessions });
  const { data: formateurs } = useQuery({
    queryKey: ["cabinet-formateurs"],
    queryFn: getFormateurs,
  });

  const sessionsCeMois =
    sessions?.filter((s) => {
      const d = new Date(s.dateDebut);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length || 0;

  const kpis = [
    {
      label: "Sessions ce mois",
      value: String(sessionsCeMois),
      delta: "—",
      icon: Calendar,
      tone: "primary" as const,
    },
    {
      label: "Formateurs",
      value: String(formateurs?.length || 0),
      delta: "—",
      icon: GraduationCap,
      tone: "ochre" as const,
    },
    {
      label: "Formations au catalogue",
      value: String(formations?.length || 0),
      delta: "—",
      icon: BookOpen,
      tone: "primary" as const,
    },
    {
      label: "Taux de satisfaction",
      value: "98%",
      delta: "—",
      icon: TrendingUp,
      tone: "ochre" as const,
    },
  ];

  return (
    <CabinetShell
      title="Tableau de bord"
      subtitle="Gérez vos formations, sessions et formateurs."
      actions={
        <>
          <Link
            to="/cabinet/sessions"
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + Nouvelle session
          </Link>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span
                className={
                  "grid h-9 w-9 place-items-center rounded-md " +
                  (k.tone === "primary"
                    ? "bg-primary/10 text-primary"
                    : "bg-ochre/20 text-ochre-foreground")
                }
              >
                <k.icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-medium text-primary">{k.delta}</span>
            </div>
            <p className="mt-4 font-display text-3xl">{k.value}</p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl">Prochaines sessions</h2>
            <p className="text-sm text-muted-foreground">
              Les sessions planifiées dans les 30 prochains jours.
            </p>
          </div>
          <Link
            to="/cabinet/sessions"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            Tout voir <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-5 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Formation</th>
                <th className="px-4 py-3">Formateur</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Lieu</th>
                <th className="px-4 py-3">Inscrits</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {(!sessions || sessions.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    Aucune session planifiée
                  </td>
                </tr>
              )}
              {sessions?.slice(0, 5).map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{s.formation?.titre || "Formation"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.formateurs?.map((f: any) => `${f.prenom} ${f.nom}`).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(s.dateDebut).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.lieu || "—"}</td>
                  <td className="px-4 py-3">{s.participants?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs " +
                        (s.isCancelled
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary")
                      }
                    >
                      {s.isCancelled ? "Annulée" : s.isCompleted ? "Terminée" : "Planifiée"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CabinetShell>
  );
}
