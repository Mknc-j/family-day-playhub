import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { usePlayerSession } from "@/components/GameGate";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";

export function GameShell({ title, station, children }: { title: string; station: number; children: ReactNode }) {
  const { t } = useLanguage();
  const { player, signOut } = usePlayerSession();
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
      {player && (
        <div className="border-b bg-muted/50 px-4 py-2">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">
              {t("playingAs")}: <b className="text-foreground">#{player.player_number}</b> · {player.name}
            </span>
            <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={signOut}>
              <LogOut className="mr-1 h-3.5 w-3.5" /> {t("switchPlayer")}
            </Button>
          </div>
        </div>
      )}
      <main className="mx-auto max-w-lg px-4 py-6">
        <p className="text-xs font-semibold uppercase text-muted-foreground">{t("station")} {station}</p>
        <h1 className="mb-5 text-2xl font-extrabold">{title}</h1>
        {children}
      </main>
    </div>
  );
}
