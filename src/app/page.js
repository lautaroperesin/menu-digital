import Link from "next/link";

export default function Home() {
  return (
    <section className="home">
      <div className="presentation">
        <img
          src="img/LOGO (2).png"
          alt="Logo de la empresa"
          className="logo-presentation animated-logo"
        />
        <h1>¡Bienvenidos a Nuestra Web!</h1>
        <p>Descubrí todas las opciones que tenemos para vos.</p>
        <Link href="/menu">
          <button>Explorar</button>
        </Link>
      </div>
    </section>
  );
}
