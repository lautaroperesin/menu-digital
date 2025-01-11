'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import Login from '../../components/Login/Login';
import OrderManagement from '@/components/OrderManagement/OrderManagement';
import ProductsTable from '@/components/ProductsTable/ProductsTable';
import ProductForm from '@/components/ProductForm';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchProducts();
        fetchCategories();
      } else {
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const fetchProducts = async () => {
    const response = await fetch('/api/productos');
    const data = await response.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/categorias');
    const data = await response.json();
    setCategories(data);
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
  }

  const handleSubmit = async (product) => {
    const url = '/api/productos';
    const method = editProduct ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      setEditProduct(null);
      fetchProducts();
      method === 'POST' ? console.log('Producto agregado exitosamente') : console.log('Producto editado exitosamente');
    } else {
      console.log('Error al guardar el producto:', await response.json());
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Estás seguro de eliminar este producto?')) {
      const response = await fetch(`/api/productos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
      });

      if (response.ok) {
        fetchProducts();
      }
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">Panel de Administración</h1>
      <button onClick={handleLogout} className='p-3 mb-4 bg-red-600 rounded-full hover:bg-red-800'>Cerrar Sesión</button>

      <ProductForm 
        initialProduct={editProduct || {}}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
        isEditing={!!editProduct}
      />

      {/* <OrderManagement /> */}

      <ProductsTable
       products={products}
       categories={categories} 
       onEdit={(product) => setEditProduct(product)}
       onDelete={handleDelete} />
    </div>
  );
}