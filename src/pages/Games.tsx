import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PublicHeader } from "@/components/PublicHeader";
import { useLanguage } from "@/lib/language";
import { fetchGames } from "@/lib/api";
import { getStoredPlayerNumber } from "@/lib/storage";
import type { Game } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock, Play } from "lucide-react";

const stationIcons = ["🔐", "🛡️", "⚡", "🦸", "🌐", "🕵️"];

const Games = () => {
  const { t, lang } = useLanguage();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const playerNumber = getStoredPlayerNumber();

  useEffect(() => {
    fetchGames().then((g) => {
      setGames(g);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-1 text-2xl font-extrabold">{t("gameStations")}</h1>
        {playerNumber ? (
          <p className="mb-5 text-sm text-muted-foreground">
            {t("currentPlayer")}: <b className="text-primary">{playerNumber}</b>
          </p>
        ) : (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-accent/10 p-4 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-accent" />
            <span>{t("noPlayerWarning")}</span>
            <Link to="/" className="ml-auto shrink-0 font-semibold text-primary underline">
              {t("goToRegister")}
            </Link>
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground">{t("loading")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {games.map((g) => {
              const title = lang === "ja" ? g.title_ja : g.title_en;
              const desc = lang === "ja" ? g.description_ja : g.description_en;
              const placeholder = g.id === "station-4" || g.id === "station-5";
              return (
                <div key={g.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-2xl">
                      {stationIcons[g.station_number - 1] ?? "🎲"}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        {t("station")} {g.station_number}
                      </p>
                      <h2 className="text-lg font-bold leading-tight">{title}</h2>
                    </div>
                  </div>
                  <p className="mb-4 flex-1 text-sm text-muted-foreground">{desc}</p>
                  <Button asChild className="h-12 w-full font-semibold" variant={placeholder ? "secondary" : "default"}>
                    <Link to={g.route}>
                      {placeholder ? <Lock className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {t("start")}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;
