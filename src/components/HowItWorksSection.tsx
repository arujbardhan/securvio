import { Brain, Database, ShieldCheck, FileText } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Brain,
    title: "LLM-Based Advice",
    description: "Our AI understands complex security questions and provides contextual, expert-level guidance tailored to your specific situation.",
  },
  {
    number: "02",
    icon: Database,
    title: "Knowledge Retrieval",
    description: "Pulls from our curated security knowledge base including frameworks, best practices, and real-world case studies.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Guardrails & Validation",
    description: "Built-in safety checks ensure recommendations are accurate, up-to-date, and aligned with industry standards.",
  },
  {
    number: "04",
    icon: FileText,
    title: "Templates & Checklists",
    description: "Get actionable templates, security checklists, and implementation guides you can use immediately.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            How <span className="text-gradient">Securvio</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powered by advanced AI, our chatbot delivers instant security expertise through a carefully engineered system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group glass-card p-6 hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="text-4xl font-display font-bold text-border/50 group-hover:text-primary/30 transition-colors">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
