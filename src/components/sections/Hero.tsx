import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Mail } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import SocialIcon from "@/components/SocialIcon";
import CVViewer from "@/components/CVViewer";
import GetInTouchModal from "@/components/GetInTouchModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Hero = () => {
  const { content } = useContent();
  const { hero } = content;
  const [isCvViewerOpen, setIsCvViewerOpen] = useState(false);
  const [isGetInTouchOpen, setIsGetInTouchOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative flex flex-col items-center justify-center p-4 pt-14 md:pt-16 scroll-mt-16 min-h-[calc(100svh-56px)] md:min-h-[calc(100dvh-56px)]">
        <div className="absolute inset-0 bg-background/80 z-10" />
        <div className="absolute inset-0 animate-pulse-slow">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
        </div>
        
        <div className="relative z-20 container grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
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
            <p className="max-w-3xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              {hero.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-12 animate-fade-in" style={{ animationDelay: '1s' }}>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg" onClick={() => setIsCvViewerOpen(true)}>
                View My CV
              </Button>
              <Button size="lg" variant="outline" onClick={() => setIsGetInTouchOpen(true)}>
                <Mail className="mr-2 h-4 w-4" /> Get In Touch
              </Button>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 animate-fade-in" style={{ animationDelay: '1.2s' }}>
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

          {/* Right Column: Image */}
          <div className="flex justify-center items-center order-1 md:order-2 animate-fade-in [perspective:1000px]" style={{ animationDelay: '0.5s' }}>
            <div className="transition-transform duration-500 ease-in-out hover:[transform:rotateY(15deg)_rotateX(5deg)]">
              <Avatar className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 border-4 border-primary/10 shadow-2xl">
                <AvatarImage src={hero.avatarUrl} alt={hero.name} className="object-cover" />
                <AvatarFallback>{hero.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <a href="#portfolio" aria-label="Scroll down" className="absolute bottom-8 z-20 animate-bounce text-muted-foreground hover:text-foreground">
          <ArrowDown className="h-6 w-6" />
        </a>
      </section>

      <CVViewer
        isOpen={isCvViewerOpen}
        onClose={() => setIsCvViewerOpen(false)}
        cvUrl={hero.cvLink}
      />

      <GetInTouchModal
        isOpen={isGetInTouchOpen}
        onClose={() => setIsGetInTouchOpen(false)}
        links={hero.getInTouchLinks}
      />
    </>
  );
};

export default Hero;