import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TaxEducation from "./pages/TaxEducation";
import TaxGuide from "./pages/TaxGuide";
import FIRSRegulations from "./pages/FIRSRegulations";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "@/hooks/useAuth";
import RequireAuth from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={(
                <RequireAuth>
                  <Index />
                </RequireAuth>
              )}
            />
            <Route
              path="/tax-education"
              element={(
                <RequireAuth>
                  <TaxEducation />
                </RequireAuth>
              )}
            />
            <Route
              path="/tax-guide"
              element={(
                <RequireAuth>
                  <TaxGuide />
                </RequireAuth>
              )}
            />
            <Route
              path="/firs-regulations"
              element={(
                <RequireAuth>
                  <FIRSRegulations />
                </RequireAuth>
              )}
            />
            <Route
              path="/faq"
              element={(
                <RequireAuth>
                  <FAQ />
                </RequireAuth>
              )}
            />
            <Route
              path="/contact"
              element={(
                <RequireAuth>
                  <Contact />
                </RequireAuth>
              )}
            />
            <Route
              path="/privacy-policy"
              element={(
                <RequireAuth>
                  <PrivacyPolicy />
                </RequireAuth>
              )}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
