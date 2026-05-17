import { useEffect, useMemo, useState } from "react";
import LearnLayout from "@/components/learn/LearnLayout";
import { FILL_BLANKS, CATEGORIES, Category } from "@/data/learn";
import { Check, X, Lightbulb, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function FillBlank() {
  const [category, setCategory] = useState<Category | "All">("All");
  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const items = useMemo(() => {
    const pool = category === "All" ? FILL_BLANKS : FILL_BLANKS.filter((f) => f.category === category);
    return shuffle(pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, seed]);

  useEffect(() => {
    setIndex(0);
    setValue("");
    setStatus("idle");
    setShowHint(false);
    setScore({ correct: 0, total: 0 });
  }, [items]);

  const item = items[index];

  const check = () => {
    if (!item || status !== "idle") return;
    const accepted = [item.answer, ...(item.acceptable ?? [])].map(normalize);
    const ok = accepted.includes(normalize(value));
    setStatus(ok ? "correct" : "wrong");
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setIndex((i) => Math.min(i + 1, items.length - 1));
    setValue("");
    setStatus("idle");
    setShowHint(false);
  };
  const prev = () => {
    setIndex((i) => Math.max(i - 1, 0));
    setValue("");
    setStatus("idle");
    setShowHint(false);
  };

  if (!item) return <LearnLayout title="Fill in the Blank"><p>No items.</p></LearnLayout>;

  const prompt = item.prompt.split("___");

  return (
    <LearnLayout title="Fill in the Blank">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Fill in the Blank</h1>
      <p className="text-muted-foreground mb-6">Type the missing word. Press Enter to check.</p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "All")}
          className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/60 text-sm"
        >
          <RotateCcw className="w-4 h-4" /> New set
        </button>
        <span className="ml-auto text-sm">
          <span className="text-muted-foreground">Score: </span>
          <span className="font-semibold">{score.correct}/{score.total}</span>
          <span className="text-muted-foreground"> · {index + 1}/{items.length}</span>
        </span>
      </div>

      <div className="glass-card p-6 md:p-10 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-wider text-primary">{item.category}</span>
        <p className="mt-3 text-xl md:text-2xl leading-relaxed">
          {prompt[0]}
          <input
            autoFocus
            value={value}
            onChange={(e) => { setValue(e.target.value); setStatus("idle"); }}
            onKeyDown={(e) => { if (e.key === "Enter") check(); }}
            placeholder="answer"
            className={`mx-2 inline-block min-w-[8ch] bg-transparent border-b-2 outline-none text-center px-2 py-1 transition-colors ${
              status === "correct" ? "border-primary text-primary"
              : status === "wrong" ? "border-destructive text-destructive"
              : "border-primary/60 focus:border-primary"
            }`}
            style={{ width: `${Math.max(value.length + 2, 8)}ch` }}
          />
          {prompt[1]}
        </p>

        {showHint && item.hint && (
          <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" /> {item.hint}
          </p>
        )}

        {status === "correct" && (
          <p className="mt-4 inline-flex items-center gap-2 text-primary text-sm animate-fade-in">
            <Check className="w-4 h-4" /> Correct!
          </p>
        )}
        {status === "wrong" && (
          <p className="mt-4 inline-flex items-center gap-2 text-destructive text-sm animate-fade-in">
            <X className="w-4 h-4" /> Not quite. Answer: <span className="font-semibold">{item.answer}</span>
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button onClick={prev} disabled={index === 0} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/60 disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <div className="flex items-center gap-2">
            {item.hint && (
              <button onClick={() => setShowHint((h) => !h)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/60 text-sm">
                <Lightbulb className="w-4 h-4" /> Hint
              </button>
            )}
            {status === "idle" ? (
              <button onClick={check} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-glow">Check</button>
            ) : (
              <button onClick={next} disabled={index === items.length - 1} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-glow disabled:opacity-40">Next</button>
            )}
          </div>
          <button onClick={next} disabled={index === items.length - 1} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/60 disabled:opacity-40">
            Skip <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </LearnLayout>
  );
}
