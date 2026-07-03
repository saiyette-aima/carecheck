import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppProvider } from "./components/app-context"
import { Layout } from "./components/layout"

// Import all screens
import { LandingScreen } from "./components/screens/landing-screen"
import { LoginScreen } from "./components/screens/login-screen"
import { LanguageScreen } from "./components/screens/language-screen"
import { DashboardScreen } from "./components/screens/dashboard-screen"
import { ExamStepScreen } from "./components/screens/exam-step-screen"
import { Question1Screen } from "./components/screens/question-1-screen"
import { Question2Screen } from "./components/screens/question-2-screen"
import { Question3Screen } from "./components/screens/question-3-screen"
import { ResultOkScreen } from "./components/screens/result-ok-screen"
import { ResultConcernScreen } from "./components/screens/result-concern-screen"
import { FindClinicScreen } from "./components/screens/find-clinic-screen"
import { DoctorFeedbackScreen } from "./components/screens/doctor-feedback-screen"
import { ReminderScreen } from "./components/screens/reminder-screen"
import { ProgressScreen } from "./components/screens/enhanced-progress-screen"

function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* Public routes — no nav shell */}
          <Route path="/" element={<LandingScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/language" element={<LanguageScreen />} />

          {/* Authenticated routes — with persistent nav layout */}
          <Route path="/dashboard" element={<Layout><DashboardScreen /></Layout>} />
          <Route path="/exam-step" element={<Layout><ExamStepScreen /></Layout>} />
          <Route path="/question-1" element={<Layout><Question1Screen /></Layout>} />
          <Route path="/question-2" element={<Layout><Question2Screen /></Layout>} />
          <Route path="/question-3" element={<Layout><Question3Screen /></Layout>} />
          <Route path="/result-ok" element={<Layout><ResultOkScreen /></Layout>} />
          <Route path="/result-concern" element={<Layout><ResultConcernScreen /></Layout>} />
          <Route path="/find-clinic" element={<Layout><FindClinicScreen /></Layout>} />
          <Route path="/doctor-feedback" element={<Layout><DoctorFeedbackScreen /></Layout>} />
          <Route path="/reminder" element={<Layout><ReminderScreen /></Layout>} />
          <Route path="/progress" element={<Layout><ProgressScreen /></Layout>} />
        </Routes>
      </AppProvider>
    </Router>
  )
}

export default App
