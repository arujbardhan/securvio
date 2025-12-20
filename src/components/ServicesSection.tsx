import { Shield, FileCheck, Workflow, GraduationCap, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Comprehensive security risk assessments that identify vulnerabilities, evaluate threats, and prioritize remediation efforts based on your unique risk profile.",
    link: "#",
  },
  {
    icon: FileCheck,
    title: "Policy & Compliance Guidance",
    description: "Expert guidance on security policies, regulatory compliance (SOC 2, GDPR, HIPAA), and industry standards to keep your organization audit-ready.",
    link: "#",
  },
  {
    icon: Workflow,
    title: "DevSecOps Integration",
    description: "Seamlessly integrate security into your development pipeline with automated scanning, secure coding practices, and continuous monitoring.",
    link: "#devsecops",
  },
  {
    icon: GraduationCap,
    title: "Continuous Security Coaching",
    description: "Ongoing security education and coaching for your team through our AI-powered platform, keeping everyone updated on the latest threats and defenses.",
    link: "#",
  },
];

interface ServicesSectionProps {
  onOpenChat: () => void;
}

const ServicesSection = ({ onOpenChat }: ServicesSectionProps) => {
  return (
    <section id="services" className="section-padding relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From risk assessment to continuous coaching, we provide comprehensive 
            security consulting powered by AI and human expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group glass-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
            >
              <div className="p-4 rounded-xl bg-primary/10 text-primary w-fit mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <service.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-display font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
              
              <a
                href={service.link}
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-3 px-8 py-4 bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/50 rounded-xl font-semibold transition-all duration-300"
          >
            Have a security question? Ask our AI assistant
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
