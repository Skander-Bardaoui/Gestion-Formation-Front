import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star, Loader2, Mail, Pencil, Trash2 } from "lucide-react";

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3 w-3 ${s <= Math.round(value) ? "fill-ochre text-ochre" : "text-muted-foreground/20"}`} />
      ))}
    </div>
  );
}
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { getFormateurs, createFormateur, updateFormateur, deleteFormateur, type Formateur } from "@/lib/api/formateurs";
import { formatPhone } from "@/lib/phone";
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
import { Textarea } from "@/components/ui/textarea";
import { formateurSchema } from "@/lib/validations";

export const Route = createFileRoute("/admin/formateurs")({
  component: AdminFormateurs,
});

const emptyForm = { nom: "", prenom: "", email: "", telephone: "", specialites: "", qualifications: "" };

function AdminFormateurs() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: formateurs, isLoading } = useQuery({ queryKey: ["formateurs"], queryFn: getFormateurs });

  const saveMutation = useMutation({
    mutationFn: () => editingId ? updateFormateur(editingId, form) : createFormateur(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs"] });
      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success(editingId ? "Formateur modifié" : "Formateur ajouté · Email envoyé");
    },
    onError: (err: any) => {
      try { const msg = JSON.parse(err.message); toast.error(msg.message || "Erreur"); }
      catch { toast.error("Erreur lors de l'enregistrement"); }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFormateur(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs"] });
      setDeleteId(null);
      toast.success("Formateur supprimé");
    },
    onError: (err: any) => {
      console.error("Delete formateur error:", err);
      toast.error(err.message || "Erreur lors de la suppression");
      setDeleteId(null);
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (t: Formateur) => {
    setEditingId(t.id);
    setForm({
      nom: t.nom,
      prenom: t.prenom,
      email: t.email,
      telephone: t.telephone || "",
      specialites: t.specialites || "",
      qualifications: t.qualifications || "",
    });
    setOpen(true);
  };

  return (
    <AdminShell
      title="Formateurs"
      subtitle="Gerer vos intervenants : consultez leurs profils, specialites, disponibilites et consultez leurs evaluations."
      actions={
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> Ajouter un formateur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Modifier le formateur" : "Nouveau formateur"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); setFormErrors({}); const r = formateurSchema.safeParse(form); if (!r.success) { const fe: Record<string, string> = {}; r.error.issues.forEach((i) => { const f = i.path[0] as string; if (!fe[f]) fe[f] = i.message; }); setFormErrors(fe); return; } saveMutation.mutate(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Nom</Label><Input placeholder="ex : Martin" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                {formErrors.nom && <p className="mt-1 text-xs text-destructive">{formErrors.nom}</p>}</div>
                <div><Label>Prénom</Label><Input placeholder="ex : Sophie" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
                {formErrors.prenom && <p className="mt-1 text-xs text-destructive">{formErrors.prenom}</p>}</div>
              </div>
              <div><Label>Email</Label><Input type="email" placeholder="ex : sophie.martin@exemple.fr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {formErrors.email && <p className="mt-1 text-xs text-destructive">{formErrors.email}</p>}</div>
              <div><Label>Téléphone</Label><Input placeholder="+216XXXXXXXX" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} onBlur={(e) => setForm({ ...form, telephone: formatPhone(e.target.value) })} />
              {formErrors.telephone && <p className="mt-1 text-xs text-destructive">{formErrors.telephone}</p>}</div>
              <div><Label>Spécialités</Label><Input placeholder="ex : Cybersécurité, Réseau" value={form.specialites} onChange={(e) => setForm({ ...form, specialites: e.target.value })} /></div>
              <div><Label>Qualifications</Label><Textarea placeholder="Diplômes, certifications, années d'expérience..." value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} /></div>
              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingId ? "Enregistrer les modifications" : "Ajouter le formateur"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {formateurs?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">Aucun formateur pour le moment</div>
          )}
          {formateurs?.map((t: Formateur) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground overflow-hidden">
                  {t.avatarUrl ? (
                    <img src={`http://localhost:3001${t.avatarUrl}`} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <>{t.prenom?.[0]}{t.nom?.[0]}</>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-lg">{t.prenom} {t.nom}</h3>
                  <p className="truncate text-xs text-muted-foreground">{t.specialites || "—"}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating value={t.noteGlobale} />
                    <span className="text-xs text-muted-foreground">({t.noteGlobale || "—"})</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(t)} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(t.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Disponible</span>
                <a href={`mailto:${t.email}`} className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs hover:bg-secondary">
                  <Mail className="h-3 w-3" /> Contacter
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce formateur ?</AlertDialogTitle>
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
