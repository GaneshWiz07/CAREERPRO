import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import EditorPage from "./pages/EditorPage";
import TailorPage from "./pages/TailorPage";
import AchievementsPage from "./pages/AchievementsPage";
import AnalysisPage from "./pages/AnalysisPage";
import ResumesPage from "./pages/ResumesPage";
import InterviewPage from "./pages/InterviewPage";
import SalaryPage from "./pages/SalaryPage";
import HeatmapPage from "./pages/HeatmapPage";
import CoverLetterPage from "./pages/CoverLetterPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <ResumeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/tailor" element={<TailorPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/resumes" element={<ResumesPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/salary" element={<SalaryPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/cover-letter" element={<CoverLetterPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </ResumeProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
