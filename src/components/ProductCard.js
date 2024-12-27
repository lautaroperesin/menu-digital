export default function ProductCard( {title, price, description, category, imageUrl = "/api/placeholder/400/300"}){ 
        return (
            <div className="w-72 overflow-hidden">
              <div className="p-0">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p variant="secondary">{category}</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">{description}</p>
              </div>
              <div className="p-4 pt-0">
                <p className="text-xl font-bold text-yellow-600">${price}</p>
              </div>
            </div>
          );
}