import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Wordmark } from "@/components/Wordmark";
import { registerPlayer } from "@/lib/api";
import { storePlayer, getStoredPlayerNumber } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Gamepad2 } from "lucide-react";
import type { Player } from "@/lib/types";

const Index = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const existing = getStoredPlayerNumber();
  const [registered, setRegistered] = useState<Player | null>(null);

  const validate = () => {
    const e: { name?: string; age?: string } = {};
    if (!name.trim()) e.name = t("nameRequired");
    else if (name.trim().length > 30) e.name = t("nameTooLong");
    const ageNum = Number(age);
    if (!age.trim()) e.age = t("ageRequired");
    else if (!Number.isInteger(ageNum) || ageNum < 3 || ageNum > 18) e.age = t("ageRange");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const player = await registerPlayer({ name, age: Number(age), language: lang });
      storePlayer(player.id, player.player_number);
      setRegistered(player);
    } catch {
      setErrors({ name: "Error, please retry" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="flex justify-end p-4">
        <LanguageSwitcher />
      </div>
      <div className="mx-auto max-w-md px-4 pb-16">
        <div className="mb-6 text-center text-primary-foreground">
          <span className="mx-auto mb-4 inline-flex h-14 items-center rounded-xl bg-card px-4 text-2xl font-extrabold lowercase tracking-tight text-primary shadow-lg">
            servicenow
          </span>
          <h1 className="text-3xl font-extrabold leading-tight">{t("welcome")}</h1>
          <p className="mt-2 text-primary-foreground/90">{t("tagline")}</p>
        </div>

        {registered ? (
          <div className="rounded-3xl bg-card p-6 text-center shadow-lg">
            <p className="text-sm font-medium text-muted-foreground">{t("yourNumber")}</p>
            <p className="my-3 text-5xl font-extrabold tracking-wider text-primary">
              {registered.player_number}
            </p>
            <p className="mb-6 text-lg font-semibold">{registered.name}</p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/games")} className="h-14 w-full text-lg font-bold">
                <Gamepad2 className="mr-2 h-5 w-5" /> {t("startGames")}
              </Button>
              <Button
                onClick={() => navigate("/leaderboard")}
                variant="outline"
                className="h-14 w-full text-lg font-bold"
              >
                <Trophy className="mr-2 h-5 w-5" /> {t("leaderboard")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-card p-6 shadow-lg">
            {existing && (
              <div className="mb-4 rounded-xl bg-secondary/10 p-3 text-center text-sm">
                {t("currentPlayer")}: <b>{existing}</b> ·{" "}
                <Link to="/games" className="font-semibold text-primary underline">
                  {t("startGames")}
                </Link>
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("nameLabel")}</Label>
                <Input
                  id="name"
                  value={name}
                  maxLength={30}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className="h-12 text-lg"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                <p className="text-xs text-muted-foreground">{t("privacyNote")}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">{t("ageLabel")}</Label>
                <Input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={3}
                  max={18}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-12 text-lg"
                />
                {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t("languageLabel")}</Label>
                <LanguageSwitcher />
              </div>
              <Button
                onClick={handleRegister}
                disabled={submitting}
                className="h-14 w-full text-lg font-bold"
              >
                {submitting ? t("registering") : t("register")}
              </Button>
            </div>
          </div>
        )}
        <p className="mt-6 text-center text-xs text-primary-foreground/70">
          <Link to="/operator-login" className="underline">
            {t("operatorLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Index;
