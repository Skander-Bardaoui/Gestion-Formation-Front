import { Link, useRouterState, useRouter, useNavigate } from "@tanstack/react-router";
import { useRef, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  CalendarDays,
  FileText,
  Settings,
  Bell,
  Search,
  LogOut,
  Moon,
  Sun,
  UserCheck,
  IdCard,
  Star,
  Wallet,
  Building2,
  BarChart3,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from "@/lib/api/notifications";
import { getFormations } from "@/lib/api/formations";
import { getSessions } from "@/lib/api/sessions";
import { getFormateurs } from "@/lib/api/formateurs";
import { getEmployes } from "@/lib/api/employes";
import { getParticipants } from "@/lib/api/users";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";

const nav = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/formations", label: "Formations", icon: BookOpen },
  { to: "/admin/sessions", label: "Sessions", icon: CalendarDays },
  { to: "/admin/employes", label: "Employés", icon: IdCard },
  { to: "/admin/formateurs", label: "Formateurs", icon: GraduationCap },
  { to: "/admin/participants", label: "Participants", icon: Users },
  { to: "/admin/approbations", label: "Approbations", icon: UserCheck },
  { to: "/admin/paiements", label: "Paiements", icon: Wallet },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/evaluations", label: "Évaluations", icon: Star },
  { to: "/admin/kpi", label: "KPI Formations", icon: BarChart3 },
  { to: "/admin/cabinets", label: "Cabinets", icon: Building2 },
];

function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const shortcut = isMac ? "⌘K" : "Ctrl+K";

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: formations } = useQuery({
    queryKey: ["search-formations"],
    queryFn: () => getFormations(undefined, true),
  });
  const { data: sessions } = useQuery({
    queryKey: ["search-sessions"],
    queryFn: () => getSessions(undefined, true),
  });
  const { data: formateurs } = useQuery({
    queryKey: ["search-formateurs"],
    queryFn: () => getFormateurs(undefined, true),
  });
  const { data: employes } = useQuery({
    queryKey: ["search-employes"],
    queryFn: getEmployes,
  });
  const { data: participants } = useQuery({
    queryKey: ["search-participants"],
    queryFn: getParticipants,
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-1 items-center gap-2 rounded-lg bg-secondary px-3 py-2"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="w-full text-left text-sm text-muted-foreground">
          Rechercher (formations, participants, sessions…)
        </span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">
          {shortcut}
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher dans toute la plateforme…" />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          {formations && formations.length > 0 && (
            <CommandGroup heading="Formations">
              {formations.map((f) => (
                <CommandItem
                  key={f.id}
                  value={`formation-${f.titre}`}
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/admin/formations" });
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{f.titre}</span>
                  {f.cabinetId && (
                    <span className="ml-auto text-[10px] text-muted-foreground">Cabinet</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {sessions && sessions.length > 0 && (
            <CommandGroup heading="Sessions">
              {sessions.map((s) => (
                <CommandItem
                  key={s.id}
                  value={`session-${s.formation?.titre || ""}-${s.lieu || ""}`}
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/admin/sessions" });
                  }}
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>{s.formation?.titre || "Session"}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(s.dateDebut).toLocaleDateString("fr-FR")}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {formateurs && formateurs.length > 0 && (
            <CommandGroup heading="Formateurs">
              {formateurs.map((f) => (
                <CommandItem
                  key={f.id}
                  value={`formateur-${f.prenom}-${f.nom}-${f.email}`}
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/admin/formateurs" });
                  }}
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>{f.prenom + " " + f.nom}</span>
                  <span className="text-xs text-muted-foreground ml-2">{f.email}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {employes && employes.length > 0 && (
            <CommandGroup heading="Employés">
              {employes.map((e) => (
                <CommandItem
                  key={e.id}
                  value={`employe-${e.prenom}-${e.nom}-${e.email}`}
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/admin/employes" });
                  }}
                >
                  <IdCard className="h-4 w-4" />
                  <span>{e.prenom + " " + e.nom}</span>
                  <span className="text-xs text-muted-foreground ml-2">{e.email}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {participants && participants.length > 0 && (
            <CommandGroup heading="Participants">
              {participants.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`participant-${p.prenom}-${p.nom}-${p.email}`}
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: "/admin/participants" });
                  }}
                >
                  <Users className="h-4 w-4" />
                  <span>{p.prenom + " " + p.nom}</span>
                  <span className="text-xs text-muted-foreground ml-2">{p.email}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/" });
  };
  return (
    <div className="min-h-screen bg-secondary/40 text-foreground">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
            <img src="/images/logoadmin.png" alt="StirForma" className="h-10 w-auto" />
            <span className="font-display text-2xl">StirForma</span>
            <span className="ml-auto rounded-md bg-sidebar-accent px-2 py-0.5 text-[10px] uppercase tracking-wide">
              Admin
            </span>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {nav.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                    (active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")
                  }
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-sidebar-border p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
            <div className="mt-3 flex items-center gap-3 rounded-md bg-sidebar-accent/60 p-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
                {user?.avatarUrl ? (
                  <img
                    src={`http://localhost:3001${user.avatarUrl}`}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : user ? (
                  user.username.slice(0, 2).toUpperCase()
                ) : (
                  "U"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.username || "Utilisateur"}</p>
                <p className="truncate text-xs text-sidebar-foreground/70 capitalize">
                  {user?.role || "Administrateur"}
                </p>
              </div>
              <Link
                to="/admin/parametres"
                className="shrink-0 rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
            <GlobalSearch />
            <DarkModeToggle />
            <NotificationBell />
          </header>

          <div className="px-6 py-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-4xl tracking-tight md:text-5xl">{title}</h1>
                {subtitle && (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground/80">
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">{actions}</div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-border p-2 text-foreground transition-colors hover:bg-secondary"
      title={dark ? "Mode clair" : "Mode sombre"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function NotificationBell() {
  const ddRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  function toggle() {
    if (!open) {
      setLoading(true);
      getNotifications()
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch(() => {
          setItems([]);
          setLoading(false);
        });
    }
    setOpen(!open);
  }

  async function markRead(id: string) {
    try {
      await markNotificationAsRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch {}
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className="relative rounded-md border border-border p-2 text-foreground transition-colors hover:bg-secondary"
      >
        <Bell className="h-4 w-4" />
        {items.filter((n) => !n.isRead).length > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {items.filter((n) => !n.isRead).length > 9
              ? "9+"
              : items.filter((n) => !n.isRead).length}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 w-80 rounded-md border bg-popover shadow-md"
          ref={ddRef}
        >
          <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
            Notifications
          </div>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {items.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-xs transition-colors hover:bg-secondary ${!n.isRead ? "bg-primary/5" : ""}`}
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                    if (n.lienAction) router.navigate({ to: n.lienAction });
                  }}
                >
                  <span className="font-medium text-foreground">{n.titre}</span>
                  <span className="text-muted-foreground line-clamp-2">{n.message}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
