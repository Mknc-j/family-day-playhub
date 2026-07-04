import { useState } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { useLanguage } from "@/lib/language";
import { useEventData } from "@/hooks/useEventData";
import { computeStations } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Minus, ListChecks } from "lucide-react";

type Filter = "all" | "incomplete" | "complete";

const Stations = () => {
  const { t, lang } = useLanguage();
  const { players, games, scores, loading } = useEventData();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const activeGames = games.filter((g) => g.active);
  let rows = computeStations(players, games, scores);

  if (filter === "incomplete") rows = rows.filter((r) => r.completedCount < r.totalActive);
  if (filter === "complete") rows = rows.filter((r) => r.completedCount === r.totalActive && r.totalActive > 0);
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    rows = rows.filter(
      (r) => r.player_number.toLowerCase().includes(q) || r.name.toLowerCase().includes(q),
    );
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "incomplete", label: t("filterIncomplete") },
    { key: "complete", label: t("filterCompleteAll") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-4 flex items-center gap-2 text-2xl font-extrabold">
          <ListChecks className="h-7 w-7 text-secondary" /> {t("stationStatus")}
        </h1>
        <div className="mb-4 space-y-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="h-12"
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={filter === f.key ? "default" : "outline"}
                onClick={() => setFilter(f.key)}
                className="min-h-[40px]"
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">{t("loading")}</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground">{t("noPlayers")}</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.player_id} className="rounded-2xl border bg-card p-4 shadow-card">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold">{r.name}</span>{" "}
                    <span className="text-sm text-muted-foreground">{r.player_number}</span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      r.completedCount === r.totalActive
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {r.completedCount}/{r.totalActive}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeGames.map((g) => {
                    const done = r.completed[g.id];
                    return (
                      <div
                        key={g.id}
                        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                          done ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                        }`}
                        title={lang === "ja" ? g.title_ja : g.title_en}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                        {g.station_number}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Stations;
