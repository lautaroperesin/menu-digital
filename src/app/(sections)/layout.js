'use client';
import { usePathname, useRouter } from 'next/navigation';
import { MdArrowBack } from "react-icons/md";

const sectionTitles = {
    '/menu': 'MENÚ',
    '/pedidos': 'PEDIDOS',
    '/reservas': 'RESERVAS',
    '/nosotros': 'NOSOTROS',
    '/pedidos/detalle': 'TU PEDIDO',
};

const getTitle = (pathname) => {
    if (pathname.startsWith('/menu/')) return 'MENÚ'; // Para categorías dinámicas
    return sectionTitles[pathname];
};

const getPreviousRoute = (pathname) => {
    const pathSegments = pathname.split('/').filter(Boolean); // Divide la ruta en segmentos
    if (pathSegments.length > 1) {
        pathSegments.pop(); // Elimina el último segmento para obtener la ruta anterior
        return `/${pathSegments.join('/')}`;
    }
    return '/'; // Si no hay ruta anterior, redirige al inicio
};

export default function MenuLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const title = getTitle(pathname);
    const previousRoute = getPreviousRoute(pathname);

    return (
        <>
        <header className="flex justify-between items-center bg-[#333] p-4">
            <button onClick={() => router.push(previousRoute)} className="text-white px-4 py-2 rounded-lg">
                <MdArrowBack size={23} />
            </button>
            <h1 className="flex-1 text-center text-xl font-semibold text-[#ff9800]">{title}</h1>
        </header>

        <main>{children}</main>
        </>
    );
    }