import { Link, useParams } from "react-router-dom";
import LabsLayout from "@/components/labs/LabsLayout";
import { getLab } from "@/data/labs";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  CheckCircle2,
  Brain,
  Layers,
  Info,
  ListChecks,
  Cpu,
  ShieldAlert,
} from "lucide-react";

export default function LabDetail() {
  const { slug } = useParams<{ slug: string }>();
  const lab = slug ? getLab(slug) : undefined;

  if (!lab) {
    return (
      <LabsLayout title="Lab not found">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-3">Lab not found</h1>
          <p className="text-muted-foreground mb-6">
            That lab doesn't exist (yet). Head back to the overview to see what's available.
          </p>
          <Link
            to="/labs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm shadow-glow"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Labs
          </Link>
        </div>
      </LabsLayout>
    );
  }

  return (
    <LabsLayout title={lab.title} description={lab.summary}>
      <Link
        to="/labs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> All labs
      </Link>

      {/* Hero */}
      <header className="mb-14 max-w-3xl animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {lab.status === "completed" ? "Completed" : "In progress"}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{lab.title}</h1>
        <p className="text-lg text-muted-foreground mb-6">{lab.summary}</p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={lab.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm shadow-glow hover:bg-primary/90 transition-all"
          >
            <Github className="w-4 h-4" /> Full documentation
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={lab.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 font-medium text-sm transition-all"
          >
            Built by {lab.author.name}
          </a>
        </div>
      </header>

      {/* Architecture */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold">Architecture</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lab.architecture.map((tier, i) => (
            <div
              key={tier.label}
              className="glass-card p-5 flex flex-col animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mb-4">
                <tier.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold mb-3">{tier.label}</h3>
              <ul className="space-y-1.5 mt-auto">
                {tier.items.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Hardware */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold">Hardware</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {lab.hardware.map((hw) => (
            <div key={hw} className="glass-card p-4 text-sm text-foreground/90">
              {hw}
            </div>
          ))}
        </div>
      </section>

      {/* Performed tasks */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <ListChecks className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold">Performed tasks</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {lab.tasks.map((task, i) => (
            <div
              key={task}
              className="glass-card p-4 flex items-start gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="shrink-0 w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-semibold flex items-center justify-center">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-foreground/90">{task}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlight */}
      {lab.highlight && (
        <section className="mb-16">
          <div className="glass-card p-6 md:p-8 shadow-glow">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Featured experiment</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">{lab.highlight.title}</h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mb-5">{lab.highlight.body}</p>
            <Link
              to="/labs/siem-detection"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm shadow-glow hover:bg-primary/90 transition-all"
            >
              <ShieldAlert className="w-4 h-4" /> Try the interactive challenge
            </Link>
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold">Skills applied</h2>
        </div>
        <p className="text-muted-foreground mb-6 max-w-3xl">{lab.skillsIntro}</p>
        <div className="flex flex-wrap gap-2">
          {lab.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full text-sm border border-primary/30 bg-primary/10 text-foreground/90"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-5">Tech stack</h2>
        <div className="flex flex-wrap gap-2">
          {lab.stack.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-full text-xs border border-border/60 bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Important / documentation callout */}
      <section className="mb-16">
        <div className="glass-card border-l-4 border-l-primary p-6 md:p-7">
          <div className="flex items-center gap-2 mb-3 text-primary">
            <Info className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Important</span>
          </div>
          <p className="text-foreground/90 mb-4">
            Full documentation — including every configuration, screenshot, and step — is available on GitHub.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-3">
            <a
              href={lab.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" /> View document
            </a>
            <span className="text-muted-foreground">
              Author: <span className="font-medium text-foreground/90">{lab.author.name}</span>{" "}
              <a
                href={lab.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {lab.author.handle}
              </a>
              {lab.author.site && (
                <>
                  {" · "}
                  <a
                    href={lab.author.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {lab.author.site.replace(/^https?:\/\//, "")}
                  </a>
                </>
              )}
            </span>
          </div>
          {lab.basedOn && (
            <p className="text-xs text-muted-foreground/80 border-t border-border/40 pt-3">
              Rebuilt and adapted from the original project by{" "}
              <span className="text-foreground/80">{lab.basedOn.name}</span>{" "}
              <a
                href={lab.basedOn.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/90 hover:underline"
              >
                {lab.basedOn.handle}
              </a>
              {lab.basedOn.site && (
                <>
                  {" · "}
                  <a
                    href={lab.basedOn.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/90 hover:underline"
                  >
                    {lab.basedOn.site.replace(/^https?:\/\//, "")}
                  </a>
                </>
              )}
              .
            </p>
          )}
        </div>
      </section>
    </LabsLayout>
  );
}
