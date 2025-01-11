import './ProductCard.css'; 

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card-container">
    <div>
      <img
        src={product.imagen}
        alt={product.nombre}
        className="product-image"
      />
    </div>
    <div>
      <div>
        <h3 className="product-title">{product.nombre}</h3>
      </div>
      <p className="product-description">{product.descripcion}</p>
    </div>
    <div>
      <p className="product-price">${product.precio}</p>
    </div>
    <div>
      <button onClick={() => onAddToCart(product)}>
        Agregar al pedido
      </button>
    </div>
  </div>
  );
}