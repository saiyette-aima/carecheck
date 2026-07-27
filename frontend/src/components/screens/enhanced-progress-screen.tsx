"use client"

import { useApp } from "../app-context"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "@/config"
import { useState } from "react"
import { Translate } from "@/components/translate"
import { translateDynamicText } from "@/lib/translations"

function MSym({ name, className = "", fill = false }: { name: string; className?: string; fill?: boolean }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}>
      {name}
    </span>
  )
}

export function ProgressScreen() {
  const { checkHistory, streak, doctorAdviceHistory, language, resetExam, t } = useApp()
  const navigate = useNavigate()
  const [playingId, setPlayingId] = useState<string | null>(null)

  const locale = language === "hi" ? "hi-IN" : language === "ar" ? "ar-EG" : "en-US"
  const sortedHistory = [...checkHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const lastCheckDate = sortedHistory[0]?.date ? new Date(sortedHistory[0].date) : null
  const nextCheckDate = lastCheckDate ? new Date(new Date(lastCheckDate).getTime() + 30 * 24 * 60 * 60 * 1000) : new Date()
  const totalChecks = checkHistory.length
  const concernCount = checkHistory.filter((c) => c.hasConcern).length
  const clearRate = totalChecks > 0 ? Math.round(((totalChecks - concernCount) / totalChecks) * 100) : 0
  const daysUntilNext = Math.ceil((nextCheckDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  // 6-month consistency flow
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const done = checkHistory.some((c) => {
      const cd = new Date(c.date)
      return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth()
    })
    const isCurrent = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    return {
      label: d.toLocaleDateString(locale, { month: "short" }),
      done,
      isCurrent,
      height: done ? 60 + ((i * 13) % 35) : 18,
    }
  })

  const formatDate = (date: Date) => {
    if (date.toDateString() === new Date().toDateString()) return t("prog.today")
    return date.toLocaleDateString(locale, { month: "short", day: "numeric" })
  }
  const formatDateShort = (date: Date) => date.toLocaleDateString(locale, { month: "long", day: "numeric" })

  const playText = async (text: string, id: string) => {
    if (playingId === id) return
    setPlayingId(id)
    try {
      const translatedText = await translateDynamicText(text, language)
      const response = await fetch(`${API_BASE_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translatedText, lang: language }),
      })
      if (response.ok) {
        const blob = await response.blob()
        const audio = new Audio(URL.createObjectURL(blob))
        audio.onended = () => setPlayingId(null)
        await audio.play()
      } else setPlayingId(null)
    } catch (e) {
      console.error(e)
      setPlayingId(null)
    }
  }

  const startSelfCheck = () => {
    resetExam()
    navigate("/exam-step")
  }

  return (
    <div className="px-safe-margin pt-12 pb-24 max-w-6xl">
      {/* ── Header ── */}
      <header className="mb-section-gap flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="font-label-sm text-primary mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t("dash.welcome")}
          </p>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-4">{t("prog.title")}</h2>
          <p className="font-body-lg text-on-secondary-fixed-variant leading-relaxed italic">
            "Small checks today can make a difference tomorrow."
          </p>
        </div>
        <button
          onClick={startSelfCheck}
          className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap uppercase tracking-widest text-[11px]"
        >
          <MSym name="add" className="text-[20px]" />
          {t("dash.startCheck")}
        </button>
      </header>

      {/* ── High-Impact Bento ── */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-element-gap">
        {/* Hero stats */}
        <div className="md:col-span-8 asymmetric-card bg-surface-container-low p-10 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/40">
          <div className="absolute -left-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
            <MSym name="local_florist" fill className="text-[160px] text-primary" />
          </div>
          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full font-label-sm inline-block mb-6 border border-on-secondary-container/10">
              {streak} {streak !== 1 ? t("dash.months") : t("dash.month")} {t("prog.streak")}
            </span>
            <h3 className="font-headline-lg text-on-surface mb-8 max-w-md">Your habit of self-care is blossoming.</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 mt-4">
              <div className="relative group">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mb-2 opacity-60">{t("prog.streak")}</p>
                <p className="font-headline-lg text-primary text-5xl relative">{streak}<span className="text-xl ml-1 font-body-md opacity-40">mo</span></p>
              </div>
              <div className="relative group">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mb-2 opacity-60">{t("dash.totalChecks")}</p>
                <p className="font-headline-lg text-on-surface text-5xl relative">{String(totalChecks).padStart(2, "0")}</p>
              </div>
              <div className="hidden sm:block relative group">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mb-2 opacity-60">{t("prog.clearRate")}</p>
                <p className="font-headline-lg text-on-surface text-5xl relative">{clearRate}<span className="text-xl ml-1 font-body-md opacity-40">%</span></p>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-4 mt-8 pt-8 border-t border-outline-variant/20">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full border-2 border-surface-container-low bg-primary-fixed flex items-center justify-center text-primary"><MSym name="person" fill className="text-lg" /></div>
              <div className="w-10 h-10 rounded-full border-2 border-surface-container-low bg-secondary-fixed flex items-center justify-center text-[#6f5959]"><MSym name="person" fill className="text-lg" /></div>
              <div className="w-10 h-10 rounded-full border-2 border-surface-container-low bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold">+12</div>
            </div>
            <p className="font-body-md text-on-surface-variant italic opacity-70">Join 4,200 others in the care community.</p>
          </div>
        </div>

        {/* Next check + reminders */}
        <div className="md:col-span-4 flex flex-col gap-8">
          <div className="flex-grow asymmetric-card bg-primary text-on-primary p-8 flex flex-col justify-between group cursor-pointer overflow-hidden shadow-xl shadow-primary/20" onClick={() => navigate("/reminder")}>
            <div className="flex justify-between items-start">
              <MSym name="calendar_month" fill className="text-4xl" />
              <MSym name="arrow_forward" className="group-hover:translate-x-2 transition-transform" />
            </div>
            <div>
              <h4 className="font-title-md mb-2">{t("prog.nextCheck")}</h4>
              <p className="font-headline-lg text-4xl">{formatDateShort(nextCheckDate)}</p>
              <p className="font-label-sm opacity-80 mt-4 tracking-widest uppercase text-[10px]">
                {daysUntilNext === 1 ? t("prog.inDay") : t("prog.inDays", { days: daysUntilNext })}
              </p>
            </div>
          </div>
          <div className="asymmetric-card bg-surface-container-highest p-8 border border-outline-variant/30">
            <h4 className="font-label-sm text-primary mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
              <MSym name="auto_awesome" className="text-lg" />
              Gentle Reminders
            </h4>
            <ul className="space-y-6">
              {["Perform your check at the same time each month for accuracy.", "Use the flat part of your fingers, not the tips."].map((tip) => (
                <li key={tip} className="flex gap-3 items-start group">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 transition-all group-hover:bg-primary group-hover:scale-125" />
                  <p className="text-[14px] leading-relaxed text-on-surface-variant/90">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="hand-drawn-divider w-full my-12 opacity-50" />

      {/* ── Consistency Flow ── */}
      <section className="mb-section-gap">
        <div className="flex items-baseline justify-between mb-10">
          <h3 className="font-headline-lg text-on-surface">Consistency Flow</h3>
        </div>
        <div className="bg-surface-container-lowest p-8 md:p-12 asymmetric-card shadow-sm border border-outline-variant/20 relative overflow-hidden">
          <div className="h-64 w-full relative flex items-end justify-between gap-2 md:gap-4">
            {months.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center group">
                <div
                  className={`w-full rounded-t-full transition-all duration-700 relative border-t ${
                    m.isCurrent ? "bg-primary/20 border-primary/40" : m.done ? "organic-gradient-fill border-primary/20" : "bg-outline-variant/10 border-transparent"
                  }`}
                  style={{ height: `${m.height}%` }}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface p-2 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    <p className="text-[10px] font-bold uppercase">{m.label} · {m.done ? t("prog.allClear") : "—"}</p>
                  </div>
                </div>
                <span className={`font-label-sm mt-6 tracking-[0.3em] uppercase text-[10px] ${m.isCurrent ? "text-primary font-bold" : "text-on-surface-variant opacity-40"}`}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── History + Doctor notes ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Check history timeline */}
        <div className="asymmetric-card bg-surface-container-low p-8 border border-white/60">
          <h2 className="font-title-md text-title-md text-on-surface mb-6 flex items-center gap-2">
            <MSym name="history" className="text-primary" /> {t("prog.checkHistory")}
          </h2>
          <div className="space-y-6">
            {sortedHistory.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-6">{t("prog.noChecks")}</p>
            ) : (
              sortedHistory.map((check, index) => (
                <div key={check.id || index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${check.hasConcern ? "bg-warning/15 text-warning" : "bg-primary-fixed/40 text-primary"}`}>
                      <MSym name={check.hasConcern ? "error" : "check_circle"} fill />
                    </div>
                    {index < sortedHistory.length - 1 && <div className="w-0.5 h-14 bg-outline-variant/50 mt-2" />}
                  </div>
                  <div className="flex-1 pt-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-on-surface">{check.hasConcern ? t("prog.concernFound") : t("prog.allClear")}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{formatDate(new Date(check.date))}</p>
                      </div>
                      {check.summary && (
                        <button
                          onClick={() => playText(check.summary || "", check.id || index.toString())}
                          className="p-1.5 bg-white hover:bg-primary-fixed/30 rounded-lg transition-colors flex items-center justify-center"
                          title={t("prog.hearSummary")}
                        >
                          <MSym name="volume_up" className={`text-primary text-[18px] ${playingId === (check.id || index.toString()) ? "animate-bounce" : ""}`} />
                        </button>
                      )}
                    </div>
                    {check.summary && (
                      <p className="text-xs text-on-surface-variant mt-2 bg-white/60 p-2.5 rounded-lg italic">
                        "<Translate>{check.summary}</Translate>"
                      </p>
                    )}
                    <div className="text-[10px] text-on-surface-variant mt-2 flex gap-3 flex-wrap">
                      <span>{t("prog.lump")}: {check.responses.lump ? t("prog.yes") : t("prog.no")}</span>
                      <span>{t("prog.pain")}: {check.responses.painOrDischarge ? t("prog.yes") : t("prog.no")}</span>
                      <span>{t("prog.different")}: {check.responses.different ? t("prog.yes") : t("prog.no")}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Doctor notes + actions */}
        <div className="space-y-8">
          <div className="asymmetric-card bg-surface-container-low p-8 border border-white/60">
            <h2 className="font-title-md text-title-md text-on-surface mb-6 flex items-center gap-2">
              <MSym name="clinical_notes" className="text-primary" /> {t("prog.doctorNotes")}
            </h2>
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
              {doctorAdviceHistory.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-6">{t("prog.noNotes")}</p>
              ) : (
                doctorAdviceHistory.map((doc, idx) => (
                  <div key={doc.id || idx} className="border-b border-outline-variant/40 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold bg-primary-fixed/40 text-primary px-2.5 py-1 rounded-full">
                        {new Date(doc.createdAt).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {doc.doctorAdviceAnalyzed && (
                        <button
                          onClick={() => playText(doc.doctorAdviceAnalyzed || "", doc.id)}
                          className="p-1.5 bg-white hover:bg-primary-fixed/30 rounded-lg transition-colors flex items-center justify-center"
                          title={t("prog.hearAdvice")}
                        >
                          <MSym name="volume_up" className={`text-primary text-[18px] ${playingId === doc.id ? "animate-bounce" : ""}`} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {doc.doctorAdviceAnalyzed && (
                        <div className="bg-primary-fixed/20 p-3 rounded-lg border border-primary/10">
                          <p className="text-[10px] uppercase font-bold text-primary mb-1">{t("prog.simplified")}</p>
                          <p className="text-xs text-on-surface italic leading-relaxed">"<Translate>{doc.doctorAdviceAnalyzed}</Translate>"</p>
                        </div>
                      )}
                      {doc.doctorAdvice && (
                        <div className="bg-white/60 p-3 rounded-lg">
                          <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">{t("prog.original")}</p>
                          <p className="text-xs text-on-surface-variant italic leading-relaxed">"<Translate>{doc.doctorAdvice}</Translate>"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/find-clinic")}
              className="w-full asymmetric-card bg-white p-5 flex items-center gap-3 text-left group border border-outline-variant/20 card-elevated"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-[#6f5959] group-hover:bg-primary-fixed transition-colors">
                <MSym name="location_on" fill />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-on-surface">{t("prog.findClinicsNear")}</p>
                <p className="text-xs text-on-surface-variant">{t("prog.browseProviders")}</p>
              </div>
              <MSym name="chevron_right" className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/doctor-feedback")}
              className="w-full py-5 rounded-full font-title-md text-title-md bg-primary text-on-primary flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"
            >
              <MSym name="mic" />
              {t("prog.recordFeedback")}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
