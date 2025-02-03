"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard/ProductCard";

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
  , [categoriaId]);

  return (
    <div className="p-6">
       <Link href="/menu" className="text-blue-500 hover:underline mb-4 block">
        ← Volver al Menú
      </Link>

      <h1 className="text-2xl font-bold mb-4">Productos</h1>
        {productos.map((producto) => (
          <ProductCard producto={producto} key={producto.id} />
        ))}
    </div>
  );
}