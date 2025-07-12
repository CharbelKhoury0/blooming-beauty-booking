import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SalonPage from "./pages/[slug]";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CancellationPolicy from "./pages/CancellationPolicy";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path=":slug/privacy-policy" element={<PrivacyPolicy />} />
          <Route path=":slug/terms-of-service" element={<TermsOfService />} />
          <Route path=":slug/cancellation-policy" element={<CancellationPolicy />} />
          <Route path=":slug/contact" element={<Contact />} />
          <Route path=":slug/services" element={<Services />} />
          <Route path=":slug/about" element={<About />} />
          <Route path=":slug/testimonials" element={<Testimonials />} />
          <Route path=":slug" element={<SalonPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
