"use client"

import { useApp } from "@/components/app-context"
import { useNavigate } from "react-router-dom"
import { Volume2, ChevronLeft, Check } from "lucide-react"

const languages = [
  { code: "hi", name: "हिंदी", native: "Hindi", flag: "🇮🇳" },
  { code: "ar", name: "العربية", native: "Arabic", flag: "🇸🇦" },
  { code: "zh", name: "中文", native: "Mandarin", flag: "🇨🇳" },
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
]

export function LanguageScreen() {
  const { setLanguage, language, t } = useApp()
  const navigate = useNavigate()

  const handleSelect = (code: string) => {
    setLanguage(code)
  }

  const handleContinue = () => {
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden gradient-hero p-4 sm:p-8">
      {/* Decorative orbs */}
      <div className="orb w-[400px] h-[400px] bg-primary/20 -top-32 -right-32 fixed" />
      <div className="orb w-[300px] h-[300px] bg-accent/15 bottom-10 left-10 fixed" />

      {/* Centered card */}
      <div className="w-full max-w-lg animate-scale-in">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">{t("lang.back")}</span>
        </button>

        <div className="glass-card rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("lang.title")}
            </h1>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {t("lang.sub")}
              </span>
            </div>
          </div>

          {/* Language options */}
          <div className="space-y-3 stagger-children mb-8">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 group ${
                  language === lang.code
                    ? "bg-primary/10 border-2 border-primary shadow-md"
                    : "bg-background/60 border border-border hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                <span className="text-3xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <p className="text-lg font-semibold text-foreground">
                    {lang.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{lang.native}</p>
                </div>

                {language === lang.code ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                ) : (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full h-14 gradient-primary text-white rounded-xl flex items-center justify-center text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {t("lang.continue")}
          </button>
        </div>
      </div>
    </div>
  )
}
