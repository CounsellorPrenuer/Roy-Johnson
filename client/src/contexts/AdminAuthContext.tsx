import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
  token: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token in localStorage
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (adminToken: string) => {
    localStorage.setItem('admin_token', adminToken);
    setToken(adminToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint if token exists
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if backend fails
    } finally {
      // Always clear local session
      localStorage.removeItem('admin_token');
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}