"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface DbUser {
  id: string;
  email: string;
  firebaseUid: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, dbUser: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        try {
          console.log('AuthContext: Firebase user detected', firebaseUser.email);
          const res = await fetch('/api/user/me');
          const data = await res.json();
          console.log('AuthContext: Fetched dbUser:', data);
          if (res.ok) {
            setDbUser(data.user);
          } else {
            setDbUser(null);
          }
        } catch (e) {
          console.log('AuthContext: Error fetching dbUser', e);
          setDbUser(null);
        }
      } else {
        console.log('AuthContext: No firebase user');
        setDbUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, dbUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 