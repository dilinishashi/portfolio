import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && (location.pathname === '/admin' || location.pathname === '/admin/')) {
      navigate('/admin/dashboard');
    } else if (!session && !isLoading && location.pathname.startsWith('/admin/dashboard')) {
      navigate('/admin');
    }
  }, [session, isLoading, location.pathname, navigate]);

  return (
    <SupabaseContext.Provider value={{ supabase: supabaseClient, session, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};