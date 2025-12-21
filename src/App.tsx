import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import AddQuestion from "./pages/AddQuestion";
import StudentPractice from "./pages/StudentPractice";
import StudentQuestions from "./pages/StudentQuestions";
import SubjectReport from "./pages/SubjectReport";
import Users from "./pages/Users";
import TaxonomyExport from "./pages/TaxonomyExport";
import Auth from "./pages/Auth";
import PaymentSuccess from "./pages/PaymentSuccess";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            {/* Rotas de Admin */}
            <Route path="/dashboard" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin", "professor"]}><Dashboard /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/questions" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin", "professor"]}><Questions /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/add-question" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin", "professor"]}><AddQuestion /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/subject-report" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin", "professor"]}><SubjectReport /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin"]}><Users /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/taxonomy-export" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin"]}><TaxonomyExport /></RoleBasedRoute></ProtectedRoute>} />
            {/* Rotas de Aluno */}
            <Route path="/student" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["aluno"]}><StudentPractice /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/student/questions" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["aluno"]}><StudentQuestions /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/student/subscription" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["aluno"]}><SubscriptionManagement /></RoleBasedRoute></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
