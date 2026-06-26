import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { SportsPage } from './pages/SportsPage';
import { SportDetailPage } from './pages/SportDetailPage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { PlanPreviewPage } from './pages/PlanPreviewPage';
import { TrainingPlanPage } from './pages/TrainingPlanPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProgressPage } from './pages/ProgressPage';
import { MyProgressPage } from './pages/MyProgressPage';
import { AICoachPage } from './pages/AICoachPage';
import { NutritionPage } from './pages/NutritionPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sports" element={<SportsPage />} />
              <Route path="/sports/:sportId" element={<SportDetailPage />} />
              <Route path="/training/:sportId/:improvementId/questionnaire" element={<QuestionnairePage />} />
              <Route path="/training/:sportId/:improvementId/plan-preview" element={<PlanPreviewPage />} />
              <Route path="/training/:sportId/:improvementId/plan" element={<TrainingPlanPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/progress" element={<MyProgressPage />} />
              <Route path="/progress-old" element={<ProgressPage />} />
              <Route path="/coach" element={<AICoachPage />} />
              <Route path="/nutrition" element={<NutritionPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
