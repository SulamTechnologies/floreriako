import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/shared/lib/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string, captchaToken?: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    captchaToken?: string,
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  isLoading: true,

  signIn: async (email, password, captchaToken) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: captchaToken ? { captchaToken } : undefined,
    });
    if (error) throw error;
  },

  signUp: async (email, password, fullName, captchaToken) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, ...(captchaToken ? { captchaToken } : {}) },
    });
    if (error) throw error;
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("fko_cart_merged_uid");
    set({ user: null, session: null });
  },

  initialize: () => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, session, isLoading: false });
    });
    return () => subscription.unsubscribe();
  },
}));
