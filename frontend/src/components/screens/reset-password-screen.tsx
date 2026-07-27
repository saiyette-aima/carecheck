"use client"

import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Lock, Heart, CheckCircle2, AlertCircle } from "lucide-react"
import { API_BASE_URL } from "@/config"

export function ResetPasswordScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setStatus("error")
      setMessage("Password must be at least 6 characters long.")
      return
    }
    if (password !== confirm) {
      setStatus("error")
      setMessage("Passwords do not match.")
      return
    }
    setStatus("saving")
    setMessage("")
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await response.json()
      if (response.ok) {
        setStatus("done")
        setMessage(data.message || "Password updated successfully.")
      } else {
        setStatus("error")
        setMessage(data.message || "Could not reset your password.")
      }
    } catch (error) {
      console.error("Reset password failed:", error)
      setStatus("error")
      setMessage("Cannot connect to the server. Please try again later.")
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden gradient-hero">
      <div className="orb w-[500px] h-[500px] bg-primary/25 -top-40 -left-40 fixed" />
      <div className="orb w-[400px] h-[400px] bg-accent/20 bottom-10 right-10 fixed" />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white fill-white/60" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">CareCheck</span>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {!token ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Invalid reset link</h1>
              <p className="text-sm text-muted-foreground">
                This link is missing its reset token. Please request a new password reset from the sign-in page.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-2 px-6 py-3 gradient-primary text-white rounded-xl font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Back to sign in
              </button>
            </div>
          ) : status === "done" ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Password updated</h1>
              <p className="text-sm text-muted-foreground">{message}</p>
              <button
                onClick={() => navigate("/login")}
                className="mt-2 px-6 py-3 gradient-primary text-white rounded-xl font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Go to sign in
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-1">Choose a new password</h1>
                <p className="text-sm text-muted-foreground">Enter and confirm your new password below.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full h-12 pl-10 pr-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-12 pl-10 pr-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    required
                  />
                </div>
                {status === "error" && <p className="text-xs text-destructive">{message}</p>}
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="w-full h-14 gradient-primary text-white rounded-xl flex items-center justify-center gap-3 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "saving" ? "Updating…" : "Update password"}
                </button>
              </form>
              <button
                onClick={() => navigate("/login")}
                className="w-full text-center text-sm text-muted-foreground hover:text-primary mt-4 transition-colors"
              >
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
