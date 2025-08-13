import { useContent } from "@/context/ContentContext";
import ProjectCard from "@/components/ProjectCard";

const Projects = () => {
  const { content } = useContent();
  const { portfolio, projects } = content;

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {portfolio.title}
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-xl">
            {portfolio.description}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={project.id} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;