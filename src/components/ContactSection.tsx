import { useState } from "react";
import { Send, Mail, ArrowRight, CheckCircle } from "lucide-react";

const ContactSection = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open mailto with pre-filled content
    const mailtoLink = `mailto:a.bardhan2004@gmail.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/30 mb-6">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Get in Touch</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Talk to <span className="text-gradient">Our Team</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have questions about our services? Want to discuss your security needs? 
              Reach out and we'll get back to you promptly.
            </p>
          </div>

          <div className="glass-card p-8 md:p-12 hover:border-primary/30 transition-all duration-500 group">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <div className="p-4 rounded-full bg-primary/20 text-primary mb-6">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-2">Thank You!</h3>
                <p className="text-muted-foreground">Your email client should open shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell us about your security challenges or questions..."
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Or email us directly at{" "}
                    <a href="mailto:a.bardhan2004@gmail.com" className="text-primary hover:underline">
                      a.bardhan2004@gmail.com
                    </a>
                  </p>
                  <button
                    type="submit"
                    className="group/btn flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-glow hover:shadow-glow-lg"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
