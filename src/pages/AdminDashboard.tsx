import { useSupabase } from '@/context/SupabaseProvider';
import { useContent, type Album, type Photo, type LoginErrorContent } from '@/context/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { showSuccess, showError } from '@/utils/toast';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, ImagePlus, Upload, Loader2 } from 'lucide-react';

type GetInTouchLink = {
  icon: string;
  name: string;
  url: string;
  color: string;
};

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type AboutContent = {
  title: string;
  subtitle: string;
  bio_p1: string;
  bio_p2: string;
  skills: string[];
  features: Feature[];
};

const AdminDashboard = () => {
  const { supabase } = useSupabase();
  const { content, updateContent } = useContent();
  
  const [heroState, setHeroState] = useState(content.hero);
  const [aboutState, setAboutState] = useState(content.about);
  const [portfolioTitle, setPortfolioTitle] = useState(content.portfolio.title);
  const [portfolioDescription, setPortfolioDescription] = useState(content.portfolio.description);
  const [galleryState, setGalleryState] = useState(content.gallery);
  const [contactTitle, setContactTitle] = useState(content.contact.title);
  const [contactDescription, setContactDescription] = useState(content.contact.description);
  const [loginErrorState, setLoginErrorState] = useState(content.loginError);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);

  useEffect(() => {
    setHeroState(content.hero);
    setAboutState(content.about);
    setPortfolioTitle(content.portfolio.title);
    setPortfolioDescription(content.portfolio.description);
    setGalleryState(content.gallery);
    setContactTitle(content.contact.title);
    setContactDescription(content.contact.description);
    setLoginErrorState(content.loginError);
  }, [content]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Logged out successfully!");
    }
  };

  const handleSave = (section: string, data: any) => {
    updateContent({ [section]: data });
  };

  const handleHeroChange = (field: string, value: string) => setHeroState(p => ({ ...p, [field]: value }));
  const handleSocialChange = (index: number, url: string) => {
    const newSocials = [...heroState.socials];
    newSocials[index].url = url;
    setHeroState(p => ({ ...p, socials: newSocials }));
  };
  const handleGetInTouchChange = (index: number, field: keyof GetInTouchLink, value: string) => {
    const newLinks = [...heroState.getInTouchLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setHeroState(p => ({ ...p, getInTouchLinks: newLinks }));
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
  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showError('Please upload an image file (e.g., JPG, PNG, GIF).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleHeroChange('avatarUrl', reader.result as string);
        showSuccess("Avatar image uploaded. Click 'Save Hero' to apply changes.");
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAboutChange = (field: keyof AboutContent, value: any) => setAboutState(p => ({ ...p, [field]: value }));
  const handleSkillChange = (e: ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    handleAboutChange('skills', skills);
  };
  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...aboutState.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    handleAboutChange('features', newFeatures);
  };

  const handleGalleryTextChange = (field: 'title' | 'description', value: string) => {
    setGalleryState(p => ({ ...p, [field]: value }));
  };

  const handleCreateAlbum = () => {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      title: 'New Album',
      description: 'A brief description of this album.',
      photos: [],
    };
    setGalleryState(p => ({ ...p, albums: [...p.albums, newAlbum] }));
    showSuccess('New album created. Remember to save!');
  };

  const handleAlbumChange = (albumId: string, field: 'title' | 'description', value: string) => {
    setGalleryState(p => ({
      ...p,
      albums: p.albums.map(album => album.id === albumId ? { ...album, [field]: value } : album),
    }));
  };

  const handleDeleteAlbum = (albumId: string) => {
    setGalleryState(p => ({ ...p, albums: p.albums.filter(album => album.id !== albumId) }));
    showSuccess('Album deleted. Remember to save!');
  };

  const handlePhotoUpload = (albumId: string, e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        showError(`File ${file.name} is not an image.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: Photo = {
          id: crypto.randomUUID(),
          url: reader.result as string,
          caption: file.name,
        };
        setGalleryState(p => ({
          ...p,
          albums: p.albums.map(album =>
            album.id === albumId ? { ...album, photos: [...album.photos, newPhoto] } : album
          ),
        }));
      };
      reader.readAsDataURL(file);
    });
    showSuccess(`${files.length} photo(s) added. Remember to save!`);
  };

  const handleDeletePhoto = (albumId: string, photoId: string) => {
    setGalleryState(p => ({
      ...p,
      albums: p.albums.map(album =>
        album.id === albumId ? { ...album, photos: album.photos.filter(photo => photo.id !== photoId) } : album
      ),
    }));
  };

  const handleLoginErrorChange = (field: keyof LoginErrorContent, value: string) => {
    setLoginErrorState(p => ({ ...p, [field]: value }));
  };

  const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      showError('Please upload a valid audio file.');
      return;
    }

    setIsProcessingAudio(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const newLoginErrorState = { ...loginErrorState, errorSoundUrl: dataUrl };
      setLoginErrorState(newLoginErrorState);
      handleSave('loginError', newLoginErrorState);
      setIsProcessingAudio(false);
      showSuccess("Audio file updated and saved automatically.");
    };

    reader.onerror = () => {
      showError("Failed to read the audio file.");
      setIsProcessingAudio(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </header>
      
      <main>
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                    <div>
                      <Label htmlFor="avatarUpload">Upload Profile Picture (Image)</Label>
                      <Input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarUpload} className="mt-1" />
                      {heroState.avatarUrl && <p className="text-sm text-muted-foreground mt-2">An avatar is currently set. Uploading a new one will replace it.</p>}
                    </div>
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
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">"Get In Touch" Links</h3>
                    <p className="text-sm text-muted-foreground mb-4">Update the links for the 'Get In Touch' popup.</p>
                    <div className="space-y-4">
                      {heroState.getInTouchLinks.map((link, index) => (
                        <div key={index} className="p-4 border rounded-md space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`get-in-touch-name-${index}`}>Name</Label>
                              <Input id={`get-in-touch-name-${index}`} value={link.name} onChange={(e) => handleGetInTouchChange(index, 'name', e.target.value)} />
                            </div>
                            <div>
                              <Label htmlFor={`get-in-touch-icon-${index}`}>Icon Name (from Lucide)</Label>
                              <Input id={`get-in-touch-icon-${index}`} value={link.icon} onChange={(e) => handleGetInTouchChange(index, 'icon', e.target.value)} />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`get-in-touch-url-${index}`}>URL</Label>
                            <Input id={`get-in-touch-url-${index}`} value={link.url} onChange={(e) => handleGetInTouchChange(index, 'url', e.target.value)} />
                          </div>
                          <div>
                            <Label htmlFor={`get-in-touch-color-${index}`}>Color Classes (Tailwind CSS)</Label>
                            <Input id={`get-in-touch-color-${index}`} value={link.color} onChange={(e) => handleGetInTouchChange(index, 'color', e.target.value)} />
                          </div>
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
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>Update the content for the "About Me" section.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('about', aboutState); }} className="space-y-6">
                  <div className="space-y-4">
                    <div><Label htmlFor="aboutTitle">Title</Label><Input id="aboutTitle" value={aboutState.title} onChange={(e) => handleAboutChange('title', e.target.value)} /></div>
                    <div><Label htmlFor="aboutSubtitle">Subtitle</Label><Input id="aboutSubtitle" value={aboutState.subtitle} onChange={(e) => handleAboutChange('subtitle', e.target.value)} /></div>
                    <div><Label htmlFor="aboutBio1">Bio Paragraph 1</Label><Textarea id="aboutBio1" rows={5} value={aboutState.bio_p1} onChange={(e) => handleAboutChange('bio_p1', e.target.value)} /></div>
                    <div><Label htmlFor="aboutBio2">Bio Paragraph 2</Label><Textarea id="aboutBio2" rows={5} value={aboutState.bio_p2} onChange={(e) => handleAboutChange('bio_p2', e.target.value)} /></div>
                    <div>
                      <Label htmlFor="aboutSkills">Skills (comma-separated)</Label>
                      <Input id="aboutSkills" value={aboutState.skills.join(', ')} onChange={handleSkillChange} />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Feature Cards</h3>
                    <div className="space-y-4">
                      {aboutState.features.map((feature, index) => (
                        <div key={index} className="p-4 border rounded-md space-y-4">
                          <h4 className="font-medium">Card {index + 1}</h4>
                          <div><Label htmlFor={`feature-icon-${index}`}>Icon Name (from Lucide)</Label><Input id={`feature-icon-${index}`} value={feature.icon} onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)} /></div>
                          <div><Label htmlFor={`feature-title-${index}`}>Title</Label><Input id={`feature-title-${index}`} value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} /></div>
                          <div><Label htmlFor={`feature-desc-${index}`}>Description</Label><Textarea id={`feature-desc-${index}`} value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
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
              <CardHeader>
                <CardTitle>Gallery Section</CardTitle>
                <CardDescription>Manage the title, description, and photo albums for your gallery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="text-lg font-medium">Gallery Details</h3>
                  <div><Label htmlFor="galleryTitle">Title</Label><Input id="galleryTitle" value={galleryState.title} onChange={(e) => handleGalleryTextChange('title', e.target.value)} /></div>
                  <div><Label htmlFor="galleryDescription">Description</Label><Textarea id="galleryDescription" value={galleryState.description} onChange={(e) => handleGalleryTextChange('description', e.target.value)} /></div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Photo Albums</h3>
                    <Button onClick={handleCreateAlbum}>Create New Album</Button>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {galleryState.albums.map(album => (
                      <AccordionItem value={album.id} key={album.id}>
                        <AccordionTrigger>{album.title}</AccordionTrigger>
                        <AccordionContent className="space-y-6 p-4">
                          <div className="space-y-4">
                            <div><Label htmlFor={`album-title-${album.id}`}>Album Title</Label><Input id={`album-title-${album.id}`} value={album.title} onChange={(e) => handleAlbumChange(album.id, 'title', e.target.value)} /></div>
                            <div><Label htmlFor={`album-desc-${album.id}`}>Album Description</Label><Textarea id={`album-desc-${album.id}`} value={album.description} onChange={(e) => handleAlbumChange(album.id, 'description', e.target.value)} /></div>
                          </div>
                          <Separator />
                          <div>
                            <Label htmlFor={`photo-upload-${album.id}`} className="flex items-center gap-2 text-sm font-medium cursor-pointer text-primary hover:underline">
                              <ImagePlus className="w-4 h-4" /> Add Photos to this Album
                            </Label>
                            <Input id={`photo-upload-${album.id}`} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(album.id, e)} />
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {album.photos.map(photo => (
                              <div key={photo.id} className="relative group">
                                <img src={photo.url} alt={photo.caption} className="w-full h-24 object-cover rounded-md" />
                                <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeletePhoto(album.id, photo.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Separator />
                          <Button variant="destructive" onClick={() => handleDeleteAlbum(album.id)}>Delete Album</Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <Button onClick={() => handleSave('gallery', galleryState)}>Save Gallery</Button>
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

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Manage site-wide settings like the login error message and sound.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSave('loginError', loginErrorState); }} className="space-y-6">
                  <h3 className="text-lg font-medium">Login Error Message</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="loginErrorTitle">Modal Title</Label>
                      <Input id="loginErrorTitle" value={loginErrorState.title} onChange={(e) => handleLoginErrorChange('title', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="loginErrorMessage">Error Message</Label>
                      <Input id="loginErrorMessage" value={loginErrorState.message} onChange={(e) => handleLoginErrorChange('message', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="loginErrorEmoji">Emoji</Label>
                      <Input id="loginErrorEmoji" value={loginErrorState.emoji} onChange={(e) => handleLoginErrorChange('emoji', e.target.value)} />
                    </div>
                  </div>
                  <Separator />
                  <h3 className="text-lg font-medium">Login Error Sound</h3>
                  <div className="space-y-2">
                    <Label htmlFor="audioUpload">Upload Audio File</Label>
                    <div className="flex items-center gap-4">
                      <Input id="audioUpload" type="file" accept="audio/*" onChange={handleAudioUpload} disabled={isProcessingAudio} className="flex-1" />
                      {isProcessingAudio && <Loader2 className="animate-spin" />}
                    </div>
                    {loginErrorState.errorSoundUrl && (
                      <div className="text-sm text-muted-foreground mt-2">
                        <p>Current sound:</p>
                        <audio src={loginErrorState.errorSoundUrl} controls className="w-full mt-1 h-8" />
                      </div>
                    )}
                  </div>
                  <Button type="submit">Save Settings</Button>
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