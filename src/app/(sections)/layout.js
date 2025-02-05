'use client';
import { usePathname, useRouter } from 'next/navigation';
import { MdArrowBack } from "react-icons/md";

const sectionTitles = {
    '/menu': 'MENÚ',
    '/menu/1': 'BEBIDAS',
    '/menu/2': 'COMIDAS',
    '/menu/3': 'POSTRES',
    '/pedidos': 'PEDIDOS',
    '/reservas': 'RESERVAS',
    '/nosotros': 'NOSOTROS',
    '/pedidos/detalle': 'TU PEDIDO',
};

export default function MenuLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const title = sectionTitles[pathname];

    return (
        <>
        <header className="flex justify-between items-center bg-[#333] p-4">
            <button onClick={() => router.back()} className="text-white px-4 py-2 rounded-lg">
                <MdArrowBack size={23} />
            </button>
            <h1 className="flex-1 text-center text-xl font-semibold text-[#ff9800]">{title}</h1>
        </header>

        <main>{children}</main>
        </>
    );
    }