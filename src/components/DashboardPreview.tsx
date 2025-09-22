import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  Code, 
  Palette, 
  Database, 
  Smartphone,
  Play,
  CheckCircle
} from "lucide-react";

const DashboardPreview = () => {
  const skillAreas = [
    { name: "Web Development", progress: 75, icon: Code, color: "text-skillsnap-blue" },
    { name: "UI/UX Design", progress: 60, icon: Palette, color: "text-skillsnap-pink" },
    { name: "Data Science", progress: 45, icon: Database, color: "text-skillsnap-green" },
    { name: "Mobile Dev", progress: 30, icon: Smartphone, color: "text-skillsnap-orange" },
  ];

  const recentAchievements = [
    { title: "React Master", description: "Completed Advanced React Patterns", icon: "🎯" },
    { title: "CSS Wizard", description: "Built 5 responsive layouts", icon: "🎨" },
    { title: "API Hero", description: "Integrated 10 different APIs", icon: "🚀" },
  ];

  const activeLabs = [
    { title: "Build a Chat App", difficulty: "Intermediate", progress: 70, timeLeft: "2h 30m" },
    { title: "Design System Creation", difficulty: "Advanced", progress: 40, timeLeft: "4h 15m" },
    { title: "Database Optimization", difficulty: "Expert", progress: 85, timeLeft: "1h 45m" },
  ];

  return (
    <section id="dashboard" className="py-20 bg-background">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Track Your 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Progress</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See exactly where you stand and where you're headed. No guesswork, just clear progress.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skill Progress */}
            <Card className="bg-gradient-card border-0 shadow-skillsnap">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-skillsnap-purple" />
                  Skill Mastery Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillAreas.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <skill.icon className={`h-4 w-4 ${skill.color}`} />
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Labs */}
            <Card className="bg-gradient-card border-0 shadow-skillsnap">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-skillsnap-green" />
                  Active Labs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeLabs.map((lab, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{lab.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {lab.difficulty}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lab.timeLeft}
                        </span>
                      </div>
                      <Progress value={lab.progress} className="h-1" />
                    </div>
                    <Button variant="ghost" size="sm" className="w-full">
                      Continue Lab
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Stats */}
            <Card className="bg-gradient-success border-0 shadow-success text-white">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">1,250</div>
                <div className="text-sm opacity-90">Total Points Earned</div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Week:</span>
                    <span>+180 pts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rank:</span>
                    <span>#47 of 10,293</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-gradient-card border-0 shadow-skillsnap">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-skillsnap-orange" />
                  Recent Wins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <span className="text-xl">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {achievement.description}
                      </div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-skillsnap-green flex-shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button variant="hero" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start New Lab
              </Button>
              <Button variant="outline" className="w-full">
                View Portfolio
              </Button>
              <Button variant="ghost" className="w-full">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;