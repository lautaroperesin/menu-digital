'use client'

import { useState, useEffect } from 'react';
  
export default function TopProductsTable() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      const response = await fetch('/api/top-productos');
      const data = await response.json();
      setTopProducts(data);
    };

    fetchTopProducts();
  }, []);

  return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-yellow-500 text-white">
            <th></th>
            <th>Producto</th>
            <th className="text-right">Ventas</th>
            <th className="text-right">Ingresos</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((product) => (
            <tr key={product.id} className="border-t border-yellow-500 hover:bg-yellow-100">
              <td className="text-center">{topProducts.indexOf(product) + 1}</td>
              <td className="font-medium">{product.nombre}</td>
              <td className="text-right">{product.total_vendido}</td>
              <td className="text-right">${product.ingresos}</td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}
  