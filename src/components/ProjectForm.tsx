import { useState, useEffect, FormEvent } from 'react';
import { type Project } from '@/context/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

interface ProjectFormProps {
  project?: Project | null;
  onSave: (project: Project) => void;
  onClose: () => void;
}

const ProjectForm = ({ project, onSave, onClose }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: '',
    is_featured: false,
    display_order: 0, // Added display_order
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        image_url: project.image_url || '',
        project_url: project.project_url || '',
        github_url: project.github_url || '',
        technologies: project.technologies?.join(', ') || '',
        is_featured: project.is_featured || false,
        display_order: project.display_order || 0, // Populate display_order
      });
    } else {
      setFormData({
        title: '',
        description: '',
        image_url: '',
        project_url: '',
        github_url: '',
        technologies: '',
        is_featured: false,
        display_order: 0, // Default for new projects
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'display_order' ? parseInt(value, 10) || 0 : value }));
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setFormData(prev => ({ ...prev, is_featured: !!checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
    };

    let savedProject: Project;

    if (project?.id) {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', project.id)
        .select()
        .single();
      
      if (error) {
        showError(`Failed to update project: ${error.message}`);
        setIsLoading(false);
        return;
      }
      savedProject = data;
      showSuccess('Project updated successfully!');
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError('You must be logged in to create a project.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({ ...projectData, user_id: user.id })
        .select()
        .single();

      if (error) {
        showError(`Failed to create project: ${error.message}`);
        setIsLoading(false);
        return;
      }
      savedProject = data;
      showSuccess('Project created successfully!');
    }

    onSave(savedProject);
    setIsLoading(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-1">
      <div><Label htmlFor="title">Title</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
      <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} /></div>
      <div><Label htmlFor="image_url">Image URL</Label><Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.png" /></div>
      <div><Label htmlFor="project_url">Live Demo URL</Label><Input id="project_url" name="project_url" value={formData.project_url} onChange={handleChange} /></div>
      <div><Label htmlFor="github_url">Code/GitHub URL</Label><Input id="github_url" name="github_url" value={formData.github_url} onChange={handleChange} /></div>
      <div><Label htmlFor="technologies">Technologies (comma-separated)</Label><Input id="technologies" name="technologies" value={formData.technologies} onChange={handleChange} /></div>
      <div><Label htmlFor="display_order">Display Order</Label><Input id="display_order" name="display_order" type="number" value={formData.display_order} onChange={handleChange} /></div> {/* Added display_order input */}
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox id="is_featured" checked={formData.is_featured} onCheckedChange={handleCheckboxChange} />
        <Label htmlFor="is_featured" className="font-medium">Featured Project</Label>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Project
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;