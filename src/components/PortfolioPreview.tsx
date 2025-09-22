import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Github, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  Code,
  Palette,
  Database
} from "lucide-react";

const PortfolioPreview = () => {
  const portfolioProjects = [
    {
      title: "TaskFlow - Project Management App",
      description: "A full-stack project management tool built with React, Node.js, and PostgreSQL. Features real-time collaboration and advanced filtering.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=240&fit=crop&crop=center",
      tags: ["React", "Node.js", "PostgreSQL", "Socket.io"],
      category: "Web Development",
      icon: Code,
      views: 1247,
      likes: 89,
      comments: 23,
      featured: true
    },
    {
      title: "EcoTrack - Sustainability Dashboard",
      description: "Mobile-first dashboard for tracking personal environmental impact with beautiful data visualizations and gamification elements.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop&crop=center",
      tags: ["React Native", "D3.js", "Firebase"],
      category: "Mobile Development", 
      icon: Database,
      views: 892,
      likes: 67,
      comments: 15,
      featured: false
    },
    {
      title: "Mindful - Mental Health App UI",
      description: "Complete UI/UX design system for a mental health application with focus on accessibility and calming user experience.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=240&fit=crop&crop=center",
      tags: ["Figma", "Design System", "Accessibility"],
      category: "UI/UX Design",
      icon: Palette,
      views: 2156,
      likes: 134,
      comments: 31,
      featured: true
    }
  ];

  const stats = [
    { label: "Total Projects", value: "24", color: "text-skillsnap-purple" },
    { label: "Portfolio Views", value: "5.2k", color: "text-skillsnap-blue" },
    { label: "Likes Received", value: "892", color: "text-skillsnap-green" },
    { label: "Community Rank", value: "#47", color: "text-skillsnap-orange" }
  ];

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Showcase Your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Work</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build a portfolio that actually impresses. Show real projects, not just certificates.
          </p>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 bg-gradient-card border-0 shadow-skillsnap">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Sample Portfolio */}
        <div className="bg-white rounded-2xl p-8 shadow-skillsnap mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Alex Chen's Portfolio</h3>
              <p className="text-muted-foreground">Full-Stack Developer & UI/UX Designer</p>
            </div>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live Portfolio
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {portfolioProjects.map((project, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-skillsnap transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.featured && (
                    <Badge className="absolute top-3 left-3 bg-skillsnap-orange text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    <project.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {project.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {project.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {project.comments}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Github className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Build Your Portfolio?</h3>
          <p className="text-muted-foreground mb-6">
            Complete labs, build projects, and showcase your skills to the world.
          </p>
          <Button variant="hero" size="lg">
            Start Building Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;