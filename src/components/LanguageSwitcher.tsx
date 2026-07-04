import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/types";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const options: { value: Language; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "ja", label: "日本語" },
  ];
  return (
    <div className="inline-flex rounded-full border bg-card p-1 shadow-sm" role="group" aria-label="Language">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => setLang(o.value)}
          className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition-colors ${
            lang === o.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
          aria-pressed={lang === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
