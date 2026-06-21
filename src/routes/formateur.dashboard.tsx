import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Loader2, ArrowUpRight, Moon, Sun } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { getMySessions } from "@/lib/api/sessions";

export const Route = createFileRoute("/formateur/dashboard")({
  component: () => (
    <ProtectedRoute requiredRole="formateur">
      <FormateurDashboard />
    </ProtectedRoute>
  ),
});

function FormateurDashboard() {
  const { user } = useAuth();
  const { data: mesSessions, isLoading } = useQuery({
    queryKey: ["my-sessions"],
    queryFn: getMySessions,
  });

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="StirForma" className="h-10 w-auto" />
            <span className="font-display text-xl">StirForma</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/catalogue" className="text-sm text-muted-foreground hover:text-foreground">Catalogue</Link>
            <Link to="/formateur/dashboard" className="text-sm font-medium text-foreground">Mes sessions</Link>
            <DarkModeToggle />
            <span className="text-xs rounded-md bg-primary/10 px-2 py-0.5 text-primary capitalize">{user?.role}</span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-display text-4xl">Mes sessions</h1>
        <p className="mt-1 text-muted-foreground">Sessions où vous intervenez en tant que formateur.</p>

        {isLoading ? (
          <div className="mt-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : mesSessions?.length === 0 ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-12 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Aucune session pour le moment</p>
            <Link to="/catalogue" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Voir le catalogue <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mesSessions.map((s: any) => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {s.formation?.type || "Formation"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.participants?.length || 0} inscrits
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl">{s.formation?.titre || "Formation"}</h3>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(s.dateDebut).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {s.lieu || "Non défini"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
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
