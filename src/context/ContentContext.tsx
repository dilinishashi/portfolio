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
  description:string;
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