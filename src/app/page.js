import Link from "next/link";

export default function Home() {
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
        <Link href="/menu">
          <button>Explorar</button>
        </Link>
      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </section>
  );
}
