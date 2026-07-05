import { useState } from "react";
import { useLanguage } from "@/lib/language";
import { submitScore } from "@/lib/api";
import { getStoredPlayerNumber } from "@/lib/storage";
import { usePlayerSession } from "@/components/GameGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  gameId: string;
  maxScore: number;
  score: number;
  source?: string;
  disabled?: boolean;
}

export function ScoreSubmit({ gameId, maxScore, score, source, disabled }: Props) {
  const { t } = useLanguage();
  const { player } = usePlayerSession();
  const locked = Boolean(player);
  const [playerNumber, setPlayerNumber] = useState(
    player?.player_number ?? getStoredPlayerNumber() ?? "",
  );
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setStatus("sending");
    setMessage("");
    try {
      const submitted = await submitScore({ playerNumber, gameId, score, maxScore, source });
      setStatus("ok");
      setMessage(`${t("scoreSent")} — ${submitted.player_number}`);
    } catch (e) {
      setStatus("error");
      const code = (e as Error).message;
      if (code === "PLAYER_NOT_FOUND") setMessage(t("playerNotFound"));
      else if (code === "SUBMISSIONS_CLOSED") setMessage(t("submissionsClosed"));
      else if (code === "INVALID_SCORE") setMessage(t("invalidScore"));
      else setMessage(code);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{t("finalScore")}</span>
        <span className="text-3xl font-extrabold text-primary">
          {score}
          <span className="text-base font-medium text-muted-foreground">/{maxScore}</span>
        </span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pn">{t("playerNumberLabel")}</Label>
        {locked ? (
          <div className="flex h-12 items-center justify-between rounded-md border bg-muted px-4 text-lg font-bold">
            <span>{player?.player_number}</span>
            <span className="text-sm font-medium text-muted-foreground">{player?.name}</span>
          </div>
        ) : (
          <Input
            id="pn"
            value={playerNumber}
            onChange={(e) => setPlayerNumber(e.target.value)}
            placeholder="1"
            inputMode="numeric"
            className="h-12 text-lg"
          />
        )}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={disabled || status === "sending" || !playerNumber}
        className="mt-4 h-12 w-full text-base font-semibold"
      >
        {status === "sending" ? "…" : t("sendScore")}
      </Button>
      {status === "ok" && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm font-medium text-success">
          <CheckCircle2 className="h-5 w-5" /> {message}
        </div>
      )}
      {status === "error" && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
          <AlertCircle className="h-5 w-5" /> {message}
        </div>
      )}
    </div>
  );
}
