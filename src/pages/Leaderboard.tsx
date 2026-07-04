import { PublicHeader } from "@/components/PublicHeader";
import { useLanguage } from "@/lib/language";
import { useEventData } from "@/hooks/useEventData";
import { computeLeaderboard } from "@/lib/api";
import { Trophy } from "lucide-react";

const medals = ["🥇", "🥈", "🥉"];

const Leaderboard = () => {
  const { t } = useLanguage();
  const { players, games, scores, loading } = useEventData();
  const rows = computeLeaderboard(players, games, scores);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-5 flex items-center gap-2 text-2xl font-extrabold">
          <Trophy className="h-7 w-7 text-accent" /> {t("leaderboard")}
        </h1>
        {loading ? (
          <p className="text-muted-foreground">{t("loading")}</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground">{t("noPlayers")}</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div
                key={r.player_id}
                className={`flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card ${
                  i < 3 ? "border-accent/40" : ""
                }`}
              >
                <div className="w-8 shrink-0 text-center text-xl font-extrabold">
                  {medals[i] ?? <span className="text-muted-foreground">{i + 1}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.player_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-primary">{r.total_score}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.games_completed} {t("gamesCompleted").toLowerCase()} · {r.average_percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
