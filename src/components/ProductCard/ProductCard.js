import './ProductCard.css';
import { usePathname } from 'next/navigation';

export default function ProductCard({ producto, onAddToCart }) {
  const pathname = usePathname();
  const isPedidosPage = pathname === '/pedidos';

  return (
    <div className="product-card-container">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-title">{producto.nombre}</h3>
        <p className="product-description">{producto.descripcion}</p>
      </div>
      <div className="product-price-button">
        <p className="product-price">${producto.precio}</p>
      </div>
      {isPedidosPage && (
        <button
          className="add-button"
          onClick={() => onAddToCart(producto)}
        >
          Agregar
        </button>
      )}
    </div>
  );
}