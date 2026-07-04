import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { ScoreSubmit } from "@/components/ScoreSubmit";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Round {
  options: string[];
  correct: number;
}

const rounds: Round[] = [
  { options: ["password", "Tr0ub4dor&3x!", "1234"], correct: 1 },
  { options: ["Sunshine2020!kY", "qwerty", "abc123"], correct: 0 },
  { options: ["letmein", "iloveyou", "gV7#mPq2$LrW9"], correct: 2 },
  { options: ["Blue-Turtle-Jumps-42!", "111111", "admin"], correct: 0 },
  { options: ["dragon", "K9!vX2mn@Qp7wZ", "monkey"], correct: 1 },
];

const PasswordChallenge = () => {
  const { t } = useLanguage();
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const score = Math.round((correctCount / rounds.length) * 100);

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === rounds[round].correct) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (round + 1 >= rounds.length) {
      setDone(true);
    } else {
      setRound((r) => r + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setRound(0);
    setCorrectCount(0);
    setSelected(null);
    setDone(false);
  };

  const r = rounds[round];
  const title = { en: "Password Challenge", ja: "パスワードチャレンジ" };

  return (
    <GameShell title={useLanguage().lang === "ja" ? title.ja : title.en} station={1}>
      {!done ? (
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            {t("round")} {round + 1} / {rounds.length}
          </p>
          <p className="font-semibold">
            {useLanguage().lang === "ja"
              ? "最も強いパスワードをタップしてください"
              : "Tap the strongest password"}
          </p>
          <div className="space-y-3">
            {r.options.map((opt, i) => {
              const isCorrect = i === r.correct;
              const show = selected !== null;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={show}
                  className={`flex min-h-[56px] w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left font-mono text-sm font-semibold transition-colors ${
                    show && isCorrect
                      ? "border-success bg-success/10 text-success"
                      : show && selected === i
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card"
                  }`}
                >
                  <span className="break-all">{opt}</span>
                  {show && isCorrect && <Check className="ml-2 h-5 w-5 shrink-0" />}
                  {show && !isCorrect && selected === i && <X className="ml-2 h-5 w-5 shrink-0" />}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <Button onClick={next} className="h-12 w-full text-base font-semibold">
              {t("next")}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <ScoreSubmit gameId="password-challenge" maxScore={100} score={score} />
          <Button onClick={restart} variant="outline" className="h-12 w-full">
            {t("playAgain")}
          </Button>
        </div>
      )}
    </GameShell>
  );
};

export default PasswordChallenge;
