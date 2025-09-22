import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DashboardPreview from "@/components/DashboardPreview";
import SkillLabsPreview from "@/components/SkillLabsPreview";
import PortfolioPreview from "@/components/PortfolioPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DashboardPreview />
        <SkillLabsPreview />
        <PortfolioPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
