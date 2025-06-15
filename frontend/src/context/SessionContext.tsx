import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface SessionContextType {
  umbrellaId: string | null;
  sessionStart: number | null;
  isValid: boolean;
  validateSession: () => boolean;
  setSession: (umbrellaId: string) => void;
  clearSession: () => void;
  isInitialized: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [umbrellaId, setUmbrellaId] = useState<string | null>(null);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  const validateSession = () => {
    if (!isInitialized) return false;
    if (!umbrellaId || !sessionStart) {
      console.log('No session data:', { umbrellaId, sessionStart });
      return false;
    }
    const now = Date.now();
    const isValid = now - sessionStart < SESSION_DURATION;
    console.log('Session validation:', {
      now,
      sessionStart,
      diff: now - sessionStart,
      isValid
    });
    return isValid;
  };

  const setSession = (newUmbrellaId: string) => {
    const timestamp = Date.now();
    console.log('Setting session:', { newUmbrellaId, timestamp });
    setUmbrellaId(newUmbrellaId);
    setSessionStart(timestamp);
    sessionStorage.setItem('umbrellaId', newUmbrellaId);
    sessionStorage.setItem('sessionStart', timestamp.toString());
  };

  const clearSession = () => {
    console.log('Clearing session');
    setUmbrellaId(null);
    setSessionStart(null);
    sessionStorage.removeItem('umbrellaId');
    sessionStorage.removeItem('sessionStart');
  };

  useEffect(() => {
    // Load session from storage on mount
    const storedUmbrellaId = sessionStorage.getItem('umbrellaId');
    const storedSessionStart = sessionStorage.getItem('sessionStart');
    
    console.log('Loading from storage:', { storedUmbrellaId, storedSessionStart });
    
    if (storedUmbrellaId && storedSessionStart) {
      setUmbrellaId(storedUmbrellaId);
      setSessionStart(parseInt(storedSessionStart));
    }
    setIsInitialized(true);
  }, []);

  const isValid = useMemo(() => validateSession(), [umbrellaId, sessionStart, isInitialized]);

  const value = {
    umbrellaId,
    sessionStart,
    isValid,
    validateSession,
    setSession,
    clearSession,
    isInitialized
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