import Image from "next/image";
import { useState, useEffect } from "react";

export default function ProductForm({
  initialProduct,
  categories,
  onSubmit,
  onCancel,
  isEditing = false,
}) {
  const [product, setProduct] = useState(initialProduct);
  const [imagenPreview, setImagenPreview] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    setProduct(initialProduct || {});
  }, [initialProduct]);

  useEffect(() => {
    if (product.categoria_id) {
      fetch(`/api/subcategorias/${product.categoria_id}`)
        .then((res) => res.json())
        .then((data) => setSubcategories(data));
    }
  }, [product.categoria_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

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
        setProduct(prev => ({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
    setImagenPreview("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-4 p-6 rounded-lg shadow h-fit border-solid border-2 border-gray-200"
    >
      <h2 className="text-xl font-bold mb-4 p-2 rounded">
        {isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}
      </h2>

      {/* Nombre */}
      <div className="mb-4">
        <label className="block mb-2">Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={product.nombre || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <label className="block mb-2">Descripción:</label>
        <input
          type="text"
          name="descripcion"
          value={product.descripcion || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Precio */}
      <div className="mb-4">
        <label className="block mb-2">Precio:</label>
        <input
          type="number"
          name="precio"
          value={product.precio || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Categoría */}
      <div className="mb-4">
        <label className="block mb-2">Categoría:</label>
        <select
          name="categoria_id"
          value={product.categoria_id || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>

        {/* Subcategoría */}
        <div className="mb-4">
        <label className="block mb-2">Subcategoría:</label>
        <select
          name="subcategoria_id"
          value={product.subcategoria_id || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Imagen */}
      <div className="mb-4">
        <label className="block mb-2">Imagen:</label>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            className="w-full p-2 border rounded"
          />

          {subiendoImagen && <div className="text-blue-500">Subiendo imagen...</div>}

          {(imagenPreview || product.imagen) && (
            <div className="relative w-full h-48">
              <Image
                src={imagenPreview || product.imagen}
                alt="Preview"
                fill
                className="object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {isEditing ? "Guardar Cambios" : "Agregar Producto"}
        </button>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}