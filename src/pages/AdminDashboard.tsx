import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { useState, FormEvent } from 'react';
import { showSuccess } from '@/utils/toast';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { content, updateContent } = useContent();
  
  const [heroTitle, setHeroTitle] = useState(content.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(content.hero.subtitle);
  const [aboutTitle, setAboutTitle] = useState(content.about.title);
  const [aboutDescription, setAboutDescription] = useState(content.about.description);
  const [portfolioTitle, setPortfolioTitle] = useState(content.portfolio.title);
  const [portfolioDescription, setPortfolioDescription] = useState(content.portfolio.description);
  const [galleryTitle, setGalleryTitle] = useState(content.gallery.title);
  const [galleryDescription, setGalleryDescription] = useState(content.gallery.description);
  const [contactTitle, setContactTitle] = useState(content.contact.title);
  const [contactDescription, setContactDescription] = useState(content.contact.description);

  const handleSave = (section: string, data: any) => {
    updateContent({ [section]: data });
    showSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} section updated!`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold">Admin Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </header>
      
      <main>
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Update the main title and subtitle of your homepage.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('hero', { title: heroTitle, subtitle: heroSubtitle }); }} className="space-y-4">
                  <div>
                    <Label htmlFor="heroTitle">Title</Label>
                    <Input id="heroTitle" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="heroSubtitle">Subtitle</Label>
                    <Input id="heroSubtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
                  </div>
                  <Button type="submit">Save Hero</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader><CardTitle>About Section</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('about', { title: aboutTitle, description: aboutDescription }); }} className="space-y-4">
                  <div><Label htmlFor="aboutTitle">Title</Label><Input id="aboutTitle" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} /></div>
                  <div><Label htmlFor="aboutDescription">Description</Label><Textarea id="aboutDescription" value={aboutDescription} onChange={(e) => setAboutDescription(e.target.value)} /></div>
                  <Button type="submit">Save About</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader><CardTitle>Portfolio Section</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('portfolio', { title: portfolioTitle, description: portfolioDescription }); }} className="space-y-4">
                  <div><Label htmlFor="portfolioTitle">Title</Label><Input id="portfolioTitle" value={portfolioTitle} onChange={(e) => setPortfolioTitle(e.target.value)} /></div>
                  <div><Label htmlFor="portfolioDescription">Description</Label><Textarea id="portfolioDescription" value={portfolioDescription} onChange={(e) => setPortfolioDescription(e.target.value)} /></div>
                  <Button type="submit">Save Portfolio</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader><CardTitle>Gallery Section</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('gallery', { title: galleryTitle, description: galleryDescription }); }} className="space-y-4">
                  <div><Label htmlFor="galleryTitle">Title</Label><Input id="galleryTitle" value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)} /></div>
                  <div><Label htmlFor="galleryDescription">Description</Label><Textarea id="galleryDescription" value={galleryDescription} onChange={(e) => setGalleryDescription(e.target.value)} /></div>
                  <Button type="submit">Save Gallery</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader><CardTitle>Contact Section</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('contact', { title: contactTitle, description: contactDescription }); }} className="space-y-4">
                  <div><Label htmlFor="contactTitle">Title</Label><Input id="contactTitle" value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} /></div>
                  <div><Label htmlFor="contactDescription">Description</Label><Textarea id="contactDescription" value={contactDescription} onChange={(e) => setContactDescription(e.target.value)} /></div>
                  <Button type="submit">Save Contact</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;