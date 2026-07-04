import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ArrowLeft } from "lucide-react";

export function GameShell({ title, station, children }: { title: string; station: number; children: ReactNode }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <Link to="/games" className="flex min-h-[40px] items-center gap-1 text-sm font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> {t("gameStations")}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-6">
        <p className="text-xs font-semibold uppercase text-muted-foreground">{t("station")} {station}</p>
        <h1 className="mb-5 text-2xl font-extrabold">{title}</h1>
        {children}
      </main>
    </div>
  );
}
