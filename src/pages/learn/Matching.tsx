import { useEffect, useMemo, useState } from "react";
import LearnLayout from "@/components/learn/LearnLayout";
import { MATCH_PAIRS, CATEGORIES, Category } from "@/data/learn";
import { Timer, RotateCcw, Check, X } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND_SIZE = 6;

export default function Matching() {
  const [category, setCategory] = useState<Category | "All">("All");
  const [timed, setTimed] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);

  const pool = useMemo(
    () => (category === "All" ? MATCH_PAIRS : MATCH_PAIRS.filter((p) => p.category === category)),
    [category]
  );

  const pairs = useMemo(() => shuffle(pool).slice(0, ROUND_SIZE), [pool, round]);
  const lefts = useMemo(() => shuffle(pairs), [pairs]);
  const rights = useMemo(() => shuffle(pairs), [pairs]);

  useEffect(() => {
    setMatched(new Set());
    setSelectedLeft(null);
    setElapsed(0);
    setAttempts(0);
    setCorrect(0);
    setRunning(true);
  }, [round, category]);

  useEffect(() => {
    if (!running || !timed) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running, timed]);

  useEffect(() => {
    if (pairs.length && matched.size === pairs.length) setRunning(false);
  }, [matched, pairs.length]);

  const onPickRight = (rightId: string) => {
    if (!selectedLeft || matched.has(selectedLeft)) return;
    setAttempts((a) => a + 1);
    if (selectedLeft === rightId) {
      setMatched((s) => new Set(s).add(selectedLeft));
      setCorrect((c) => c + 1);
      setSelectedLeft(null);
    } else {
      setWrong(rightId);
      setTimeout(() => setWrong(null), 400);
    }
  };

  const done = pairs.length > 0 && matched.size === pairs.length;

  return (
    <LearnLayout title="Matching">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Matching</h1>
      <p className="text-muted-foreground mb-6">Pick a term, then click its matching definition. Instant feedback.</p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "All")}
          className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} /> Timed
        </label>
        {timed && (
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm">
            <Timer className="w-4 h-4 text-primary" /> {elapsed}s
          </span>
        )}
        <button
          onClick={() => setRound((r) => r + 1)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/60 text-sm"
        >
          <RotateCcw className="w-4 h-4" /> New round
        </button>
        <span className="ml-auto text-sm text-muted-foreground">
          {correct}/{pairs.length} matched · {attempts} attempts
        </span>
      </div>

      {done && (
        <div className="glass-card p-5 mb-6 border-primary/50 animate-fade-in">
          <p className="font-medium">Round complete! {correct}/{pairs.length} matched in {elapsed}s with {attempts} attempts.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Terms</h3>
          {lefts.map((p) => {
            const isMatched = matched.has(p.id);
            const isSelected = selectedLeft === p.id;
            return (
              <button
                key={p.id}
                disabled={isMatched}
                onClick={() => setSelectedLeft(p.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isMatched
                    ? "border-primary/40 bg-primary/10 opacity-60 line-through"
                    : isSelected
                    ? "border-primary bg-primary/15 shadow-glow"
                    : "border-border hover:border-primary/60 bg-card/50"
                }`}
              >
                {p.left}
              </button>
            );
          })}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Definitions</h3>
          {rights.map((p) => {
            const isMatched = matched.has(p.id);
            const isWrong = wrong === p.id;
            return (
              <button
                key={p.id}
                disabled={isMatched}
                onClick={() => onPickRight(p.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3 ${
                  isMatched
                    ? "border-primary/40 bg-primary/10 opacity-60"
                    : isWrong
                    ? "border-destructive bg-destructive/10 animate-fade-in"
                    : "border-border hover:border-primary/60 bg-card/50"
                }`}
              >
                <span className="flex-1">{p.right}</span>
                {isMatched && <Check className="w-4 h-4 text-primary mt-0.5" />}
                {isWrong && <X className="w-4 h-4 text-destructive mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </LearnLayout>
  );
}
