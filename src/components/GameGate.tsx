import { createContext, useContext, useState, ReactNode } from "react";
import { Outlet, Link } from "react-router-dom";
import type { Player } from "@/lib/types";
import { findPlayerByNumber } from "@/lib/api";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, LogIn } from "lucide-react";

interface SessionCtx {
  player: Player | null;
  signOut: () => void;
}

const Ctx = createContext<SessionCtx>({ player: null, signOut: () => {} });

export const usePlayerSession = () => useContext(Ctx);

/**
 * Layout route wrapper. Every game visit (e.g. via a station QR code) shows a
 * fresh login screen where the player keys in their number. Once verified, the
 * game is rendered and the player is available via usePlayerSession().
 */
export function GameGate({ children }: { children?: ReactNode }) {
  const { t } = useLanguage();
  const [player, setPlayer] = useState<Player | null>(null);
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");
  const [message, setMessage] = useState("");

  const signOut = () => {
    setPlayer(null);
    setNumber("");
    setStatus("idle");
    setMessage("");
  };

  const login = async () => {
    if (!number.trim()) return;
    setStatus("checking");
    setMessage("");
    try {
      const found = await findPlayerByNumber(number.trim());
      if (!found) {
        setStatus("error");
        setMessage(t("playerNotFound"));
        return;
      }
      setPlayer(found);
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage(t("loginError"));
    }
  };

  if (player) {
    return (
      <Ctx.Provider value={{ player, signOut }}>{children ?? <Outlet />}</Ctx.Provider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="flex justify-end p-4">
        <LanguageSwitcher />
      </div>
      <div className="mx-auto max-w-md px-4 pb-16">
        <div className="mb-6 text-center text-white">
          <span className="mx-auto mb-4 inline-flex h-14 items-center rounded-xl bg-card px-5 shadow-lg">
            <Wordmark className="text-2xl" />
          </span>
          <h1 className="text-3xl font-extrabold leading-tight">{t("gameLogin")}</h1>
          <p className="mt-2 text-primary-foreground/90">{t("gameLoginPrompt")}</p>
        </div>
        <div className="rounded-3xl bg-card p-6 shadow-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pn">{t("playerNumberLabel")}</Label>
              <Input
                id="pn"
                value={number}
                inputMode="numeric"
                onChange={(e) => setNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                placeholder="1"
                className="h-14 text-center text-2xl font-bold"
                autoFocus
              />
            </div>
            {status === "error" && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                <AlertCircle className="h-5 w-5" /> {message}
              </div>
            )}
            <Button
              onClick={login}
              disabled={status === "checking" || !number.trim()}
              className="h-14 w-full text-lg font-bold"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {status === "checking" ? "…" : t("continue")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("noNumberYet")}{" "}
              <Link to="/" className="font-semibold text-primary underline">
                {t("goToRegister")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
