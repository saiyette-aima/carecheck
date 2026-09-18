"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../app-context"

/** Material Symbols icon */
function MSym({ name, className = "", fill = false, style }: { name: string; className?: string; fill?: boolean; style?: React.CSSProperties }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0", ...style }}
    >
      {name}
    </span>
  )
}

// Personal cancer-awareness website — link goes live once the site is active.
// TODO: replace with the real URL when it's ready.
const CANCER_AWARENESS_URL = "#"

const features = [
  { icon: "mic", title: "Audio-guided self-exams", body: "Follow simple voice instructions step by step. Our soothing audio guides ensure you never miss a spot while keeping you calm.", radius: "organic-radius-1", iconBg: "bg-primary-fixed/40", iconColor: "text-primary" },
  { icon: "smart_toy", title: "AI-powered summaries", tag: "Latest Innovation", body: "Get clear, easy to understand summaries of your self-exam results. No medical jargon, just plain language insights.", radius: "organic-radius-2", iconBg: "bg-primary-fixed/40", iconColor: "text-primary" },
  { icon: "description", title: "Simplified medical reports", body: "Upload your reports and receive plain language explanations. We bridge the gap between technical data and personal understanding.", radius: "organic-radius-3", iconBg: "bg-secondary-fixed/60", iconColor: "text-primary" },
  { icon: "notifications_active", title: "Monthly reminders", body: "Gentle reminders to help you stay consistent. Choose your preferred frequency and tone for a supportive nudge.", radius: "organic-radius-2", offset: "lg:col-start-1 lg:translate-x-1/2 lg:mt-6", iconBg: "bg-primary-fixed/40", iconColor: "text-primary" },
  { icon: "location_on", title: "Find nearby clinics", body: "Locate nearby hospitals and clinics when you need professional care. Integrated map services with verified wellness centers.", radius: "organic-radius-1", offset: "lg:col-start-2 lg:translate-x-1/2 lg:mt-6", iconBg: "bg-secondary-fixed/60", iconColor: "text-primary" },
]

export function LandingScreen() {
  const navigate = useNavigate()
  const { t } = useApp()

  // Nav shadow on scroll + smoothly-eased (lerped) blob parallax
  useEffect(() => {
    const nav = document.getElementById("landing-nav")
    const onScroll = () => {
      if (!nav) return
      if (window.scrollY > 50) nav.classList.add("shadow-sm")
      else nav.classList.remove("shadow-sm")
    }
    // target = where the cursor points; current = eased position that chases it
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX - window.innerWidth / 2) / 100
      target.y = (e.clientY - window.innerHeight / 2) / 100
    }
    let raf = 0
    const blobs = () => document.querySelectorAll<HTMLElement>(".parallax-blob")
    const tick = () => {
      // ease ~8% toward the target each frame → soft, weighty follow, never a snap
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      blobs().forEach((blob, i) => {
        const speed = (i + 1) * 2
        // use the independent `translate` property so it composes with any
        // `transform`-based breathe/float animation instead of clobbering it
        blob.style.translate = `${current.x * speed}px ${current.y * speed}px`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener("scroll", onScroll)
    window.addEventListener("mousemove", onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("mousemove", onMove)
    }
  }, [])

  const start = () => navigate("/login")

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden watercolor-bg selection:bg-primary-fixed selection:text-on-primary-fixed-variant">
      {/* ── Top Navigation ── */}
      <nav id="landing-nav" className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="flex justify-between items-center w-full px-safe-margin py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-fixed flex items-center justify-center rounded-xl organic-blob">
              <MSym name="favorite" fill className="text-primary" />
            </div>
            <span className="font-headline-lg text-title-md font-bold text-primary">CareCheck</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href={CANCER_AWARENESS_URL} target="_blank" rel="noopener noreferrer" className="text-primary font-bold border-b-2 border-primary pb-1 text-body-md hover:opacity-80 transition-opacity">Cancer Awareness</a>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/login")} className="hidden sm:block text-on-surface-variant font-semibold hover:text-primary transition-colors duration-300">{t("login.signIn")}</button>
            <button onClick={start} className="bg-primary text-on-primary px-7 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-layered-cta">Start Your Journey</button>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
          <div className="parallax-blob absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed/20 blur-3xl organic-blob animate-breathe" />
          <div className="parallax-blob absolute top-1/2 -right-24 w-80 h-80 bg-secondary-fixed/20 blur-3xl organic-blob" />
          <div className="max-w-7xl mx-auto px-safe-margin grid grid-cols-1 md:grid-cols-12 gap-element-gap items-center relative z-10">
            <div className="md:col-span-6 lg:col-span-5 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-secondary-container/50 text-on-secondary-container rounded-full border border-primary/5">
                <MSym name="auto_awesome" className="text-[18px]" />
                <span className="font-label-sm text-label-sm uppercase tracking-widest">Self-Care First</span>
              </div>
              <h1 className="font-display-lg text-display-lg text-on-surface leading-[1.1] tracking-tight">
                You know your <span className="text-primary italic">body best</span>. We're here to support you.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Accessible breast health support, whenever you need it. Gentle guidance designed for your emotional and physical well-being.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <button onClick={start} className="bg-primary text-on-primary px-10 py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all group shadow-layered-hero">
                  Start Journey
                  <MSym name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="md:col-span-6 lg:col-span-7 relative mt-12 md:mt-0 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="relative w-full aspect-square md:aspect-auto md:h-[560px] flex items-center justify-center">
                <div className="parallax-blob absolute inset-0 bg-primary-fixed/25 organic-blob -rotate-3 scale-105" />
                <div className="relative z-20 w-[82%] aspect-square rounded-[3rem] shadow-layered-hero overflow-hidden border border-outline-variant/30 hover:scale-[1.02] transition-transform duration-700">
                  <img src="/images/hero-selfcare.jpg" alt="A woman calmly performing a guided self-check at home" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-safe-margin">
            <div className="bg-surface-container-low rounded-[60px] p-10 md:p-24 relative overflow-hidden">
              <div className="absolute top-10 right-10 opacity-5 select-none pointer-events-none">
                <MSym name="favorite" fill className="text-[160px]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-[0.25em]">Our Why</span>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">Simple. Accessible. Supportive.</h2>
                  </div>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    CareCheck helps you perform guided self-breast examinations, understand medical reports in plain language, and stay consistent with monthly reminders—all in one place. We focus on the person behind the patient.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/20 shadow-sm">
                      <h4 className="font-bold text-primary text-xl mb-1">100%</h4>
                      <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Private &amp; Secure</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/20 shadow-sm">
                      <h4 className="font-bold text-primary text-xl mb-1">Guided</h4>
                      <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Audio Care</p>
                    </div>
                  </div>
                </div>
                <div className="relative pt-8 md:pt-0">
                  <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-layered-hero transform md:rotate-2">
                    <img src="/images/about.jpg" alt="Gentle self-care moment" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-8 -left-4 bg-primary text-on-primary p-8 rounded-[2.5rem] max-w-[240px] shadow-layered-hero transform -rotate-3">
                    <p className="text-body-md font-bold italic leading-relaxed">"Self-care is a revolutionary act of health."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-32 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-safe-margin text-center mb-20">
            <h2 className="font-headline-lg text-display-lg text-on-surface mb-6 tracking-tight">Why CareCheck?</h2>
            <div className="dot-divider"><span /></div>
          </div>
          <div className="max-w-7xl mx-auto px-safe-margin grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f) => (
              <div
                key={f.title}
                className={`p-10 border-b-4 border-primary/20 ${f.radius} ${f.offset ?? ""} ${
                  f.elevated ? "bg-surface-container-high shadow-layered-cta md:-mt-12" : "bg-surface hover:shadow-xl"
                } transition-all duration-500 group relative overflow-hidden`}
              >
                <div className={`w-16 h-16 ${f.iconBg} rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
                  <MSym name={f.icon} className={`${f.iconColor} text-3xl`} />
                </div>
                <h3 className="font-title-md text-title-md text-on-surface mb-2 leading-tight">{f.title}</h3>
                {f.tag && <h4 className="text-primary font-bold text-[10px] mb-4 uppercase tracking-[0.2em]">{f.tag}</h4>}
                <p className="font-body-md text-on-surface-variant leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="py-32 bg-surface-container-low overflow-hidden">
          <div className="max-w-7xl mx-auto px-safe-margin relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="parallax-blob absolute -inset-16 bg-primary-fixed/15 blur-[100px] organic-blob" />
                <div className="relative bg-surface-container-lowest rounded-[4rem] p-10 border border-outline-variant/30 shadow-layered-hero transform -rotate-2">
                  <div className="w-full aspect-[4/3] rounded-[3rem] mb-10 shadow-sm overflow-hidden">
                    <img src="/images/mission.jpg" alt="A woman taking a calm, reflective moment" className="w-full h-full object-cover" />
                  </div>
                  <blockquote className="text-4xl italic font-display-lg text-primary leading-tight mb-6 tracking-tight">"It started with a single check."</blockquote>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">CareCheck was born from a personal journey. We realized that health care isn't just about medicine—it's about the courage to look, the support to understand, and the community to heal.</p>
                </div>
              </div>
              <div className="space-y-10 order-1 lg:order-2">
                <div className="space-y-4">
                  <span className="font-label-sm text-label-sm text-[#6f5959] uppercase tracking-[0.4em]">Our Heart</span>
                  <h2 className="font-display-lg text-display-lg text-on-surface leading-[1.1] tracking-tight">Every body has a story.</h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Our mission is to turn fear into proactive care. By providing tools that are as gentle as they are powerful, we empower every woman to become an expert on her own body.
                </p>
                <ul className="space-y-6">
                  {["Inclusive by Design", "Privacy Centric Infrastructure", "Compassionate Communication"].map((item) => (
                    <li key={item} className="flex items-center gap-5 group">
                      <MSym name="check_circle" className="text-primary bg-primary-fixed/30 p-2 rounded-full transition-colors group-hover:bg-primary group-hover:text-on-primary" />
                      <span className="font-body-md font-bold text-on-surface/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/30 w-full pt-20 pb-12">
        <div className="flex flex-col items-center px-safe-margin w-full text-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-12 h-12 bg-primary-fixed/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <MSym name="favorite" fill className="text-primary text-3xl" />
            </div>
            <span className="font-headline-lg-mobile text-primary font-bold text-3xl tracking-tight">CareCheck</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 mb-10 text-on-secondary-fixed-variant">
            {["Privacy Policy", "Terms of Service", "Medical Disclaimer", "Contact Us"].map((l) => (
              <a key={l} className="font-label-sm text-label-sm uppercase tracking-widest hover:text-primary transition-colors duration-200 cursor-pointer">{l}</a>
            ))}
          </div>
          <div className="dot-divider mb-10 opacity-50"><span /></div>
          <p className="text-on-secondary-fixed-variant opacity-60 font-body-md text-body-md max-w-lg mb-10 leading-relaxed">
            DISCLAIMER: CareCheck is an educational and awareness tool. It does not diagnose medical conditions or replace professional medical advice.
          </p>
          <div className="mb-8">
            <p className="text-on-surface-variant text-sm mb-3">
              Designed &amp; developed by{" "}
              <span className="font-semibold text-primary">Saiyette Aima</span>
            </p>
          
            <div className="flex items-center justify-center gap-5">
              <a
                href="https://www.linkedin.com/in/saiyette-aima-166517376"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
          
              <span className="opacity-30">•</span>
          
              <a
                href="mailto:pinkforpurpose@gmail.com"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                Email
              </a>
            </div>
          </div>
          <div className="font-label-sm text-[15px] text-on-secondary-fixed-variant uppercase tracking-[0.3em] opacity-40">
            © {new Date().getFullYear()} CareCheck. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
