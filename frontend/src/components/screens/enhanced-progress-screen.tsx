"use client"

import { useApp } from "../app-context"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "@/config"
import { MapPin, Volume2, ArrowLeft, ChevronRight, CheckCircle, AlertCircle, Flame, Calendar, TrendingUp } from "lucide-react"
import { useState } from "react"
import { Translate } from "@/components/translate"
import { translateDynamicText } from "@/lib/translations"

export function ProgressScreen() {
  const { checkHistory, streak, doctorAdviceHistory, language, t } = useApp()
  const navigate = useNavigate()
  
  // TTS audio playing state
  const [playingId, setPlayingId] = useState<string | null>(null)

  const sortedHistory = [...checkHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const lastCheckDate = sortedHistory[0]?.date ? new Date(sortedHistory[0].date) : null
  const nextCheckDate = lastCheckDate ? new Date(new Date(lastCheckDate).getTime() + 30*24*60*60*1000) : new Date()
  const totalChecks = checkHistory.length
  const concernCount = checkHistory.filter(c => c.hasConcern).length
  const clearRate = totalChecks > 0 ? Math.round(((totalChecks - concernCount)/totalChecks)*100) : 0

  const formatDate = (date: Date) => {
    const today = new Date()
    if (date.toDateString() === today.toDateString()) return t("prog.today")
    return date.toLocaleDateString(language === "hi" ? "hi-IN" : language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" })
  }
  const formatDateFull = (date: Date) => date.toLocaleDateString(language === "hi" ? "hi-IN" : language === "ar" ? "ar-EG" : "en-US", { month: "long", day: "numeric", year: "numeric" })
  const daysUntilNext = Math.ceil((nextCheckDate.getTime() - new Date().getTime()) / (1000*60*60*24))

  const playText = async (text: string, id: string) => {
    if (playingId === id) return
    setPlayingId(id)
    try {
      const translatedText = await translateDynamicText(text, language)
      const response = await fetch(`${API_BASE_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translatedText, lang: language })
      })
      if (response.ok) {
        const blob = await response.blob()
        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        audio.onended = () => setPlayingId(null)
        await audio.play()
      } else {
        setPlayingId(null)
      }
    } catch (e) {
      console.error(e)
      setPlayingId(null)
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">{t("lang.back")}</span>
        </button>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t("prog.title")}</h1>
      </div>

      {/* Stats cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
        <div className="glass-card rounded-xl p-5 card-elevated">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center"><Flame className="w-5 h-5 text-accent" /></div>
            <span className="text-sm font-medium text-muted-foreground">{t("prog.streak")}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{streak}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("prog.streakDesc")}</p>
        </div>
        <div className="glass-card rounded-xl p-5 card-elevated">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-success" /></div>
            <span className="text-sm font-medium text-muted-foreground">{t("prog.clearRate")}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{clearRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">{t("prog.clearRateDesc")}</p>
        </div>
        <div className="glass-card rounded-xl p-5 card-elevated">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center"><Calendar className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-medium text-muted-foreground">{t("prog.nextCheck")}</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatDateFull(nextCheckDate)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {daysUntilNext === 1 ? t("prog.inDay") : t("prog.inDays", { days: daysUntilNext })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Check history timeline */}
        <div className="glass-card rounded-xl p-6 card-elevated animate-fade-in-up" style={{animationDelay:"0.1s"}}>
          <h2 className="text-base font-semibold text-foreground uppercase tracking-wide mb-5">{t("prog.checkHistory")}</h2>
          <div className="space-y-6">
            {sortedHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">{t("prog.noChecks")}</p>
            ) : sortedHistory.map((check, index) => (
              <div key={check.id || index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${check.hasConcern ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>
                    {check.hasConcern ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  </div>
                  {index < sortedHistory.length - 1 && <div className="w-0.5 h-16 bg-border mt-2" />}
                </div>
                <div className="flex-1 pt-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{check.hasConcern ? t("prog.concernFound") : t("prog.allClear")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(new Date(check.date))}</p>
                    </div>
                    {check.summary && (
                      <button
                        onClick={() => playText(check.summary || "", check.id || index.toString())}
                        className="p-1.5 bg-secondary hover:bg-muted rounded-lg transition-colors flex items-center justify-center"
                        title={t("prog.hearSummary")}
                      >
                        <Volume2 className={`w-3.5 h-3.5 text-primary ${playingId === (check.id || index.toString()) ? "animate-bounce" : ""}`} />
                      </button>
                    )}
                  </div>
                  {check.summary && (
                    <p className="text-xs text-muted-foreground mt-2 bg-secondary/20 p-2.5 rounded-lg italic">
                      "<Translate>{check.summary}</Translate>"
                    </p>
                  )}
                  <div className="text-[10px] text-muted-foreground mt-2 flex gap-3 flex-wrap">
                    <span>{t("prog.lump")}: {check.responses.lump ? t("prog.yes") : t("prog.no")}</span>
                    <span>{t("prog.pain")}: {check.responses.painOrDischarge ? t("prog.yes") : t("prog.no")}</span>
                    <span>{t("prog.different")}: {check.responses.different ? t("prog.yes") : t("prog.no")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor advice list & Actions panel */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 card-elevated animate-fade-in-up" style={{animationDelay:"0.15s"}}>
            <h2 className="text-base font-semibold text-foreground uppercase tracking-wide mb-5">{t("prog.doctorNotes")}</h2>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {doctorAdviceHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">{t("prog.noNotes")}</p>
              ) : doctorAdviceHistory.map((doc, idx) => (
                <div key={doc.id || idx} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      {new Date(doc.createdAt).toLocaleDateString(language === "hi" ? "hi-IN" : language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {doc.doctorAdviceAnalyzed && (
                      <button
                        onClick={() => playText(doc.doctorAdviceAnalyzed || "", doc.id)}
                        className="p-1.5 bg-secondary hover:bg-muted rounded-lg transition-colors flex items-center justify-center"
                        title={t("prog.hearAdvice")}
                      >
                        <Volume2 className={`w-3.5 h-3.5 text-primary ${playingId === doc.id ? "animate-bounce" : ""}`} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {doc.doctorAdviceAnalyzed && (
                      <div className="bg-success/5 p-3 rounded-lg border border-success/10">
                        <p className="text-[10px] uppercase font-bold text-success mb-1">{t("prog.simplified")}</p>
                        <p className="text-xs text-foreground italic leading-relaxed">"<Translate>{doc.doctorAdviceAnalyzed}</Translate>"</p>
                      </div>
                    )}
                    {doc.doctorAdvice && (
                      <div className="bg-secondary/10 p-3 rounded-lg">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{t("prog.original")}</p>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">"<Translate>{doc.doctorAdvice}</Translate>"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 animate-fade-in-up" style={{animationDelay:"0.2s"}}>
            <button onClick={() => navigate("/find-clinic")}
              className="w-full glass-card rounded-xl p-5 card-elevated flex items-center gap-3 text-left group">
              <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors"><MapPin className="w-5 h-5 text-accent" /></div>
              <div className="flex-1"><p className="font-semibold text-foreground">{t("prog.findClinicsNear")}</p><p className="text-xs text-muted-foreground">{t("prog.browseProviders")}</p></div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>

            <button onClick={() => navigate("/doctor-feedback")}
              className="w-full h-14 gradient-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              {t("prog.recordFeedback")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
