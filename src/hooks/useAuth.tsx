import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  username: string | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, username: string) => Promise<{ error?: string }>;
  signInWithProvider: (provider: "google" | "apple") => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  logEvent: (action: string, payload?: Record<string, unknown>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const defaultValue: AuthContextValue = {
  session: null,
  user: null,
  loading: false,
  username: null,
  signInWithEmail: async () => ({ error: "Auth not configured" }),
  signUpWithEmail: async () => ({ error: "Auth not configured" }),
  signInWithProvider: async () => ({ error: "Auth not configured" }),
  signOut: async () => undefined,
  logEvent: async () => undefined
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(isSupabaseConfigured));

  useEffect(() => {
    if (!supabase) return;

    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    if (!supabase) {
      return defaultValue;
    }

    const user = session?.user ?? null;
    const username = user?.user_metadata?.username ?? null;

    return {
      session,
      user,
      loading,
      username,
      signInWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message };
      },
      signUpWithEmail: async (email, password, desiredUsername) => {
        const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/login?verified=1` : undefined;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { username: desiredUsername }
          }
        });
        return { error: error?.message };
      },
      signInWithProvider: async (provider) => {
        const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
        const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
        return { error: error?.message };
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
      logEvent: async (action, payload) => {
        if (!user) return;
        await supabase.from("user_events").insert({
          user_id: user.id,
          action,
          payload: payload ?? {},
          occurred_at: new Date().toISOString()
        });
      }
    };
  }, [loading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
