"use client"

import { useApp } from "@/components/app-context"
import { useNavigate } from "react-router-dom"
import { Volume2, RotateCcw, ChevronRight, X, Pause } from "lucide-react"
import { useState, useEffect } from "react"

const examSteps = [
  {
    id: 1,
    title: "Stand in front of mirror",
    description: "Stand with your arms at your sides. Look at your breasts in the mirror for any visible changes in shape, size, or skin texture.",
    illustration: "mirror",
  },
  {
    id: 2,
    title: "Raise your arms",
    description: "Raise both arms overhead. Look for any changes in contour, swelling, or dimpling of the skin.",
    illustration: "arms-up",
  },
  {
    id: 3,
    title: "Check with fingers",
    description: "Use the pads of your three middle fingers. Move in small, circular motions covering the entire breast area.",
    illustration: "examine",
  },
  {
    id: 4,
    title: "Lie down",
    description: "Place a pillow under your right shoulder. Use your left hand to examine your right breast with the same circular motions.",
    illustration: "lying",
  },
]

function StepIllustration({ type }: { type: string }) {
  const illustrations: Record<string, JSX.Element> = {
    /* ── Step 1: Mirror — gentle breathing sway with reflection shimmer ── */
    "mirror": (
      <svg viewBox="0 0 120 140" className="w-full h-full">
        {/* Mirror frame */}
        <rect x="20" y="10" width="80" height="100" rx="10" fill="currentColor" opacity="0.1" />
        <rect x="25" y="15" width="70" height="90" rx="8" fill="currentColor" opacity="0.05" />
        {/* Mirror shimmer */}
        <rect x="25" y="15" width="70" height="90" rx="8" fill="currentColor" opacity="0">
          <animate attributeName="opacity" values="0;0.08;0" dur="3s" repeatCount="indefinite" />
        </rect>
        {/* Stand */}
        <rect x="55" y="110" width="10" height="20" fill="currentColor" opacity="0.2" />
        <ellipse cx="60" cy="132" rx="25" ry="5" fill="currentColor" opacity="0.15" />

        {/* Person group — breathing animation */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="3s" repeatCount="indefinite" />
          {/* Head */}
          <circle cx="60" cy="50" r="12" fill="currentColor" opacity="0.7" />
          {/* Body — subtle breathing scale */}
          <ellipse cx="60" cy="85" rx="18" ry="22" fill="currentColor" opacity="0.45">
            <animate attributeName="rx" values="18;19;18" dur="3s" repeatCount="indefinite" />
            <animate attributeName="ry" values="22;22.5;22" dur="3s" repeatCount="indefinite" />
          </ellipse>
          {/* Left arm — gentle sway */}
          <line x1="42" y1="70" x2="38" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.45">
            <animate attributeName="x2" values="38;36;38" dur="3s" repeatCount="indefinite" />
          </line>
          {/* Right arm — gentle sway */}
          <line x1="78" y1="70" x2="82" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.45">
            <animate attributeName="x2" values="82;84;82" dur="3s" repeatCount="indefinite" />
          </line>
        </g>
        {/* Scanning eye-line indicators */}
        <line x1="35" y1="78" x2="28" y2="78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
        </line>
        <line x1="85" y1="78" x2="92" y2="78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
        </line>
      </svg>
    ),

    /* ── Step 2: Arms Up — arms rising and lowering continuously ── */
    "arms-up": (
      <svg viewBox="0 0 120 140" className="w-full h-full">
        {/* Head */}
        <circle cx="60" cy="45" r="15" fill="currentColor" opacity="0.7" />
        {/* Body */}
        <ellipse cx="60" cy="92" rx="20" ry="28" fill="currentColor" opacity="0.45" />

        {/* Left arm — animating from down to up */}
        <line x1="40" y1="72" x2="36" y2="95" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.5">
          <animate attributeName="x2" values="36;25;36" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y2" values="95;35;95" dur="3s" repeatCount="indefinite" />
        </line>
        {/* Left hand */}
        <circle cx="36" cy="95" r="5" fill="currentColor" opacity="0.35">
          <animate attributeName="cx" values="36;22;36" dur="3s" repeatCount="indefinite" />
          <animate attributeName="cy" values="95;32;95" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Right arm — animating from down to up */}
        <line x1="80" y1="72" x2="84" y2="95" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.5">
          <animate attributeName="x2" values="84;95;84" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y2" values="95;35;95" dur="3s" repeatCount="indefinite" />
        </line>
        {/* Right hand */}
        <circle cx="84" cy="95" r="5" fill="currentColor" opacity="0.35">
          <animate attributeName="cx" values="84;98;84" dur="3s" repeatCount="indefinite" />
          <animate attributeName="cy" values="95;32;95" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Look-for-change indicator arrows — appear when arms are up */}
        <g opacity="0">
          <animate attributeName="opacity" values="0;0;0.5;0.5;0;0" dur="3s" repeatCount="indefinite" />
          <path d="M30 70 L38 74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M30 70 L32 77" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M90 70 L82 74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M90 70 L88 77" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    ),

    /* ── Step 3: Examine — hand orbiting in circular motions with scan rings ── */
    "examine": (
      <svg viewBox="0 0 120 140" className="w-full h-full">
        {/* Head */}
        <circle cx="60" cy="32" r="14" fill="currentColor" opacity="0.7" />
        {/* Body */}
        <ellipse cx="60" cy="82" rx="25" ry="35" fill="currentColor" opacity="0.4" />
        {/* Left arm resting */}
        <line x1="85" y1="60" x2="95" y2="85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.35" />

        {/* Examining hand — orbiting in a circle */}
        <g>
          <circle cx="0" cy="0" r="6" fill="currentColor" opacity="0.6">
            <animateMotion path="M50,72 a10,10 0 1,1 0,0.01" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Finger dots */}
          <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.4">
            <animateMotion path="M47,70 a10,10 0 1,1 0,0.01" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.4">
            <animateMotion path="M53,70 a10,10 0 1,1 0,0.01" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Scan ring 1 — expanding outward */}
        <circle cx="50" cy="75" r="5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
          <animate attributeName="r" values="5;18;28" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0.15;0" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* Scan ring 2 — staggered */}
        <circle cx="50" cy="75" r="5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
          <animate attributeName="r" values="5;18;28" dur="2.5s" repeatCount="indefinite" begin="1.2s" />
          <animate attributeName="opacity" values="0.3;0.12;0" dur="2.5s" repeatCount="indefinite" begin="1.2s" />
        </circle>

        {/* Circular motion guide — dashed rotating circle */}
        <circle cx="50" cy="75" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.25">
          <animateTransform attributeName="transform" type="rotate" from="0 50 75" to="360 50 75" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),

    /* ── Step 4: Lying — hand doing circular exam with pulsing highlight ── */
    "lying": (
      <svg viewBox="0 0 140 100" className="w-full h-full">
        {/* Bed surface */}
        <line x1="5" y1="78" x2="135" y2="78" stroke="currentColor" strokeWidth="2" opacity="0.15" />
        {/* Pillow */}
        <ellipse cx="28" cy="55" rx="22" ry="10" fill="currentColor" opacity="0.12">
          <animate attributeName="ry" values="10;11;10" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* Head on pillow */}
        <circle cx="32" cy="48" r="12" fill="currentColor" opacity="0.7" />

        {/* Body lying */}
        <ellipse cx="80" cy="56" rx="40" ry="14" fill="currentColor" opacity="0.4">
          <animate attributeName="ry" values="14;14.5;14" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* Arm behind head */}
        <path d="M22 58 Q10 48 26 38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.45">
          <animate attributeName="d" values="M22 58 Q10 48 26 38;M22 58 Q8 46 26 36;M22 58 Q10 48 26 38" dur="4s" repeatCount="indefinite" />
        </path>

        {/* Examining hand — orbiting */}
        <circle cx="0" cy="0" r="5" fill="currentColor" opacity="0.55">
          <animateMotion path="M75,48 a8,8 0 1,1 0,0.01" dur="2.2s" repeatCount="indefinite" />
        </circle>

        {/* Scan pulse on breast area */}
        <circle cx="75" cy="50" r="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
          <animate attributeName="r" values="4;14;22" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0.15;0" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="50" r="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
          <animate attributeName="r" values="4;14;22" dur="2.2s" repeatCount="indefinite" begin="1.1s" />
          <animate attributeName="opacity" values="0.3;0.1;0" dur="2.2s" repeatCount="indefinite" begin="1.1s" />
        </circle>

        {/* Dashed circular guide */}
        <circle cx="75" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.2">
          <animateTransform attributeName="transform" type="rotate" from="0 75 50" to="360 75 50" dur="5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
  }

  return (
    <div className="text-primary">
      {illustrations[type] || illustrations["mirror"]}
    </div>
  )
}

export function ExamStepScreen() {
  const { examStep, setExamStep, language, t } = useApp()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  const currentStep = examSteps[examStep - 1]
  const isLastStep = examStep === examSteps.length

  useEffect(() => {
    // Stop previous audio
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.src = ""
    }

    const audioPath = `/audio/${language}/${examStep}.mp3`
    const audio = new Audio(audioPath)
    setCurrentAudio(audio)
    setIsPlaying(true)

    const handleEnded = () => setIsPlaying(false)
    const handleError = () => {
      console.warn(`Failed to load audio from: ${audioPath}`)
      setIsPlaying(false)
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    audio.play().catch((err) => {
      console.warn("Audio play failed:", err)
      setIsPlaying(false)
    })

    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.pause()
      audio.src = ""
    }
  }, [examStep, language])

  const handleNext = () => {
    if (isLastStep) {
      navigate("/question-1")
    } else {
      setExamStep(examStep + 1)
    }
  }

  const togglePlay = () => {
    if (!currentAudio) return
    if (isPlaying) {
      currentAudio.pause()
      setIsPlaying(false)
    } else {
      currentAudio.play().catch((err) => {
        console.warn("Play failed:", err)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  const handleRepeat = () => {
    if (!currentAudio) return
    currentAudio.currentTime = 0
    currentAudio.play().catch((err) => {
      console.warn("Play failed:", err)
      setIsPlaying(false)
    })
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-secondary hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wider">{t("exam.title")}</p>
            <h1 className="text-xl font-bold text-foreground">
              {t("exam.step")} {examStep} {t("exam.of")} {examSteps.length}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Step progress bar ── */}
      <div className="flex gap-2 mb-10 animate-fade-in-up">
        {examSteps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
              i < examStep
                ? "gradient-primary"
                : i === examStep - 1
                ? "gradient-primary"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* ── Two-column content ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Illustration */}
        <div className="flex-1 flex items-center justify-center animate-scale-in">
          <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-primary/5 flex items-center justify-center animate-glow-pulse">
            <div className="w-48 h-48 lg:w-60 lg:h-60 rounded-full bg-primary/8 flex items-center justify-center">
              <div className="w-36 h-36 lg:w-44 lg:h-44">
                <StepIllustration type={currentStep.illustration} />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="flex-1 space-y-6 w-full max-w-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Audio player card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <button
                onClick={togglePlay}
                className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isPlaying ? "gradient-primary shadow-lg shadow-primary/25" : "bg-secondary hover:bg-muted"
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 text-foreground" />
                )}
              </button>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {t(`exam.step${currentStep.id}Title`)}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`exam.step${currentStep.id}Desc`)}
                </p>
              </div>
            </div>

            {/* Audio waveform */}
            {isPlaying && (
              <div className="flex items-center justify-center gap-1 h-10 animate-fade-in">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    style={{
                      animation: `wave-bar 0.8s ease-in-out infinite`,
                      animationDelay: `${i * 0.04}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleRepeat}
              className="flex-1 h-14 bg-secondary hover:bg-muted text-foreground rounded-xl flex items-center justify-center gap-2 text-base font-semibold transition-all duration-200 hover:shadow-md"
            >
              <RotateCcw className="w-5 h-5" />
              {t("exam.repeat")}
            </button>

            <button
              onClick={handleNext}
              className="flex-[2] h-14 gradient-primary text-white rounded-xl flex items-center justify-center gap-2 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {isLastStep ? t("exam.done") : t("exam.next")}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
