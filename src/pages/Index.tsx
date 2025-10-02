import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Gallery from "@/components/sections/Gallery";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import AIAnalyzer from "@/components/sections/AIAnalyzer";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Projects />
        <AIAnalyzer />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;