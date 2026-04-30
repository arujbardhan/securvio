import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import LearnLayout from "@/components/learn/LearnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { toast } from "sonner";

interface Module {
  id: string;
  title: string;
  position: number;
  lessons: { id: string; title: string; position: number }[];
}
interface Course {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  category: string;
  slug: string;
}

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!slug || !user) return;
    setLoading(true);
    const { data: c } = await supabase
      .from("courses")
      .select("id,title,description,difficulty,category,slug")
      .eq("slug", slug)
      .maybeSingle();
    if (!c) {
      setLoading(false);
      return;
    }
    setCourse(c as Course);

    const { data: mods } = await supabase
      .from("modules")
      .select("id,title,position,lessons(id,title,position)")
      .eq("course_id", c.id)
      .order("position");
    const sorted = (mods ?? []).map((m: any) => ({
      ...m,
      lessons: (m.lessons ?? []).sort((a: any, b: any) => a.position - b.position),
    })) as Module[];
    setModules(sorted);

    const { data: enr } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", c.id)
      .maybeSingle();
    setEnrolled(!!enr);

    const lessonIds = sorted.flatMap((m) => m.lessons.map((l) => l.id));
    if (lessonIds.length > 0) {
      const { data: prog } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds);
      setCompleted(new Set((prog ?? []).map((p: any) => p.lesson_id)));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user]);

  const handleEnroll = async () => {
    if (!user || !course) return;
    const { error } = await supabase.from("enrollments").insert({ user_id: user.id, course_id: course.id });
    if (error) return toast.error(error.message);
    toast.success("Enrolled");
    setEnrolled(true);
  };

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const firstLessonId = modules.find((m) => m.lessons.length)?.lessons[0]?.id;

  if (loading) {
    return (
      <LearnLayout>
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      </LearnLayout>
    );
  }
  if (!course) {
    return <LearnLayout><div className="container mx-auto px-4">Course not found.</div></LearnLayout>;
  }

  return (
    <LearnLayout>
      <Helmet>
        <title>{course.title} | Securvio Learn</title>
        <meta name="description" content={course.description ?? `Learn ${course.title}`} />
      </Helmet>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="capitalize">{course.difficulty}</Badge>
            <Badge variant="outline">{course.category}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground mt-3 text-lg">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {!enrolled ? (
              <Button onClick={handleEnroll}>Enroll</Button>
            ) : (
              firstLessonId && (
                <Link to={`/learn/courses/${course.slug}/lessons/${firstLessonId}`}>
                  <Button><PlayCircle className="h-4 w-4 mr-2" /> Start learning</Button>
                </Link>
              )
            )}
            {totalLessons > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <span className="font-mono font-semibold">{completed.size}/{totalLessons}</span>
                <Progress value={(completed.size / totalLessons) * 100} className="w-40" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {modules.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle className="text-lg">{m.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {m.lessons.map((l) => {
                  const done = completed.has(l.id);
                  return (
                    <Link
                      key={l.id}
                      to={`/learn/courses/${course.slug}/lessons/${l.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="text-sm">{l.title}</span>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </LearnLayout>
  );
};

export default CourseDetail;
