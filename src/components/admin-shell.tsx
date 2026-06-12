import { Link, useRouterState } from "@tanstack/react-router";
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
} from "lucide-react";

const nav = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/formations", label: "Formations", icon: BookOpen },
  { to: "/admin/sessions", label: "Sessions", icon: CalendarDays },
  { to: "/admin/formateurs", label: "Formateurs", icon: GraduationCap },
  { to: "/admin/participants", label: "Participants", icon: Users },
  { to: "/admin/documents", label: "Documents", icon: FileText },
];

export function AdminShell({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-secondary/40 text-foreground">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-display text-xl">F</span>
            <span className="font-display text-2xl">FormaPro</span>
            <span className="ml-auto rounded-md bg-sidebar-accent px-2 py-0.5 text-[10px] uppercase tracking-wide">Admin</span>
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
            <Link to="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="h-4 w-4" /> Retour au site
            </Link>
            <button className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent">
              <Settings className="h-4 w-4" /> Paramètres
            </button>
            <div className="mt-3 flex items-center gap-3 rounded-md bg-sidebar-accent/60 p-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">SM</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Sarah Moreau</p>
                <p className="truncate text-xs text-sidebar-foreground/70">Administratrice</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-secondary px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Rechercher (formations, participants, sessions…)" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">⌘K</kbd>
            </div>
            <button className="relative rounded-md p-2 hover:bg-secondary">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-ochre" />
            </button>
          </header>

          <div className="px-6 py-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-4xl tracking-tight md:text-5xl">{title}</h1>
                {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
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