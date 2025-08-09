import { useContent } from "@/context/ContentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SocialIcon from "@/components/SocialIcon";

const About = () => {
  const { content } = useContent();
  const { about } = content;

  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {about.title}
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-xl">
            {about.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Left Column */}
          <div className="md:col-span-3 space-y-6">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{about.bio_p1}</p>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{about.bio_p2}</p>
            <div className="flex flex-wrap gap-2 pt-4">
              {about.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            {about.features.map((feature) => (
              <Card key={feature.title} className="bg-muted/50 p-2">
                <CardHeader>
                  <SocialIcon name={feature.icon as any} className="w-7 h-7 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;