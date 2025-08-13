import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/organisms/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const ProductGrid = ({ category, searchQuery, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      let data;
      if (searchQuery) {
        data = await productService.searchProducts(searchQuery);
      } else if (category) {
        data = await productService.getProductsByCategory(category);
      } else {
        data = await productService.getAll();
      }
      
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category, searchQuery]);

  const handleAddToCart = (product) => {
    onAddToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  if (loading) {
    return <Loading type="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No products found"
        message={
          searchQuery
            ? `No products found for "${searchQuery}". Try different keywords.`
            : category
            ? `No products found in this category.`
            : "No products available at the moment."
        }
        icon="Package"
      />
    );
  }

  return (
    <div className="space-y-6">
      {(searchQuery || category) && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            {searchQuery ? `Search results for "${searchQuery}"` : `${category} Products`}
          </h2>
          <p className="text-gray-600 font-body">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        layout
      >
        <AnimatePresence>
{products.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProductGrid;