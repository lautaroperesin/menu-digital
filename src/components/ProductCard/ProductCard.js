import './ProductCard.css'; 

export default function ProductCard({ producto, onAddToCart }) {
  return (
    <div className="product-card-container">
    <div>
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="product-image"
      />
    </div>
    <div>
      <h3 className="product-title">{producto.nombre}</h3>
      <p className="product-description">{producto.descripcion}</p>
    </div>
    <div>
      <p className="product-price">${producto.precio}</p>
    </div>
    <div>
      <button onClick={() => onAddToCart(producto)}>
        AGREGAR
      </button>
    </div>
  </div>
  );
}