import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
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
      <Pricing />
      <Contact />
      <Partnership />
      <Footer />
    </div>
  );
}

function Router() {
  return (
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
