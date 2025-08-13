import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { categoryService } from "@/services/api/categoryService";

const Category = ({ onAddToCart }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategory = async () => {
    try {
      setLoading(true);
      setError("");
      const categoryData = await categoryService.getById(parseInt(categoryId));
      setCategory(categoryData);
    } catch (err) {
      setError(err.message || "Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
        <Loading type="grid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadCategory} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
{category?.Name || category?.name || "Category"}
        </h1>
        <p className="text-lg text-gray-600 font-body">
          Discover amazing products in this category
        </p>
      </motion.div>

      <ProductGrid
        category={category?.Name || category?.name}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};

export default Category;