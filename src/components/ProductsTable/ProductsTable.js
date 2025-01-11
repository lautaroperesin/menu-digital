import { useState, useEffect } from 'react';
import Image from 'next/image';
import '@/components/ProductsTable/ProductsTable.css';

export default function ProductsTable({ products, categories, onEdit, onDelete }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [search, setSearch] = useState('');
    const productsPerPage = 10;

    const filteredProducts = products.filter(product =>
        categoryFilter === 'all' || product.categoria_id === parseInt(categoryFilter))
    .filter(product =>
        product.nombre.toLowerCase().includes(search.toLowerCase())
    );

     // Calcular productos para la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    // Reset página cuando cambia la categoría
    useEffect(() => {
        setCurrentPage(1);
    }, [categoryFilter]);

    return(
        <>
        <div className="mb-6 flex gap-4">
        <div className="flex-1">
        <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded"
        />
        </div>
        <div>
        <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2 border rounded"
        >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
            <option key={category.id} value={category.id}>
                {category.nombre}
            </option>
            ))}
        </select>
        </div>
        </div>


        {/* Tabla de productos existentes */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
        <thead className="bg-gray-50">
            <tr className='bg-yellow-500 text-white'>
            <th className="border-b p-4 text-left">Imagen</th>
            <th className="border-b p-4 text-left">Nombre</th>
            <th className="border-b p-4 text-left">Descripción</th>
            <th className="border-b p-4 text-left">Precio</th>
            <th className="border-b p-4 text-left">Categoría</th>
            <th className="border-b p-4 text-left">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {currentProducts.map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
                <td className="border-b p-4">
                {product.imagen && (
                    <div className="relative w-20 h-20">
                    <Image
                        src={product.imagen}
                        alt={product.nombre}
                        fill
                        className="object-cover rounded"
                    />
                    </div>
                )}
                </td>
                <td className="border-b p-4">{product.nombre}</td>
                <td className="border-b p-4">{product.descripcion}</td>
                <td className="border-b p-4">${product.precio}</td>
                <td className="border-b p-4">
                {categories.find(c => c.id === product.categoria_id)?.nombre}
                </td>
                <td className="border-b p-4">
                <button onClick={() => onEdit(product)} className="text-blue-500 mr-2 hover:text-blue-700">
                    Editar
                </button>
                <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700">
                    Eliminar
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-center items-center space-x-2 mt-4">
            <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
            Anterior
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border rounded-lg ${
                currentPage === page
                    ? 'bg-yellow-500 text-white'
                    : 'hover:bg-gray-50'
                }`}
            >
                {page}
            </button>
            ))}
            
            <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
            Siguiente
            </button>
        </div>

        {/* Información de resultados */}
        <div className="text-center text-gray-600">
            Mostrando {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} productos
        </div>
        </div>
        </>
    )
}