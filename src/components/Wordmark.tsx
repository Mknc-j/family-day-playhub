import { cn } from "@/lib/utils";

/**
 * ServiceNow-style wordmark: lowercase "servicenow" with the signature
 * green "o" loop. `on` controls whether it renders light (on dark bg) or dark.
 */
export function Wordmark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "font-extrabold lowercase tracking-tight",
        tone === "light" ? "text-white" : "text-secondary",
        className,
      )}
    >
      servicen<span className="text-accent">o</span>w
    </span>
  );
}
