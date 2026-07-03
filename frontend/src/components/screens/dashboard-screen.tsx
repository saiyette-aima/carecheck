"use client"

import { useApp } from "@/components/app-context"
import { useNavigate } from "react-router-dom"
import {
  Play,
  BarChart3,
  Bell,
  CheckCircle2,
  Heart,
  Flame,
  TrendingUp,
  Calendar,
  ArrowRight,
  AlertCircle,
} from "lucide-react"

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

  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* ── Header ── */}
      <div className="mb-8 animate-fade-in-up">
        <p className="text-sm text-muted-foreground mb-1">{t("dash.welcome")}</p>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
          {t("dash.title")}
        </h1>
      </div>

      {/* ── Hero CTA ── */}
      <div
        onClick={startSelfCheck}
        className="relative overflow-hidden gradient-primary rounded-2xl p-8 lg:p-10 mb-8 cursor-pointer group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {t("dash.startCheck")}
              </h2>
              <p className="text-white/70 text-sm">
                {t("dash.checkDesc")}
              </p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white/60 group-hover:translate-x-2 transition-transform duration-300 hidden lg:block" />
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {/* Streak */}
        <div className="glass-card rounded-xl p-5 card-elevated">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {t("dash.streak")}
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{streak}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("dash.streakSub")}
          </p>
        </div>

        {/* Total checks */}
        <div className="glass-card rounded-xl p-5 card-elevated">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {t("dash.totalChecks")}
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalChecks}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("dash.totalSub")}
          </p>
        </div>

        {/* Clear rate */}
        <div className="glass-card rounded-xl p-5 card-elevated">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {t("dash.clearRate")}
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{clearRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("dash.clearRateSub")}
          </p>
        </div>

        {/* Last check */}
        <div className="glass-card rounded-xl p-5 card-elevated">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              !lastCheck ? "bg-muted" : lastCheck.hasConcern ? "bg-warning/15" : "bg-success/15"
            }`}>
              {!lastCheck ? (
                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
              ) : lastCheck.hasConcern ? (
                <AlertCircle className="w-5 h-5 text-warning" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-success" />
              )}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {t("dash.lastCheck")}
            </span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {lastCheck 
              ? new Date(lastCheck.date).toLocaleDateString(language === "hi" ? "hi-IN" : language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric", year: "numeric" })
              : t("dash.noneYet")
            }
          </p>
          <p className={`text-xs mt-1 ${
            !lastCheck ? "text-muted-foreground" : lastCheck.hasConcern ? "text-warning font-medium" : "text-success font-medium"
          }`}>
            {!lastCheck 
              ? t("dash.noChecks") 
              : lastCheck.hasConcern 
              ? t("dash.concernFound") 
              : t("dash.allClear")
            }
          </p>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate("/progress")}
          className="glass-card rounded-xl p-6 card-elevated flex items-center gap-4 group text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground">
              {t("dash.viewProgress")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("dash.progressDesc")}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => navigate("/reminder")}
          className="glass-card rounded-xl p-6 card-elevated flex items-center gap-4 group text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-warning/15 flex items-center justify-center group-hover:bg-warning/25 transition-colors">
            <Bell className="w-6 h-6 text-warning" />
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground">
              {t("dash.setReminder")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("dash.reminderDesc")}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-warning group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* ── Streak Visualization ── */}
      <div className="glass-card rounded-xl p-6 card-elevated animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            {t("dash.monthlyStreak")}
          </h3>
          <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
            {streak} {streak !== 1 ? t("dash.months") : t("dash.month")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < streak
                  ? "gradient-primary text-white shadow-sm"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          {t("dash.streakGoal")}
        </p>
      </div>
    </div>
  )
}
