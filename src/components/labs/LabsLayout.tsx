import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { LABS } from "@/data/labs";

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function LabsLayout({
  children,
  title = "Securvio Labs",
  description = "Hands-on cybersecurity labs: real-world environments built, broken, monitored, and defended end-to-end.",
}: Props) {
  const { pathname } = useLocation();

  const tabs = [
    { to: "/labs", label: "Overview" },
    ...LABS.map((l) => ({ to: `/labs/${l.slug}`, label: l.title })),
    { to: "/labs/siem-detection", label: "SIEM Challenge" },
  ];

  return (
    <>
      <Helmet>
        <title>{title} | Securvio</title>
        <meta name="description" content={description} />
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : "https://securvio.vercel.app/labs"}
        />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-28 md:pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <nav className="mb-8 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const active = pathname === t.to;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-glow"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
          {children}
        </div>
      </main>
    </>
  );
}
