import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="nav-menu">
            <Link href="/" className="nav-link"><i className="fas fa-home"></i> INICIO</Link>
            <Link href="/menu" className="nav-link"><i className="fas fa-utensils"></i> MENÚ</Link>
            <Link href="/nosotros" className="nav-link"><i className="fas fa-info-circle"></i> NOSOTROS</Link>
        </nav>
    );
}