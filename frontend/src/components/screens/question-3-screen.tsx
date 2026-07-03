"use client"

import { QuestionScreen } from "./question-screen"
import { useApp } from "../app-context"

export function Question3Screen() {
  const { t } = useApp()
  return (
    <QuestionScreen
      questionNumber={3}
      title={t("q.q3Title")}
      subtitle={t("q.q3Sub")}
    />
  )
}
