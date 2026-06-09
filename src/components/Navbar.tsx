import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import securvioLogo from "@/assets/securvio-logo.png";

const homeDropdown = [
  { name: "Platform", hash: "#platform" },
  { name: "How It Works", hash: "#how-it-works" },
  { name: "DevSecOps", hash: "#devsecops" },
  { name: "Services", hash: "#services" },
  { name: "Comparison", hash: "#comparison" },
  { name: "About", hash: "#about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  const sectionHref = (hash: string) => (onHome ? hash : `/${hash}`);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={securvioLogo}
              alt="Securvio"
              className="h-12 md:h-16 w-auto rounded-lg"
              style={{ backgroundColor: "hsl(222, 47%, 6%)" }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Home dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHomeOpen(true)}
              onMouseLeave={() => setHomeOpen(false)}
            >
              <Link
                to="/"
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors duration-200 text-sm font-semibold"
              >
                Home
                <ChevronDown className={`w-4 h-4 transition-transform ${homeOpen ? "rotate-180" : ""}`} />
              </Link>
              {homeOpen && (
                <div className="absolute top-full left-0 pt-3 min-w-[200px]">
                  <div className="bg-background/95 backdrop-blur-xl border border-border/60 rounded-lg shadow-glow py-2 animate-fade-in">
                    {homeDropdown.map((item) => (
                      <a
                        key={item.name}
                        href={sectionHref(item.hash)}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        onClick={() => setHomeOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/learn"
              className="text-foreground hover:text-primary transition-colors duration-200 text-sm font-semibold"
            >
              Learn
            </Link>

            <Link
              to="/labs"
              className="text-foreground hover:text-primary transition-colors duration-200 text-sm font-semibold"
            >
              Labs
            </Link>

            <Link
              to="/download"
              className="text-foreground hover:text-primary transition-colors duration-200 text-sm font-semibold"
            >
              Enterprise
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
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-3">
              {/* Home + sections */}
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-foreground font-semibold py-2"
              >
                Home
              </Link>
              <div className="pl-2 -mt-1 mb-1">
                {homeDropdown.map((item) => (
                  <a
                    key={item.name}
                    href={sectionHref(item.hash)}
                    onClick={() => setIsOpen(false)}
                    className="block text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <Link
                to="/learn"
                onClick={() => setIsOpen(false)}
                className="text-foreground font-semibold py-2 border-t border-border/30 pt-3"
              >
                Learn
              </Link>
              <Link
                to="/labs"
                onClick={() => setIsOpen(false)}
                className="text-foreground font-semibold py-2"
              >
                Labs
              </Link>
              <Link
                to="/download"
                onClick={() => setIsOpen(false)}
                className="text-foreground font-semibold py-2"
              >
                Enterprise
              </Link>
              <a
                href="mailto:a.bardhan2004@gmail.com"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm text-center mt-1"
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
