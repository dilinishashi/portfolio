import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SectionContent {
  title: string;
  description: string;
}

interface SocialLink {
  icon: string;
  name: string;
  url: string;
}

interface Content {
  hero: {
    greeting: string;
    name: string;
    role: string;
    description: string;
    cvLink: string;
    contactLink: string;
    socials: SocialLink[];
  };
  about: SectionContent;
  portfolio: SectionContent;
  gallery: SectionContent;
  contact: SectionContent;
}

interface ContentContextType {
  content: Content;
  updateContent: (newContent: Partial<Content>) => void;
}

const initialContent: Content = {
  hero: {
    greeting: "Hello, I'm",
    name: 'Nawayir Inamulhasan',
    role: 'Software Quality Assurance Engineer',
    description: "I'm a Quality Assurance Engineer who turns clean code into reliable software. I build smart automation frameworks, test APIs, and ensure every release meets real-world quality. Passionate about performance, precision, and continuous improvement.",
    cvLink: '#',
    contactLink: '#contact',
    socials: [
      { icon: 'Code', name: 'Dev Portfolio', url: '#' },
      { icon: 'Linkedin', name: 'LinkedIn', url: '#' },
      { icon: 'Mail', name: 'Email', url: 'mailto:your-email@example.com' },
      { icon: 'MessageCircle', name: 'WhatsApp', url: '#' },
      { icon: 'Facebook', name: 'Facebook', url: '#' },
      { icon: 'Music', name: 'TikTok', url: '#' },
    ],
  },
  about: {
    title: 'About Me',
    description: 'I am a passionate developer with experience in building modern web applications. You can edit this text in the admin dashboard.',
  },
  portfolio: {
    title: 'Portfolio',
    description: 'Here are some of my recent projects. You can edit this text in the admin dashboard.',
  },
  gallery: {
    title: 'Gallery',
    description: 'A collection of my visual work and inspirations. You can edit this text in the admin dashboard.',
  },
  contact: {
    title: 'Contact',
    description: 'Feel free to reach out! You can edit this text in the admin dashboard.',
  },
};

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<Content>(initialContent);

  const updateContent = (newContent: Partial<Content>) => {
    setContent(prevContent => {
        const updatedContent = { ...prevContent };
        for (const key in newContent) {
            if (Object.prototype.hasOwnProperty.call(newContent, key)) {
                const section = key as keyof Content;
                updatedContent[section] = {
                    ...prevContent[section],
                    ...newContent[section],
                };
            }
        }
        return updatedContent;
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
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};