import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { formations } from "@/lib/data";

export const Route = createFileRoute("/admin/sessions")({
  component: AdminSessions,
});

function AdminSessions() {
  return (
    <AdminShell
      title="Sessions"
      subtitle="Planifiez, convoquez, suivez les présences."
      actions={
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Planifier une session
        </button>
      }
    >
      {/* Mini calendar */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">Juin 2026</h2>
          <div className="flex gap-1">
            <button className="rounded-md border border-border bg-background px-3 py-1 text-sm hover:bg-secondary">←</button>
            <button className="rounded-md border border-border bg-background px-3 py-1 text-sm hover:bg-secondary">→</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wide text-muted-foreground">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div key={i} className="py-2">{d}</div>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const has = [6, 12, 15, 22, 27].includes(day);
            const today = day === 12;
            return (
              <button
                key={day}
                className={
                  "relative aspect-square rounded-md border text-sm transition-colors " +
                  (today ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-secondary")
                }
              >
                {day}
                {has && !today && <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ochre" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions list */}
      <div className="mt-8 space-y-3">
        {formations.map((f, i) => (
          <div key={f.id} className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="rounded-md bg-secondary p-3 text-center">
              <div className="text-xs uppercase text-muted-foreground">{["JUI","JUI","AOÛ","SEP","JUI","JUI"][i % 6]}</div>
              <div className="font-display text-2xl text-primary">{[22, 14, 5, 10, 30, 18][i % 6]}</div>
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-display text-xl">{f.title}</h3>
              <p className="truncate text-sm text-muted-foreground">{f.trainer} · {f.location} · {f.duration}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-xs uppercase text-muted-foreground">Présences</p>
                <p className="text-sm font-medium">{f.enrolled}/{f.seats}</p>
              </div>
              <button className="rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">Détails</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}