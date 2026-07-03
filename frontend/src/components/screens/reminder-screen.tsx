"use client"

import { useNavigate } from "react-router-dom"
import { ChevronLeft, Bell, Volume2, Sun, Cloud, Moon, Check, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useApp } from "../app-context"

const timeOptions = [
  { id: "morning", label: "Morning", icon: Sun, time: "9:00 AM", desc: "Start your day mindfully" },
  { id: "afternoon", label: "Afternoon", icon: Cloud, time: "2:00 PM", desc: "Midday wellness break" },
  { id: "evening", label: "Evening", icon: Moon, time: "7:00 PM", desc: "Evening self-care routine" },
]

export function ReminderScreen() {
  const navigate = useNavigate()
  const { userSettings, saveReminder, language, t } = useApp()

  const [selectedTime, setSelectedTime] = useState("morning")
  const [selectedDay, setSelectedDay] = useState(15)
  const [voiceReminder, setVoiceReminder] = useState(true)
  const [loading, setLoading] = useState(false)

  // Pre-load saved preferences
  useEffect(() => {
    if (userSettings?.reminder) {
      try {
        const pref = JSON.parse(userSettings.reminder)
        if (pref.time) setSelectedTime(pref.time)
        if (pref.day) setSelectedDay(pref.day)
        if (pref.voice !== undefined) setVoiceReminder(pref.voice)
      } catch (e) {
        console.error("Failed to parse reminder setting:", e)
      }
    }
  }, [userSettings])

  // Dynamically calculate the next check date
  const getNextCheckDate = (day: number) => {
    const now = new Date()
    let targetMonth = now.getMonth()
    let targetYear = now.getFullYear()
    
    // If the preferred day has already passed this month, schedule for next month
    if (now.getDate() >= day) {
      targetMonth += 1
      if (targetMonth > 11) {
        targetMonth = 0
        targetYear += 1
      }
    }
    
    return new Date(targetYear, targetMonth, day)
  }

  const nextCheckDate = getNextCheckDate(selectedDay)
  const monthName = nextCheckDate.toLocaleDateString(language === "hi" ? "hi-IN" : language === "ar" ? "ar-EG" : "en-US", { month: "long" })
  const dayNum = nextCheckDate.getDate()
  const yearNum = nextCheckDate.getFullYear()

  const handleSave = async () => {
    setLoading(true)
    const success = await saveReminder(selectedDay, selectedTime, voiceReminder)
    setLoading(false)
    if (success) {
      navigate("/dashboard")
    } else {
      alert(t("rem.failedSave"))
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /><span className="text-sm font-medium">{t("lang.back")}</span>
          </button>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">{t("rem.title")}</h1>
          <p className="text-muted-foreground">{t("rem.sub")}</p>
        </div>

        {/* Next check date card */}
        <div className="glass-card rounded-2xl p-8 text-center mb-8 animate-fade-in-up" style={{animationDelay:"0.05s"}}>
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">{t("rem.nextCheck")}</p>
          <p className="text-4xl font-extrabold text-foreground tracking-tight">
            {language === "ar" ? `${dayNum} ${monthName}` : `${monthName} ${dayNum}`}
          </p>
          <p className="text-lg text-muted-foreground">{yearNum}</p>
        </div>

        {/* Day of Month selection */}
        <div className="mb-8 animate-fade-in-up" style={{animationDelay:"0.08s"}}>
          <p className="text-base font-semibold text-foreground mb-4 font-medium">{t("rem.preferredDay")}</p>
          <div className="grid grid-cols-7 gap-2 max-w-sm mx-auto p-4 rounded-2xl bg-card border border-border">
            {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
              const isSelected = selectedDay === day
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                    isSelected
                      ? "gradient-primary text-white shadow-md scale-105"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time selection */}
        <div className="mb-8 animate-fade-in-up" style={{animationDelay:"0.1s"}}>
          <p className="text-base font-semibold text-foreground mb-4">{t("rem.preferredTime")}</p>
          <div className="space-y-3 stagger-children">
            {timeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedTime === option.id
              return (
                <button key={option.id} onClick={() => setSelectedTime(option.id)}
                  className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 ${isSelected ? "glass-card border-2 !border-primary shadow-md" : "bg-card border border-border hover:border-primary/20 hover:shadow-sm"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSelected ? "gradient-primary shadow-sm" : "bg-secondary"}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-base font-semibold text-foreground">
                      {t(`rem.${option.id}`)} — {option.time}
                    </p>
                    <p className="text-sm text-muted-foreground">{t(`rem.${option.id}Desc`)}</p>
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-sm">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Voice reminder toggle */}
        <div className="mb-10 animate-fade-in-up" style={{animationDelay:"0.15s"}}>
          <button onClick={() => setVoiceReminder(!voiceReminder)}
            className="w-full p-4 rounded-xl bg-card border border-border flex items-center gap-4 hover:shadow-sm transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${voiceReminder ? "bg-primary/15" : "bg-secondary"}`}>
              <Volume2 className={`w-5 h-5 ${voiceReminder ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-base font-semibold text-foreground">{t("rem.voiceReminder")}</p>
              <p className="text-sm text-muted-foreground">{t("rem.voiceDesc")}</p>
            </div>
            <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${voiceReminder ? "bg-primary" : "bg-muted"}`}>
              <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${voiceReminder ? "translate-x-6" : "translate-x-0"}`} />
            </div>
          </button>
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={loading}
          className="w-full h-14 gradient-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-75">
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {t("rem.save")}
        </button>
      </div>
    </div>
  )
}
