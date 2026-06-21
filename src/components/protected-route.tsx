import { useEffect, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "../contexts/auth-context";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, requiredRole }: { children: ReactNode; requiredRole?: string }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.navigate({ to: "/connexion" });
      return;
    }
    if (requiredRole && user?.role !== requiredRole) {
      router.navigate({ to: "/" });
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;

  return <>{children}</>;
}
