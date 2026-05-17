import { useEffect, useMemo, useState } from "react";
import LearnLayout from "@/components/learn/LearnLayout";
import { MCQS, CATEGORIES, Category } from "@/data/learn";
import { Check, X, RotateCcw } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND = 10;

export default function Quiz() {
  const [category, setCategory] = useState<Category | "All">("All");
  const [seed, setSeed] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [submittedIdx, setSubmittedIdx] = useState<Record<number, boolean>>({});

  const pool = useMemo(
    () => (category === "All" ? MCQS : MCQS.filter((q) => q.category === category)),
    [category]
  );

  const questions = useMemo(() => {
    return shuffle(pool).slice(0, ROUND).map((q) => {
      const indices = shuffle(q.choices.map((_, i) => i));
      return {
        ...q,
        displayChoices: indices.map((i) => q.choices[i]),
        correctDisplay: indices.indexOf(q.answerIndex),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, seed]);

  useEffect(() => {
    setPicked({});
    setSubmittedIdx({});
  }, [questions]);

  const score = Object.entries(submittedIdx).reduce((acc, [i]) => {
    const qi = Number(i);
    return picked[qi] === questions[qi]?.correctDisplay ? acc + 1 : acc;
  }, 0);

  const total = questions.length;
  const allAnswered = Object.keys(submittedIdx).length === total && total > 0;

  return (
    <LearnLayout title="Quiz">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Multiple Choice Quiz</h1>
      <p className="text-muted-foreground mb-6">{ROUND} randomized questions. Instant feedback after each.</p>

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
          <RotateCcw className="w-4 h-4" /> New quiz
        </button>
        <span className="ml-auto text-sm">
          <span className="text-muted-foreground">Score: </span>
          <span className="font-semibold text-foreground">{score}/{total}</span>
        </span>
      </div>

      {allAnswered && (
        <div className="glass-card p-5 mb-6 border-primary/50 animate-fade-in">
          <p className="font-medium">You scored {score}/{total} ({Math.round((score / total) * 100)}%).</p>
        </div>
      )}

      <div className="space-y-5">
        {questions.map((q, qi) => {
          const choiceIdx = picked[qi];
          const submitted = submittedIdx[qi];
          return (
            <div key={q.id} className="glass-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-base md:text-lg font-medium">{qi + 1}. {q.question}</h3>
                <span className="text-xs text-primary whitespace-nowrap">{q.category}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.displayChoices.map((c, ci) => {
                  const isPicked = choiceIdx === ci;
                  const isCorrect = q.correctDisplay === ci;
                  let cls = "border-border hover:border-primary/60 bg-card/50";
                  if (submitted) {
                    if (isCorrect) cls = "border-primary bg-primary/15";
                    else if (isPicked) cls = "border-destructive bg-destructive/10";
                    else cls = "border-border/40 opacity-60";
                  } else if (isPicked) {
                    cls = "border-primary bg-primary/10";
                  }
                  return (
                    <button
                      key={ci}
                      disabled={submitted}
                      onClick={() => setPicked((p) => ({ ...p, [qi]: ci }))}
                      className={`text-left p-3 rounded-lg border transition-all flex items-start gap-2 ${cls}`}
                    >
                      <span className="flex-1">{c}</span>
                      {submitted && isCorrect && <Check className="w-4 h-4 text-primary mt-0.5" />}
                      {submitted && isPicked && !isCorrect && <X className="w-4 h-4 text-destructive mt-0.5" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {submitted && q.explanation ? q.explanation : ""}
                </p>
                {!submitted && (
                  <button
                    disabled={choiceIdx === undefined}
                    onClick={() => setSubmittedIdx((s) => ({ ...s, [qi]: true }))}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 shadow-glow"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </LearnLayout>
  );
}
