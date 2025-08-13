import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import RatingStars from "@/components/molecules/RatingStars";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      
      const productData = await productService.getById(parseInt(id));
      setProduct(productData);
      
      // Load related products
      const allProducts = await productService.getAll();
      const related = allProducts
        .filter(p => p.category === productData.category && p.Id !== productData.Id)
        .slice(0, 4);
      setRelatedProducts(related);
      
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    
    toast.success(`${quantity} ${product.title}${quantity > 1 ? "s" : ""} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  if (loading) {
    return <Loading type="detail" />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadProduct} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message="Product not found" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
<motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 font-body"
      >
        <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">
          Home
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <button 
          onClick={() => navigate(`/category/${(product.category_c?.Name || product.category).toLowerCase()}`)}
          className="hover:text-primary transition-colors"
        >
          {product.category_c?.Name || product.category}
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900 truncate">{product.title_c || product.title}</span>
      </motion.nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square bg-white rounded-2xl card-shadow overflow-hidden">
            <img
              src={product.images?.[selectedImage] || "/api/placeholder/600/600"}
              alt={product.title_c || product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? "border-primary shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  whileHover={{ scale: selectedImage === index ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={image}
                    alt={`${product.title_c || product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <Badge variant="outline" className="mb-3">
              {product.category_c?.Name || product.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
              {product.title_c || product.title}
            </h1>
            <RatingStars 
              rating={product.rating_c || product.rating} 
              reviewCount={product.review_count_c || product.reviewCount} 
              size={20} 
            />
          </div>

          <div className="space-y-4">
            <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent font-display">
              {formatPrice(product.price_c || product.price)}
            </div>
            
            {!(product.in_stock_c || product.inStock) && (
              <Badge variant="error" className="text-base px-4 py-2">
                Out of Stock
              </Badge>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 font-display">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed font-body">
              {product.description_c || product.description}
            </p>
          </div>

          {/* Quantity and Actions */}
          {(product.in_stock_c || product.inStock) && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium text-gray-900 font-display">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <ApperIcon name="Minus" size={20} />
                  </Button>
                  
                  <span className="w-12 text-center text-lg font-medium font-body">
                    {quantity}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <ApperIcon name="Plus" size={20} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 gradient-primary text-white"
                  onClick={handleAddToCart}
                >
                  <ApperIcon name="ShoppingCart" size={24} className="mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleBuyNow}
                >
                  <ApperIcon name="Zap" size={24} className="mr-2" />
                  Buy Now
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 font-display">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.Id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl card-shadow overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${relatedProduct.Id}`)}
              >
                <img
                  src={relatedProduct.images?.[0] || "/api/placeholder/300/300"}
                  alt={relatedProduct.title_c || relatedProduct.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate font-display">
                    {relatedProduct.title_c || relatedProduct.title}
                  </h3>
                  <p className="text-lg font-bold gradient-primary bg-clip-text text-transparent mt-2 font-display">
                    {formatPrice(relatedProduct.price_c || relatedProduct.price)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default ProductDetail;