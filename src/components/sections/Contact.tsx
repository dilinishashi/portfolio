import { useContent } from "@/context/ContentContext";

const Contact = () => {
  const { content } = useContent();
  return (
    <section id="contact" className="py-20 md:py-32 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          {content.contact.title}
        </h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto whitespace-pre-wrap">
          {content.contact.description}
        </p>
      </div>
    </section>
  );
};

export default Contact;