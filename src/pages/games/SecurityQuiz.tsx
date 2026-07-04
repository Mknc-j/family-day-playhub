import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { ScoreSubmit } from "@/components/ScoreSubmit";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Q {
  q: { en: string; ja: string };
  options: { en: string; ja: string }[];
  correct: number;
}

const questions: Q[] = [
  {
    q: { en: "You get an email asking for your password. What do you do?", ja: "パスワードを求めるメールが届きました。どうしますか？" },
    options: [
      { en: "Reply with my password", ja: "パスワードを返信する" },
      { en: "Report it and don't reply", ja: "報告して返信しない" },
      { en: "Click the link to check", ja: "リンクを開いて確認する" },
    ],
    correct: 1,
  },
  {
    q: { en: "Which link looks safest?", ja: "最も安全なリンクはどれ？" },
    options: [
      { en: "http://bank-login-verify.xyz", ja: "http://bank-login-verify.xyz" },
      { en: "https://www.mybank.com", ja: "https://www.mybank.com" },
      { en: "http://192.84.11.5/login", ja: "http://192.84.11.5/login" },
    ],
    correct: 1,
  },
  {
    q: { en: "An unexpected attachment arrives from a stranger. You should…", ja: "知らない人から予期しない添付ファイルが届きました。どうする？" },
    options: [
      { en: "Open it right away", ja: "すぐに開く" },
      { en: "Don't open it, report it", ja: "開かずに報告する" },
      { en: "Forward it to friends", ja: "友達に転送する" },
    ],
    correct: 1,
  },
  {
    q: { en: "What does MFA add to your login?", ja: "MFAはログインに何を追加しますか？" },
    options: [
      { en: "An extra verification step", ja: "追加の確認ステップ" },
      { en: "A faster login", ja: "より速いログイン" },
      { en: "Nothing useful", ja: "特に何もない" },
    ],
    correct: 0,
  },
  {
    q: { en: "You spot something suspicious. Best action?", ja: "怪しいものを見つけました。最善の行動は？" },
    options: [
      { en: "Ignore it", ja: "無視する" },
      { en: "Report it to the security team", ja: "セキュリティチームに報告する" },
      { en: "Keep it a secret", ja: "秘密にしておく" },
    ],
    correct: 1,
  },
];

const SecurityQuiz = () => {
  const { t, lang } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const score = Math.round((correct / questions.length) * 100);
  const q = questions[idx];

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setCorrect((c) => c + 1);
  };
  const next = () => {
    if (idx + 1 >= questions.length) setDone(true);
    else {
      setIdx((v) => v + 1);
      setSelected(null);
    }
  };
  const restart = () => {
    setIdx(0);
    setCorrect(0);
    setSelected(null);
    setDone(false);
  };

  return (
    <GameShell title={lang === "ja" ? "セキュリティクイズ" : "Security Quiz"} station={2}>
      {!done ? (
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            {t("question")} {idx + 1} / {questions.length}
          </p>
          <p className="text-lg font-semibold">{lang === "ja" ? q.q.ja : q.q.en}</p>
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
                  <span>{lang === "ja" ? opt.ja : opt.en}</span>
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
          <ScoreSubmit gameId="security-quiz" maxScore={100} score={score} />
          <Button onClick={restart} variant="outline" className="h-12 w-full">
            {t("playAgain")}
          </Button>
        </div>
      )}
    </GameShell>
  );
};

export default SecurityQuiz;
