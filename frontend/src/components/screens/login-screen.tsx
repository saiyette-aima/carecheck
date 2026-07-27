"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, User, Heart, Shield, Sparkles, Clock } from "lucide-react"
import { useApp } from "../app-context"
import { API_BASE_URL } from "@/config"

export function LoginScreen() {
  const navigate = useNavigate()
  const { setUserId, t, language } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Forgot-password flow
  const [showForgot, setShowForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetStatus, setResetStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [resetMsg, setResetMsg] = useState("")

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetStatus("sending")
    setResetMsg("")
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail || email }),
      })
      const data = await response.json()
      if (response.ok) {
        setResetStatus("sent")
        setResetMsg(data.message || "If an account exists, a reset link has been sent.")
      } else {
        setResetStatus("error")
        setResetMsg(data.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Forgot password failed:", error)
      setResetStatus("error")
      setResetMsg("Cannot connect to the server. Please try again later.")
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault() 
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, language })
      })
      const data = await response.json()
      if (response.ok) {
        setUserId(data.id)
        navigate("/language")
      } else {
        alert(data.message || "Failed to sign in")
      }
    } catch (error) {
      console.error("Sign in failed:", error)
      alert("Cannot connect to server. Running offline fallback.")
      setUserId("mock-offline-user")
      navigate("/language")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden">
      {/* ── Decorative orbs ── */}
      <div className="orb w-[500px] h-[500px] bg-primary/30 -top-40 -left-40 fixed" />
      <div className="orb w-[400px] h-[400px] bg-accent/20 bottom-20 right-10 fixed" />
      <div className="orb w-[300px] h-[300px] bg-success/15 top-1/2 left-1/3 fixed" />

      {/* ── Left Panel — Branding & Illustration ── */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 lg:p-16 gradient-hero">
        {/* Animated illustration */}
        <div className="relative animate-fade-in-up mb-8">
          <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-full bg-primary/10 flex items-center justify-center animate-glow-pulse">
            <div className="w-44 h-44 lg:w-56 lg:h-56 rounded-full bg-primary/15 flex items-center justify-center">
              <div className="relative">
                <svg viewBox="0 0 100 120" className="w-32 h-32 lg:w-40 lg:h-40 text-primary">
                  <circle cx="50" cy="25" r="18" fill="currentColor" opacity="0.8" />
                  <path d="M32 25 Q32 10 50 8 Q68 10 68 25 Q70 15 60 12 Q50 5 40 12 Q30 15 32 25" fill="currentColor" />
                  <ellipse cx="50" cy="70" rx="25" ry="30" fill="currentColor" opacity="0.6" />
                  <path d="M25 60 Q15 70 20 85" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" />
                  <path d="M75 60 Q85 70 80 85" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" />
                </svg>
                <Heart className="absolute -top-2 -right-2 w-10 h-10 text-accent fill-accent animate-pulse" />
              </div>
            </div>
          </div>

          {/* Floating decorative dots */}
          <div className="absolute top-6 -left-6 w-5 h-5 rounded-full bg-accent animate-float" style={{ animationDelay: "0.2s" }} />
          <div className="absolute bottom-12 -right-8 w-4 h-4 rounded-full bg-primary/50 animate-float" style={{ animationDelay: "0.8s" }} />
          <div className="absolute top-16 -right-10 w-3 h-3 rounded-full bg-success/60 animate-float" style={{ animationDelay: "1.4s" }} />
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-2">
            {t("login.title")}
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg max-w-md">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Feature pills — hidden on mobile, shown on large */}
        <div className="hidden lg:flex gap-3 mt-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {[
            { icon: Shield, key: "login.secure" },
            { icon: Clock, key: "login.fiveMin" },
            { icon: Sparkles, key: "login.aiGuided" },
          ].map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-foreground"
            >
              <f.icon className="w-4 h-4 text-primary" />
              {t(f.key)}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Auth Buttons ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-md space-y-6 animate-scale-in">
          {/* Welcome text */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {t("login.welcome")}
            </h2>
            <p className="text-muted-foreground">
              {t("login.welcomeSub")}
            </p>
          </div>

          {/* Glass auth card */}
          <div className="glass-card rounded-2xl p-8">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("login.email")}
                    className="w-full h-12 pl-10 pr-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.password")}
                    className="w-full h-12 pl-10 pr-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 gradient-primary text-white rounded-xl flex items-center justify-center gap-3 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("login.signingIn") : t("login.signIn")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgot((v) => !v)
                  setResetEmail(email)
                  setResetStatus("idle")
                  setResetMsg("")
                }}
                className="w-full text-center text-sm text-primary font-medium hover:underline mt-1"
              >
                Forgot password?
              </button>
            </form>

            {/* Forgot-password panel */}
            {showForgot && (
              <div className="mt-5 pt-5 border-t border-border animate-fade-in-up">
                {resetStatus === "sent" ? (
                  <div className="text-center space-y-2 py-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-foreground font-medium">Check your inbox</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{resetMsg}</p>
                  </div>
                ) : (
                  <form onSubmit={handleForgot} className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Enter your email and we'll send you a link to reset your password.
                    </p>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder={t("login.email")}
                        className="w-full h-12 pl-10 pr-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        required
                      />
                    </div>
                    {resetStatus === "error" && (
                      <p className="text-xs text-destructive">{resetMsg}</p>
                    )}
                    <button
                      type="submit"
                      disabled={resetStatus === "sending"}
                      className="w-full h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center gap-2 text-sm font-semibold hover:bg-primary/15 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {resetStatus === "sending" ? "Sending…" : "Send reset link"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground">{t("login.or")}</span>
              <div className="flex-grow border-t border-border"></div>
            </div> */}

            {/* <button
              onClick={() => navigate("/language")}
              type="button"
              className="w-full h-14 bg-card border border-border text-foreground rounded-xl flex items-center justify-center gap-3 text-base font-medium hover:bg-secondary hover:border-primary/20 hover:shadow-md active:scale-[0.98] transition-all duration-200"
            >
              <User className="w-5 h-5 text-muted-foreground" />
              {t("login.guest")}
            </button> */}
          </div>

          {/* Privacy note */}
          {/* <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {t("login.privacy")}
          </p> */}
        </div>
      </div>
    </div>
  )
}
