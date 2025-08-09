import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { useState, FormEvent, ChangeEvent } from 'react';
import { showSuccess, showError } from '@/utils/toast';
import { Separator } from '@/components/ui/separator';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { content, updateContent } = useContent();
  
  const [heroState, setHeroState] = useState(content.hero);
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

  const handleHeroChange = (field: string, value: string) => {
    setHeroState(prevState => ({ ...prevState, [field]: value }));
  };

  const handleSocialChange = (index: number, url: string) => {
    const newSocials = [...heroState.socials];
    newSocials[index].url = url;
    setHeroState(prevState => ({ ...prevState, socials: newSocials }));
  };

  const handleCvUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showError('Please upload a PDF file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleHeroChange('cvLink', reader.result as string);
        showSuccess("CV uploaded. Click 'Save Hero' to apply changes.");
      };
      reader.readAsDataURL(file);
    }
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
                <CardDescription>Update the content for the main hero section of your homepage.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('hero', heroState); }} className="space-y-6">
                  <div className="space-y-4">
                    <div><Label htmlFor="heroGreeting">Greeting</Label><Input id="heroGreeting" value={heroState.greeting} onChange={(e) => handleHeroChange('greeting', e.target.value)} /></div>
                    <div><Label htmlFor="heroName">Name</Label><Input id="heroName" value={heroState.name} onChange={(e) => handleHeroChange('name', e.target.value)} /></div>
                    <div><Label htmlFor="heroRole">Role</Label><Input id="heroRole" value={heroState.role} onChange={(e) => handleHeroChange('role', e.target.value)} /></div>
                    <div><Label htmlFor="heroDescription">Description</Label><Textarea id="heroDescription" value={heroState.description} onChange={(e) => handleHeroChange('description', e.target.value)} /></div>
                    
                    <div>
                      <Label htmlFor="cvUpload">Upload CV (PDF only)</Label>
                      <Input id="cvUpload" type="file" accept="application/pdf" onChange={handleCvUpload} className="mt-1" />
                      {heroState.cvLink && heroState.cvLink !== '#' && <p className="text-sm text-muted-foreground mt-2">A CV is currently uploaded. Uploading a new one will replace it.</p>}
                    </div>

                    <div><Label htmlFor="heroContactLink">"Get In Touch" Link</Label><Input id="heroContactLink" value={heroState.contactLink} onChange={(e) => handleHeroChange('contactLink', e.target.value)} /></div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Social Links</h3>
                    <p className="text-sm text-muted-foreground mb-4">Update the URLs for your social media icons.</p>
                    <div className="space-y-4">
                      {heroState.socials.map((social, index) => (
                        <div key={index}>
                          <Label htmlFor={`social-url-${index}`}>{social.name} URL</Label>
                          <Input id={`social-url-${index}`} value={social.url} onChange={(e) => handleSocialChange(index, e.target.value)} />
                        </div>
                      ))}
                    </div>
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