import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SkillSnap
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#dashboard" className="text-sm font-medium hover:text-primary transition-smooth">
            Dashboard
          </a>
          <a href="#labs" className="text-sm font-medium hover:text-primary transition-smooth">
            Skill Labs
          </a>
          <a href="#portfolio" className="text-sm font-medium hover:text-primary transition-smooth">
            Portfolio
          </a>
          <a href="#community" className="text-sm font-medium hover:text-primary transition-smooth">
            Community
          </a>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Points Badge */}
          <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
            <span className="text-skillsnap-green">⭐</span>
            1,250 pts
          </Badge>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-skillsnap-green rounded-full"></span>
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>

          {/* CTA Button */}
          <Button variant="hero" size="sm" className="hidden sm:flex">
            Start Learning
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;