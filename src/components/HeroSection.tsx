import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Rocket, Users, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="container relative px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              <Rocket className="h-3 w-3 mr-1" />
              Go from "I want to learn" to "I can do it"
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Master Skills That
              <span className="block bg-gradient-to-r from-skillsnap-green to-skillsnap-orange bg-clip-text text-transparent">
                Actually Matter
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
              Interactive labs, real projects, and a community that gets it. 
              Build your skills, showcase your work, and prove what you can do.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group">
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Your First Lab
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                View Portfolio Examples
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-white/80">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">10k+</span>
                </div>
                <span className="text-sm">Active Learners</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold">500+</span>
                </div>
                <span className="text-sm">Skills Available</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  <span className="font-semibold">50k+</span>
                </div>
                <span className="text-sm">Labs Completed</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img 
                src={heroImage} 
                alt="SkillSnap learning platform interface showing interactive coding labs and progress tracking"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-skillsnap animate-bounce">
              <Trophy className="h-6 w-6 text-skillsnap-orange" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-success animate-pulse">
              <Rocket className="h-6 w-6 text-skillsnap-green" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;