import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import LearnLayout from "@/components/learn/LearnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";

interface CourseRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  difficulty: string;
  category: string;
  total: number;
  completed: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data: enrolls } = await supabase
        .from("enrollments")
        .select("course_id, courses(id,title,slug,description,difficulty,category)")
        .eq("user_id", user.id);

      if (!enrolls) {
        setLoading(false);
        return;
      }

      const out: CourseRow[] = [];
      for (const e of enrolls) {
        const course = (e as any).courses;
        if (!course) continue;
        const { data: lessons } = await supabase
          .from("lessons")
          .select("id, modules!inner(course_id)")
          .eq("modules.course_id", course.id);
        const lessonIds = (lessons ?? []).map((l: any) => l.id);
        const total = lessonIds.length;
        let completed = 0;
        if (total > 0) {
          const { count } = await supabase
            .from("lesson_progress")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .in("lesson_id", lessonIds);
          completed = count ?? 0;
        }
        out.push({ ...course, total, completed });
      }
      setRows(out);
      setLoading(false);
    };
    load();
  }, [user]);

  return (
    <LearnLayout>
      <Helmet>
        <title>Dashboard | Securvio Learn</title>
        <meta name="description" content="Track your enrolled cybersecurity courses and progress." />
      </Helmet>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your dashboard</h1>
            <p className="text-muted-foreground mt-2">Continue where you left off.</p>
          </div>
          <Link to="/learn/courses">
            <Button variant="outline">Browse all courses</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : rows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No enrolled courses yet</h3>
              <p className="text-muted-foreground mb-6">Browse the catalog and enroll to get started.</p>
              <Link to="/learn/courses">
                <Button>Browse courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {rows.map((c) => {
              const pct = c.total ? (c.completed / c.total) * 100 : 0;
              return (
                <Card key={c.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl">{c.title}</CardTitle>
                        <CardDescription className="mt-1">{c.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="capitalize shrink-0">{c.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-mono font-semibold">{c.completed}/{c.total}</span>
                    </div>
                    <Progress value={pct} />
                    <Link to={`/learn/courses/${c.slug}`}>
                      <Button className="w-full mt-2">
                        Continue <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </LearnLayout>
  );
};

export default Dashboard;
