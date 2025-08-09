import { Button } from "@/components/ui/button";
import { ArrowDown, Mail } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import SocialIcon from "@/components/SocialIcon";

const Hero = () => {
  const { content } = useContent();
  const { hero } = content;

  return (
    <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden p-4">
      <div className="absolute inset-0 bg-background/80 z-10" />
      <div className="absolute inset-0 animate-pulse-slow">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
      </div>
      
      <div className="relative z-20 container flex flex-col items-center justify-center">
        <p className="text-lg md:text-xl text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {hero.greeting}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            {hero.name}
          </span>
        </h1>
        <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {hero.role}
        </h2>
        <p className="max-w-3xl mx-auto text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {hero.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '1s' }}>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg">
            <a href={hero.cvLink} target="_blank" rel="noopener noreferrer">
              View My CV
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={hero.contactLink}>
              <Mail className="mr-2 h-4 w-4" /> Get In Touch
            </a>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          {hero.socials.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
            >
              <SocialIcon name={social.icon as any} className="h-5 w-5 text-secondary-foreground" />
            </a>
          ))}
        </div>
      </div>

      <a href="#portfolio" aria-label="Scroll down" className="absolute bottom-8 z-20 animate-bounce text-muted-foreground hover:text-foreground">
        <ArrowDown className="h-6 w-6" />
      </a>
    </section>
  );
};

export default Hero;