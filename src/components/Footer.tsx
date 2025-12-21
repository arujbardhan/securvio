import securvioLogo from "@/assets/securvio-footer-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Tech grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand with seamless logo */}
          <div className="md:col-span-2">
            <div className="relative mb-6">
              <img 
                src={securvioLogo} 
                alt="Securvio" 
                className="h-16 md:h-20 w-auto object-contain"
                style={{
                  filter: 'brightness(1.1) contrast(1.05)'
                }}
              />
            </div>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              AI-powered security consulting that makes expert-level security 
              guidance accessible to everyone. Secure your future with Securvio.
            </p>
            
            {/* Tech decorative element */}
            <div className="flex items-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-primary/50 to-transparent" />
              <span className="text-xs text-muted-foreground/70 font-mono tracking-wider">SECURE • PROTECT • DEFEND</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Services", "DevSecOps", "How It Works", "About", "Comparison"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-4" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Contact
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:a.bardhan2004@gmail.com"
                className="text-muted-foreground hover:text-primary text-sm transition-colors block"
              >
                a.bardhan2004@gmail.com
              </a>
              <div className="flex items-center gap-3 pt-4">
                <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer group">
                  <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer group">
                  <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with tech styling */}
        <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground/60 font-mono">SYSTEMS OPERATIONAL</span>
            </div>
            <span className="text-muted-foreground/20">|</span>
            <p className="text-muted-foreground/60 text-sm">
              © {currentYear} Securvio. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground/60 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground/60 hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
