"use client"

import { useState, useEffect, ReactNode } from "react"
import { useApp } from "./app-context"
import { translateDynamicText } from "@/lib/translations"

export function useTranslatedText(text: string) {
  const { language } = useApp()
  const [translated, setTranslated] = useState(text)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!text || language === "en") {
      setTranslated(text)
      return
    }

    let isMounted = true
    const performTranslation = async () => {
      setLoading(true)
      const res = await translateDynamicText(text, language)
      if (isMounted) {
        setTranslated(res)
        setLoading(false)
      }
    }

    performTranslation()

    return () => {
      isMounted = false
    }
  }, [text, language])

  return { translated, loading }
}

interface TranslateProps {
  children: string | null | undefined
  fallback?: ReactNode
}

export function Translate({ children, fallback }: TranslateProps) {
  const textStr = children || ""
  const { translated, loading } = useTranslatedText(textStr)

  if (!children) return null
  if (loading && fallback) return <>{fallback}</>

  return <>{translated}</>
}
