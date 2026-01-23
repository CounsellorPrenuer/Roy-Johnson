import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";

// Custom hash location hook to ensure robust handling of GitHub Pages routing
const useHashLocation = () => {
  const getLocation = () => {
    const hash = window.location.hash.replace(/^#/, "") || "/";
    return hash.startsWith("/") ? hash : "/" + hash;
  };

  const [loc, setLoc] = useState(getLocation());

  useEffect(() => {
    const handler = () => setLoc(getLocation());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (to: string) => { window.location.hash = to; };
  return [loc, navigate] as [string, (to: string) => void];
};
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Partnership from "@/components/Partnership";
import Footer from "@/components/Footer";

// Admin imports
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PaymentManagement from "@/pages/admin/PaymentManagement";
import ContactManagement from "@/pages/admin/ContactManagement";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Pricing />
      <Contact />
      <Partnership />
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />

        {/* Admin Routes */}
        <Route path="/admin/login" component={AdminLogin} />

        <Route path="/admin">
          <ProtectedAdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedAdminRoute>
        </Route>

        <Route path="/admin/payments">
          <ProtectedAdminRoute>
            <AdminLayout>
              <PaymentManagement />
            </AdminLayout>
          </ProtectedAdminRoute>
        </Route>

        <Route path="/admin/contacts">
          <ProtectedAdminRoute>
            <AdminLayout>
              <ContactManagement />
            </AdminLayout>
          </ProtectedAdminRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
