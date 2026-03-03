
export function Loader({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="h-10 w-10 animate-spin text-primary"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default Loader;