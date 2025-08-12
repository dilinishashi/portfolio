import { createContext, useState, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

// Define types for our content structure
export type SocialLink = {
  name: string;
  icon: string;
  url: string;
};

export type GetInTouchLink = {
  icon: string;
  name: string;
  url: string;
  color: string;
};

export type HeroContent = {
  greeting: string;
  name: string;
  role: string;
  description: string;
  socials: SocialLink[];
  getInTouchLinks: GetInTouchLink[];
  cvLink: string;
  avatarUrl: string;
};

export type Feature = {
  icon: string;
  title: string;
  description: string;
};

export type AboutContent = {
  title: string;
  subtitle: string;
  bio_p1: string;
  bio_p2: string;
  skills: string[];
  features: Feature[];
};

export type PortfolioContent = {
  title: string;
  description: string;
};

export type Photo = {
  id: string;
  url: string;
  caption: string;
};

export type Album = {
  id: string;
  title: string;
  description: string;
  photos: Photo[];
};

export type GalleryContent = {
  title: string;
  description: string;
  albums: Album[];
};

export type ContactContent = {
  title: string;
  description:string;
};

export type LoginErrorContent = {
  title: string;
  message: string;
  emoji: string;
  errorSoundUrl: string;
};

export type Content = {
  hero: HeroContent;
  about: AboutContent;
  portfolio: PortfolioContent;
  gallery: GalleryContent;
  contact: ContactContent;
  loginError: LoginErrorContent;
};

type ContentContextType = {
  content: Content;
  updateContent: (newContent: Partial<Content>) => void;
};

// Initial default content
const initialContent: Content = {
  hero: {
    greeting: "Hello, I'm",
    name: "Hasan Bose",
    role: "Software Quality Assurance Engineer",
    description: "I ensure software quality through meticulous testing and attention to detail.",
    socials: [
      { name: "GitHub", icon: "Github", url: "https://github.com/your-profile" },
      { name: "Email", icon: "Mail", url: "mailto:your.email@example.com" },
      { name: "LinkedIn", icon: "Linkedin", url: "#" },
      { name: "WhatsApp", icon: "MessageCircle", url: "https://wa.me/yourphonenumber" },
    ],
    getInTouchLinks: [
      { icon: "Mail", name: "Email", url: "mailto:your.email@example.com", color: "bg-red-500 hover:bg-red-600 text-white" },
      { icon: "Send", name: "Telegram", url: "https://t.me/yourusername", color: "bg-sky-500 hover:bg-sky-600 text-white" },
      { icon: "MessageCircle", name: "WhatsApp", url: "https://wa.me/yourphonenumber", color: "bg-green-500 hover:bg-green-600 text-white" },
      { icon: "Facebook", name: "Facebook", url: "#", color: "bg-blue-800 hover:bg-blue-900 text-white" },
      { icon: "Instagram", name: "Instagram", url: "#", color: "bg-pink-600 hover:bg-pink-700 text-white" },
      { icon: "Clapperboard", name: "TikTok", url: "#", color: "bg-black hover:bg-gray-800 text-white" },
    ],
    cvLink: "#",
    avatarUrl: "https://via.placeholder.com/400x400?text=Your+Photo",
  },
  about: {
    title: "About Me",
    subtitle: "My journey in quality assurance.",
    bio_p1: "I am a dedicated Software Quality Assurance Engineer with a passion for ensuring flawless user experiences. My meticulous approach to testing and keen eye for detail help bridge the gap between development and deployment, guaranteeing robust and reliable software.",
    bio_p2: "I thrive on identifying potential issues before they impact users, and I'm proficient in creating comprehensive test plans, executing test cases, and automating repetitive tasks to improve efficiency. My goal is to uphold the highest standards of quality for every project I'm a part of.",
    skills: ["Manual Testing", "Automation Testing", "Selenium", "Jira", "Test Planning", "API Testing", "SQL", "Agile Methodologies"],
    features: [
      { icon: "ClipboardCheck", title: "Test Planning", description: "Creating detailed and effective test strategies." },
      { icon: "Bot", title: "Test Automation", description: "Developing scripts to automate testing processes." },
      { icon: "Bug", title: "Defect Tracking", description: "Managing and tracking bugs from discovery to resolution." },
      { icon: "Handshake", title: "Collaboration", description: "Working closely with teams to ensure quality standards." }
    ],
  },
  portfolio: {
    title: "My Portfolio",
    description: "A selection of my recent work.",
  },
  gallery: {
    title: "Photo Gallery",
    description: "A collection of moments and memories.",
    albums: [
      {
        id: "album-1",
        title: "Landscapes",
        description: "Views from my travels.",
        photos: [
          { id: "photo-1", url: "https://via.placeholder.com/300x200?text=Landscape+1", caption: "Mountain view" },
          { id: "photo-2", url: "https://via.placeholder.com/300x200?text=Landscape+2", caption: "Ocean sunset" },
        ],
      },
      {
        id: "album-2",
        title: "Cityscapes",
        description: "The hustle and bustle of urban life.",
        photos: [
          { id: "photo-3", url: "https://via.placeholder.com/300x200?text=Cityscape+1", caption: "Downtown at night" },
        ],
      },
    ],
  },
  contact: {
    title: "Get In Touch",
    description: "Feel free to reach out to me for any inquiries or collaborations.",
  },
  loginError: {
    title: "Access Denied",
    message: "You are not Inamulhasan!",
    emoji: "😠",
    errorSoundUrl: "",
  },
};

const contentQueryKey = ['portfolioContent'];
const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: content, isLoading, isError } = useQuery<Content>({
    queryKey: contentQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('content')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine on first load
        console.error("Error fetching content:", error);
        throw new Error(error.message);
      }
      
      if (data?.content) {
        return data.content as Content;
      }
      
      // If no content in DB, return the default initial content.
      // The first save action will create the record in the database.
      return initialContent;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { mutate } = useMutation({
    mutationFn: async (newContent: Partial<Content>) => {
      // Ensure we have the full, most recent content object before merging
      const currentContent = queryClient.getQueryData<Content>(contentQueryKey) || initialContent;
      const updatedContent = { ...currentContent, ...newContent };
      
      const { error } = await supabase
        .from('portfolio_content')
        .upsert({ id: 1, content: updatedContent }, { onConflict: 'id' });

      if (error) {
        throw new Error(error.message);
      }
      return updatedContent;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(contentQueryKey, data);
      showSuccess("Content saved to database!");
    },
    onError: (error) => {
      showError(`Failed to save content: ${error.message}`);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
        <div className="flex items-center justify-center h-screen bg-background text-destructive">
            <p>Error: Could not load website content from the database.</p>
        </div>
    );
  }

  return (
    <ContentContext.Provider value={{ content: content || initialContent, updateContent: mutate }}>
      {children}
    </Content-Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};