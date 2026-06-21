import { createFileRoute } from "@tanstack/react-router";
import { Plus, Loader2, Pencil, Trash2, ChevronDown, ChevronUp, Search, FileText } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { getSessions, createSession, updateSession, deleteSession, type Session } from "@/lib/api/sessions";
import { getFormations } from "@/lib/api/formations";
import { getEmployes } from "@/lib/api/employes";
import { getFormateurs } from "@/lib/api/formateurs";
import { getParticipants } from "@/lib/api/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sessionSchema } from "@/lib/validations";

export const Route = createFileRoute("/admin/sessions")({
  component: AdminSessions,
});

const months = ["JAN","FÉV","MAR","AVR","MAI","JUI","JUI","AOÛ","SEP","OCT","NOV","DÉC"];

async function downloadPresenceList(sessionId: string, titre?: string) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`http://localhost:3001/api/sessions/${sessionId}/presence-list`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) { toast.error("Erreur lors du téléchargement"); return; }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `feuille_presence_${(titre || 'formation').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
const emptyForm = { dateDebut: "", dateFin: "", lieu: "", formationId: "", participantIds: [] as string[], employeIds: [] as string[], formateurIds: [] as string[] };

function AdminSessions() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [employeSearch, setEmployeSearch] = useState("");
  const [source, setSource] = useState<"employes" | "participants">("participants");

  const { data: sessions, isLoading } = useQuery({ queryKey: ["sessions"], queryFn: getSessions });
  const { data: formations } = useQuery({ queryKey: ["formations"], queryFn: getFormations });
  const { data: employes } = useQuery({ queryKey: ["employes"], queryFn: getEmployes });
  const { data: formateurs } = useQuery({ queryKey: ["formateurs"], queryFn: getFormateurs });
  const { data: participants } = useQuery({ queryKey: ["participants"], queryFn: getParticipants });

  const selectedFormation = formations?.find((f: any) => f.id === form.formationId);
  const formationType = selectedFormation?.type;
  const showSourceToggle = formationType === "intra";
  const showEmployes = formationType === "inter" || (showSourceToggle && source === "employes");
  const showParticipants = formationType !== "inter" && (!showSourceToggle || source === "participants");

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        participantIds: form.participantIds.length ? form.participantIds : undefined,
        employeIds: form.employeIds.length ? form.employeIds : undefined,
        formateurIds: form.formateurIds.length ? form.formateurIds : undefined,
      };
      return editingId ? updateSession(editingId, payload) : createSession(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success(editingId ? "Session modifiée" : "Session créée");
    },
    onError: () => toast.error("Erreur lors de l'enregistrement"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setDeleteId(null);
      toast.success("Session supprimée");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setDeleteId(null);
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (s: Session) => {
    setEditingId(s.id);
    setForm({
      dateDebut: s.dateDebut ? new Date(s.dateDebut).toISOString().slice(0, 16) : "",
      dateFin: s.dateFin ? new Date(s.dateFin).toISOString().slice(0, 16) : "",
      lieu: s.lieu || "",
      formationId: s.formation?.id || "",
      participantIds: s.participants?.map((p: any) => p.id) || [],
      employeIds: s.employes?.map((e: any) => e.id) || [],
      formateurIds: s.formateurs?.map((f: any) => f.id) || [],
    });
    setOpen(true);
  };

  const filteredEmployes = employes?.filter((e: any) =>
    !employeSearch || `${e.nom} ${e.prenom} ${e.identifiant || ""}`.toLowerCase().includes(employeSearch.toLowerCase())
  ) || [];

  const toggleEmploye = (id: string) => {
    setForm((f) => ({ ...f, employeIds: f.employeIds.includes(id) ? f.employeIds.filter((x) => x !== id) : [...f.employeIds, id] }));
  };
  const toggleParticipant = (id: string) => {
    setForm((f) => ({ ...f, participantIds: f.participantIds.includes(id) ? f.participantIds.filter((x) => x !== id) : [...f.participantIds, id] }));
  };
  const toggleFormateur = (id: string) => {
    setForm((f) => ({ ...f, formateurIds: f.formateurIds.includes(id) ? f.formateurIds.filter((x) => x !== id) : [...f.formateurIds, id] }));
  };

  return (
    <AdminShell
      title="Sessions"
      subtitle="Planifiez, convoquez, suivez les présences."
      actions={
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> Planifier une session</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? "Modifier la session" : "Nouvelle session"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setFormErrors({}); const r = sessionSchema.safeParse(form); if (!r.success) { const fe: Record<string, string> = {}; r.error.issues.forEach((i) => { const f = i.path[0] as string; if (!fe[f]) fe[f] = i.message; }); setFormErrors(fe); return; } saveMutation.mutate(); }} className="space-y-4">
              {formErrors.form && <p className="text-xs text-destructive">{formErrors.form}</p>}
              <div><Label>Formation</Label>
                <Select value={form.formationId} onValueChange={(v) => setForm({ ...form, formationId: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner une formation" /></SelectTrigger>
                  <SelectContent>
                    {formations?.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.titre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date début</Label><Input type="datetime-local" value={form.dateDebut} onChange={(e) => setForm({ ...form, dateDebut: e.target.value })} />
                {formErrors.dateDebut && <p className="mt-1 text-xs text-destructive">{formErrors.dateDebut}</p>}</div>
                <div><Label>Date fin</Label><Input type="datetime-local" value={form.dateFin} onChange={(e) => setForm({ ...form, dateFin: e.target.value })} />
                {formErrors.dateFin && <p className="mt-1 text-xs text-destructive">{formErrors.dateFin}</p>}</div>
              </div>
              <div><Label>Lieu</Label><Input placeholder="ex : Paris 11e — Salle 3B" value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} /></div>
              {showSourceToggle && (
                <div>
                  <Label>Type de participants</Label>
                  <div className="flex gap-2 rounded-md border border-border p-1">
                    <button
                      type="button"
                      onClick={() => setSource("employes")}
                      className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${source === "employes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Employés
                    </button>
                    <button
                      type="button"
                      onClick={() => setSource("participants")}
                      className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${source === "participants" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Participants
                    </button>
                  </div>
                </div>
              )}
              {showEmployes && (
                <div>
                  <Label>Employés</Label>
                  <div className="relative mb-1">
                    <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      placeholder="Rechercher par identifiant ou nom…"
                      value={employeSearch}
                      onChange={(e) => setEmployeSearch(e.target.value)}
                      className="w-full rounded-md border border-border bg-background py-1.5 pl-7 pr-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1 rounded-md border p-2">
                    {filteredEmployes.map((e: any) => (
                      <label key={e.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.employeIds.includes(e.id)} onChange={() => toggleEmploye(e.id)} className="rounded" />
                        <span className="font-mono text-xs text-muted-foreground">{e.identifiant || "—"}</span>
                        <span>{e.prenom} {e.nom}</span>
                      </label>
                    ))}
                    {filteredEmployes.length === 0 && <p className="text-xs text-muted-foreground py-2 text-center">
                      {employeSearch ? "Aucun employé trouvé" : "Aucun employé disponible"}
                    </p>}
                  </div>
                </div>
              )}
              {showParticipants && (
                <div>
                  <Label>Participants</Label>
                  <div className="max-h-40 overflow-y-auto space-y-1 rounded-md border p-2">
                    {participants?.map((p: any) => (
                      <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.participantIds.includes(p.id)} onChange={() => toggleParticipant(p.id)} className="rounded" />
                        <span>{p.prenom} {p.nom}</span>
                      </label>
                    ))}
                    {(!participants || participants.length === 0) && <p className="text-xs text-muted-foreground py-2 text-center">Aucun participant disponible</p>}
                  </div>
                </div>
              )}
              <div><Label>Formateurs</Label>
                <div className="max-h-32 overflow-y-auto space-y-1 rounded-md border p-2">
                  {formateurs?.map((f: any) => (
                    <label key={f.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={form.formateurIds.includes(f.id)} onChange={() => toggleFormateur(f.id)} className="rounded" />
                      {f.prenom} {f.nom}
                    </label>
                  ))}
                  {(!formateurs || formateurs.length === 0) && <p className="text-xs text-muted-foreground">Aucun formateur disponible</p>}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingId ? "Enregistrer les modifications" : "Créer la session"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {sessions?.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">Aucune session planifiée</div>
          )}
          {sessions?.map((s: Session) => {
            const d = new Date(s.dateDebut);
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card">
                <div className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-4 p-5">
                  <div className="rounded-md bg-secondary p-3 text-center">
                    <div className="text-xs uppercase text-muted-foreground">{months[d.getMonth()]}</div>
                    <div className="font-display text-2xl text-primary">{d.getDate()}</div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xl">{s.formation?.titre || "Formation"}</h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {s.formateurs?.map((f: any) => `${f.prenom} ${f.nom}`).join(", ") || "Aucun formateur"} · {s.lieu || "À définir"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="hidden text-right md:block">
                      <p className="text-xs uppercase text-muted-foreground">Participants</p>
                      <p className="text-sm font-medium">{s.participants?.length || 0}</p>
                    </div>
                    <button onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} className="rounded-md border border-border bg-background p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                      {expandedId === s.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <button onClick={() => downloadPresenceList(s.id, s.formation?.titre)} className="rounded-md border border-border bg-background p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Télécharger la feuille de présence"><FileText className="h-4 w-4" /></button>
                    <button onClick={() => openEdit(s)} className="rounded-md border border-border bg-background p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteId(s.id)} className="rounded-md border border-border bg-background p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                {expandedId === s.id && (
                  <div className="border-t border-border px-5 py-3 space-y-3">
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Participants (utilisateurs)</p>
                      {s.participants?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {s.participants.map((p: any) => (
                            <span key={p.id} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium">
                              {p.prenom} {p.nom}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucun</p>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Employés</p>
                      {s.employes?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {s.employes.map((e: any) => (
                            <span key={e.id} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium">
                              {e.prenom} {e.nom}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucun</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette session ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
