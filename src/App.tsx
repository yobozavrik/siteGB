import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import Index from "./pages/Index.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import CollaborationPage from "./pages/CollaborationPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import WhereToBuyPage from "./pages/WhereToBuyPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import { landingPages } from "./data/landingPages";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/collaboration" element={<CollaborationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/where-to-buy" element={<WhereToBuyPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/landing/*" element={<Navigate to="/" replace />} />
            <Route path="/admin" element={<AdminPage />} />
            {landingPages.map((p) => (
              <Route key={p.slug} path={p.path} element={<LandingPage />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
