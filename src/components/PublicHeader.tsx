import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Trophy, Grid3x3, Home, ListChecks } from "lucide-react";

export function PublicHeader() {
  const { t } = useLanguage();
  const loc = useLocation();

  const links = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/games", label: t("gameStations"), icon: Grid3x3 },
    { to: "/leaderboard", label: t("leaderboard"), icon: Trophy },
    { to: "/stations", label: t("stationStatus"), icon: ListChecks },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <span className="text-lg">🎪</span>
          <span className="hidden text-sm sm:inline">{t("appName")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden gap-1 md:flex">
            {links.map((l) => {
              const active = loc.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-sm font-medium ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t px-3 py-2 md:hidden">
        {links.map((l) => {
          const active = loc.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-2 text-xs font-medium ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <l.icon className="h-5 w-5" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
