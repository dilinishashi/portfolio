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

interface GetInTouchLink {
  icon: string;
  name: string;
  url: string;
  color: string;
}

interface Content {
  hero: {
    greeting: string;
    name: string;
    role: string;
    description: string;
    cvLink: string;
    socials: SocialLink[];
    getInTouchLinks: GetInTouchLink[];
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
    socials: [
      { icon: 'Code', name: 'Dev Portfolio', url: '#' },
      { icon: 'Linkedin', name: 'LinkedIn', url: '#' },
      { icon: 'Mail', name: 'Email', url: 'mailto:your-email@example.com' },
      { icon: 'MessageCircle', name: 'WhatsApp', url: '#' },
      { icon: 'Facebook', name: 'Facebook', url: '#' },
      { icon: 'Music', name: 'TikTok', url: '#' },
    ],
    getInTouchLinks: [
      { icon: 'MessageCircle', name: 'WhatsApp', url: '#', color: 'bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800/50 text-green-800 dark:text-green-200' },
      { icon: 'Mail', name: 'Email', url: 'mailto:your-email@example.com', color: 'bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200' },
      { icon: 'Phone', name: 'Phone', url: 'tel:+1234567890', color: 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200' },
      { icon: 'Facebook', name: 'Facebook', url: '#', color: 'bg-sky-100 dark:bg-sky-900/50 hover:bg-sky-200 dark:hover:bg-sky-800/50 text-sky-800 dark:text-sky-200' },
      { icon: 'Music', name: 'TikTok', url: '#', color: 'bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300' },
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