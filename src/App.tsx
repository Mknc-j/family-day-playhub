import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language";
import Index from "./pages/Index.tsx";
import Games from "./pages/Games.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";
import Stations from "./pages/Stations.tsx";
import OperatorLogin from "./pages/OperatorLogin.tsx";
import Operator from "./pages/Operator.tsx";
import PasswordChallenge from "./pages/games/PasswordChallenge.tsx";
import SecurityQuiz from "./pages/games/SecurityQuiz.tsx";
import IncidentClicker from "./pages/games/IncidentClicker.tsx";
import PrimaryQuiz from "./pages/games/PrimaryQuiz.tsx";
import JuniorQuiz from "./pages/games/JuniorQuiz.tsx";
import HighSchoolQuiz from "./pages/games/HighSchoolQuiz.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/games" element={<Games />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/operator-login" element={<OperatorLogin />} />
            <Route path="/operator" element={<Operator />} />
            <Route path="/games/password-challenge" element={<PasswordChallenge />} />
            <Route path="/games/security-quiz" element={<SecurityQuiz />} />
            <Route path="/games/incident-clicker" element={<IncidentClicker />} />
            <Route path="/games/primary-quiz" element={<PrimaryQuiz />} />
            <Route path="/games/junior-quiz" element={<JuniorQuiz />} />
            <Route path="/games/highschool-quiz" element={<HighSchoolQuiz />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
