import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Download from "./pages/Download";
import NotFound from "./pages/NotFound";
import LearnHub from "./pages/learn/Hub";
import Flashcards from "./pages/learn/Flashcards";
import Matching from "./pages/learn/Matching";
import Quiz from "./pages/learn/Quiz";
import FillBlank from "./pages/learn/FillBlank";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/download" element={<Download />} />
            <Route path="/learn" element={<LearnHub />} />
            <Route path="/learn/flashcards" element={<Flashcards />} />
            <Route path="/learn/matching" element={<Matching />} />
            <Route path="/learn/quiz" element={<Quiz />} />
            <Route path="/learn/fill-blank" element={<FillBlank />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
