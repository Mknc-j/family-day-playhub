import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getSetting } from "@/lib/api";
import { setOperator } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

const OperatorLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError(false);
    try {
      const stored = (await getSetting<string>("operator_pin")) ?? "1234";
      if (pin === stored) {
        setOperator(true);
        navigate("/operator");
      } else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-lg">
        <div className="mb-2 flex justify-end">
          <LanguageSwitcher />
        </div>
        <Lock className="mx-auto mb-3 h-12 w-12 text-primary" />
        <h1 className="mb-5 text-center text-2xl font-extrabold">{t("operatorLogin")}</h1>
        <div className="space-y-3">
          <Label htmlFor="pin">{t("enterPin")}</Label>
          <Input
            id="pin"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="h-12 text-center text-2xl tracking-widest"
          />
          {error && <p className="text-sm text-destructive">{t("wrongPin")}</p>}
          <Button onClick={login} disabled={loading} className="h-12 w-full text-base font-semibold">
            {t("login")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OperatorLogin;
