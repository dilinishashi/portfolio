import { createContext, useState, useContext, ReactNode } from 'react';

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
  description: string;
};

export type Content = {
  hero: HeroContent;
  about: AboutContent;
  portfolio: PortfolioContent;
  gallery: GalleryContent;
  contact: ContactContent;
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
    role: "Full-Stack Developer",
    description: "I design and build beautiful and responsive web applications.",
    socials: [
      { name: "GitHub", icon: "Github", url: "https://github.com/your-profile" },
      { name: "Facebook", icon: "Facebook", url: "#" },
      { name: "Instagram", icon: "Instagram", url: "#" },
      { name: "LinkedIn", icon: "Linkedin", url: "#" },
    ],
    getInTouchLinks: [
      { icon: "Mail", name: "Email", url: "mailto:your.email@example.com", color: "bg-red-500 hover:bg-red-600" },
      { icon: "MessageSquare", name: "Telegram", url: "https://t.me/yourusername", color: "bg-sky-500 hover:bg-sky-600" },
      { icon: "Linkedin", name: "LinkedIn", url: "https://linkedin.com/in/your-profile", color: "bg-blue-600 hover:bg-blue-700" },
    ],
    cvLink: "#",
  },
  about: {
    title: "About Me",
    subtitle: "My story and skills.",
    bio_p1: "I am a passionate full-stack developer with a knack for creating elegant solutions in the least amount of time. I have experience with a wide range of technologies, including React, Node.js, and Python. I am always eager to learn new things and take on new challenges.",
    bio_p2: "When I'm not coding, I enjoy spending time with my family, reading, and playing video games. I am also a big fan of open-source software and contribute to various projects in my spare time.",
    skills: ["React", "TypeScript", "Node.js", "Python", "Supabase", "Tailwind CSS", "Figma"],
    features: [
      { icon: "Code", title: "Web Development", description: "Building responsive and dynamic websites." },
      { icon: "Database", title: "Database Management", description: "Working with SQL and NoSQL databases." },
      { icon: "PenTool", title: "UI/UX Design", description: "Designing user-friendly interfaces." },
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
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<Content>(() => {
    try {
      const savedContent = localStorage.getItem('portfolioContent');
      return savedContent ? JSON.parse(savedContent) : initialContent;
    } catch (error) {
      console.error("Failed to parse content from localStorage", error);
      return initialContent;
    }
  });

  const updateContent = (newContent: Partial<Content>) => {
    setContent(prevContent => {
      const updated = { ...prevContent, ...newContent };
      localStorage.setItem('portfolioContent', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};