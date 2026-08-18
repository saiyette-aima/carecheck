"use client"

import { useApp } from "../app-context"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "@/config"
import { Mic, Check, ArrowLeft, Volume2, Trash2, Square, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Translate } from "@/components/translate"
import { translateDynamicText } from "@/lib/translations"

export function DoctorFeedbackScreen() {
  const { addDoctorFeedback, userId, language, t } = useApp()
  const navigate = useNavigate()

  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzedAdvice, setAnalyzedAdvice] = useState("")
  const [playingAdvice, setPlayingAdvice] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleStartRecording = async () => {
    try {
      setAnalyzedAdvice("")
      setHasRecording(false)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await uploadAudio(audioBlob)
      }

      recorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 120) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (e) {
      console.error(e)
      alert(t("doc.micRequired", "Microphone access is required to record feedback."))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const uploadAudio = async (blob: Blob) => {
    setAnalyzing(true)
    const formData = new FormData()
    formData.append("audio", blob, "doctor-feedback.wav")

    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: "POST",
        headers: {
          "userId": userId || "guest-user"
        },
        body: formData
      })
      if (response.ok) {
        const data = await response.json()
        setAnalyzedAdvice(data.msg)
        setHasRecording(true)
      } else {
        alert(t("doc.failedAnalyze", "Failed to analyze recording. Please try again."))
      }
    } catch (e) {
      console.error(e)
      alert(t("doc.failedConnect", "Could not connect to analysis server."))
    } finally {
      setAnalyzing(false)
    }
  }

  const handleHearAdvice = async () => {
    if (playingAdvice || !analyzedAdvice) return
    setPlayingAdvice(true)
    try {
      const translatedText = await translateDynamicText(analyzedAdvice, language)
      const response = await fetch(`${API_BASE_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translatedText, lang: language })
      })
      if (response.ok) {
        const blob = await response.blob()
        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        audio.onended = () => setPlayingAdvice(false)
        await audio.play()
      } else {
        setPlayingAdvice(false)
      }
    } catch (e) {
      console.error(e)
      setPlayingAdvice(false)
    }
  }

  const handleDeleteRecording = () => {
    setHasRecording(false)
    setRecordingTime(0)
    setAnalyzedAdvice("")
  }

  const handleSave = () => {
    addDoctorFeedback(analyzedAdvice || `Doctor feedback - ${recordingTime}s`)
    navigate("/progress")
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-10">
      <div className="w-full max-w-lg animate-scale-in">
        <button onClick={() => navigate("/progress")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">{t("lang.back")}</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">{t("doc.title")}</h1>
          <p className="text-muted-foreground">{t("doc.sub")}</p>
        </div>
        <div className="glass-card rounded-2xl p-8 mb-6">
          <div className="flex justify-center mb-6">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? "bg-primary/15 animate-glow-pulse scale-110" : hasRecording ? "bg-success/15" : "bg-secondary"}`}>
              {isRecording ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg animate-pulse"><Mic className="w-6 h-6 text-white" /></div>
                  <span className="text-sm font-mono text-primary font-semibold">{formatTime(recordingTime)}</span>
                </div>
              ) : analyzing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground">{t("doc.processing")}</span>
                </div>
              ) : hasRecording ? (
                <div className="flex flex-col items-center gap-2"><Check className="w-14 h-14 text-success" /><span className="text-sm font-mono text-success font-semibold">{formatTime(recordingTime)}</span></div>
              ) : (<Mic className="w-14 h-14 text-muted-foreground" />)}
            </div>
          </div>
          {(isRecording || hasRecording) && !analyzing && (
            <div className="flex items-center justify-center gap-1 h-12 mb-6">
              {Array.from({ length: 24 }).map((_, i) => (<div key={i} className={`w-1 rounded-full ${isRecording ? "bg-primary" : "bg-success"}`} style={{ animation: isRecording ? `wave-bar 0.8s ease-in-out infinite` : "none", animationDelay: isRecording ? `${i * 40}ms` : "0ms", height: isRecording ? undefined : `${12 + Math.random() * 24}px` }} />))}
            </div>
          )}
          {analyzedAdvice && (
            <div className="bg-secondary/20 rounded-xl p-5 border border-border/80 mb-6">
              <p className="text-[11px] uppercase tracking-wider text-primary font-bold mb-2">{t("doc.aiAnalysis")}</p>
              <p className="text-sm text-foreground leading-relaxed italic">"<Translate>{analyzedAdvice}</Translate>"</p>
            </div>
          )}
          
          {hasRecording && analyzedAdvice && (
            <button onClick={handleHearAdvice} disabled={playingAdvice} className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/15 rounded-xl py-3 transition-colors disabled:opacity-70">
              <Volume2 className={`w-5 h-5 text-primary ${playingAdvice ? "animate-bounce" : ""}`} />
              <span className="text-sm font-semibold text-primary">{playingAdvice ? t("q.playing") : t("doc.playAdviceAudio", "Play Advice Audio")}</span>
            </button>
          )}
        </div>
        <div className="space-y-3">
          {!isRecording && !hasRecording && !analyzing && (<><button onClick={handleStartRecording} className="w-full h-14 gradient-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"><Mic className="w-5 h-5" />{t("doc.startRecording", "Start Recording")}</button><button onClick={() => navigate("/progress")} className="w-full h-12 bg-secondary hover:bg-muted text-foreground rounded-xl font-medium transition-all">{t("res.skip")}</button></>)}
          {isRecording && (<button onClick={stopRecording} className="w-full h-14 bg-warning text-warning-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"><Square className="w-5 h-5 fill-current" />{t("doc.stopRecording", "Stop Recording")}</button>)}
          {hasRecording && (<><button onClick={handleSave} className="w-full h-14 gradient-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"><Check className="w-5 h-5" />{t("doc.saveContinue", "Save & Continue")}</button><button onClick={handleDeleteRecording} className="w-full h-12 bg-secondary hover:bg-muted text-foreground rounded-xl font-medium transition-all flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" />{t("doc.deleteRerecord", "Delete & Re-record")}</button></>)}
        </div>
      </div>
    </div>
  )
}
