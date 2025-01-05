export default function ProductCard({ product, onAddToCart }) { 
        return (
            <div className="contenedor-carta overflow-hidden">
              <div className="p-0">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{product.nombre}</h3>
                  <p variant="secondary">{product.categoria}</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.descripcion}</p>
              </div>
              <div className="p-4 pt-0">
                <p className="text-xl font-bold text-yellow-600">${product.precio}</p>
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