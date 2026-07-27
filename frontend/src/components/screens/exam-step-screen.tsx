"use client"

import { useApp } from "@/components/app-context"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function MSym({ name, className = "", fill = false, style }: { name: string; className?: string; fill?: boolean; style?: React.CSSProperties }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0", ...style }}>
      {name}
    </span>
  )
}

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
  // Shared elegant line-art woman (hair, head, neck, waisted gown) — drawn per pose
  const strokeProps = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 3.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  const illustrations: Record<string, JSX.Element> = {
    /* ── Step 1: Mirror — she stands facing the mirror, breathing gently ── */
    "mirror": (
      <svg viewBox="0 0 200 240" className="w-full h-full" {...strokeProps}>
        {/* Standing mirror */}
        <rect x="48" y="16" width="104" height="196" rx="52" strokeWidth={3} opacity="0.2" />
        <rect x="48" y="16" width="104" height="196" rx="52" fill="currentColor" stroke="none" opacity="0.03" />
        <path d="M100 212 L100 224 M82 224 L118 224" strokeWidth={3} opacity="0.2" />

        {/* Woman — gentle breathing rise */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="4.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.37 0 0.28 1; 0.37 0 0.28 1" keyTimes="0;0.5;1" />
          {/* Hair */}
          <path d="M77 66 C72 34 128 34 123 66 C118 50 110 44 100 44 C90 44 82 50 77 66 Z" fill="currentColor" stroke="none" opacity="0.55" />
          {/* Head */}
          <circle cx="100" cy="60" r="18" fill="currentColor" fillOpacity="0.07" />
          {/* Neck */}
          <path d="M92 76 L92 86 M108 76 L108 86" />
          {/* Gown / torso — soft fill + outline */}
          <path d="M100 86 C88 88 82 96 80 110 C78 124 74 142 69 170 C82 178 118 178 131 170 C126 142 122 124 120 110 C118 96 112 88 100 86 Z" fill="currentColor" stroke="none" fillOpacity="0.06" />
          <path d="M100 86 C88 88 82 96 80 110 C78 124 74 142 69 170 C82 178 118 178 131 170 C126 142 122 124 120 110 C118 96 112 88 100 86 Z">
            <animate attributeName="opacity" values="1;0.85;1" dur="4.5s" repeatCount="indefinite" />
          </path>
          {/* Arms resting at sides */}
          <path d="M83 98 C76 112 74 132 77 154" />
          <path d="M117 98 C124 112 126 132 123 154" />
        </g>
      </svg>
    ),

    /* ── Step 2: Arms Up — arms rise overhead and lower again ── */
    "arms-up": (
      <svg viewBox="0 0 200 240" className="w-full h-full" {...strokeProps}>
        {/* Hair */}
        <path d="M77 66 C72 34 128 34 123 66 C118 50 110 44 100 44 C90 44 82 50 77 66 Z" fill="currentColor" stroke="none" opacity="0.55" />
        {/* Head */}
        <circle cx="100" cy="60" r="18" fill="currentColor" fillOpacity="0.07" />
        {/* Neck */}
        <path d="M92 76 L92 86 M108 76 L108 86" />
        {/* Gown */}
        <path d="M100 86 C88 88 82 96 80 110 C78 124 74 142 69 170 C82 178 118 178 131 170 C126 142 122 124 120 110 C118 96 112 88 100 86 Z" fill="currentColor" stroke="none" fillOpacity="0.06" />

        {/* Left arm raising */}
        <path d="M83 98 C76 112 74 132 77 154">
          <animate attributeName="d" values="M83 98 C76 112 74 132 77 154; M83 98 C74 74 66 50 60 34; M83 98 C76 112 74 132 77 154" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.37 0 0.28 1; 0.37 0 0.28 1" keyTimes="0;0.5;1" />
        </path>
        <circle cx="77" cy="154" r="6" fill="currentColor" stroke="none">
          <animate attributeName="cx" values="77;60;77" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.37 0 0.28 1; 0.37 0 0.28 1" keyTimes="0;0.5;1" />
          <animate attributeName="cy" values="154;34;154" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.37 0 0.28 1; 0.37 0 0.28 1" keyTimes="0;0.5;1" />
        </circle>

        {/* Right arm raising */}
        <path d="M117 98 C124 112 126 132 123 154">
          <animate attributeName="d" values="M117 98 C124 112 126 132 123 154; M117 98 C126 74 134 50 140 34; M117 98 C124 112 126 132 123 154" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.37 0 0.28 1; 0.37 0 0.28 1" keyTimes="0;0.5;1" />
        </path>
        <circle cx="123" cy="154" r="6" fill="currentColor" stroke="none">
          <animate attributeName="cx" values="123;140;123" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.37 0 0.28 1; 0.37 0 0.28 1" keyTimes="0;0.5;1" />
          <animate attributeName="cy" values="154;34;154" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.37 0 0.28 1; 0.37 0 0.28 1" keyTimes="0;0.5;1" />
        </circle>
      </svg>
    ),

    /* ── Step 3: Examine — one hand traces slow circles over the chest ── */
    "examine": (
      <svg viewBox="0 0 200 240" className="w-full h-full" {...strokeProps}>
        {/* Hair */}
        <path d="M77 60 C72 28 128 28 123 60 C118 44 110 38 100 38 C90 38 82 44 77 60 Z" fill="currentColor" stroke="none" opacity="0.55" />
        {/* Head */}
        <circle cx="100" cy="54" r="18" fill="currentColor" fillOpacity="0.07" />
        {/* Neck */}
        <path d="M92 70 L92 80 M108 70 L108 80" />
        {/* Gown */}
        <path d="M100 80 C88 82 82 90 80 104 C78 118 74 140 69 172 C82 180 118 180 131 172 C126 140 122 118 120 104 C118 90 112 82 100 80 Z" fill="currentColor" stroke="none" fillOpacity="0.06" />
        {/* Left arm resting */}
        <path d="M83 92 C76 108 74 130 77 156" />
        {/* Right arm bent across to the chest */}
        <path d="M117 92 C122 104 116 114 104 118" />

        {/* Examining hand tracing a circle over the chest */}
        <g stroke="none" fill="currentColor">
          <circle r="6.5">
            <animateMotion path="M100,104 a11,11 0 1,1 0,0.01" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle r="2.4" opacity="0.5">
            <animateMotion path="M96,101 a11,11 0 1,1 0,0.01" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle r="2.4" opacity="0.5">
            <animateMotion path="M104,101 a11,11 0 1,1 0,0.01" dur="2.6s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Soft scan rings */}
        <circle cx="100" cy="115" r="6" strokeWidth={1.4} opacity="0">
          <animate attributeName="r" values="6;20;32" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.12;0" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="115" r="6" strokeWidth={1.4} opacity="0">
          <animate attributeName="r" values="6;20;32" dur="2.8s" repeatCount="indefinite" begin="1.4s" />
          <animate attributeName="opacity" values="0.26;0.1;0" dur="2.8s" repeatCount="indefinite" begin="1.4s" />
        </circle>
        {/* Dashed circular guide */}
        <circle cx="100" cy="115" r="15" strokeWidth={1.5} strokeDasharray="3 5" opacity="0.28">
          <animateTransform attributeName="transform" type="rotate" from="0 100 115" to="360 100 115" dur="5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),

    /* ── Step 4: Lying — reclined, one arm behind head, the other examines ── */
    "lying": (
      <svg viewBox="0 0 240 150" className="w-full h-full" {...strokeProps}>
        {/* Bed line */}
        <path d="M6 118 L234 118" strokeWidth={3} opacity="0.15" />
        {/* Pillow */}
        <rect x="14" y="60" width="66" height="40" rx="18" fill="currentColor" stroke="none" fillOpacity="0.07" />
        <rect x="14" y="60" width="66" height="40" rx="18" strokeWidth={3} opacity="0.25">
          <animate attributeName="y" values="60;61;60" dur="4.5s" repeatCount="indefinite" />
        </rect>

        {/* Reclined woman — gentle breathing */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -1.5; 0 0" dur="4.5s" repeatCount="indefinite" />
          {/* Hair */}
          <path d="M40 64 C24 60 24 40 44 40 C58 40 60 52 58 60 Z" fill="currentColor" stroke="none" opacity="0.55" />
          {/* Head on pillow */}
          <circle cx="52" cy="62" r="16" fill="currentColor" fillOpacity="0.07" />
          {/* Arm tucked behind the head */}
          <path d="M40 66 C24 60 20 44 34 36" />
          {/* Reclined torso → hip → bent knees */}
          <path d="M66 66 C96 58 138 62 168 74 C176 77 176 90 168 92 C138 98 96 96 70 88" fill="currentColor" stroke="none" fillOpacity="0.06" />
          <path d="M66 66 C96 58 138 62 168 74" />
          <path d="M70 88 C96 96 138 98 168 92" />
          {/* Legs — thigh up, shin down to the bed */}
          <path d="M168 82 C192 80 206 66 208 54 C210 68 208 84 198 98 C192 106 188 112 190 118" />
        </g>

        {/* Examining hand tracing a circle over the chest */}
        <g stroke="none" fill="currentColor">
          <circle r="6">
            <animateMotion path="M110,74 a10,10 0 1,1 0,0.01" dur="2.6s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Scan pulse */}
        <circle cx="110" cy="80" r="5" strokeWidth={1.4} opacity="0">
          <animate attributeName="r" values="5;16;26" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.12;0" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="110" cy="80" r="15" strokeWidth={1.5} strokeDasharray="3 5" opacity="0.25">
          <animateTransform attributeName="transform" type="rotate" from="0 110 80" to="360 110 80" dur="5.5s" repeatCount="indefinite" />
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

  // Static waveform bars with a central peak
  const barCount = 40
  const [waveBars] = useState(() =>
    Array.from({ length: barCount }, (_, i) => {
      const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2)
      const scale = 1 - distFromCenter * 0.7
      return {
        height: Math.round(8 + 32 * scale),
        // uneven start + slightly different tempo per bar → a living, human voice-print
        delay: Number((Math.random() * 2).toFixed(2)),
        duration: Number((1.2 + Math.random() * 0.9).toFixed(2)),
      }
    })
  )

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
    <div className="min-h-screen relative">
      {/* ── Header ── */}
      <header className="w-full px-safe-margin py-8 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-element-gap">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-variant transition-all active:scale-95 group"
          >
            <MSym name="close" className="text-on-surface-variant group-hover:text-primary" />
          </button>
          <div>
            <p className="font-label-sm text-[11px] text-primary/80 uppercase tracking-[0.2em] font-medium mb-0.5">{t("exam.title")}</p>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-normal">
              {t("exam.step")} {examStep} {t("exam.of")} {examSteps.length}
            </h1>
          </div>
        </div>
        <div className="hidden md:flex gap-3">
          {examSteps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === examStep - 1 ? "w-12 bg-primary/50" : i < examStep - 1 ? "w-6 bg-primary/30" : "w-3 bg-surface-container-highest/60"
              }`}
            />
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-safe-margin pt-element-gap pb-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Illustration */}
        <div className="lg:col-span-5 relative flex justify-center animate-scale-in">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary/5 animate-breathe opacity-40" />
          </div>
          <div className="relative z-10 w-full max-w-md aspect-square bg-surface-container-low organic-shape layered-shadow flex items-center justify-center p-12 overflow-hidden">
            <div className="w-3/4 h-3/4">
              <StepIllustration type={currentStep.illustration} />
            </div>
          </div>
          {/* Floating support badge */}
          <div className="absolute -bottom-4 right-0 md:-right-2 z-20 bg-surface/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-outline-variant/20 flex items-center gap-3 animate-float">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <MSym name="favorite" fill className="text-primary text-lg" />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant normal-case tracking-normal">We're here to support you.</p>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-7 flex flex-col gap-element-gap lg:pl-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass-card p-8 md:p-12 rounded-[3rem] relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
              <button
                onClick={togglePlay}
                className="w-16 h-16 flex-shrink-0 bg-primary/90 rounded-2xl flex items-center justify-center text-on-primary shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
              >
                <MSym name={isPlaying ? "pause" : "play_arrow"} fill className="text-3xl" />
              </button>
              <div>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-3xl text-on-surface mb-4 leading-tight">
                  {t(`exam.step${currentStep.id}Title`)}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant opacity-90">
                  {t(`exam.step${currentStep.id}Desc`)}
                </p>
              </div>
            </div>

            {/* Waveform */}
            <div className="flex items-end justify-center py-6 waveform-glow">
              <div className="pulse-wave">
                {waveBars.map((bar, i) => (
                  <div
                    key={i}
                    className="wave-bar"
                    style={{
                      height: `${bar.height}px`,
                      animationDelay: `${bar.delay}s`,
                      animationDuration: `${bar.duration}s`,
                      animationPlayState: isPlaying ? "running" : "paused",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 text-on-secondary-fixed-variant/60">
              <MSym name="lock" className="text-sm" />
              <p className="font-label-sm text-[11px] uppercase tracking-wider">Privacy: This session is entirely local and private.</p>
            </div>
          </div>

          {/* Navigation actions */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <button
              onClick={handleRepeat}
              className="w-full sm:w-auto px-10 py-5 rounded-full font-title-md text-title-md border-2 border-outline-variant/40 text-on-surface-variant flex items-center justify-center gap-3 hover:bg-surface-container-high hover:border-outline-variant transition-all active:scale-95 group"
            >
              <MSym name="replay" className="group-hover:-rotate-45 transition-transform" />
              {t("exam.repeat")}
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:flex-1 px-10 py-5 rounded-full font-title-md text-title-md bg-primary text-on-primary flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:bg-primary-container transition-all active:scale-95"
            >
              {isLastStep ? t("exam.done") : t("exam.next")}
              <MSym name="arrow_forward" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
