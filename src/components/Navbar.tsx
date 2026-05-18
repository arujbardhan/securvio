import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import securvioLogo from "@/assets/securvio-logo.png";

const servicesDropdown = [
  { name: "Services", hash: "#services" },
  { name: "DevSecOps", hash: "#devsecops" },
  { name: "How It Works", hash: "#how-it-works" },
  { name: "About", hash: "#about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  const sectionHref = (hash: string) => (onHome ? hash : `/${hash}`);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={securvioLogo}
              alt="Securvio"
              className="h-12 md:h-16 w-auto rounded-lg"
              style={{ backgroundColor: "hsl(222, 47%, 6%)" }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/learn"
              className="text-foreground hover:text-primary transition-colors duration-200 text-sm font-semibold"
            >
              Learn
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
                onClick={() => setServicesOpen((v) => !v)}
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 pt-3 min-w-[200px]">
                  <div className="bg-background/95 backdrop-blur-xl border border-border/60 rounded-lg shadow-glow py-2 animate-fade-in">
                    {servicesDropdown.map((item) => (
                      <a
                        key={item.name}
                        href={sectionHref(item.hash)}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        onClick={() => setServicesOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/download"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
            >
              Download
            </Link>

            <a
              href="mailto:a.bardhan2004@gmail.com"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-all duration-200 shadow-glow"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link
                to="/learn"
                onClick={() => setIsOpen(false)}
                className="text-foreground font-semibold py-2"
              >
                Learn
              </Link>
              <div className="border-t border-border/30 pt-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-2">Services</p>
                {servicesDropdown.map((item) => (
                  <a
                    key={item.name}
                    href={sectionHref(item.hash)}
                    onClick={() => setIsOpen(false)}
                    className="block text-muted-foreground hover:text-foreground transition-colors py-2 pl-2"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <Link
                to="/download"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors py-2 border-t border-border/30 pt-3"
              >
                Download
              </Link>
              <a
                href="mailto:a.bardhan2004@gmail.com"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm text-center"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
