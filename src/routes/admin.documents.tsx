import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, FileSignature, FileText, QrCode } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/documents")({
  component: AdminDocuments,
});

const docs = [
  { name: "Certificat — Leadership #1284.pdf", type: "Certificat", size: "184 Ko", signed: true, date: "12 juin 2026" },
  { name: "Support — Cybersécurité.pdf", type: "Support", size: "3,2 Mo", signed: false, date: "10 juin 2026" },
  { name: "Convention — Acme SA.pdf", type: "Convention", size: "92 Ko", signed: true, date: "08 juin 2026" },
  { name: "Facture — F-2026-0418.pdf", type: "Facture", size: "76 Ko", signed: true, date: "07 juin 2026" },
  { name: "Programme — Excel avancé.pdf", type: "Programme", size: "240 Ko", signed: false, date: "05 juin 2026" },
  { name: "Feuille de présence — Session 1190.pdf", type: "Présence", size: "120 Ko", signed: true, date: "03 juin 2026" },
];

function AdminDocuments() {
  return (
    <AdminShell
      title="Documents"
      subtitle="Centralisez tous les documents : certificats, conventions, factures et supports de formation."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Tile icon={Award} label="Certificats émis" value="412" />
        <Tile icon={FileSignature} label="Signatures électroniques" value="287" />
        <Tile icon={QrCode} label="Vérifications QR-code" value="1 084" />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-xl">Documents récents</h2>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary">
            <Download className="h-4 w-4" /> Tout télécharger
          </button>
        </div>
        <ul className="divide-y divide-border">
          {docs.map((d) => (
            <li key={d.name} className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 text-sm hover:bg-secondary/40">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary"><FileText className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="truncate font-medium">{d.name}</p>
                <p className="truncate text-xs text-muted-foreground">{d.type} · {d.size} · {d.date}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {d.signed && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Signé</span>}
                <button className="rounded p-1 hover:bg-secondary"><Download className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}

function Tile({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
      <p className="mt-4 font-display text-3xl">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}