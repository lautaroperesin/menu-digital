'use client'

import { useState, useEffect } from 'react';
  
export default function TopProductsTable() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch('/api/top-productos');
        const data = await response.json();
        
        // Asegurarse de que `data` es un array antes de asignarlo
        if (Array.isArray(data)) {
          setTopProducts(data);
        } else {
          console.error('La respuesta no es un array:', data);
          setTopProducts([]);
        }
      } catch (error) {
        console.error('Error al cargar los productos:', error);
        setTopProducts([]);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <table className="w-full border-separate border-spacing-0 shadow-lg rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
          <th className="py-3 px-4 text-center">#</th>
          <th className="py-3 px-4 text-left">Producto</th>
          <th className="py-3 px-4 text-right">Ventas</th>
          <th className="py-3 px-4 text-right">Ingresos</th>
        </tr>
      </thead>
      <tbody>
        {topProducts.map((product, index) => (
          <tr key={product.id} className="border-t border-gray-300 hover:bg-gray-100 transition-all duration-200">
            <td className="py-4 px-4 text-center text-sm text-gray-700">{index + 1}</td>
            <td className="py-4 px-4 text-sm font-medium text-gray-800">{product.nombre}</td>
            <td className="py-4 px-4 text-sm text-right text-gray-600">{product.total_vendido}</td>
            <td className="py-4 px-4 text-sm text-right text-gray-600">${product.ingresos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  
}
