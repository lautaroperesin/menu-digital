'use client';
import "./globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  return (
    <section className="home">
      <div className="presentation">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="logo-presentation animated-logo"
        />
        <h1>¡Bienvenidos a Nuestra Web!</h1>
        <p>Descubrí todas las opciones que tenemos para vos.</p>
        {categorias.map((categoria) => (
        <Link href={`/menu?categoria=${categoria.id}`} key={categoria.id}>
          <button className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
          {categoria.nombre}
          </button>
        </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 CMS Equipamientos - Desarrolladores. Todos los derechos reservados.</p>
        <div className="social-icons">
          <Link href="https://facebook.com" target="_blank">
            <i className="fab fa-facebook"></i>
          </Link>
          <Link href="https://twitter.com" target="_blank">
            <i className="fab fa-twitter"></i>
          </Link>
          <Link href="https://instagram.com" target="_blank">
            <i className="fab fa-instagram"></i>
          </Link>
        </div>
      </footer>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </section>
  );
}

