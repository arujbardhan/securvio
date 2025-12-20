import { Github, Linkedin, Mail, Heart } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Founder Image/Avatar */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-glow-pulse" />
              <div className="absolute inset-4 rounded-full border border-primary/30" />
              <div className="absolute inset-8 rounded-full border border-primary/40" />
              
              {/* Avatar placeholder with initials */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/50 flex items-center justify-center">
                <span className="text-5xl md:text-6xl font-display font-bold text-primary">AB</span>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute top-4 right-8 glass-card px-3 py-2 text-sm animate-float">
              <span className="text-primary">Security Expert</span>
            </div>
            <div className="absolute bottom-8 left-4 glass-card px-3 py-2 text-sm animate-float delay-300">
              <span className="text-primary">Open Source Advocate</span>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-sm text-primary mb-6">
              <Heart className="w-4 h-4" />
              Meet the Founder
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Aruj Bardhan
            </h2>
            
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Aruj Bardhan founded Securvio to democratize access to advanced security 
              expertise. With a passion for making security accessible to everyone, 
              Aruj combines deep technical knowledge with a commitment to helping 
              organizations of all sizes protect their digital assets.
            </p>

            <div className="glass-card p-6 mb-8 border-l-4 border-l-primary">
              <p className="text-foreground italic leading-relaxed">
                "By embracing open source, I believe that transparency and community 
                collaboration are essential to building trustworthy, adaptable, and 
                resilient security solutions for everyone. Security should never be 
                a privilege—it should be a right."
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="mailto:a.bardhan2004@gmail.com"
                className="p-3 glass-card hover:border-primary/50 transition-all text-muted-foreground hover:text-primary"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 glass-card hover:border-primary/50 transition-all text-muted-foreground hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 glass-card hover:border-primary/50 transition-all text-muted-foreground hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
