import Link from 'next/link';

export default function MenuLayout({ children }) {
    return (
        <>
        <Link href="../" className="text-blue-500 hover:underline mb-4 block">
        ←
        </Link>
        <main>{children}</main>
        </>
    );
    }