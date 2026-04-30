import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import securvioLogo from "@/assets/securvio-logo.png";

const LearnLayout = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/learn/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={securvioLogo}
                alt="Securvio"
                className="h-12 w-auto rounded-lg"
                style={{ backgroundColor: "hsl(222, 47%, 6%)" }}
              />
              <span className="hidden sm:inline text-sm font-medium text-muted-foreground border-l border-border pl-3">
                Learn
              </span>
            </Link>

            <div className="flex items-center gap-2 md:gap-6">
              {user && (
                <>
                  <NavLink
                    to="/learn/dashboard"
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-sm font-medium transition-colors ${
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </NavLink>
                  <NavLink
                    to="/learn/courses"
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-sm font-medium transition-colors ${
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Courses</span>
                  </NavLink>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign out</span>
                  </Button>
                </>
              )}
              {!user && (
                <Link to="/learn/auth">
                  <Button size="sm">Sign in</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-24 pb-16">{children}</main>
    </div>
  );
};

export default LearnLayout;
