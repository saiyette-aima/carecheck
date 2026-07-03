"use client"

import { useApp } from "../app-context"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "@/config"
import { CheckCircle, Heart, Volume2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { Translate } from "@/components/translate"
import { translateDynamicText } from "@/lib/translations"

export function ResultOkScreen() {
  const { addCheck, currentResponses, language, t } = useApp()
  const navigate = useNavigate()
  const [playingSummary, setPlayingSummary] = useState(false)

  const latestSummary = localStorage.getItem("latestSummary") || "Your self checkup is complete and everything looks good. No warning signs were detected. Continue checking monthly to stay familiar with your body."

  const handleContinue = () => {
    addCheck(currentResponses, false)
    navigate("/progress")
  }

  const handleHearSummary = async () => {
    if (playingSummary) return
    setPlayingSummary(true)
    try {
      const translatedText = await translateDynamicText(latestSummary, language)
      const response = await fetch(`${API_BASE_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translatedText, lang: language })
      })
      if (response.ok) {
        const blob = await response.blob()
        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        audio.onended = () => setPlayingSummary(false)
        await audio.play()
      } else {
        setPlayingSummary(false)
      }
    } catch (e) {
      console.error(e)
      setPlayingSummary(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-10 relative overflow-hidden">
      {/* Celebration particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float"
            style={{
              background: i % 3 === 0 ? "var(--success)" : i % 3 === 1 ? "var(--primary)" : "var(--accent)",
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-lg animate-scale-in relative z-10">
        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-success/15 flex items-center justify-center animate-glow-pulse">
            <div className="w-18 h-18 rounded-full bg-success/25 flex items-center justify-center">
              <CheckCircle className="w-14 h-14 text-success" />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-3">
            {t("res.okTitle")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("res.okSub")}
          </p>
        </div>

        {/* AI summary report card */}
        <div className="glass-card rounded-xl p-6 border border-border/80 mb-6 bg-secondary/10">
          <p className="text-[11px] uppercase tracking-wider text-primary font-bold mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> {t("res.aiSummary")}
          </p>
          <p className="text-sm text-foreground leading-relaxed italic">
            "<Translate>{latestSummary}</Translate>"
          </p>
        </div>

        {/* Info cards */}
        <div className="space-y-4 mb-8 stagger-children">
          <div className="glass-card rounded-xl p-6 border-l-4 border-l-success">
            <div className="flex gap-3">
              <Heart className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">
                  {t("res.okTip1Title")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("res.okTip1Desc")}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 border-l-4 border-l-primary">
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">
                {t("res.okTip2Desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Audio summary */}
        <button
          onClick={handleHearSummary}
          disabled={playingSummary}
          className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-muted rounded-xl py-3.5 transition-colors mb-4 disabled:opacity-75"
        >
          <Volume2 className={`w-5 h-5 text-primary ${playingSummary ? "animate-bounce" : ""}`} />
          <span className="text-sm font-semibold text-foreground">
            {playingSummary ? t("res.playingAudio") : t("res.hearSummary")}
          </span>
        </button>

        {/* Continue */}
        <button
          onClick={handleContinue}
          className="w-full h-14 gradient-primary text-white rounded-xl font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
        >
          {t("res.viewProgress")}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
