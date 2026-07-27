"use client"

import { useApp } from "@/components/app-context"
import { useNavigate } from "react-router-dom"

function MSym({ name, className = "", fill = false }: { name: string; className?: string; fill?: boolean }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}>
      {name}
    </span>
  )
}

export function DashboardScreen() {
  const { streak, checkHistory, resetExam, t, language } = useApp()
  const navigate = useNavigate()

  const startSelfCheck = () => {
    resetExam()
    navigate("/exam-step")
  }

  const totalChecks = checkHistory.length
  const concernCount = checkHistory.filter((c) => c.hasConcern).length
  const clearRate = totalChecks > 0 ? Math.round(((totalChecks - concernCount) / totalChecks) * 100) : 0
  const sortedHistory = [...checkHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const lastCheck = sortedHistory[0]
  const nextCheckDate = lastCheck ? new Date(new Date(lastCheck.date).getTime() + 30 * 24 * 60 * 60 * 1000) : new Date()
  const locale = language === "hi" ? "hi-IN" : language === "ar" ? "ar-EG" : "en-US"
  const nextCheckStr = nextCheckDate.toLocaleDateString(locale, { month: "long", day: "numeric" })

  return (
    <div className="p-safe-margin min-h-screen relative">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <p className="font-body-md text-body-md text-[#6f5959] opacity-80 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t("dash.welcome")}
          </p>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mt-2">{t("dash.title")}</h2>
        </div>
        <div className="flex items-center gap-4 bg-white/40 p-2 pr-6 rounded-full border border-white/60">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary border-2 border-surface">
            <MSym name="person" fill />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface font-semibold">{t("login.title")}</span>
        </div>
      </header>

      {/* ── Bento Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-element-gap gap-y-12 items-stretch">
        {/* Hero personal message */}
        <section className="md:col-span-7 group flex">
          <div className="relative overflow-hidden bg-primary p-8 md:p-12 rounded-[3rem] text-on-primary layered-shadow asymmetric-card w-full min-h-[420px] flex flex-col justify-center">
            <div className="relative z-10 max-w-lg">
              <h3 className="font-display-lg text-[40px] leading-tight mb-4">{t("dash.startCheck")}</h3>
              <p className="font-body-lg text-body-lg text-on-primary/80 mb-10">
                {t("dash.checkDesc")}
              </p>
              <button
                onClick={startSelfCheck}
                className="bg-white text-primary px-10 py-5 custom-radius font-title-md text-title-md flex items-center gap-3 hover:shadow-2xl transition-all active:scale-95 group/btn"
              >
                {t("dash.startCheck")}
                <MSym name="arrow_forward" className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute right-[-8%] bottom-[-15%] w-[320px] opacity-30 mix-blend-soft-light pointer-events-none">
              <MSym name="self_improvement" fill className="text-[320px] text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-transparent to-white/10 pointer-events-none" />
          </div>
        </section>

        {/* Streak + Nudge */}
        <section className="md:col-span-5 flex flex-col gap-element-gap">
          <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/20 asymmetric-card card-elevated">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-secondary-container rounded-2xl flex items-center justify-center text-[#6f5959]">
                <MSym name="local_fire_department" fill />
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-[#6f5959] border border-[#6f5959]/10 uppercase tracking-[0.15em]">
                {t("dash.streak")}
              </span>
            </div>
            <div className="mb-4">
              <span className="font-display-lg text-display-lg text-on-surface font-medium tracking-tight">{streak}</span>
              <span className="font-body-md text-body-md text-on-surface-variant block font-light tracking-[0.05em] uppercase mt-1">
                {t("dash.streakSub")}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant opacity-70">{t("dash.streakGoal")}</p>
            <div className="mt-8 flex gap-2">
              <div className="flex-1 h-1 bg-[#6f5959]/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${Math.min((streak / 12) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-sm asymmetric-card relative overflow-hidden card-elevated">
            <div className="absolute inset-0 grain-texture pointer-events-none opacity-[0.03]" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
                <MSym name="event_repeat" />
              </div>
              <h4 className="font-title-md text-title-md text-on-surface">{t("dash.setReminder")}</h4>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 relative z-10">
              {t("prog.nextCheck")}: {nextCheckStr}.
            </p>
            <button
              onClick={() => navigate("/reminder")}
              className="w-full py-4 rounded-2xl border border-primary/20 text-primary font-title-md hover:bg-primary-fixed/30 transition-colors relative z-10"
            >
              {t("dash.reminderDesc")}
            </button>
          </div>
        </section>

        {/* Your Journey */}
        <section className="md:col-span-12 mt-8">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">{t("dash.viewProgress")}</h3>
            <button onClick={() => navigate("/progress")} className="text-primary font-label-sm hover:underline tracking-widest uppercase text-[11px]">
              {t("prog.checkHistory")}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Examination history mini-chart */}
            <button
              onClick={() => navigate("/progress")}
              className="bg-white p-8 rounded-[2rem] border border-outline-variant/10 shadow-lg shadow-black/[0.03] flex flex-col gap-6 md:translate-y-4 text-left card-elevated"
            >
              <div className="h-32 w-full bg-surface-container rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-end justify-around px-6 pb-2 gap-3">
                  <div className="w-4 bg-primary/20 h-1/2 rounded-t-lg" />
                  <div className="w-4 bg-primary/30 h-3/4 rounded-t-lg" />
                  <div className="w-4 bg-primary/20 h-2/3 rounded-t-lg" />
                  <div className="w-4 bg-primary h-full rounded-t-lg" />
                  <div className="w-4 bg-primary/50 h-3/4 rounded-t-lg" />
                </div>
              </div>
              <div>
                <h5 className="font-title-md text-title-md">{t("prog.checkHistory")}</h5>
                <p className="font-body-md text-body-md text-on-surface-variant opacity-70">
                  {totalChecks} {t("dash.totalChecks")} · {clearRate}% {t("dash.clearRate")}
                </p>
              </div>
            </button>

            {/* Community wisdom quote */}
            <div className="bg-secondary-fixed p-8 rounded-[2rem] border border-[#6f5959]/10 flex flex-col justify-between md:-translate-y-4">
              <p className="font-headline-lg text-xl text-on-secondary-fixed leading-relaxed font-normal italic">
                "Knowing your 'normal' is the single most important step in early detection."
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-label-sm text-on-secondary-fixed-variant uppercase tracking-widest text-[10px]">Community Wisdom</span>
                <MSym name="format_quote" className="text-[#6f5959] opacity-40" />
              </div>
            </div>

            {/* Find a specialist */}
            <button
              onClick={() => navigate("/find-clinic")}
              className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 group cursor-pointer hover:bg-surface-container-high transition-all md:translate-y-2 text-left"
            >
              <div className="w-20 h-20 rounded-[1.5rem] bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                <MSym name="local_hospital" className="text-4xl" />
              </div>
              <div>
                <h5 className="font-title-md text-title-md">{t("prog.findClinicsNear")}</h5>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.2em] text-[10px] mt-2">
                  {t("prog.browseProviders")}
                </p>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-section-gap pt-element-gap border-t border-outline-variant/30 flex flex-col items-center text-center">
        <h1 className="font-headline-lg-mobile text-primary text-headline-lg mb-4">{t("login.title")}</h1>
        <p className="font-body-md text-body-md text-on-secondary-fixed-variant max-w-md mb-8">
          Supporting your journey with gentle guidance, privacy, and proactive care.
        </p>
        <p className="font-label-sm text-label-sm text-on-secondary-fixed-variant opacity-60">
          © {new Date().getFullYear()} CareCheck. All rights reserved.
        </p>
      </footer>

      {/* FAB */}
      <button
        onClick={startSelfCheck}
        className="fixed bottom-24 right-8 md:bottom-12 md:right-12 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center group active:scale-90 transition-transform z-40"
      >
        <MSym name="add" className="text-3xl" />
        <div className="absolute right-20 bg-white px-4 py-2 rounded-xl text-primary font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-primary/10">
          {t("dash.startCheck")}
        </div>
      </button>
    </div>
  )
}
