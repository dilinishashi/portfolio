import JobAnalyzer from "@/components/JobAnalyzer";

const AIAnalyzer = () => {
  return (
    <section id="ai-analyzer" className="py-20 md:py-32 bg-background">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Check Your Fit
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-muted-foreground md:text-xl">
            Use my AI-powered tool to see how my skills align with your job requirements.
          </p>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <JobAnalyzer />
        </div>
      </div>
    </section>
  );
};

export default AIAnalyzer;