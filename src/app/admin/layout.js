'use client'

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { signOutUser } from '@/utils/auth';
import { auth } from '@/utils/firebaseConfig';
import Login from '@/components/Login/Login';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/SideBar';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    router.push('/admin');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen">
        <Sidebar handleLogout={handleLogout}/>
        <main className="flex-1 overflow-y-auto p-8">
            {children}
        </main>
    </div>
  );
}