import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import LearnLayout from "@/components/learn/LearnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Lesson { id: string; title: string; content: string | null; position: number; module_id: string; }
interface Module { id: string; title: string; position: number; lessons: Lesson[]; }

const LessonPlayer = () => {
  const { slug, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState<string>("");
  const [courseTitle, setCourseTitle] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!slug || !user) return;
    setLoading(true);
    const { data: c } = await supabase.from("courses").select("id,title").eq("slug", slug).maybeSingle();
    if (!c) { setLoading(false); return; }
    setCourseId(c.id);
    setCourseTitle(c.title);

    const { data: mods } = await supabase
      .from("modules")
      .select("id,title,position,lessons(id,title,content,position,module_id)")
      .eq("course_id", c.id)
      .order("position");
    const sorted = (mods ?? []).map((m: any) => ({
      ...m,
      lessons: (m.lessons ?? []).sort((a: any, b: any) => a.position - b.position),
    })) as Module[];
    setModules(sorted);

    const lessonIds = sorted.flatMap((m) => m.lessons.map((l) => l.id));
    if (lessonIds.length) {
      const { data: prog } = await supabase
        .from("lesson_progress").select("lesson_id")
        .eq("user_id", user.id).in("lesson_id", lessonIds);
      setCompleted(new Set((prog ?? []).map((p: any) => p.lesson_id)));
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [slug, user]);

  const flat: Lesson[] = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const idx = flat.findIndex((l) => l.id === lessonId);
  const lesson = idx >= 0 ? flat[idx] : null;
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  const markComplete = async () => {
    if (!user || !lesson) return;
    if (completed.has(lesson.id)) return;
    const { error } = await supabase.from("lesson_progress").insert({ user_id: user.id, lesson_id: lesson.id });
    if (error && !error.message.includes("duplicate")) return toast.error(error.message);
    setCompleted((s) => new Set(s).add(lesson.id));
    toast.success("Lesson completed");
  };

  if (loading) return <LearnLayout><div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></LearnLayout>;
  if (!lesson) return <LearnLayout><div className="container mx-auto px-4">Lesson not found.</div></LearnLayout>;

  return (
    <LearnLayout>
      <Helmet><title>{lesson.title} | {courseTitle}</title></Helmet>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <Link to={`/learn/courses/${slug}`} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ChevronLeft className="h-3 w-3" /> Course overview
            </Link>
            <div>
              <h2 className="text-sm font-semibold mb-3">{courseTitle}</h2>
              <div className="space-y-4">
                {modules.map((m) => (
                  <div key={m.id}>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{m.title}</div>
                    <div className="space-y-0.5">
                      {m.lessons.map((l) => {
                        const isActive = l.id === lesson.id;
                        const done = completed.has(l.id);
                        return (
                          <Link
                            key={l.id}
                            to={`/learn/courses/${slug}/lessons/${l.id}`}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                              isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                          >
                            {done ? <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> : <Circle className="h-3.5 w-3.5 shrink-0" />}
                            <span className="truncate">{l.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Content */}
          <div>
            <Card>
              <CardContent className="p-6 md:p-10">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">{lesson.title}</h1>
                <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {lesson.content || "No content yet."}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mt-6 gap-3">
              <Button
                variant="outline"
                disabled={!prev}
                onClick={() => prev && navigate(`/learn/courses/${slug}/lessons/${prev.id}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>

              <Button variant={completed.has(lesson.id) ? "secondary" : "default"} onClick={markComplete}>
                {completed.has(lesson.id) ? "Completed" : "Mark complete"}
              </Button>

              <Button
                disabled={!next}
                onClick={() => next && navigate(`/learn/courses/${slug}/lessons/${next.id}`)}
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LearnLayout>
  );
};

export default LessonPlayer;
