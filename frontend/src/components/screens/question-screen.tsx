"use client"

import { useApp } from "../app-context"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "@/config"
import { Volume2, Check, ThumbsDown, ThumbsUp, Mic, Square, RotateCcw, Loader2, Pause } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Translate } from "@/components/translate"

interface QuestionScreenProps {
  questionNumber: 1 | 2 | 3
  title: string
  subtitle: string
}

export function QuestionScreen({ questionNumber, title, subtitle }: QuestionScreenProps) {
  const { currentResponses, setCurrentResponses, userId, refreshHistory, language, t } = useApp()
  const navigate = useNavigate()
  const responseKeys = ["lump", "painOrDischarge", "different"] as const
  const currentKey = responseKeys[questionNumber - 1]

  // Recording & UI states
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcriptText, setTranscriptText] = useState("")
  const [transcribing, setTranscribing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [playingQuestion, setPlayingQuestion] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const questionAudioRef = useRef<HTMLAudioElement | null>(null)

  // Question audio playback
  const playQuestionAudio = () => {
    if (playingQuestion) return
    
    // Stop any current audio
    if (questionAudioRef.current) {
      questionAudioRef.current.pause()
      questionAudioRef.current.src = ""
    }

    setPlayingQuestion(true)
    const audioPath = `/audio/${language}/${questionNumber + 4}.mp3`
    const audio = new Audio(audioPath)
    questionAudioRef.current = audio
    
    audio.onended = () => setPlayingQuestion(false)
    audio.onerror = () => {
      console.warn("Failed to load question audio:", audioPath)
      setPlayingQuestion(false)
    }

    audio.play().catch(err => {
      console.warn("Failed to play question audio:", err)
      setPlayingQuestion(false)
    })
  }

  const stopQuestionAudio = () => {
    if (questionAudioRef.current) {
      questionAudioRef.current.pause()
    }
    setPlayingQuestion(false)
  }

  const togglePlayQuestionAudio = () => {
    if (playingQuestion) {
      stopQuestionAudio()
    } else {
      playQuestionAudio()
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      playQuestionAudio()
    }, 200)
    
    return () => {
      clearTimeout(timer)
      if (questionAudioRef.current) {
        questionAudioRef.current.pause()
        questionAudioRef.current.src = ""
      }
    }
  }, [questionNumber, language])

  // Audio recording handlers
  const startRecording = async () => {
    // Pause any playing question dictation first
    stopQuestionAudio()
    try {
      setTranscriptText("")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await uploadAudio(audioBlob)
      }

      recorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (err) {
      console.error("Mic access denied or error:", err)
      alert(t("doc.micRequired"))
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
    setTranscribing(true)
    const formData = new FormData()
    formData.append("voice", blob, `question-${questionNumber}.wav`)

    try {
      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: "POST",
        headers: {
          "userId": userId || "guest-user",
          "type": currentKey === "painOrDischarge" ? "Pain" : currentKey,
          "language": language
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setTranscriptText(data.transcript)
        // Auto-fill response logic: if they speak and it's not clear or they state concern
        // We'll let them review. We'll set concern to true if they spoke, and AI will judge it in the end!
        setCurrentResponses({
          ...currentResponses,
          [currentKey]: true // Mark as answered/has content
        })
      } else {
        let reason = ""
        try { reason = (await response.json())?.reason } catch { /* ignore */ }
        if (reason === "no_speech") {
          alert(t("q.noSpeech", "We couldn't hear anything. Please record again and speak clearly, or use the Yes/No buttons."))
        } else {
          alert(t("q.transcribeFailed", "Transcription failed. Please try again or type/use buttons."))
        }
      }
    } catch (e) {
      console.error(e)
      alert(t("q.noConnect", "Failed to connect to transcription server."))
    } finally {
      setTranscribing(false)
    }
  }

  // Button Yes/No overrides
  const handleButtonResponse = async (val: boolean) => {
    setTranscribing(true)
    const textVal = val ? "Yes" : "No"
    try {
      await fetch(`${API_BASE_URL}/transcribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "userId": userId || "guest-user",
          "type": currentKey === "painOrDischarge" ? "Pain" : currentKey
        },
        body: JSON.stringify({ text: textVal })
      })

      const newResponses = {
        ...currentResponses,
        [currentKey]: val
      }
      setCurrentResponses(newResponses)

      await proceedToNext(newResponses)
    } catch (e) {
      console.error(e)
      alert(t("q.failedSubmit", "Failed to submit response."))
    } finally {
      setTranscribing(false)
    }
  }

  const handleContinueVoice = async () => {
    if (!transcriptText) return
    const newResponses = {
      ...currentResponses,
      [currentKey]: true // Affirmative/voice transcript is present
    }
    setCurrentResponses(newResponses)
    await proceedToNext(newResponses)
  }

  // Navigation & Streaming Report Analysis
  const proceedToNext = async (updatedResponses: any) => {
    if (questionNumber < 3) {
      navigate(`/question-${questionNumber + 1}`)
    } else {
      // Q3 finished - call report generation
      setAnalyzing(true)
      try {
        const response = await fetch(`${API_BASE_URL}/report`, {
          headers: {
            "userId": userId || "guest-user"
          }
        })

        if (!response.ok) throw new Error("Report failed")
        
        // Read stream
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let done = false
        let reportText = ""

        if (reader) {
          while (!done) {
            const { value, done: readerDone } = await reader.read()
            done = readerDone
            if (value) {
              reportText += decoder.decode(value, { stream: !done })
            }
          }
        }

        console.log("Full Report Response:", reportText)
        let summary = "Your self checkup is completed."
        let adviseDoctor = false

        try {
          const parsed = JSON.parse(reportText)
          summary = parsed.summary || summary
          adviseDoctor = parsed.isdoctorcheckadvised === "true" || 
                         /yes|true|advise|recommend/i.test(parsed.isdoctorcheckadvised)
        } catch (e) {
          // Fallback if not JSON
          summary = reportText
          adviseDoctor = /doctor|physician|checkup|seek/i.test(reportText)
        }

        localStorage.setItem("latestSummary", summary)
        await refreshHistory()

        if (adviseDoctor) {
          navigate("/result-concern")
        } else {
          navigate("/result-ok")
        }
      } catch (err) {
        console.error(err)
        alert(t("q.failedAnalyze", "Failed to analyze responses. Proceeding to default result."))
        navigate("/result-ok")
      } finally {
        setAnalyzing(false)
      }
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`
  const emojis = ["👋", "✨", "🔄"]

  if (analyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="text-center space-y-6 max-w-md animate-scale-in">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-glow-pulse">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("q.analyzing")}</h1>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {t("q.analyzingDesc")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-10">
      <div className="w-full max-w-xl animate-scale-in">
        {/* Step dots */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  n < questionNumber
                    ? "gradient-primary text-white shadow-md"
                    : n === questionNumber
                    ? "gradient-primary text-white shadow-lg shadow-primary/30 scale-110"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {n < questionNumber ? <Check className="w-5 h-5" /> : n}
              </div>
              {n < 3 && (
                <div
                  className={`w-12 h-0.5 rounded-full transition-colors duration-300 ${
                    n < questionNumber ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Question card */}
        <div className="glass-card rounded-2xl p-8 lg:p-10 text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            {t("q.question")} {questionNumber} {t("exam.of")} 3
          </div>

          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">{emojis[questionNumber - 1]}</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-3">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            {subtitle}
          </p>

          {/* Audio listen */}
          <button
            onClick={togglePlayQuestionAudio}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-muted text-foreground text-sm font-medium transition-all mb-8"
          >
            {playingQuestion ? (
              <Pause className="w-4 h-4 text-primary animate-pulse" />
            ) : (
              <Volume2 className="w-4 h-4 text-primary" />
            )}
            {playingQuestion ? t("q.playing") : t("q.tapListen")}
          </button>

          {/* Transcription details */}
          {transcribing ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">{t("q.processing")}</p>
            </div>
          ) : isRecording ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-20 h-20 rounded-full bg-warning/15 flex items-center justify-center animate-glow-pulse scale-105">
                <button
                  onClick={stopRecording}
                  className="w-14 h-14 rounded-full bg-warning flex items-center justify-center shadow-lg"
                >
                  <Square className="w-5 h-5 text-warning-foreground fill-current" />
                </button>
              </div>
              <span className="text-sm font-mono text-warning font-semibold">{formatTime(recordingTime)}</span>
              <p className="text-xs text-muted-foreground">{t("q.tapStop")}</p>
            </div>
          ) : transcriptText ? (
            <div className="bg-secondary/35 rounded-xl p-4 mb-8 text-left border border-border/60">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{t("q.speechAnswer")}</p>
              <p className="text-sm text-foreground leading-relaxed italic">"{transcriptText}"</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={startRecording}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> {t("q.speakAgain")}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 mb-8">
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-primary/10 hover:bg-primary/15 flex items-center justify-center transition-all duration-300 scale-100 hover:scale-105 group border border-primary/20"
              >
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-md">
                  <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
              </button>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                {t("q.micHint")}
              </p>
            </div>
          )}

          {/* Actions / Yes-No Fallback */}
          {!isRecording && !transcribing && (
            <div className="border-t border-border/40 pt-6">
              {transcriptText ? (
                <button
                  onClick={handleContinueVoice}
                  className="w-full h-14 gradient-primary text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.01] transition-all duration-200"
                >
                  {t("q.continue")}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleButtonResponse(false)}
                    className="py-4 bg-secondary hover:bg-success/15 hover:border-success/30 text-foreground border border-transparent rounded-xl font-semibold text-base flex flex-col items-center justify-center gap-1.5 transition-all"
                  >
                    <ThumbsDown className="w-5 h-5 text-muted-foreground" />
                    {t("q.no")}
                  </button>
                  <button
                    onClick={() => handleButtonResponse(true)}
                    className="py-4 bg-secondary hover:bg-warning/15 hover:border-warning/30 text-foreground border border-transparent rounded-xl font-semibold text-base flex flex-col items-center justify-center gap-1.5 transition-all"
                  >
                    <ThumbsUp className="w-5 h-5 text-muted-foreground" />
                    {t("q.yes")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
