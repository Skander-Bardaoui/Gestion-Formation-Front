import { createFileRoute } from "@tanstack/react-router";
import { Filter, MoreHorizontal, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { formations } from "@/lib/data";

export const Route = createFileRoute("/admin/formations")({
  component: AdminFormations,
});

function AdminFormations() {
  return (
    <AdminShell
      title="Formations"
      subtitle="Gérez votre catalogue : intra, inter et formations à la carte."
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
            <Filter className="h-4 w-4" /> Filtres
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Nouvelle formation
          </button>
        </>
      }
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Format</th>
              <th className="px-4 py-3">Durée</th>
              <th className="px-4 py-3">Prix HT</th>
              <th className="px-4 py-3">Sessions</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {formations.map((f) => (
              <tr key={f.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-4 py-3 font-medium">{f.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{f.category}</td>
                <td className="px-4 py-3"><span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{f.type}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{f.duration}</td>
                <td className="px-4 py-3">{f.price} €</td>
                <td className="px-4 py-3 text-muted-foreground">3 planifiées</td>
                <td className="px-4 py-3 text-right"><button className="rounded p-1 hover:bg-secondary"><MoreHorizontal className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}