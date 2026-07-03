"use client"

import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "@/config"
import { MapPin, ExternalLink, ArrowLeft, Clock, Users, Star, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useApp } from "../app-context"
import { Translate } from "@/components/translate"

interface Clinic {
  id: string
  name: string
  distance: string
  address: string
  phone: string
  hours: string
  availability: string
  rating: number
}

export function FindClinicScreen() {
  const navigate = useNavigate()
  const { t } = useApp()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState(() => t("clinic.acquiring"))

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatusMessage(t("clinic.unsupported", "Geolocation is not supported by your browser."))
      fetchFallbackClinics()
      return
    }

    const geoOptions = {
      enableHighAccuracy: false, // Allows faster Wi-Fi/IP location resolution (vital for laptops/desktops)
      timeout: 8000,
      maximumAge: 60000
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setStatusMessage(t("clinic.fetching"))
        try {
          const response = await fetch(`${API_BASE_URL}/nearby_clinics`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ lat: latitude, lng: longitude })
          })
          if (response.ok) {
            const data = await response.json()
            setClinics(data.output || [])
          } else {
            throw new Error("Failed to fetch clinics")
          }
        } catch (e) {
          console.error(e)
          fetchFallbackClinics()
        } finally {
          setLoading(false)
        }
      },
      (geoError) => {
        console.warn("Geolocation warning/error:", geoError)
        if (geoError.code === 1) {
          setStatusMessage(t("clinic.denied"))
        } else if (geoError.code === 2) {
          setStatusMessage(t("clinic.unavailable"))
        } else if (geoError.code === 3) {
          setStatusMessage(t("clinic.timeout"))
        } else {
          setStatusMessage(t("clinic.failed"))
        }
        fetchFallbackClinics()
      },
      geoOptions
    )
  }, [])

  const fetchFallbackClinics = async () => {
    let lat = 19.0760
    let lng = 72.8777
    try {
      // Automatic IP-based geolocation fallback
      const ipRes = await fetch("https://freeipapi.com/api/json")
      if (ipRes.ok) {
        const ipData = await ipRes.json()
        if (ipData.latitude && ipData.longitude) {
          lat = ipData.latitude
          lng = ipData.longitude
          console.log(`[Clinics] Resolved IP coordinates fallback: ${lat}, ${lng} (${ipData.cityName || ""})`)
          setStatusMessage(t("clinic.fetchingFallback"))
        }
      }
    } catch (ipErr) {
      console.warn("IP Geolocation fallback failed, using default coordinates:", ipErr)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/nearby_clinics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng })
      })
      if (response.ok) {
        const data = await response.json()
        setClinics(data.output || [])
      } else {
        throw new Error("Failed to fetch clinics")
      }
    } catch (e) {
      console.error(e)
      setClinics([
        {
          id: "1",
          name: t("clinic.fallback1Name", "Central Health Clinic (Offline Fallback)"),
          distance: "1.5 km",
          address: t("clinic.fallback1Addr", "123 Main Street, Health Center"),
          phone: "+1 (555) 123-4567",
          hours: "Mon-Fri 8am-6pm",
          availability: t("clinic.availableToday"),
          rating: 4.8,
        },
        {
          id: "2",
          name: t("clinic.fallback2Name", "Women's Care Center (Offline Fallback)"),
          distance: "3.2 km",
          address: t("clinic.fallback2Addr", "456 Oak Avenue, Medical Plaza"),
          phone: "+1 (555) 234-5678",
          hours: "Mon-Sat 9am-5pm",
          availability: t("clinic.tomorrowMorning", "Tomorrow morning"),
          rating: 4.9,
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* ── Header ── */}
      <div className="mb-8 animate-fade-in-up">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t("lang.back")}</span>
        </button>

        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
          {t("clinic.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("clinic.sub")}
        </p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">{statusMessage}</p>
        </div>
      ) : (
        <>
          {/* ── Clinics Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-8 stagger-children">
            {clinics.map((clinic) => (
              <div
                key={clinic.id}
                className="glass-card rounded-xl overflow-hidden card-elevated"
              >
                {/* Map placeholder area */}
                <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center relative">
                  <MapPin className="w-8 h-8 text-primary/40" />
                  <span className="absolute top-3 right-3 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full backdrop-blur-sm">
                    {clinic.distance}
                  </span>
                </div>

                <div className="p-5">
                  {/* Name and rating */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-foreground text-lg">
                      <Translate>{clinic.name}</Translate>
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-warning">
                      <Star className="w-4 h-4 fill-warning" />
                      <span className="font-semibold">{clinic.rating}</span>
                    </div>
                  </div>

                  {/* Availability badge */}
                  <span className="inline-flex text-xs font-medium bg-success/15 text-success px-2.5 py-1 rounded-full mb-3">
                    <Translate>{clinic.availability}</Translate>
                  </span>

                  {/* Details */}
                  <div className="space-y-2 mb-5 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <Translate>{clinic.address}</Translate>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <Translate>{clinic.hours}</Translate>
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      {t("clinic.specialists")}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name + " " + clinic.address)}`, "_blank")}
                      className="w-full py-3 gradient-primary text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t("clinic.directions")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {clinics.length === 0 && (
            <p className="text-center text-muted-foreground py-10">{t("clinic.noClinics")}</p>
          )}
        </>
      )}

      {/* Bottom action */}
      <div className="max-w-md mx-auto mt-6">
        <button
          onClick={() => navigate("/progress")}
          className="w-full h-14 gradient-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          {t("clinic.continueProgress")}
        </button>
      </div>
    </div>
  )
}
