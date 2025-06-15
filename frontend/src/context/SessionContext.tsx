import React, { createContext, useContext, useState, useEffect } from 'react';

interface SessionContextType {
  umbrellaId: string | null;
  sessionStart: number | null;
  isValid: boolean;
  validateSession: () => boolean;
  setSession: (umbrellaId: string) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [umbrellaId, setUmbrellaId] = useState<string | null>(null);
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  const validateSession = () => {
    if (!umbrellaId || !sessionStart) return false;
    const now = Date.now();
    return now - sessionStart < SESSION_DURATION;
  };

  const setSession = (newUmbrellaId: string) => {
    setUmbrellaId(newUmbrellaId);
    setSessionStart(Date.now());
    sessionStorage.setItem('umbrellaId', newUmbrellaId);
    sessionStorage.setItem('sessionStart', Date.now().toString());
  };

  const clearSession = () => {
    setUmbrellaId(null);
    setSessionStart(null);
    sessionStorage.removeItem('umbrellaId');
    sessionStorage.removeItem('sessionStart');
  };

  useEffect(() => {
    // Load session from storage on mount
    const storedUmbrellaId = sessionStorage.getItem('umbrellaId');
    const storedSessionStart = sessionStorage.getItem('sessionStart');
    
    if (storedUmbrellaId && storedSessionStart) {
      setUmbrellaId(storedUmbrellaId);
      setSessionStart(parseInt(storedSessionStart));
    }
  }, []);

  const value = {
    umbrellaId,
    sessionStart,
    isValid: validateSession(),
    validateSession,
    setSession,
    clearSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}; 