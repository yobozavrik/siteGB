import { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import ScrollToTop from "@/components/ScrollToTop";

import Index from "./pages/Index.tsx";
import MenuPage from "./pages/MenuPage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import OrderPage from "./pages/OrderPage.tsx";
import DeliveryPage from "./pages/DeliveryPage.tsx";
import ShopsPage from "./pages/ShopsPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactsPage from "./pages/ContactsPage.tsx";
import FranchisePage from "./pages/FranchisePage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import { landingPages } from "./data/landingPages";
import { SHOW_PRICES } from "@/config/site";

// Admin pulls in recharts — keep it out of the storefront bundle.
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:category" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            {SHOW_PRICES ? (
              <>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/:id" element={<OrderPage />} />
              </>
            ) : (
              <>
                <Route path="/cart" element={<Navigate to="/menu" replace />} />
                <Route path="/checkout" element={<Navigate to="/menu" replace />} />
                <Route path="/order/:id" element={<Navigate to="/menu" replace />} />
              </>
            )}
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/franchise" element={<FranchisePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route
              path="/admin"
              element={
                <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Завантаження…</div>}>
                  <AdminPage />
                </Suspense>
              }
            />

            {/* legacy Kratea paths */}
            <Route path="/where-to-buy" element={<Navigate to="/shops" replace />} />
            <Route path="/collaboration" element={<Navigate to="/franchise" replace />} />
            <Route path="/contact" element={<Navigate to="/contacts" replace />} />
            <Route path="/landing/*" element={<Navigate to="/" replace />} />

            {landingPages.map((p) => (
              <Route key={p.slug} path={p.path} element={<LandingPage />} />
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
