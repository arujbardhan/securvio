import { Link } from "react-router-dom";
import { GraduationCap, FlaskConical, ShieldCheck, ArrowRight } from "lucide-react";
import ParallaxCard from "./ParallaxCard";

const products = [
  {
    icon: GraduationCap,
    name: "Securvio Learn",
    label: "Education",
    description:
      "Master security terminology and certification material fast with interactive study tools — no accounts, no tracking.",
    features: ["Flashcards & quizzes", "Matching & fill-in-the-blank", "15+ topics: SOC 2, ISO 27001, Zero Trust"],
    to: "/learn",
    cta: "Start learning",
    badge: null as string | null,
  },
  {
    icon: FlaskConical,
    name: "Securvio Labs",
    label: "Hands-on",
    description:
      "Go beyond theory with real-world environments and interactive challenges that mirror how the work actually happens.",
    features: ["Cybersecurity HomeLab writeup", "Interactive SIEM detection challenge", "Architecture, tooling & skills"],
    to: "/labs",
    cta: "Explore labs",
    badge: "New",
  },
  {
    icon: ShieldCheck,
    name: "Securvio Enterprise",
    label: "Toolkit",
    description:
      "The downloadable AI-powered security suite for teams — risk scoring, compliance tracking, and DevSecOps integration.",
    features: ["Pipeline-integrated checks", "Continuous risk dashboards", "Templates & compliance guides"],
    to: "/download",
    cta: "Get the suite",
    badge: null as string | null,
  },
];

const ProductsSection = () => {
  return (
    <section id="platform" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] max-w-full bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-foreground/80">One platform, three ways in</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            The <span className="text-gradient">Securvio</span> Platform
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From quick study tools to hands-on labs to an enterprise-grade toolkit — everything you need to learn,
            practice, and apply security in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ParallaxCard key={product.name} intensity={8}>
              <Link
                to={product.to}
                className="group glass-card p-8 flex flex-col h-full hover:border-primary/50 hover:shadow-glow transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <product.icon className="w-8 h-8" />
                  </div>
                  {product.badge ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border border-primary/40 bg-primary/10 text-primary">
                      {product.badge}
                    </span>
                  ) : (
                    <span className="text-xs uppercase tracking-wider text-muted-foreground/60">{product.label}</span>
                  )}
                </div>

                <h3 className="text-2xl font-display font-semibold mb-3">{product.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{product.description}</p>

                <ul className="space-y-2 mb-8">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                  {product.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
