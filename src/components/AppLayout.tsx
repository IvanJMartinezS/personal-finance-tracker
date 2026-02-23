// import { useAuth } from "@/hooks/useAuth"; // comenta o elimina

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {children}
      </div>
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-muted-foreground">Sesión de prueba</p>
      </div>
    </div>
  );
}