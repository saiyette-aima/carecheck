"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { API_BASE_URL } from "@/config"
import { translations } from "@/lib/translations"

export interface CheckRecord {
  id?: string
  date: Date
  hasConcern: boolean
  responses: {
    lump: boolean
    painOrDischarge: boolean
    different: boolean
  }
  summary?: string
  doctorFeedback?: string
}

export interface DoctorAdviceRecord {
  id: string
  user_id: string
  doctorAdvice: string | null
  doctorAdviceAnalyzed: string | null
  createdAt: string
}

interface AppContextType {
  userId: string | null
  setUserId: (id: string | null) => void
  language: string
  setLanguage: (lang: string) => void
  examStep: number
  setExamStep: (step: number) => void
  currentResponses: {
    lump: boolean | null
    painOrDischarge: boolean | null
    different: boolean | null
  }
  setCurrentResponses: (responses: any) => void
  checkHistory: CheckRecord[]
  doctorAdviceHistory: DoctorAdviceRecord[]
  addCheck: (responses: any, hasConcern: boolean) => void
  addDoctorFeedback: (feedback: string) => void
  refreshHistory: () => Promise<void>
  streak: number
  resetExam: () => void
  userSettings: { email: string; reminder: string | null } | null
  saveReminder: (day: number, time: string, voice: boolean) => Promise<boolean>
  t: (key: string, variables?: Record<string, string | number>) => string
}

const AppContext = createContext<AppContextType | null>(null)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null)
  const [language, setLanguageState] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("language") || "en" : "en"))
  const [examStep, setExamStep] = useState(1)

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const langTranslations = translations[language] || translations["en"];
    let text = langTranslations[key] || translations["en"][key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const [currentResponses, setCurrentResponses] = useState({
    lump: null as boolean | null,
    painOrDischarge: null as boolean | null,
    different: null as boolean | null,
  })
  
  // Local check history fallback
  const [localCheckHistory, setLocalCheckHistory] = useState<CheckRecord[]>([
    { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), hasConcern: false, responses: { lump: false, painOrDischarge: false, different: false } },
    { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), hasConcern: false, responses: { lump: false, painOrDischarge: false, different: false } },
    { date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), hasConcern: true, responses: { lump: true, painOrDischarge: false, different: false } },
    { date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), hasConcern: false, responses: { lump: false, painOrDischarge: false, different: false } },
  ])
  
  const [dbReports, setDbReports] = useState<any[]>([])
  const [doctorAdviceHistory, setDoctorAdviceHistory] = useState<DoctorAdviceRecord[]>([])
  const [userSettings, setUserSettings] = useState<{ email: string; reminder: string | null } | null>(null)
  const [streak, setStreak] = useState(1)

  const setUserId = (id: string | null) => {
    setUserIdState(id)
    if (id) {
      localStorage.setItem("userId", id)
      fetchHistory(id)
    } else {
      localStorage.removeItem("userId")
      setDbReports([])
      setDoctorAdviceHistory([])
      setUserSettings(null)
    }
  }

  const fetchHistory = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`, {
        headers: { "userId": id }
      })
      if (res.ok) {
        const data = await res.json()
        setDbReports(data.reports || [])
        setDoctorAdviceHistory(data.doctorAdvice || [])
        setUserSettings(data.user || null)
      }
    } catch (e) {
      console.error("Failed to fetch history:", e)
    }
  }

  const refreshHistory = async () => {
    if (userId) {
      await fetchHistory(userId)
    }
  }

  const saveReminder = async (day: number, time: string, voice: boolean) => {
    if (!userId) return false
    try {
      const res = await fetch(`${API_BASE_URL}/reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "userId": userId
        },
        body: JSON.stringify({ day, time, voice })
      })
      if (res.ok) {
        await refreshHistory()
        return true
      }
      return false
    } catch (e) {
      console.error("Failed to save reminder:", e)
      return false
    }
  }

  useEffect(() => {
    const savedId = localStorage.getItem("userId")
    if (savedId) {
      setUserIdState(savedId)
      fetchHistory(savedId)
    }
  }, [])

  // Map db reports dynamically, using stable criteria for concerns
  const checkHistory = userId && dbReports.length > 0
    ? dbReports.map((rep: any) => {
        const hasLump = rep.lump && !/^(no|none|n|false|clear)$/i.test(rep.lump.trim())
        const hasPain = rep.pain && !/^(no|none|n|false|clear)$/i.test(rep.pain.trim())
        const hasDiff = rep.different && !/^(no|none|n|false|clear)$/i.test(rep.different.trim())
        return {
          id: rep.id,
          date: new Date(rep.createdAt),
          hasConcern: !!rep.hasConcern,
          responses: {
            lump: !!hasLump,
            painOrDischarge: !!hasPain,
            different: !!hasDiff,
          },
          summary: rep.summary,
        }
      })
    : localCheckHistory

  // Update streak dynamically based on history
  useEffect(() => {
    if (checkHistory.length > 0) {
      let currentStreak = 0
      // Sort with oldest first to count consecutive clear months
      const sorted = [...checkHistory].sort((a, b) => a.date.getTime() - b.date.getTime())
      for (const check of sorted) {
        if (!check.hasConcern) {
          currentStreak++
        } else {
          currentStreak = 0
        }
      }
      setStreak(currentStreak || 1)
    }
  }, [checkHistory])

  const resetExam = () => {
    setExamStep(1)
    setCurrentResponses({ lump: null, painOrDischarge: null, different: null })
  }

  const addCheck = (responses: any, hasConcern: boolean) => {
    setLocalCheckHistory(prev => [...prev, {
      date: new Date(),
      hasConcern,
      responses,
      doctorFeedback: undefined
    }])
    refreshHistory()
  }

  const addDoctorFeedback = (feedback: string) => {
    setLocalCheckHistory(prev => {
      const updated = [...prev]
      if (updated.length > 0) {
        updated[updated.length - 1].doctorFeedback = feedback
      }
      return updated
    })
    refreshHistory()
  }

  return (
    <AppContext.Provider value={{
      userId,
      setUserId,
      language,
      setLanguage,
      examStep,
      setExamStep,
      currentResponses,
      setCurrentResponses,
      checkHistory,
      doctorAdviceHistory,
      addCheck,
      addDoctorFeedback,
      refreshHistory,
      streak,
      resetExam,
      userSettings,
      saveReminder,
      t
    }}>
      {children}
    </AppContext.Provider>
  )
}
