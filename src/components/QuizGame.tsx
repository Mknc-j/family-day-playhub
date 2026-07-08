import { useMemo, useState } from "react";
import { GameShell } from "@/components/GameShell";
import { ScoreSubmit } from "@/components/ScoreSubmit";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, Award } from "lucide-react";

type LocalizedText = string | { en: string; ja: string };

export interface QuizQuestion {
  q: LocalizedText;
  options: LocalizedText[];
  correct: number;
  why: LocalizedText;
}

interface PreparedOption {
  value: LocalizedText;
  originalIndex: number;
}

interface PreparedQuestion extends Omit<QuizQuestion, "options" | "correct"> {
  options: PreparedOption[];
  correct: number;
}

export interface BadgeTier {
  min: number;
  label: LocalizedText;
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

function text(value: LocalizedText, lang: "en" | "ja") {
  return typeof value === "string" ? value : value[lang];
}

function prepareQuestion(question: QuizQuestion): PreparedQuestion {
  const options = shuffle(question.options.map((value, originalIndex) => ({ value, originalIndex })));

  return {
    ...question,
    options,
    correct: options.findIndex((option) => option.originalIndex === question.correct),
  };
}

function ByteGeckoMonster({ lang }: { lang: "en" | "ja" }) {
  return (
    <svg
      viewBox="0 0 240 190"
      role="img"
      aria-label={
        lang === "ja"
          ? "バイトゲッコー: 四角いモニター頭、紫の背びれ、プラグのしっぽ、光る回路模様を持つ緑のトカゲ型モンスター"
          : "ByteGecko monster: a green lizard with a square computer monitor head, purple crystal back plates, a plug tail, clawed feet, and glowing circuit spots"
      }
      className="quiz-monster-svg"
    >
      <g className="pixel-lines" stroke="#09241f" strokeWidth="5" strokeLinecap="square" strokeLinejoin="round">
        <ellipse cx="122" cy="164" rx="82" ry="14" fill="#d9e1dc" stroke="none" opacity="0.9" />
        <path d="M126 85 C156 76 195 94 198 130 C201 157 171 169 132 163 C91 157 75 137 84 111 C89 98 104 90 126 85Z" fill="#28734f" />
        <path d="M130 100 C157 95 178 108 181 132 C184 150 163 158 133 154 C104 150 92 136 99 119 C103 109 114 103 130 100Z" fill="#43a36f" />
        <path d="M86 112 C57 106 45 88 56 69 C66 51 94 57 107 78 C116 93 106 109 86 112Z" fill="#2c7e58" />
        <path d="M62 70 L112 70 L112 25 L51 25 L51 83 L62 83Z" fill="#165c44" />
        <path d="M63 37 H99 V65 H63Z" fill="#78d99b" />
        <path d="M71 47 L79 56 M91 47 L84 56 M74 63 H91" fill="none" />
        <path d="M111 38 L132 31 L124 55Z" fill="#7c52b8" />
        <path d="M112 65 L137 63 L119 84Z" fill="#7c52b8" />
        <path d="M130 84 L149 78 L142 104Z" fill="#7c52b8" />
        <path d="M156 99 L174 91 L168 116Z" fill="#7c52b8" />
        <path d="M190 111 C214 91 221 65 210 49" fill="none" />
        <path d="M204 44 H221 V58 H207Z" fill="#5bc67d" />
        <path d="M110 150 L96 177 M126 153 L122 180 M164 151 L177 177" fill="none" />
        <path d="M90 177 L104 177 M116 180 L130 180 M172 177 L186 177" fill="none" />
        <circle cx="78" cy="92" r="5" fill="#09241f" />
        <circle cx="151" cy="122" r="12" fill="#61d98f" opacity="0.7" />
        <path d="M136 121 H147 V111 M151 132 V122 H162" fill="none" stroke="#d8ffe5" strokeWidth="3" />
        <path d="M117 105 H128 M123 100 V112 M139 97 H151 M146 92 V103" fill="none" stroke="#d8ffe5" strokeWidth="3" />
        <path d="M85 129 C98 140 113 143 128 140" fill="none" stroke="#bfead0" strokeWidth="4" />
      </g>
    </svg>
  );
}

function PlayerSprite({ lang }: { lang: "en" | "ja" }) {
  return (
    <img
      src="/game-assets/safety-helper.png"
      alt={
        lang === "ja"
          ? "横後ろ姿のセーフティヘルパー: バックパックを背負い、相手を指さすキャラクター"
          : "Safety Helper character seen from the side and back, wearing a backpack and pointing toward the opponent"
      }
      className="quiz-player-svg"
    />
  );
}

export function QuizGame({ gameId, station, title, prompt, questions, perPlay = 10, tiers }: Props) {
  const { t, lang } = useLanguage();
  const [seed, setSeed] = useState(0);
  const deck = useMemo(
    () => shuffle(questions).slice(0, Math.min(perPlay, questions.length)).map(prepareQuestion),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = deck[idx];
  const badge = tiers.find((tier) => correct >= tier.min) ?? tiers[tiers.length - 1];
  const enemyHp = Math.max(0, Math.round(((deck.length - correct) / deck.length) * 100));
  const progressValue = ((idx + (selected !== null ? 1 : 0)) / deck.length) * 100;
  const enemyName = lang === "ja" ? "バイトゲッコー" : "BYTEGECKO";
  const hpLabel = lang === "ja" ? "たいりょく" : "HP";

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
        <div className="quiz-battle space-y-4">
          <div className="rounded-lg border-2 border-secondary bg-card p-3 shadow-card">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold uppercase text-secondary">
              <span>{lang === "ja" ? prompt.ja : prompt.en}</span>
              <span>
                {t("question")} {idx + 1}/{deck.length}
              </span>
            </div>
            <Progress value={progressValue} className="h-2 bg-muted" />
          </div>
          <section className="quiz-stage" aria-label={lang === "ja" ? "バトル画面" : "Battle screen"}>
            <div className="quiz-stage-grid">
              <div className="quiz-enemy">
                <ByteGeckoMonster lang={lang} />
                <div className="quiz-hp-panel" aria-label={`${enemyName} ${hpLabel} ${enemyHp}%`}>
                  <div className="flex items-center justify-between gap-2">
                    <span>{enemyName}</span>
                    <span>
                      {hpLabel} {enemyHp}%
                    </span>
                  </div>
                  <div className="quiz-hp-track">
                    <div className="quiz-hp-fill" style={{ width: `${enemyHp}%` }} />
                  </div>
                </div>
              </div>
              <div className="quiz-player">
                <PlayerSprite lang={lang} />
                <div className="quiz-player-label">
                  {lang === "ja" ? "セーフティヘルパー" : "Safety Helper"}
                </div>
              </div>
            </div>
          </section>
          <section className="quiz-question-panel">
            <p className="text-base font-bold leading-snug md:text-lg">{text(q.q, lang)}</p>
          </section>
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
                        : "border-border bg-card text-foreground hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <span>{text(opt.value, lang)}</span>
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
                <p className="text-foreground/80">{text(q.why, lang)}</p>
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
            <p className="text-2xl font-extrabold text-primary-foreground">{text(badge.label, lang)}</p>
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
