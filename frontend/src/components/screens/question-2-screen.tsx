"use client"

import { QuestionScreen } from "./question-screen"
import { useApp } from "../app-context"

export function Question2Screen() {
  const { t } = useApp()
  return (
    <QuestionScreen
      questionNumber={2}
      title={t("q.q2Title")}
      subtitle={t("q.q2Sub")}
    />
  )
}
