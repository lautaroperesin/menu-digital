import './ProductCard.css'; 

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card-container">
      <div className="p-0">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="product-image w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="product-title">{product.nombre}</h3>
          <p className="product-category">{product.categoria}</p>
        </div>
        <p className="product-description">{product.descripcion}</p>
      </div>
      <div className="p-4 pt-0">
        <p className="product-price">${product.precio}</p>
      </div>
      <div className="p-4 pt-0">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-yellow-500 text-white font-semibold py-2 rounded"
        >
          Agregar al pedido
        </button>
      </div>
    </div>
  );
}