"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoriesNavBar from "@/components/CategoriesNavBar/CategoriesNavBar";

export default function CategoriaPage() {
  const paramsPromise = useParams();
  const categoriaId = paramsPromise.categoriaId;

  const [productos, setProductos] = useState([]);

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

  return (
    <div className="p-6">
      <CategoriesNavBar categoriaId={categoriaId} />
      
        {productos.map((producto) => (
          <ProductCard producto={producto} key={producto.id} />
        ))}
    </div>
  );
}