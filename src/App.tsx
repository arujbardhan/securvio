import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import RequireAuth from "@/components/learn/RequireAuth";
import Index from "./pages/Index";
import Download from "./pages/Download";
import NotFound from "./pages/NotFound";
import LearnAuth from "./pages/learn/Auth";
import Dashboard from "./pages/learn/Dashboard";
import Courses from "./pages/learn/Courses";
import CourseDetail from "./pages/learn/CourseDetail";
import LessonPlayer from "./pages/learn/LessonPlayer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/download" element={<Download />} />
              <Route path="/learn/auth" element={<LearnAuth />} />
              <Route path="/learn" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/learn/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/learn/courses" element={<RequireAuth><Courses /></RequireAuth>} />
              <Route path="/learn/courses/:slug" element={<RequireAuth><CourseDetail /></RequireAuth>} />
              <Route path="/learn/courses/:slug/lessons/:lessonId" element={<RequireAuth><LessonPlayer /></RequireAuth>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
