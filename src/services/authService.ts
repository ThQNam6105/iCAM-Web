const ADMIN_SESSION_KEY = 'icancam_admin_session';

export interface UserSession {
  isAuthenticated: boolean;
  username: string;
  role: 'admin' | 'editor';
  token?: string;
}

export const authService = {
  isAuthenticated(): boolean {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  },

  login(password: string): boolean {
    if (password === 'icancam2026' || password === 'admin123') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  },

  logout(): void {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  },

  getSession(): UserSession {
    const isAuth = this.isAuthenticated();
    return {
      isAuthenticated: isAuth,
      username: isAuth ? 'iCANCAM Admin' : '',
      role: 'admin',
    };
  },
};
