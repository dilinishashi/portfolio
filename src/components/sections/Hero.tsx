import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useContent } from "@/context/ContentContext";

const Hero = () => {
  const { content } = useContent();

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-background/50 z-10" />
      <div className="absolute inset-0 animate-pulse-slow">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
      </div>
      <div className="relative z-20 container px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {content.hero.title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {content.hero.subtitle}
        </p>
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button asChild size="lg">
            <a href="#portfolio">
              View My Work <ArrowDown className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;