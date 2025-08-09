import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, FormEvent } from 'react';
import { showSuccess } from '@/utils/toast';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { content, updateContent } = useContent();
  
  const [heroTitle, setHeroTitle] = useState(content.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(content.hero.subtitle);

  const handleHeroSave = (e: FormEvent) => {
    e.preventDefault();
    updateContent({ hero: { title: heroTitle, subtitle: heroSubtitle } });
    showSuccess("Hero section updated!");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold">Admin Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </header>
      
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Edit Hero Section</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleHeroSave} className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">Title</Label>
                <Input id="heroTitle" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="heroSubtitle">Subtitle</Label>
                <Input id="heroSubtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
              </div>
              <Button type="submit">Save Hero Content</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;