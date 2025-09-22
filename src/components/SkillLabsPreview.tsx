import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Palette, 
  Database, 
  Smartphone,
  Play,
  Clock,
  Users,
  Star,
  Terminal,
  Figma,
  Brain
} from "lucide-react";

const SkillLabsPreview = () => {
  const featuredLabs = [
    {
      title: "Build a React E-commerce App",
      description: "Create a full-featured shopping platform with cart, payments, and user authentication",
      difficulty: "Intermediate",
      duration: "4-6 hours",
      participants: 2847,
      rating: 4.8,
      icon: Code,
      color: "text-skillsnap-blue",
      bgColor: "bg-skillsnap-blue/10",
      category: "Web Development"
    },
    {
      title: "Design System from Scratch",
      description: "Learn to build scalable design systems with components, tokens, and documentation",
      difficulty: "Advanced",
      duration: "6-8 hours", 
      participants: 1523,
      rating: 4.9,
      icon: Palette,
      color: "text-skillsnap-pink",
      bgColor: "bg-skillsnap-pink/10",
      category: "UI/UX Design"
    },
    {
      title: "Machine Learning Pipeline",
      description: "Build an end-to-end ML pipeline with data processing, training, and deployment",
      difficulty: "Expert",
      duration: "8-10 hours",
      participants: 892,
      rating: 4.7,
      icon: Brain,
      color: "text-skillsnap-green",
      bgColor: "bg-skillsnap-green/10",
      category: "Data Science"
    },
    {
      title: "Mobile App with React Native",
      description: "Create a cross-platform mobile app with navigation, API integration, and offline support",
      difficulty: "Intermediate",
      duration: "5-7 hours",
      participants: 1647,
      rating: 4.6,
      icon: Smartphone,
      color: "text-skillsnap-orange",
      bgColor: "bg-skillsnap-orange/10",
      category: "Mobile Development"
    }
  ];

  const quickLabs = [
    { title: "CSS Grid Mastery", duration: "30 min", icon: Terminal },
    { title: "API Testing Basics", duration: "45 min", icon: Database },
    { title: "Figma Prototyping", duration: "1 hour", icon: Figma },
  ];

  return (
    <section id="labs" className="py-20 bg-secondary/30">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hands-On
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Skill Labs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real projects, real tools, real results. No tutorials that go nowhere—just practical skills you can use immediately.
          </p>
        </div>

        {/* Featured Labs Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {featuredLabs.map((lab, index) => (
            <Card key={index} className="group hover:shadow-skillsnap transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${lab.bgColor} mb-3`}>
                    <lab.icon className={`h-6 w-6 ${lab.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {lab.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {lab.title}
                </CardTitle>
                <Badge variant="secondary" className="text-xs w-fit">
                  {lab.category}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {lab.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lab.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {lab.participants.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-skillsnap-orange text-skillsnap-orange" />
                    {lab.rating}
                  </div>
                </div>
                
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  <Play className="h-4 w-4 mr-2" />
                  Start Lab
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Labs */}
        <div className="bg-white rounded-2xl p-8 shadow-skillsnap">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Quick <span className="text-skillsnap-green">30-Minute</span> Labs
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {quickLabs.map((lab, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer">
                <div className="p-2 rounded-lg bg-skillsnap-purple/10">
                  <lab.icon className="h-5 w-5 text-skillsnap-purple" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{lab.title}</div>
                  <div className="text-sm text-muted-foreground">{lab.duration}</div>
                </div>
                <Play className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline">
              View All Quick Labs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillLabsPreview;