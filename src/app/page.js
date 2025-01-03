import "./globals.css";
import Link from "next/link";

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

  const handleCategoriaClick = (categoriaId) => {
    router.push(`/menu?categoria=${categoriaId}`);
  };
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => handleCategoriaClick(categoria.id)}
            className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold">{categoria.nombre}</h2>
          </button>
        ))}
      </div>
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

