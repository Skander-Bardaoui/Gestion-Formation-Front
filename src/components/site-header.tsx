import { Link, useRouter } from "@tanstack/react-router";
import { Bell, Settings, User, LogOut, Loader2, Moon, Sun } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/auth-context";
import { getNotifications, markNotificationAsRead, type Notification } from "@/lib/api/notifications";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const publicNav = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="StirForma" className="h-10 w-auto" />
          <span className="font-display text-2xl tracking-tight text-foreground">StirForma</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {!isAuthenticated && publicNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {n.label}
            </Link>
          ))}
          {!isLoading && isAuthenticated && user?.role !== "admin" && (
            <>
              <Link
                to="/mes-formations"
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Mes formations
              </Link>
              {user?.role === "formateur" && (
                <>
                  <Link
                    to="/formateur/dashboard"
                    className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Mes sessions
                  </Link>
                  <Link
                    to="/formateur/calendrier"
                    className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Calendrier
                  </Link>
                </>
              )}
              {(user?.role === "participant" || user?.role === "employe") && (
                <Link
                  to="/participant/calendrier"
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Calendrier
                </Link>
              )}
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          {!isLoading && isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary sm:inline-flex"
                >
                  Tableau de bord
                </Link>
              )}

              {user?.role !== "admin" && (
                <Link
                  to="/catalogue"
                  className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  Catalogue
                </Link>
              )}
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="overflow-hidden rounded-full border-2 border-border text-foreground transition-colors hover:border-primary h-9 w-9">
                    {user?.avatarUrl ? (
                      <img src={`http://localhost:3001${user.avatarUrl}`} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-primary/10 text-sm font-medium text-primary">
                        {user?.username?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profil" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              to="/connexion"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-border p-2 text-foreground transition-colors hover:bg-secondary"
      title={dark ? 'Mode clair' : 'Mode sombre'}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getNotifications()
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => { setItems([]); setLoading(false); });
  }, [open]);

  async function markRead(id: string) {
    try { await markNotificationAsRead(id); setItems((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n)); } catch {}
  }

  const unread = items.filter((n) => !n.isRead);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-md border border-border p-2 text-foreground transition-colors hover:bg-secondary"
      >
        <Bell className="h-4 w-4" />
        {unread.length > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-md border bg-popover shadow-md">
          <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
            Notifications
          </div>
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
          ) : items.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">Aucune notification</div>
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

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="StirForma" className="h-10 w-auto" />
            <span className="font-display text-2xl">StirForma</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            La plateforme française qui simplifie la gestion de vos formations professionnelles.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Plateforme</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/a-propos">À propos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Société</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/a-propos">À propos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>12 rue de la Forge, 75011 Paris</li>
            <li>contact@formapro.fr</li>
            <li>+33 1 84 80 12 34</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 StirForma — Tous droits réservés.
      </div>
    </footer>
  );
}
