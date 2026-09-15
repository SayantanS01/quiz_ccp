'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getActiveSession, Session } from '@/lib/idb';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = async () => {
    try {
      const active = await getActiveSession();
      setSession(active);
      
      // Silently purge expired attempts on load
      const { purgeExpiredAttempts } = await import('@/lib/idb');
      await purgeExpiredAttempts();
    } catch (err) {
      console.error('Failed to get active session', err);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [pathname]);

  // Routing guard
  useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname.startsWith('/auth') || pathname.startsWith('/admin/login');
    const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

    if (!session) {
      if (!isAuthRoute) {
        router.replace('/auth/login');
      }
    } else {
      if (isAuthRoute) {
        if (session.isAdmin) {
          router.replace('/admin');
        } else {
          router.replace('/');
        }
      } else if (isAdminRoute && !session.isAdmin) {
        router.replace('/');
      } else if (!isAdminRoute && session.isAdmin) {
        router.replace('/admin');
      }
    }
  }, [session, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Prevent flashing of protected content before redirect
  const isAuthRoute = pathname.startsWith('/auth') || pathname.startsWith('/admin/login');
  if (!session && !isAuthRoute) return null;

  return (
    <AuthContext.Provider value={{ session, loading, refreshSession: checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}
