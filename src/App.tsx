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
import StudentSimulations from "./pages/StudentSimulations";
import StudentQuestions from "./pages/StudentQuestions";
import SubjectReport from "./pages/SubjectReport";
import Users from "./pages/Users";
import TaxonomyMigration from "./pages/TaxonomyMigration";
import Subscriptions from "./pages/Subscriptions";
import Auth from "./pages/Auth";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyAccount from "./pages/MyAccount";
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
            <Route path="/subject-report" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin"]}><SubjectReport /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin"]}><Users /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/subscriptions" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin"]}><Subscriptions /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/taxonomy-migration" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["admin"]}><TaxonomyMigration /></RoleBasedRoute></ProtectedRoute>} />
            {/* Rotas de Aluno */}
            <Route path="/student" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["aluno"]}><StudentPractice /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/student/questions" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["aluno"]}><StudentQuestions /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/student/simulations" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["aluno"]}><StudentSimulations /></RoleBasedRoute></ProtectedRoute>} />
            <Route path="/student/account" element={<ProtectedRoute><RoleBasedRoute allowedRoles={["aluno"]}><MyAccount /></RoleBasedRoute></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
