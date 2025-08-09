import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Gallery from "@/components/sections/Gallery";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;