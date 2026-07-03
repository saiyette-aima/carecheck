"use client"

import { useNavigate } from "react-router-dom"
import { useApp } from "../app-context"
import {
  Heart,
  Mic,
  Bot,
  FileText,
  Bell,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Calendar,
  History,
  User,
  Home,
} from "lucide-react"

export function LandingScreen() {
  const navigate = useNavigate()
  const { t } = useApp()

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* ── Background Decorative Orbs ── */}
      <div className="orb w-[600px] h-[600px] bg-primary/10 -top-40 -left-40 fixed z-0" />
      <div className="orb w-[500px] h-[500px] bg-accent/10 bottom-20 right-10 fixed z-0" />
      <div className="orb w-[400px] h-[400px] bg-secondary/20 top-1/3 left-1/4 fixed z-0" />

      {/* ── Top Header Navigation ── */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            {/* Custom ribbon-heart logo */}
            <svg viewBox="0 0 100 120" className="w-6 h-6 fill-none stroke-current" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M30 75 C 10 50, 10 20, 30 10 C 45 5, 50 15, 50 15 C 50 15, 55 5, 70 10 C 90 20, 90 50, 70 75 L 50 100 L 30 75 Z" />
              <path d="M30 75 L 15 105" />
              <path d="M70 75 L 85 105" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-[var(--font-heading)]">
            CareCheck
          </span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 bg-secondary border border-border text-foreground font-semibold rounded-xl text-sm hover:bg-primary/5 active:scale-[0.98] transition-all"
        >
          {t("login.signIn")}
        </button>
      </header>

      {/* ── Hero Section ── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 flex-grow">
        {/* Left Info Column */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="space-y-3">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground font-serif tracking-tight leading-none animate-fade-in">
              CareCheck
            </h1>
            <div className="w-16 h-1.5 bg-primary rounded-full" />
          </div>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-lg font-sans font-normal leading-relaxed">
            Accessible breast health support, whenever you need it.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-lg flex items-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Phone Mockup Column */}
        <div className="relative flex justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          {/* Large decorative ribbon in the background */}
          <svg className="absolute -right-8 top-8 w-72 h-auto text-primary/10 pointer-events-none drop-shadow-[0_20px_20px_rgba(219,92,137,0.08)] z-0" viewBox="0 0 120 180" fill="currentColor">
            <path d="M60 10 C35 10 20 28 20 50 C20 75 40 100 60 125 C80 100 100 75 100 50 C100 28 85 10 60 10 Z 
                     M60 30 C72 30 80 40 80 50 C80 60 70 78 60 92 C50 78 40 60 40 50 C40 40 48 30 60 30 Z" fillRule="evenodd" />
            <path d="M40 92 L10 160 C5 170 15 175 22 168 L60 125 Z" />
            <path d="M80 92 L110 160 C115 170 105 175 98 168 L60 125 Z" />
          </svg>

          {/* Phone Frame */}
          <div className="w-[310px] h-[610px] bg-black rounded-[46px] p-2.5 shadow-2xl relative border-[3px] border-muted/30 flex flex-col z-10 hover:rotate-1 hover:scale-[1.01] transition-transform duration-500">
            {/* Speaker/Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30 flex items-center justify-center">
              <div className="w-12 h-1 bg-neutral-800 rounded-full" />
            </div>

            {/* Internal Phone Screen */}
            <div className="w-full h-full bg-[#fff2f5] rounded-[36px] overflow-hidden relative flex flex-col p-4 pt-8 border border-white/20 select-none">
              {/* Top Status Bar Mockup */}
              <div className="flex justify-between items-center px-4 py-1 text-[10px] text-foreground/60 font-semibold absolute top-1.5 left-0 right-0 z-20">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.13 19.58 10.53 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 5H7a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm1 11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v8z"/></svg>
                </div>
              </div>

              {/* App Welcome Text */}
              <div className="mb-4">
                <span className="text-xs text-muted-foreground font-medium block">Hello, there! 👋</span>
                <h3 className="text-base font-bold text-foreground font-[var(--font-heading)] leading-snug">
                  Take charge of your breast health today.
                </h3>
              </div>

              {/* Central Illustration Area inside phone */}
              <div className="flex-1 bg-white border border-primary/5 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden mb-4 shadow-xs">
                <div className="w-28 h-28 rounded-full bg-primary/5 flex items-center justify-center relative">
                  <svg viewBox="0 0 200 200" className="w-20 h-20 text-primary/75 fill-none stroke-current" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {/* Simplified line illustration of a woman */}
                    <path d="M100 40 C90 40, 80 45, 78 60 C76 75, 85 85, 100 85 C115 85, 124 75, 122 60 C120 45, 110 40, 100 40 Z" />
                    <path d="M78 60 C70 60, 65 70, 65 80 C65 95, 75 110, 85 115 C90 117, 110 117, 115 115 C125 110, 135 95, 135 80 C135 70, 130 60, 122 60" />
                    <path d="M92 85 L92 92 C80 96, 65 104, 50 119 L50 160" />
                    <path d="M108 85 L108 92 C120 96, 135 104, 150 119 L150 160" />
                    <path d="M50 119 C60 129, 75 139, 105 139 C120 139, 135 129, 135 119" />
                    {/* Hand on heart */}
                    <path d="M105 139 C100 139, 95 134, 95 126 C95 118, 105 114, 112 118 C116 120, 118 124, 116 128 C114 132, 109 136, 105 139 Z" fill="currentColor" fillOpacity="0.2" />
                  </svg>
                  {/* Small floating hearts */}
                  <Heart className="absolute top-2 right-2 w-4 h-4 text-primary fill-primary animate-pulse" />
                  <Heart className="absolute bottom-4 left-2 w-3.5 h-3.5 text-primary fill-primary/60" />
                </div>
              </div>

              {/* Next Self Exam Card */}
              <div className="bg-white rounded-xl p-3 border border-border flex items-center justify-between shadow-xs mb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold block">Next Self-Exam</span>
                  <span className="text-xs font-bold text-foreground">May 25, 2025</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              {/* Mockup Button */}
              <button className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs shadow-xs hover:opacity-90 active:scale-[0.98] transition-transform">
                Start Self-Exam
              </button>

              {/* Bottom Nav Bar Mockup */}
              <div className="border-t border-border mt-4 pt-2 flex justify-between px-2 text-[8px] font-semibold text-muted-foreground">
                <div className="flex flex-col items-center gap-0.5 text-primary">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <History className="w-4 h-4" />
                  <span>History</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Bell className="w-4 h-4" />
                  <span>Reminders</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="bg-secondary/30 border border-primary/5 rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* About Icon */}
          <div className="lg:col-span-1 flex justify-start lg:justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
              <Heart className="w-7 h-7 fill-primary/10" />
            </div>
          </div>

          {/* About Text Content */}
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary block">
              About
            </span>
            <h2 className="text-3xl font-extrabold text-foreground font-[var(--font-heading)] leading-tight">
              Simple. Accessible. Supportive.
            </h2>
            <p className="text-muted-foreground leading-relaxed font-sans max-w-2xl text-base">
              CareCheck helps you perform guided self-breast examinations, understand medical reports in plain language, and stay consistent with monthly reminders—all in one place.
            </p>
          </div>

          {/* Outline Drawing Graphic */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <div className="relative">
              <svg viewBox="0 0 200 220" className="w-40 h-40 text-primary/50 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M100 190 C60 150 20 100 20 65 C20 40 40 20 65 20 C80 20 93 30 100 40 C107 30 120 20 135 20 C160 20 180 40 180 65 C180 100 140 150 100 190 Z" fill="currentColor" fillOpacity="0.03" strokeDasharray="3 3" />
                <path d="M100 45 C90 45, 80 50, 78 65 C76 80, 85 90, 100 90 C115 90, 124 80, 122 65 C120 50, 110 45, 100 45 Z" />
                <path d="M78 65 C70 65, 65 75, 65 85 C65 100, 75 115, 85 120 C90 122, 110 122, 115 120 C125 115, 135 100, 135 85 C135 75, 130 65, 122 65" />
                <path d="M92 90 L92 98 C80 102, 65 110, 50 125 L50 170" />
                <path d="M108 90 L108 98 C120 102, 135 110, 150 125 L150 170" />
                <path d="M50 125 C60 135, 75 145, 105 145 C120 145, 135 135, 135 125" />
                <path d="M105 145 C100 145, 95 140, 95 132 C95 124, 105 120, 112 124 C116 126, 118 130, 116 134 C114 138, 109 142, 105 145 Z" fill="currentColor" fillOpacity="0.08" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why CareCheck Section ── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground font-[var(--font-heading)]">
            Why CareCheck?
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-20 h-20 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/10 transition-all duration-300">
              <Mic className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">
              Audio-guided self-exams
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Follow simple voice instructions step by step.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-20 h-20 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/10 transition-all duration-300">
              <Bot className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">
              AI-powered health summaries
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get clear, easy to understand summaries of your self-exam.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-20 h-20 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/10 transition-all duration-300">
              <FileText className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">
              Simplified medical reports
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload your reports and receive plain language explanations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-20 h-20 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/10 transition-all duration-300">
              <Bell className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">
              Monthly reminders
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gentle reminders to help you stay consistent.
            </p>
          </div>

          {/* Card 5 */}
          <div className="flex flex-col items-center text-center space-y-4 group">
            <div className="w-20 h-20 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/10 transition-all duration-300">
              <MapPin className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">
              Find nearby clinics
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Locate nearby hospitals and clinics when you need professional care.
            </p>
          </div>
        </div>
      </section>

      {/* ── Disclaimer Section ── */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="bg-secondary/25 border border-border rounded-3xl p-6 md:p-8 flex items-start gap-5 max-w-4xl mx-auto relative overflow-hidden shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1 relative z-10 pr-12">
            <span className="font-extrabold text-foreground text-sm tracking-wide uppercase block">
              Disclaimer
            </span>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
              CareCheck is an educational and awareness tool. It does not diagnose medical conditions or replace professional medical advice.
            </p>
          </div>

          {/* Decorative Branch Leaf SVG */}
          <svg viewBox="0 0 100 100" className="absolute bottom-2 right-4 w-16 h-16 text-primary/15 pointer-events-none fill-current">
            <path d="M10 90 Q 50 50 90 10 Q 70 30 50 35 Q 30 40 10 90" />
            <path d="M30 70 Q 20 60 15 65 Q 20 75 30 70" />
            <path d="M45 55 Q 35 45 30 50 Q 38 62 45 55" />
            <path d="M60 40 Q 50 30 45 35 Q 52 48 60 40" />
            <path d="M75 25 Q 65 15 60 20 Q 68 32 75 25" />
          </svg>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="w-full py-6 border-t border-border/60 text-center text-xs text-muted-foreground relative z-10">
        <p>&copy; {new Date().getFullYear()} CareCheck. All rights reserved.</p>
      </footer>
    </div>
  )
}
