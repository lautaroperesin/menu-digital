'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { BsTwitter, BsInstagram, BsFacebook } from "react-icons/bs";

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

        {/* Botón para ir a la página de menú */}
        <Link href="/menu">
          <button className="menu-btn">
            MENÚ
          </button>
        </Link>
        {/* Botón para ir a la página de Pedidos */}
        <Link href="/menu">
          <button className="menu-btn">
            PEDIDOS
          </button>
        </Link>
        {/* Botón para ir a la página de Pedidos */}
        <Link href="/menu">
          <button className="menu-btn">
            RESERVAS
          </button>
        </Link>
        {/* Botón para ir a la página de Pedidos */}
        <Link href="/menu">
          <button className="menu-btn">
            DEJANOS TU OPINIÓN
          </button>
        </Link>

        {categorias.map((categoria) => (
        <Link href={`/menu?categoria=${categoria.id}`} key={categoria.id}>
          <button>
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
            <i className="fab fa-facebook">
              <BsFacebook />
            </i>
          </Link>
          <Link href="https://twitter.com" target="_blank">
            <i className="fab fa-twitter">
              <BsTwitter />
            </i>
          </Link>
          <Link href="https://instagram.com" target="_blank">
            <i className="fab fa-instagram">
              <BsInstagram />
            </i>
          </Link>
        </div>
      </footer>
    </section>
  );
}

