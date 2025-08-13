import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import RatingStars from "@/components/molecules/RatingStars";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.Id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl card-shadow card-hover cursor-pointer overflow-hidden group"
      onClick={handleProductClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images?.[0] || "/api/placeholder/300/300"}
          alt={product.title_c || product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Stock Badge */}
        {!product.in_stock_c && !product.inStock && (
          <div className="absolute top-3 left-3">
            <Badge variant="error">Out of Stock</Badge>
          </div>
        )}
        
        {/* Quick Add Button */}
        {(product.in_stock_c || product.inStock) && (
          <motion.div
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="icon"
              className="gradient-primary text-white shadow-lg"
              onClick={handleAddToCart}
            >
              <ApperIcon name="Plus" size={20} />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 font-display group-hover:text-primary transition-colors duration-300">
            {product.title_c || product.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 font-body">
            {product.category_c?.Name || product.category}
          </p>
        </div>

        {/* Rating */}
        <RatingStars 
          rating={product.rating_c || product.rating} 
          reviewCount={product.review_count_c || product.reviewCount} 
        />

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold gradient-primary bg-clip-text text-transparent font-display">
              {formatPrice(product.price_c || product.price)}
            </p>
          </div>
          
          {(product.in_stock_c || product.inStock) && (
            <Button
              size="sm"
              className="gradient-secondary text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleAddToCart}
            >
              <ApperIcon name="ShoppingCart" size={16} className="mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;