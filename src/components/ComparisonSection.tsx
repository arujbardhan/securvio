import { useEffect, useState, useRef } from "react";
import { TrendingUp, Shield, Zap, Clock } from "lucide-react";

interface CompetitorData {
  name: string;
  logo: string;
  color: string;
  scores: {
    accuracy: number;
    speed: number;
    coverage: number;
    value: number;
  };
}

const competitors: CompetitorData[] = [
  {
    name: "Securvio",
    logo: "S",
    color: "hsl(var(--primary))",
    scores: { accuracy: 98, speed: 95, coverage: 92, value: 96 },
  },
  {
    name: "Hawk.ai",
    logo: "H",
    color: "#6366f1",
    scores: { accuracy: 82, speed: 78, coverage: 75, value: 70 },
  },
  {
    name: "Reco.ai",
    logo: "R",
    color: "#22c55e",
    scores: { accuracy: 76, speed: 85, coverage: 68, value: 72 },
  },
  {
    name: "Abnormal.ai",
    logo: "A",
    color: "#f97316",
    scores: { accuracy: 84, speed: 72, coverage: 80, value: 65 },
  },
];

const metrics = [
  { key: "accuracy", label: "Detection Accuracy", icon: Shield },
  { key: "speed", label: "Response Speed", icon: Zap },
  { key: "coverage", label: "Threat Coverage", icon: TrendingUp },
  { key: "value", label: "Cost Efficiency", icon: Clock },
];

const AnimatedBar = ({ 
  value, 
  color, 
  delay,
  isVisible 
}: { 
  value: number; 
  color: string; 
  delay: number;
  isVisible: boolean;
}) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setWidth(value);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setWidth(0);
    }
  }, [value, delay, isVisible]);

  return (
    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${width}%`, 
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}40`
        }}
      />
    </div>
  );
};

const CompetitorLogo = ({ competitor }: { competitor: CompetitorData }) => (
  <div 
    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
    style={{ 
      backgroundColor: `${competitor.color}20`,
      color: competitor.color,
      border: `1px solid ${competitor.color}40`
    }}
  >
    {competitor.logo}
  </div>
);

const ComparisonSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="comparison" 
      className="py-24 relative overflow-hidden"
    >
      {/* Tech Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Market Comparison</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How We <span className="text-gradient">Stack Up</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how Securvio outperforms leading security platforms across key metrics
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="max-w-5xl mx-auto">
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {competitors.map((competitor) => (
              <div 
                key={competitor.name}
                className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-2"
              >
                <CompetitorLogo competitor={competitor} />
                <span className="font-medium text-sm">{competitor.name}</span>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid gap-8">
            {metrics.map((metric, metricIndex) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={metric.key}
                  className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg">{metric.label}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {competitors.map((competitor, index) => (
                      <div key={competitor.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: competitor.color }}
                            />
                            <span className="text-sm text-muted-foreground">{competitor.name}</span>
                          </div>
                          <span 
                            className="text-sm font-semibold"
                            style={{ color: competitor.color }}
                          >
                            {competitor.scores[metric.key as keyof typeof competitor.scores]}%
                          </span>
                        </div>
                        <AnimatedBar 
                          value={competitor.scores[metric.key as keyof typeof competitor.scores]}
                          color={competitor.color}
                          delay={metricIndex * 200 + index * 100}
                          isVisible={isVisible}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">23%</div>
              <p className="text-sm text-muted-foreground">Higher accuracy than competitors</p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">2.5x</div>
              <p className="text-sm text-muted-foreground">Faster threat detection</p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <p className="text-sm text-muted-foreground">More cost effective</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
