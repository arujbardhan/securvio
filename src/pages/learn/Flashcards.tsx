import { useEffect, useMemo, useState, useCallback } from "react";
import LearnLayout from "@/components/learn/LearnLayout";
import { FLASHCARDS, CATEGORIES, Category } from "@/data/learn";
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards() {
  const [category, setCategory] = useState<Category | "All">("All");
  const [order, setOrder] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filtered = useMemo(
    () => (category === "All" ? FLASHCARDS : FLASHCARDS.filter((f) => f.category === category)),
    [category]
  );

  useEffect(() => {
    setOrder(filtered.map((_, i) => i));
    setIndex(0);
    setFlipped(false);
  }, [filtered]);

  const card = filtered[order[index]] ?? filtered[0];

  const next = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
  }, [filtered.length]);

  const prev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
  }, [filtered.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <LearnLayout title="Flashcards">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Flashcards</h1>
      <p className="text-muted-foreground mb-6">Click the card or press Space to flip. Use ← → to navigate.</p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "All")}
          className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={() => { setOrder(shuffle(order)); setIndex(0); setFlipped(false); }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/60 text-sm"
        >
          <Shuffle className="w-4 h-4" /> Shuffle
        </button>
        <button
          onClick={() => { setOrder(filtered.map((_, i) => i)); setIndex(0); setFlipped(false); }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/60 text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <span className="ml-auto text-sm text-muted-foreground">{filtered.length ? `${index + 1} / ${filtered.length}` : "0 / 0"}</span>
      </div>

      {card && (
        <div className="max-w-3xl mx-auto">
          <div
            className="relative w-full h-72 md:h-96 cursor-pointer [perspective:1200px]"
            onClick={() => setFlipped((f) => !f)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
            >
              <div className="absolute inset-0 glass-card flex flex-col items-center justify-center p-8 text-center [backface-visibility:hidden]">
                <span className="text-xs uppercase tracking-wider text-primary mb-3">{card.category}</span>
                <h2 className="text-3xl md:text-5xl font-bold">{card.term}</h2>
                <span className="absolute bottom-4 text-xs text-muted-foreground">Click to reveal answer</span>
              </div>
              <div className="absolute inset-0 glass-card flex flex-col items-center justify-center p-8 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] border-primary/40">
                <span className="text-xs uppercase tracking-wider text-primary mb-3">Definition</span>
                <p className="text-lg md:text-2xl leading-relaxed">{card.definition}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={prev} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/60">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button onClick={() => setFlipped((f) => !f)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-glow">
              {flipped ? "Hide answer" : "Reveal answer"}
            </button>
            <button onClick={next} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/60">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </LearnLayout>
  );
}
