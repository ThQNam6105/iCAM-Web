import { supabase } from './supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

export interface UserSession {
  isAuthenticated: boolean;
  username: string;
  email: string;
  role: 'super_admin' | 'content_admin' | 'guest';
  user: User | null;
  session: Session | null;
}

export const authService = {
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Friendly Vietnamese error translation
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) {
          msg = 'Email hoặc mật khẩu không chính xác.';
        } else if (msg.includes('Email not confirmed')) {
          msg = 'Email chưa được xác nhận.';
        }
        return { success: false, error: msg };
      }

      if (data.session) {
        return { success: true };
      }
      return { success: false, error: 'Đăng nhập không thành công.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Lỗi kết nối hệ thống.' };
    }
  },

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase logout notice:', err);
    }
  },

  async getSession(): Promise<UserSession> {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session && session.user) {
        return {
          isAuthenticated: true,
          username: session.user.email?.split('@')[0] || 'Admin',
          email: session.user.email || '',
          role: 'super_admin',
          user: session.user,
          session: session,
        };
      }
    } catch (err) {
      console.warn('Get auth session error:', err);
    }

    return {
      isAuthenticated: false,
      username: '',
      email: '',
      role: 'guest',
      user: null,
      session: null,
    };
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },
};
