'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import Login from '../../components/Login/Login';
import OrderManagement from '@/components/OrderManagement/OrderManagement';
import ProductsTable from '@/components/ProductsTable/ProductsTable';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">Panel de Administración</h1>
      <button onClick={handleLogout} className='p-3 mb-4 bg-red-600 rounded-full hover:bg-red-800'>Cerrar Sesión</button>

      <Link href="/admin/pedidos">
      <button className='p-3 mb-4 bg-yellow-500 rounded-full hover:bg-yellow-800'>Gestión de pedidos</button>
      </Link>

      <Link href="/admin/productos">
      <button className='p-3 mb-4 bg-yellow-500 rounded-full hover:bg-yellow-800'>Gestión de productos</button>
      </Link>
    </div>
  );
}