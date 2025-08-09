import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Content {
  hero: {
    title: string;
    subtitle: string;
  };
}

interface ContentContextType {
  content: Content;
  updateContent: (newContent: Partial<Content>) => void;
}

const initialContent: Content = {
  hero: {
    title: 'Hasan Bose',
    subtitle: 'Full Stack Developer',
  },
};

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<Content>(initialContent);

  const updateContent = (newContent: Partial<Content>) => {
    setContent(prevContent => ({
      ...prevContent,
      ...newContent,
      hero: { ...prevContent.hero, ...newContent.hero }
    }));
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