import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/formateurs", label: "Formateurs" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-display text-xl">F</span>
          <span className="font-display text-2xl tracking-tight text-foreground">FormaPro</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
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
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="hidden rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary sm:inline-flex"
          >
            Espace admin
          </Link>
          <Link
            to="/catalogue"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voir le catalogue
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-display text-xl">F</span>
            <span className="font-display text-2xl">FormaPro</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            La plateforme française qui simplifie la gestion de vos formations professionnelles.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Plateforme</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/catalogue">Catalogue</Link></li>
            <li><Link to="/formateurs">Formateurs</Link></li>
            <li><Link to="/admin">Espace admin</Link></li>
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
        © 2026 FormaPro — Tous droits réservés.
      </div>
    </footer>
  );
}