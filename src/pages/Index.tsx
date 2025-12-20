import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DevSecOpsSection from "@/components/DevSecOpsSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection onOpenChat={handleOpenChat} />
        <HowItWorksSection />
        <DevSecOpsSection />
        <ServicesSection onOpenChat={handleOpenChat} />
        <AboutSection />
      </main>
      <Footer />
      <ChatBot isOpen={isChatOpen} onToggle={handleToggleChat} />
    </div>
  );
};

export default Index;
