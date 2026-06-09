import { Link } from "react-router-dom";
import LabsLayout from "@/components/labs/LabsLayout";
import { FlaskConical, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { LABS } from "@/data/labs";

export default function Hub() {
  return (
    <LabsLayout title="Labs">
      <header className="mb-12 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
          <FlaskConical className="w-3.5 h-3.5" /> Securvio Labs
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Security, <span className="text-gradient">hands-on</span>.
        </h1>
        <p className="text-lg text-muted-foreground">
          Real-world environments built, broken, monitored, and defended end-to-end. Each lab walks through the
          architecture, the tooling, and the skills it exercises — the way the work actually happens.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-5 mb-16">
        {LABS.map((lab, i) => (
          <Link
            key={lab.slug}
            to={`/labs/${lab.slug}`}
            className="group glass-card p-6 md:p-7 hover:border-primary/60 transition-all hover:shadow-glow animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <FlaskConical className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-primary">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lab.status === "completed" ? "Completed" : "In progress"}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-1">{lab.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{lab.tagline}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {lab.stack.slice(0, 5).map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full text-[11px] border border-border/60 bg-secondary/50 text-muted-foreground"
                >
                  {s}
                </span>
              ))}
              {lab.stack.length > 5 && (
                <span className="px-2.5 py-1 rounded-full text-[11px] border border-border/60 bg-secondary/50 text-muted-foreground">
                  +{lab.stack.length - 5} more
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              View lab <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}

        <Link
          to="/labs/siem-detection"
          className="group glass-card p-6 md:p-7 hover:border-primary/60 transition-all hover:shadow-glow animate-fade-up"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-primary">Interactive</span>
          </div>
          <h3 className="text-xl font-semibold mb-1">SIEM Detection Challenge</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Investigate Splunk event logs, write the query, and trace the simulated malware back to its source.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
            Start challenge <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </section>
    </LabsLayout>
  );
}
