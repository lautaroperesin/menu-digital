import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { GiMeal } from "react-icons/gi";
import { RiInformation2Fill } from "react-icons/ri";

export default function NavBar() {
    return (
        <nav className="nav-menu">
            <Link href="/" className="nav-link">
                <AiFillHome />
                <span>INICIO</span>
            </Link>
            <Link href="/menu" className="nav-link">
                <GiMeal />
                <span>MENÚ</span>
            </Link>
            <Link href="/nosotros" className="nav-link">
                <RiInformation2Fill />
                <span>NOSOTROS</span>
            </Link>
        </nav>
    );
}