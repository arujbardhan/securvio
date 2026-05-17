import { Link } from "react-router-dom";
import LearnLayout from "@/components/learn/LearnLayout";
import { Layers, Shuffle, ListChecks, Type, Sparkles } from "lucide-react";
import { CATEGORIES, FLASHCARDS, MCQS, MATCH_PAIRS, FILL_BLANKS } from "@/data/learn";

const modes = [
  { to: "/learn/flashcards", title: "Study Flashcards", desc: "Flip cards to learn key cybersecurity terminology fast.", icon: Layers, count: FLASHCARDS.length },
  { to: "/learn/matching", title: "Start Matching", desc: "Drag terms onto definitions. Race against the clock.", icon: Shuffle, count: MATCH_PAIRS.length },
  { to: "/learn/quiz", title: "Take Quiz", desc: "Multiple choice with instant feedback and explanations.", icon: ListChecks, count: MCQS.length },
  { to: "/learn/fill-blank", title: "Fill in the Blank", desc: "Complete real consulting terminology and definitions.", icon: Type, count: FILL_BLANKS.length },
];

export default function Hub() {
  return (
    <LearnLayout title="Learn">
      <header className="mb-12 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Securvio Learn
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          <span className="text-gradient">Cybersecurity</span>, the fast way.
        </h1>
        <p className="text-lg text-muted-foreground">
          Quick-study tools covering HIPAA, SOC 2, ISO 27001, Zero Trust, incident response, and more. No accounts, no tracking — just learn.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-5 mb-16">
        {modes.map((m, i) => (
          <Link
            key={m.to}
            to={m.to}
            className="group glass-card p-6 md:p-7 hover:border-primary/60 transition-all hover:shadow-glow animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <m.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-muted-foreground">{m.count} items</span>
            </div>
            <h3 className="text-xl font-semibold mb-1">{m.title}</h3>
            <p className="text-sm text-muted-foreground">{m.desc}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-5">Topics covered</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <span key={c} className="px-3 py-1.5 rounded-full text-xs border border-border/60 bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
              {c}
            </span>
          ))}
        </div>
      </section>
    </LearnLayout>
  );
}
