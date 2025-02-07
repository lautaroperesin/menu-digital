"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoriesNavBar from "@/components/CategoriesNavBar/CategoriesNavBar";

export default function CategoriaPage() {
  const paramsPromise = useParams();
  const categoriaId = paramsPromise.categoriaId;

  const [productos, setProductos] = useState([]);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`/api/productos?categoria=${categoriaId}`);
        const data = await res.json();
        setProductos(data);
      }
      catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }
  , []);

  useEffect(() => {
    if (subcategoriaSeleccionada) {
      const element = document.getElementById(subcategoriaSeleccionada);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [subcategoriaSeleccionada]);

  return (
    <div className="p-6">
      <CategoriesNavBar categoriaId={categoriaId} onSelectSubcategoria={setSubcategoriaSeleccionada} />

      {productos && Object.entries(
        productos.reduce((grupos, producto) => {
          // Determinar la subcategoría (usando subcategoria_id o un valor predeterminado)
          const subcategoria = producto.subcategoria_nombre || 'OTROS';

          // Inicializar el array para la subcategoría si no existe
          if (!grupos[subcategoria]) {
            grupos[subcategoria] = [];
          }

          // Agregar el producto al grupo correspondiente
          grupos[subcategoria].push(producto);

          return grupos;
        }, {})
      ).map(([subcategoria, productos]) => (
        <div key={subcategoria} id={subcategoria}>
          <h2 className="text-xl font-bold text-black mt-4 p-4 bg-[#ff9500f6] rounded-md">{subcategoria}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}