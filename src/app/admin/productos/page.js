'use client';
import { useEffect, useState } from 'react';
import ProductForm from "@/components/ProductForm";
import ProductsTable from "@/components/ProductsTable/ProductsTable";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editProduct, setEditProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
      }, []);

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Gestión de Productos</h1>

      <ProductForm 
        initialProduct={editProduct || {}}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
        isEditing={!!editProduct}
        />

      <ProductsTable 
        products={products}
        categories={categories}
        onEdit={(product) => setEditProduct(product)}
        onDelete={handleDelete}
      />
    </div>
  );
}