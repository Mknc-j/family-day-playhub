import { useMemo, useState } from "react";
import { GameShell } from "@/components/GameShell";
import { ScoreSubmit } from "@/components/ScoreSubmit";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, Award } from "lucide-react";

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  why: string;
}

export interface BadgeTier {
  min: number;
  label: string;
}

interface Props {
  gameId: string;
  station: number;
  title: { en: string; ja: string };
  prompt: { en: string; ja: string };
  questions: QuizQuestion[];
  /** how many questions to show per play */
  perPlay?: number;
  /** badge tiers, evaluated high-to-low by min correct count */
  tiers: BadgeTier[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizGame({ gameId, station, title, prompt, questions, perPlay = 10, tiers }: Props) {
  const { t, lang } = useLanguage();
  const [seed, setSeed] = useState(0);
  const deck = useMemo(
    () => shuffle(questions).slice(0, Math.min(perPlay, questions.length)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = deck[idx];
  const badge = tiers.find((tier) => correct >= tier.min) ?? tiers[tiers.length - 1];

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= deck.length) {
      setDone(true);
    } else {
      setIdx((v) => v + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setCorrect(0);
    setSelected(null);
    setDone(false);
  };

  return (
    <GameShell title={lang === "ja" ? title.ja : title.en} station={station}>
      {!done ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">
              {t("question")} {idx + 1} / {deck.length}
            </p>
            <Progress value={((idx + (selected !== null ? 1 : 0)) / deck.length) * 100} className="h-2" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {lang === "ja" ? prompt.ja : prompt.en}
          </p>
          <p className="text-lg font-semibold">{q.q}</p>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const show = selected !== null;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={show}
                  className={`flex min-h-[56px] w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    show && isCorrect
                      ? "border-success bg-success/10 text-success"
                      : show && selected === i
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border bg-card"
                  }`}
                >
                  <span>{opt}</span>
                  {show && isCorrect && <Check className="ml-2 h-5 w-5 shrink-0" />}
                  {show && !isCorrect && selected === i && <X className="ml-2 h-5 w-5 shrink-0" />}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div className="space-y-3">
              <div
                className={`rounded-xl p-4 text-sm ${
                  selected === q.correct
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <p className="mb-1 font-bold">
                  {selected === q.correct ? t("correct") : t("incorrect")}
                </p>
                <p className="text-foreground/80">{q.why}</p>
              </div>
              <Button onClick={next} className="h-12 w-full text-base font-semibold">
                {t("next")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 rounded-2xl border bg-gradient-hero p-6 text-center">
            <Award className="h-10 w-10 text-primary-foreground" />
            <p className="text-sm font-medium text-primary-foreground/80">
              {correct} / {deck.length}
            </p>
            <p className="text-2xl font-extrabold text-primary-foreground">{badge.label}</p>
          </div>
          <ScoreSubmit gameId={gameId} maxScore={deck.length} score={correct} />
          <Button onClick={restart} variant="outline" className="h-12 w-full">
            {t("playAgain")}
          </Button>
        </div>
      )}
    </GameShell>
  );
}
