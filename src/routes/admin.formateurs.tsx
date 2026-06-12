import { createFileRoute } from "@tanstack/react-router";
import { Mail, Plus, Star } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { trainers } from "@/lib/data";

export const Route = createFileRoute("/admin/formateurs")({
  component: AdminTrainers,
});

function AdminTrainers() {
  return (
    <AdminShell
      title="Formateurs"
      subtitle="Base de données des intervenants, qualifications et disponibilités."
      actions={
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Ajouter un formateur
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trainers.map((t) => (
          <div key={t.name} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground">
                {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-lg">{t.name}</h3>
                <p className="truncate text-xs text-muted-foreground">{t.expertise}</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-ochre-foreground"><Star className="h-3 w-3 fill-ochre text-ochre" /> {t.rating}</span>
                  <span className="text-muted-foreground">{t.sessions} sessions</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Disponible</span>
              <button className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs hover:bg-secondary">
                <Mail className="h-3 w-3" /> Contacter
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}