import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";
import { MenuSection, WhySection, ShopsSection, BlogSection, FeedbackSection, FranchiseSection } from "@/components/GalyaSections";
const Index = () => <div className="min-h-screen bg-background"><SEO title="Галя Балувана — домашні напівфабрикати" description="Домашні напівфабрикати: оберіть місто, перегляньте меню та знайдіть найближчий магазин." path="/" /><Header /><CartDrawer /><main><HeroSection /><MenuSection /><WhySection /><ShopsSection /><BlogSection /><FeedbackSection /><FranchiseSection /></main><Footer /></div>;
export default Index;
