import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/organisms/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const FeaturedProducts = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
const featured = await productService.getFeaturedProducts();
      setProducts(featured);
    } catch (err) {
      setError(err.message || "Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    onAddToCart(product);
    toast.success(`${product.title_c || product.title} added to cart!`);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <Loading type="grid" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadFeaturedProducts} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-white via-background to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            Featured <span className="gradient-primary bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-body">
            Discover our top-rated products that customers love most
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;