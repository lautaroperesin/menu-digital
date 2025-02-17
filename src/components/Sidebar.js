import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { HiOutlineClipboardList, HiOutlineShoppingBag  } from "react-icons/hi";
import { FaClipboardCheck } from "react-icons/fa6";
import { PiSignOutBold } from "react-icons/pi";

export default function Sidebar( {handleLogout} ) {
    return (
        <aside className="w-64 bg-yellow-500 text-black p-6">
        <nav className="space-y-8">
          <div className="flex items-center space-x-2">
            <AiFillHome className="w-6 h-6" />
            <Link href="/admin" className="text-xl font-bold">
              Admin Panel
            </Link>
          </div>
          <ul className="space-y-4">
            <li>
              <Link href="/admin/productos" className="flex items-center space-x-2 hover:text-yellow-600">
                <HiOutlineShoppingBag className="w-5 h-5" />
                <span>Productos</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/pedidos" className="flex items-center space-x-2 hover:text-yellow-600">
                <HiOutlineClipboardList className="w-5 h-5" />
                <span>Pedidos</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/reserva" className="flex items-center space-x-2 hover:text-yellow-600">
                <FaClipboardCheck className="w-5 h-5" />
                <span>Reservas</span>
              </Link>
            </li>
            <li>
                <button onClick={handleLogout} className="flex items-center space-x-2 hover:text-yellow-600">
                    <PiSignOutBold className="w-5 h-5" />
                    <span>Cerrar sesión</span>
                </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
    }