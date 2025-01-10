import { useState } from 'react';
import Image from 'next/image';

export default function ProductsTable({ products, categories, handleEdit, handleDelete }) {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [search, setSearch] = useState('');

    const leakedProducts = products.filter(product => 
        categoryFilter === 'all' || product.categoria_id === parseInt(categoryFilter)
      )
      .filter(product =>
        product.nombre.toLowerCase().includes(search.toLowerCase())
      );

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


        {/* Lista de productos existentes */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
        <thead className="bg-gray-50">
            <tr>
            <th className="border-b p-4 text-left">Imagen</th>
            <th className="border-b p-4 text-left">Nombre</th>
            <th className="border-b p-4 text-left">Descripción</th>
            <th className="border-b p-4 text-left">Precio</th>
            <th className="border-b p-4 text-left">Categoría</th>
            <th className="border-b p-4 text-left">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {leakedProducts.map(product => (
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
                <button onClick={() => handleEdit(product)} className="text-blue-500 mr-2 hover:text-blue-700">
                    Editar
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">
                    Eliminar
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
        </div>
        </>
    )
}