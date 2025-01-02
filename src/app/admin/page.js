'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import Login from '../../components/Login/Login';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [newProduct, setNewProduct] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '', 
    imagen: '',
    categoria_id: ''
  });
  const [editProduct, setEditProduct] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchProducts();
        fetchCategories();
      } else {
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const fetchProducts = async () => {
    const response = await fetch('/api/productos');
    const data = await response.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/categorias');
    const data = await response.json();
    setCategories(data);
  };

  const handleEdit = (product) => {
    setEditProduct(product.id);
    console.log("Editando producto: "+ product.nombre);
    console.log("ID del producto: " + product.id);
    setNewProduct({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen: product.imagen,
      categoria_id: product.categoria_id
    });
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
    setNewProduct({
      id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      categoria_id: ''
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = '/api/productos';
    const method = editProduct ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    console.log('Datos enviados al servidor:', newProduct);

    if (response.ok) {
      handleCancelEdit();
      fetchProducts();
      method === 'POST' ? console.log('Producto agregado exitosamente') : console.log('Producto editado exitosamente');
      console.log(newProduct);
    } else {
      console.log('Error al agregar producto:', await response.json());
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Estás seguro de eliminar este producto?')) {
      const response = await fetch(`/api/productos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
      });

      if (response.ok) {
        fetchProducts();
      }
    }
  };

  const leakedProducts = products.filter(product => 
    categoryFilter === 'all' || product.categoria_id === parseInt(categoryFilter)
  )
  .filter(product =>
    product.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostrar preview
    setImagenPreview(URL.createObjectURL(file));
    setSubiendoImagen(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNewProduct(prev => ({
          ...prev,
          imagen: data.url
        }));
      } else {
        alert('Error al subir la imagen');
      }
    } catch (error) {
      alert('Error al subir la imagen');
    } finally {
      setSubiendoImagen(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">Panel de Administración</h1>
      <button onClick={handleLogout} className='p-3 mb-4 bg-red-600 rounded-full hover:bg-red-800'>Cerrar Sesión</button>

      {/* Formulario de nuevo producto */}
      <form onSubmit={handleSubmit} className="max-w-lg mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          {editProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h2>

        <div className="mb-4">
          <label className="block mb-2">Nombre:</label>
          <input
            type="text"
            value={newProduct.nombre || ''}
            onChange={(e) => setNewProduct({...newProduct, nombre: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Descripción:</label>
          <input
            type="text"
            value={newProduct.descripcion || ''}
            onChange={(e) => setNewProduct({...newProduct, descripcion: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Precio:</label>
          <input
            type="number"
            value={newProduct.precio || ''}
            onChange={(e) => setNewProduct({...newProduct, precio: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Categoría:</label>
          <select
            value={newProduct.categoria_id || ''}
            onChange={(e) => setNewProduct({...newProduct, categoria_id: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Imagen:</label>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="w-full p-2 border rounded"
            />
            
            {subiendoImagen && (
              <div className="text-blue-500">
                Subiendo imagen...
              </div>
            )}

            {(imagenPreview || newProduct.imagen) && (
              <div className="relative w-full h-48">
                <Image
                  src={imagenPreview || newProduct.imagen}
                  alt="Preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editProduct ? 'Guardar Cambios' : 'Agregar Producto'}
          </button>
          
          {editProduct && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Filtros */}
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
    </div>
  );
}