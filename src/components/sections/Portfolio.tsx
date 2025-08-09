import { useContent } from "@/context/ContentContext";

const Portfolio = () => {
  const { content } = useContent();
  return (
    <section id="portfolio" className="py-20 md:py-32">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          {content.portfolio.title}
        </h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto whitespace-pre-wrap">
          {content.portfolio.description}
        </p>
        <div className="text-center text-muted-foreground mt-8">
          Portfolio items coming soon.
        </div>
      </div>
    </section>
  );
};

export default Portfolio;