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
import Station4 from "./pages/games/Station4.tsx";
import Station5 from "./pages/games/Station5.tsx";
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
            <Route path="/games/station-4" element={<Station4 />} />
            <Route path="/games/station-5" element={<Station5 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
