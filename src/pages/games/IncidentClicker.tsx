import { useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/GameShell";
import { ScoreSubmit } from "@/components/ScoreSubmit";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";

interface Bubble {
  id: number;
  x: number;
  y: number;
}

const ROUND_SECONDS = 30;
const TARGET = 25; // resolving 25 incidents = 100

const IncidentClicker = () => {
  const { t, lang } = useLanguage();
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [time, setTime] = useState(ROUND_SECONDS);
  const [resolved, setResolved] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const nextId = useRef(0);
  const timerRef = useRef<number>();
  const spawnRef = useRef<number>();

  const score = Math.min(100, Math.round((resolved / TARGET) * 100));

  const start = () => {
    setPhase("playing");
    setTime(ROUND_SECONDS);
    setResolved(0);
    setBubbles([]);
  };

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = window.setInterval(() => {
      setTime((tm) => {
        if (tm <= 1) {
          window.clearInterval(timerRef.current);
          window.clearInterval(spawnRef.current);
          setBubbles([]);
          setPhase("done");
          return 0;
        }
        return tm - 1;
      });
    }, 1000);
    spawnRef.current = window.setInterval(() => {
      setBubbles((bs) => {
        const b: Bubble = {
          id: nextId.current++,
          x: 8 + Math.random() * 78,
          y: 8 + Math.random() * 78,
        };
        const updated = [...bs, b];
        window.setTimeout(() => {
          setBubbles((cur) => cur.filter((x) => x.id !== b.id));
        }, 1400);
        return updated;
      });
    }, 650);
    return () => {
      window.clearInterval(timerRef.current);
      window.clearInterval(spawnRef.current);
    };
  }, [phase]);

  const pop = (id: number) => {
    setBubbles((bs) => bs.filter((b) => b.id !== id));
    setResolved((r) => r + 1);
  };

  return (
    <GameShell title={lang === "ja" ? "インシデントクリッカー" : "Incident Clicker"} station={3}>
      {phase === "idle" && (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {lang === "ja"
              ? "30秒でできるだけ多くのインシデントをタップして解決しよう！"
              : "Tap and resolve as many incidents as you can in 30 seconds!"}
          </p>
          <Button onClick={start} className="h-14 w-full text-lg font-bold">
            {t("start")}
          </Button>
        </div>
      )}

      {phase === "playing" && (
        <div>
          <div className="mb-3 flex items-center justify-between font-bold">
            <span className="text-secondary">⏱ {time}s</span>
            <span className="text-primary">⚡ {resolved}</span>
          </div>
          <div className="relative h-[60vh] w-full touch-none overflow-hidden rounded-2xl border-2 border-dashed bg-muted/40">
            {bubbles.map((b) => (
              <button
                key={b.id}
                onPointerDown={() => pop(b.id)}
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
                className="absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-accent text-2xl shadow-lg active:scale-90"
                aria-label="incident"
              >
                🚨
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-4">
          <ScoreSubmit gameId="incident-clicker" maxScore={100} score={score} />
          <Button onClick={start} variant="outline" className="h-12 w-full">
            {t("playAgain")}
          </Button>
        </div>
      )}
    </GameShell>
  );
};

export default IncidentClicker;
