import { Suspense, lazy, type ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { supabaseConfigured } from "@/integrations/supabase/client";

// Pulls in react-markdown — keep it out of the initial bundle.
const CustomerSupportChat = lazy(() => import("@/components/CustomerSupportChat"));

interface SiteLayoutProps {
  children: ReactNode;
  /** Output of <SEO ... />, rendered before the header. */
  seo?: ReactNode;
  /** Extra top padding so content clears the fixed header. Default true. */
  offsetHeader?: boolean;
}

const SiteLayout = ({ children, seo, offsetHeader = true }: SiteLayoutProps) => (
  <div className="min-h-screen bg-background flex flex-col">
    {seo}
    <Header />
    <CartDrawer />
    <main className={`flex-1 ${offsetHeader ? "pt-[72px]" : ""}`}>{children}</main>
    <Footer />
    {supabaseConfigured && (
      <Suspense fallback={null}>
        <CustomerSupportChat />
      </Suspense>
    )}
  </div>
);

export default SiteLayout;
