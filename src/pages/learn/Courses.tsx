import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import LearnLayout from "@/components/learn/LearnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  difficulty: string;
  category: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    supabase
      .from("courses")
      .select("id,title,slug,description,difficulty,category")
      .eq("published", true)
      .order("title")
      .then(({ data }) => {
        setCourses((data ?? []) as Course[]);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(courses.map((c) => c.category))),
    [courses]
  );

  const filtered = courses.filter(
    (c) =>
      (difficulty === "all" || c.difficulty === difficulty) &&
      (category === "all" || c.category === category)
  );

  return (
    <LearnLayout>
      <Helmet>
        <title>Courses | Securvio Learn</title>
        <meta name="description" content="Browse cybersecurity and compliance courses by difficulty and category." />
      </Helmet>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Course catalog</h1>
          <p className="text-muted-foreground mt-2">Curated cybersecurity and compliance training.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No courses match your filters.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <Card key={c.id} className="hover:border-primary/50 transition-colors flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize">{c.difficulty}</Badge>
                    <Badge variant="outline">{c.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{c.title}</CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link to={`/learn/courses/${c.slug}`}>
                    <Button variant="outline" className="w-full">
                      View course <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </LearnLayout>
  );
};

export default Courses;
