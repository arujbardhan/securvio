import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LabsLayout from "@/components/labs/LabsLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Terminal,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Lightbulb,
} from "lucide-react";

type LogEvent = {
  id: number;
  time: string;
  host: string;
  eventCode: string;
  process: string;
  parent: string;
  user: string;
  path: string;
  cmdline: string;
  malicious?: boolean;
  suspiciousParent?: boolean;
};

const EVENTS: LogEvent[] = [
  {
    id: 1,
    time: "10:14:02",
    host: "DC01",
    eventCode: "4624",
    process: "-",
    parent: "-",
    user: "Administrator",
    path: "-",
    cmdline: "An account was successfully logged on",
  },
  {
    id: 2,
    time: "10:15:11",
    host: "WIN11-CLIENT",
    eventCode: "4688",
    process: "chrome.exe",
    parent: "explorer.exe",
    user: "j.doe",
    path: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    cmdline: "chrome.exe",
  },
  {
    id: 3,
    time: "10:16:45",
    host: "DC01",
    eventCode: "4688",
    process: "svchost.exe",
    parent: "services.exe",
    user: "SYSTEM",
    path: "C:\\Windows\\System32\\svchost.exe",
    cmdline: "svchost.exe -k netsvcs",
  },
  {
    id: 4,
    time: "10:17:03",
    host: "DC01",
    eventCode: "4688",
    process: "spotify.exe",
    parent: "explorer.exe",
    user: "admin",
    path: "C:\\Users\\admin\\Downloads\\spotify.exe",
    cmdline: "spotify.exe",
    suspiciousParent: true,
  },
  {
    id: 5,
    time: "10:17:04",
    host: "DC01",
    eventCode: "4688",
    process: "PING.EXE",
    parent: "spotify.exe",
    user: "admin",
    path: "C:\\Windows\\System32\\PING.EXE",
    cmdline: "ping -t 192.168.1.50",
    malicious: true,
  },
  {
    id: 6,
    time: "10:17:22",
    host: "WIN11-CLIENT",
    eventCode: "4688",
    process: "MsMpEng.exe",
    parent: "services.exe",
    user: "SYSTEM",
    path: "C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\MsMpEng.exe",
    cmdline: "MsMpEng.exe",
  },
  {
    id: 7,
    time: "10:18:09",
    host: "FILE-SRV",
    eventCode: "4672",
    process: "-",
    parent: "-",
    user: "SYSTEM",
    path: "-",
    cmdline: "Special privileges assigned to new logon",
  },
  {
    id: 8,
    time: "10:18:51",
    host: "DC01",
    eventCode: "4688",
    process: "powershell.exe",
    parent: "explorer.exe",
    user: "admin",
    path: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    cmdline: "powershell.exe",
  },
  {
    id: 9,
    time: "10:19:30",
    host: "WIN11-CLIENT",
    eventCode: "4688",
    process: "explorer.exe",
    parent: "userinit.exe",
    user: "j.doe",
    path: "C:\\Windows\\explorer.exe",
    cmdline: "explorer.exe",
  },
  {
    id: 10,
    time: "10:20:12",
    host: "DC01",
    eventCode: "4688",
    process: "lsass.exe",
    parent: "wininit.exe",
    user: "SYSTEM",
    path: "C:\\Windows\\System32\\lsass.exe",
    cmdline: "lsass.exe",
  },
];

const FIELD_MAP: Record<string, keyof LogEvent> = {
  eventcode: "eventCode",
  process: "process",
  parent: "parent",
  host: "host",
  user: "user",
  path: "path",
  cmdline: "cmdline",
  command: "cmdline",
  commandline: "cmdline",
};

function matchEvent(e: LogEvent, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  const tokens = q.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
  return tokens.every((raw) => {
    const tok = raw.replace(/"/g, "");
    const eq = tok.indexOf("=");
    if (eq > 0) {
      const key = tok.slice(0, eq).toLowerCase();
      const val = tok.slice(eq + 1).toLowerCase();
      if (key === "index" || key === "source" || key === "sourcetype") return true;
      const field = FIELD_MAP[key];
      if (!field) return true;
      return String(e[field] ?? "").toLowerCase().includes(val);
    }
    const hay = Object.values(e).join(" ").toLowerCase();
    return hay.includes(tok.toLowerCase());
  });
}

const STEPS = [
  "Identify the event ID",
  "Filter process creation",
  "Find the beaconing process",
  "Trace the parent process",
];

const HINTS: { title: string; hint: string }[] = [
  {
    title: "Step 1 — Identify the event ID",
    hint: "Windows logs a new process under one specific Security event. Logons are 4624 and special privileges are 4672 — you want the one for process creation: Event ID 4688.",
  },
  {
    title: "Step 2 — Filter process creation",
    hint: "In the search bar, type EventCode=4688 and press Run (or tap the suggestion chip). This drops the logon/privilege noise so only launched processes remain.",
  },
  {
    title: "Step 3 — Find the beaconing process",
    hint: "Scan the Command column. A normal host doesn't continuously ping an internal IP. Look for ping -t 192.168.1.50 — that's PING.EXE beaconing to the Raspberry Pi. Click that row.",
  },
  {
    title: "Step 4 — Trace the parent process",
    hint: "Check the Parent column of PING.EXE — it was launched by spotify.exe, which is running from C:\\Users\\admin\\Downloads (not a real install path). Click the spotify.exe row to confirm the malware.",
  },
];

export default function SiemChallenge() {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [ranQuery, setRanQuery] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [eventAnswer, setEventAnswer] = useState<string | null>(null);

  const results = useMemo(
    () => EVENTS.filter((e) => matchEvent(e, ranQuery)),
    [ranQuery]
  );

  const selectable = step === 3 || step === 4;

  const runQuery = () => {
    setRanQuery(query);
    const normalized = query.toLowerCase().replace(/\s+/g, "");
    if (step === 2) {
      if (normalized.includes("eventcode=4688")) {
        setStep(3);
        setFeedback({
          ok: true,
          msg: "Nice — now only process-creation events remain. Spot the one that shouldn't be there.",
        });
      } else {
        setFeedback({
          ok: false,
          msg: "Query ran. To isolate process creation, filter on EventCode=4688.",
        });
      }
    }
  };

  const answerEventId = (code: string) => {
    setEventAnswer(code);
    if (code === "4688") {
      setFeedback({ ok: true, msg: "Correct. Event ID 4688 logs a new process creation." });
      setStep(2);
    } else {
      setFeedback({ ok: false, msg: "Not quite. That ID isn't process creation — try again." });
    }
  };

  const onRowClick = (e: LogEvent) => {
    if (step === 3) {
      if (e.malicious) {
        setFeedback({
          ok: true,
          msg: "Got it — PING.EXE is beaconing to 192.168.1.50 (the Raspberry Pi). Now find what launched it.",
        });
        setStep(4);
      } else {
        setFeedback({ ok: false, msg: `${e.process} is a legitimate process. Keep looking.` });
      }
    } else if (step === 4) {
      if (e.suspiciousParent) {
        setFeedback({
          ok: true,
          msg: "Threat confirmed. spotify.exe (running from Downloads) spawned the ping — that's our malicious binary.",
        });
        setStep(5);
      } else {
        setFeedback({ ok: false, msg: `${e.process} didn't spawn the beacon. Check the parent of PING.EXE.` });
      }
    }
  };

  const reset = () => {
    setStep(1);
    setQuery("");
    setRanQuery("");
    setFeedback(null);
    setEventAnswer(null);
  };

  return (
    <LabsLayout title="SIEM Detection Challenge">
      <Link
        to="/labs/cybersecurity-homelab"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to HomeLab
      </Link>

      <header className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
          <ShieldAlert className="w-3.5 h-3.5" /> Interactive Lab
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">SIEM Detection Challenge</h1>
        <p className="text-muted-foreground">
          A process on <span className="text-foreground/90 font-medium">DC01</span> is beaconing to the lab's
          "threat actor" Raspberry Pi. Investigate the Splunk event logs, write the query, and trace the malware —
          the same workflow from the HomeLab's malware-simulation experiment.
        </p>
      </header>

      {/* Progress */}
      <div className="flex flex-wrap gap-2 mb-8">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                done
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : active
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-border/60 text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{n}</span>}
              {label}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Console */}
        <div className="lg:col-span-2 space-y-5">
          {/* Step 1: event id question */}
          {step === 1 && (
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-1">Step 1 — Which Windows Event ID records process creation?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You'll filter on this to surface every process that launched.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {["4624", "4688", "4672", "1102"].map((code) => {
                  const chosen = eventAnswer === code;
                  const isCorrect = code === "4688";
                  return (
                    <button
                      key={code}
                      onClick={() => answerEventId(code)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                        chosen && isCorrect
                          ? "border-primary bg-primary/10 text-primary"
                          : chosen && !isCorrect
                          ? "border-destructive/60 bg-destructive/10 text-destructive"
                          : "border-border/60 hover:border-primary/50 text-foreground/90"
                      }`}
                    >
                      Event ID {code}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SPL search bar */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <Terminal className="w-4 h-4 text-primary" />
              Splunk Search (SPL)
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 bg-background/60 font-mono text-sm">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runQuery()}
                  placeholder="e.g. EventCode=4688"
                  disabled={step < 2}
                  className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/50 disabled:opacity-50"
                  spellCheck={false}
                />
              </div>
              <button
                onClick={runQuery}
                disabled={step < 2}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-glow hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Run
              </button>
            </div>
            {step < 2 && (
              <p className="text-xs text-muted-foreground/70 mt-2">Complete Step 1 to unlock the search.</p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["EventCode=4688", "process=PING.EXE", "parent=spotify.exe"].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  disabled={step < 2}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono border border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Results table */}
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border/40 text-sm text-muted-foreground flex items-center justify-between">
              <span>{ranQuery ? `Results for: ` : "All events"}{ranQuery && <code className="text-primary font-mono">{ranQuery}</code>}</span>
              <span>{results.length} events</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border/40">
                    <th className="px-4 py-2 font-medium">Time</th>
                    <th className="px-4 py-2 font-medium">Host</th>
                    <th className="px-4 py-2 font-medium">EventCode</th>
                    <th className="px-4 py-2 font-medium">Process</th>
                    <th className="px-4 py-2 font-medium">Parent</th>
                    <th className="px-4 py-2 font-medium">Command</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => selectable && onRowClick(e)}
                      className={`border-b border-border/20 transition-colors ${
                        selectable ? "cursor-pointer hover:bg-primary/10" : ""
                      }`}
                    >
                      <td className="px-4 py-2 font-mono text-muted-foreground">{e.time}</td>
                      <td className="px-4 py-2 font-mono">{e.host}</td>
                      <td className="px-4 py-2 font-mono">{e.eventCode}</td>
                      <td className="px-4 py-2 font-mono font-semibold text-foreground/90">{e.process}</td>
                      <td className="px-4 py-2 font-mono text-muted-foreground">{e.parent}</td>
                      <td className="px-4 py-2 font-mono text-muted-foreground max-w-[220px] truncate" title={e.cmdline}>
                        {e.cmdline}
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                        No events match that query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {selectable && (
              <div className="px-5 py-3 border-t border-border/40 text-xs text-primary">
                {step === 3
                  ? "Click the process that is beaconing to the attacker."
                  : "Click the parent process that spawned the beacon."}
              </div>
            )}
          </div>
        </div>

        {/* Mission panel */}
        <div className="space-y-5">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Mission</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
                    <Lightbulb className="w-3.5 h-3.5" /> Hints?
                  </button>
                </DialogTrigger>
                <DialogContent className="glass-card border-border/60 max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-primary" /> Step-by-step hints
                    </DialogTitle>
                    <DialogDescription>
                      Stuck? Reveal as much as you need — your current step is highlighted.
                    </DialogDescription>
                  </DialogHeader>
                  <ol className="space-y-3 mt-2">
                    {HINTS.map((h, i) => {
                      const isCurrent = step === i + 1;
                      const isDone = step > i + 1;
                      return (
                        <li
                          key={h.title}
                          className={`rounded-lg border p-3 transition-colors ${
                            isCurrent
                              ? "border-primary/60 bg-primary/10"
                              : "border-border/50 bg-secondary/30"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`shrink-0 w-5 h-5 rounded-md text-[11px] font-semibold flex items-center justify-center ${
                                isDone || isCurrent
                                  ? "bg-primary/20 border border-primary/40 text-primary"
                                  : "bg-secondary/60 border border-border/60 text-muted-foreground"
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                            </span>
                            <span className="text-sm font-medium text-foreground/90">{h.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed pl-7">{h.hint}</p>
                        </li>
                      );
                    })}
                  </ol>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground">
              {step === 1 && "Identify the event ID used for process-creation logging."}
              {step === 2 && "Run a search that isolates process-creation events."}
              {step === 3 && "Find the process making suspicious network calls."}
              {step === 4 && "Trace it back to the malicious parent binary."}
              {step >= 5 && "Investigation complete."}
            </p>
          </div>

          {feedback && (
            <div
              className={`glass-card p-4 flex items-start gap-3 text-sm ${
                feedback.ok ? "border-primary/50" : "border-destructive/50"
              }`}
            >
              {feedback.ok ? (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              )}
              <span className="text-foreground/90">{feedback.msg}</span>
            </div>
          )}

          {step >= 5 && (
            <div className="glass-card p-6 text-center shadow-glow">
              <Trophy className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">Threat neutralized</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You traced <code className="font-mono text-primary">PING.EXE</code> back to{" "}
                <code className="font-mono text-primary">spotify.exe</code> — exactly the detection performed in
                the HomeLab using Splunk SPL and Event Code 4688.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border/60 text-sm font-medium hover:border-primary/50 transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Replay
                </button>
                <Link
                  to="/labs/cybersecurity-homelab"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-glow hover:bg-primary/90 transition-all"
                >
                  Read the full writeup
                </Link>
              </div>
            </div>
          )}

          {step < 5 && (
            <button
              onClick={reset}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          )}
        </div>
      </div>
    </LabsLayout>
  );
}
