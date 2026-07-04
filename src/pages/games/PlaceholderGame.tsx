import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { ScoreSubmit } from "@/components/ScoreSubmit";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { isOperator } from "@/lib/storage";
import { Construction } from "lucide-react";

export function PlaceholderGame({ gameId, station, title }: { gameId: string; station: number; title: { en: string; ja: string } }) {
  const { t, lang } = useLanguage();
  const [score, setScore] = useState(0);
  const showDemo = isOperator();

  return (
    <GameShell title={lang === "ja" ? title.ja : title.en} station={station}>
      <div className="space-y-5">
        <div className="rounded-2xl border bg-card p-6 text-center shadow-card">
          <Construction className="mx-auto mb-3 h-12 w-12 text-accent" />
          <p className="text-lg font-bold">{t("comingSoon")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("placeholderGame")}</p>
        </div>
        {(showDemo || true) && (
          <Button
            variant="secondary"
            onClick={() => setScore(Math.floor(Math.random() * 101))}
            className="h-12 w-full font-semibold"
          >
            {t("demoScore")}
          </Button>
        )}
        <ScoreSubmit gameId={gameId} maxScore={100} score={score} />
      </div>
    </GameShell>
  );
}
