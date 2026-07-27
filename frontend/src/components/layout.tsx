import { ReactNode } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useApp } from "./app-context"

interface LayoutProps {
  children: ReactNode
}

function MSym({ name, className = "", fill = false }: { name: string; className?: string; fill?: boolean }) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}>
      {name}
    </span>
  )
}

const navItems = [
  { path: "/dashboard", key: "nav.dashboard", icon: "dashboard" },
  { path: "/exam-step", key: "nav.selfCheck", icon: "accessibility_new" },
  { path: "/progress", key: "nav.progress", icon: "insights" },
  { path: "/find-clinic", key: "nav.findClinic", icon: "local_hospital" },
  { path: "/reminder", key: "nav.reminders", icon: "notifications" },
]

const mobileNav = [
  { path: "/dashboard", key: "nav.dashboard", icon: "dashboard" },
  { path: "/progress", key: "nav.progress", icon: "insights" },
  { path: "/exam-step", key: "nav.selfCheck", icon: "add", fab: true },
  { path: "/find-clinic", key: "nav.findClinic", icon: "local_hospital" },
  { path: "/reminder", key: "nav.reminders", icon: "notifications" },
]

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, setLanguage, setUserId } = useApp()

  const signOut = () => {
    setUserId(null)
    setLanguage("en")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden custom-scrollbar">
      {/* Global watercolor blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-primary-container watercolor-blob opacity-[0.15] pointer-events-none -z-10" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[35vw] h-[35vw] bg-secondary-container watercolor-blob opacity-[0.15] pointer-events-none -z-10" />

      {/* ─── Desktop Side Navigation ─── */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low p-4 gap-unit z-50">
        <div
          className="flex items-center gap-3 mb-12 px-2 mt-4 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-sm">
            <MSym name="favorite" fill />
          </div>
          <div>
            <h1 className="font-headline-lg text-primary text-xl leading-none">{t("login.title")}</h1>
            <p className="font-label-sm text-on-surface-variant opacity-70">{t("layout.companion")}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-grow">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`editorial-nav-link flex items-center gap-4 p-4 transition-all text-left ${
                  isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <MSym name={item.icon} fill={isActive} />
                <span className="font-label-sm tracking-widest uppercase text-[10px]">{t(item.key)}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant">
          <div className="bg-primary-fixed p-4 rounded-2xl mb-4 relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 w-12 h-12 bg-on-primary-fixed-variant opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700" />
            <p className="font-label-sm text-on-primary-fixed-variant mb-1">{t("layout.reminderTitle")}</p>
            <p className="text-[11px] leading-relaxed text-on-primary-fixed-variant opacity-80">{t("layout.reminderDesc")}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-4 p-3 text-on-surface-variant hover:text-primary transition-all"
          >
            <MSym name="logout" />
            <span className="font-label-sm uppercase text-[9px] tracking-widest">{t("nav.signOut")}</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="md:ml-64 min-h-screen animate-fade-in-up pb-24 md:pb-0">
        {children}
      </main>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-md flex justify-around items-center py-4 px-6 z-50 border-t border-outline-variant/10">
        {mobileNav.map((item) => {
          const isActive = location.pathname === item.path
          if (item.fab) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-center w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg -translate-y-6 border-4 border-surface"
              >
                <MSym name={item.icon} className="text-3xl" />
              </button>
            )
          }
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-on-surface-variant"}`}
            >
              <MSym name={item.icon} fill={isActive} />
              <span className="text-[10px] font-bold uppercase">{t(item.key)}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
