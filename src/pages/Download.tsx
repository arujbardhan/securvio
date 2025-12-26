import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, Lock, Cloud, Search, Download as DownloadIcon, CheckCircle, 
  ArrowRight, Eye, EyeOff, ChevronDown, Sparkles,
  Network, Database, Mail, Phone, User, Building, MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import securvioLogo from "@/assets/securvio-logo.png";

const Download = () => {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Password state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setFormSubmitted(true);
    toast({
      title: "Demo Request Received",
      description: "Our security team will contact you shortly.",
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocking(true);
    setPasswordError(false);
    
    setTimeout(() => {
      if (password === "prototype") {
        setIsUnlocked(true);
        toast({
          title: "Access Granted",
          description: "Download link unlocked successfully.",
        });
      } else {
        setPasswordError(true);
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Invalid password. Please contact support.",
        });
      }
      setIsUnlocking(false);
    }, 800);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src={securvioLogo} 
                alt="Securvio" 
                className="h-12 w-auto rounded-lg"
                style={{ backgroundColor: 'hsl(222, 47%, 6%)' }}
              />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("overview")} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Overview
              </button>
              <button onClick={() => scrollToSection("demo")} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Book Demo
              </button>
              <button onClick={() => scrollToSection("download")} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Download
              </button>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Home
              </Link>
              <button 
                onClick={() => scrollToSection("demo")}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-all duration-200 shadow-glow animate-glow-pulse"
              >
                Get Started
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {isMenuOpen ? (
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className="block w-5 h-0.5 bg-foreground rotate-45 translate-y-0.5" />
                  <span className="block w-5 h-0.5 bg-foreground -rotate-45 -translate-y-0" />
                </div>
              ) : (
                <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                  <span className="block w-5 h-0.5 bg-foreground" />
                  <span className="block w-5 h-0.5 bg-foreground" />
                  <span className="block w-5 h-0.5 bg-foreground" />
                </div>
              )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
              <div className="flex flex-col gap-4">
                <button onClick={() => scrollToSection("overview")} className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left">
                  Overview
                </button>
                <button onClick={() => scrollToSection("demo")} className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left">
                  Book Demo
                </button>
                <button onClick={() => scrollToSection("download")} className="text-muted-foreground hover:text-foreground transition-colors py-2 text-left">
                  Download
                </button>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                  Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Circuit Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-full h-full opacity-20" viewBox="0 0 1000 1000">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(199, 89%, 48%)" stopOpacity="1" />
                <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,200 Q250,150 500,200 T1000,200" stroke="url(#lineGradient)" strokeWidth="1" fill="none" className="animate-pulse" />
            <path d="M0,400 Q250,350 500,400 T1000,400" stroke="url(#lineGradient)" strokeWidth="1" fill="none" className="animate-pulse delay-200" />
            <path d="M0,600 Q250,550 500,600 T1000,600" stroke="url(#lineGradient)" strokeWidth="1" fill="none" className="animate-pulse delay-300" />
            <path d="M0,800 Q250,750 500,800 T1000,800" stroke="url(#lineGradient)" strokeWidth="1" fill="none" className="animate-pulse delay-500" />
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Enterprise Cybersecurity Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6 animate-fade-up leading-tight">
            Protect What Powers
            <br />
            <span className="text-gradient">Your Enterprise.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-up delay-100">
            Securvio delivers next-generation cybersecurity intelligence for the world's 
            most data-driven organizations. AI-powered threat detection meets enterprise resilience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-200">
            <button 
              onClick={() => scrollToSection("demo")}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-glow-lg animate-glow-pulse flex items-center justify-center gap-2 group"
            >
              Book a Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection("overview")}
              className="px-8 py-4 bg-secondary text-foreground rounded-xl font-semibold text-lg hover:bg-secondary/80 transition-all duration-300 border border-border flex items-center justify-center gap-2"
            >
              Learn More
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-muted-foreground" />
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="section-padding relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="animate-fade-up">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-6">
                Unified Defense
                <br />
                <span className="text-gradient">Ecosystem</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Securvio combines AI threat analytics, end-to-end encryption, and zero-trust 
                architecture into a unified defense ecosystem. Built for enterprises that 
                demand resilience, visibility, and speed in an evolving threat landscape.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>SOC 2 Type II</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>ISO 27001</span>
                </div>
              </div>
            </div>

            {/* Abstract Graphic */}
            <div className="relative animate-fade-up delay-200">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Glowing Shield */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/10 animate-pulse flex items-center justify-center">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/20 flex items-center justify-center shadow-glow-lg">
                      <Shield className="w-16 h-16 md:w-24 md:h-24 text-primary animate-float" />
                    </div>
                  </div>
                </div>
                {/* Orbiting Elements */}
                <div className="absolute top-8 right-8 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center animate-float delay-100">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute bottom-12 left-4 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center animate-float delay-200">
                  <Cloud className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute top-1/4 left-0 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center animate-float delay-300">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute bottom-1/4 right-0 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center animate-float delay-500">
                  <Network className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="glass-card p-8 group hover:border-primary/50 transition-all duration-300 animate-fade-up">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow">
                <Search className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-3">AI-Powered Threat Detection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Machine learning algorithms analyze patterns in real-time, identifying threats 
                before they compromise your systems.
              </p>
            </div>

            <div className="glass-card p-8 group hover:border-primary/50 transition-all duration-300 animate-fade-up delay-100">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-3">End-to-End Encryption</h3>
              <p className="text-muted-foreground leading-relaxed">
                Military-grade encryption protects your data at rest and in transit, 
                ensuring complete confidentiality.
              </p>
            </div>

            <div className="glass-card p-8 group hover:border-primary/50 transition-all duration-300 animate-fade-up delay-200">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow">
                <Cloud className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-3">Cloud-Native Integration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seamlessly integrates with AWS, Azure, and GCP, providing unified security 
                across your cloud infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Demo Section */}
      <section id="demo" className="section-padding relative bg-card/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4">
              Experience Securvio
              <span className="text-gradient"> in Action</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule a personalized demonstration with our cybersecurity experts and see 
              how Securvio protects your business from evolving digital threats.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {formSubmitted ? (
              <div className="glass-card p-8 md:p-12 text-center animate-fade-up">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold font-display mb-4">Thank You!</h3>
                <p className="text-muted-foreground text-lg">
                  Our security team will contact you shortly to schedule your demo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="glass-card p-8 md:p-12 animate-fade-up">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleFormChange}
                        className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        id="company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleFormChange}
                        className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="Acme Corporation"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Business Email <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message / Notes
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleFormChange}
                      className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      placeholder="Tell us about your security needs..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Schedule My Demo
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="section-padding relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6 animate-fade-up">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Client Access Only</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 animate-fade-up">
              Download Securvio
              <span className="text-gradient"> Enterprise Suite</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 animate-fade-up delay-100">
              Access restricted. Authorized clients and partners can download the latest 
              Securvio Enterprise build using the access password provided by our support team.
            </p>

            <div className="glass-card p-8 md:p-12 animate-fade-up delay-200">
              {isUnlocked ? (
                <div className="animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-glow-lg">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold font-display mb-4">Access Granted</h3>
                  <p className="text-muted-foreground mb-8">
                    You can now download the Securvio Enterprise Suite.
                  </p>
                  <a
                    href="/downloads/securvio-enterprise.zip"
                    download="securvio-enterprise.zip"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-glow-lg animate-glow-pulse"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    Download Now
                  </a>
                  <p className="text-xs text-muted-foreground mt-6">
                    This file contains proprietary software. Do not redistribute without written consent from Securvio.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 border border-border">
                    <Lock className={`w-10 h-10 transition-colors ${passwordError ? 'text-destructive' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className="text-xl font-semibold font-display mb-4">Enter Access Password</h3>
                  <p className="text-muted-foreground mb-6">
                    Contact <a href="mailto:support@securvio.com" className="text-primary hover:underline">support@securvio.com</a> to request access credentials.
                  </p>
                  
                  <div className="max-w-sm mx-auto">
                    <div className="relative mb-4">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError(false);
                        }}
                        className={`w-full pl-12 pr-12 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors ${
                          passwordError ? 'border-destructive' : 'border-border'
                        }`}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-destructive text-sm mb-4 animate-fade-in">
                        Invalid password. Please try again or contact support.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={!password || isUnlocking}
                      className="w-full py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all duration-300 border border-border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isUnlocking ? (
                        <>
                          <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Unlock Download
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="inline-block mb-4">
                <img 
                  src={securvioLogo} 
                  alt="Securvio" 
                  className="h-12 w-auto rounded-lg"
                  style={{ backgroundColor: 'hsl(222, 47%, 6%)' }}
                />
              </Link>
              <p className="text-muted-foreground max-w-sm">
                Next-generation cybersecurity intelligence for enterprises that demand 
                resilience, visibility, and speed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Home</Link></li>
                <li><button onClick={() => scrollToSection("overview")} className="text-muted-foreground hover:text-foreground transition-colors text-sm">Overview</button></li>
                <li><button onClick={() => scrollToSection("demo")} className="text-muted-foreground hover:text-foreground transition-colors text-sm">Book Demo</button></li>
                <li><button onClick={() => scrollToSection("download")} className="text-muted-foreground hover:text-foreground transition-colors text-sm">Download</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:support@securvio.com" className="text-muted-foreground hover:text-foreground transition-colors text-sm">support@securvio.com</a></li>
                <li><a href="mailto:a.bardhan2004@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors text-sm">a.bardhan2004@gmail.com</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Securvio Technologies, Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Security Practices</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Download;
