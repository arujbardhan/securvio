import { GitBranch, Code2, BarChart3, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Pipeline-Integrated Checks",
    description: "Automated security scanning integrated directly into your CI/CD pipeline. Catch vulnerabilities before they reach production.",
    highlights: ["Pre-commit hooks", "PR security reviews", "Deployment gates"],
  },
  {
    icon: Code2,
    title: "AI-Assisted Secure Coding",
    description: "Real-time feedback on your code with AI-powered suggestions for secure patterns and vulnerability remediation.",
    highlights: ["Code analysis", "Fix suggestions", "Best practices"],
  },
  {
    icon: BarChart3,
    title: "Continuous Risk Dashboards",
    description: "Monitor your security posture with real-time dashboards showing vulnerabilities, compliance status, and risk trends.",
    highlights: ["Risk scoring", "Trend analysis", "Compliance tracking"],
  },
];

const DevSecOpsSection = () => {
  return (
    <section id="devsecops" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-sm text-primary mb-6">
              <GitBranch className="w-4 h-4" />
              DevSecOps Integration
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Security Built Into
              <br />
              <span className="text-gradient">Your Workflow</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8">
              Shift security left with our DevSecOps integration. We embed security 
              practices directly into your development lifecycle, making secure 
              development the path of least resistance.
            </p>

            <div className="flex flex-wrap gap-4">
              {["GitHub", "GitLab", "Jenkins", "Azure DevOps"].map((tool) => (
                <span key={tool} className="px-4 py-2 glass-card text-sm text-muted-foreground">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group glass-card p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.highlights.map((highlight) => (
                        <span key={highlight} className="inline-flex items-center gap-1.5 text-xs text-primary">
                          <CheckCircle2 className="w-3 h-3" />
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevSecOpsSection;
