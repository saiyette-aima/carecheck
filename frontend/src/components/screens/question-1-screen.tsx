"use client"

import { QuestionScreen } from "./question-screen"
import { useApp } from "../app-context"

export function Question1Screen() {
  const { t } = useApp()
  return (
    <QuestionScreen
      questionNumber={1}
      title={t("q.q1Title")}
      subtitle={t("q.q1Sub")}
    />
  )
}
