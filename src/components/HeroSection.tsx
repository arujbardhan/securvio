import { Shield, MessageSquare, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onOpenChat: () => void;
}

const HeroSection = ({ onOpenChat }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/30 mb-8 animate-fade-up">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Security Consulting</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-up delay-100">
            Your <span className="text-gradient">AI Security Consultant</span>
            <br />in the Browser
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
            Get instant, expert-level security guidance powered by AI. Ask questions, 
            receive best practices, and strengthen your security posture in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <button
              onClick={onOpenChat}
              className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-glow hover:shadow-glow-lg"
            >
              <MessageSquare className="w-5 h-5" />
              Ask Securvio a Security Question
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a
              href="#how-it-works"
              className="px-8 py-4 border border-border hover:border-primary/50 rounded-xl font-semibold text-lg hover:bg-secondary/50 transition-all duration-300"
            >
              Learn How It Works
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-border/50 animate-fade-up delay-400">
            <p className="text-sm text-muted-foreground mb-4">Trusted by security-conscious teams</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {["DevSecOps", "SOC 2", "NIST", "ISO 27001", "GDPR"].map((badge) => (
                <span key={badge} className="px-4 py-2 glass-card text-sm text-muted-foreground">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
