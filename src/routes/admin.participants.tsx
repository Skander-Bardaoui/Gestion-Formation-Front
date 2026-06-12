import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/participants")({
  component: AdminParticipants,
});

const people = [
  { name: "Marie Durand", email: "marie.durand@acme.fr", company: "Acme SA", role: "Cheffe de projet", trainings: 7, last: "12 juin 2026" },
  { name: "Karim El Amrani", email: "karim.elamrani@oryx.fr", company: "Oryx", role: "Lead développeur", trainings: 5, last: "08 juin 2026" },
  { name: "Inès Picard", email: "ines.picard@lumen.fr", company: "Lumen", role: "DRH", trainings: 12, last: "03 juin 2026" },
  { name: "Théo Brun", email: "theo.brun@nordic.fr", company: "Nordic", role: "Ingénieur", trainings: 3, last: "29 mai 2026" },
  { name: "Sofia Reis", email: "sofia.reis@petalum.fr", company: "Petalum", role: "Designer", trainings: 9, last: "25 mai 2026" },
  { name: "Antoine Wagner", email: "antoine.w@vertige.fr", company: "Vertige", role: "Commercial", trainings: 4, last: "20 mai 2026" },
];

function AdminParticipants() {
  return (
    <AdminShell
      title="Participants"
      subtitle="Profils, historique de formation et certifications obtenues."
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
            <Download className="h-4 w-4" /> Exporter
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </>
      }
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Entreprise</th>
              <th className="px-4 py-3">Poste</th>
              <th className="px-4 py-3">Formations suivies</th>
              <th className="px-4 py-3">Dernière session</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.email} className="border-t border-border hover:bg-secondary/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {p.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{p.company}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.role}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{p.trainings}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{p.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}