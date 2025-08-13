import { useState, useEffect } from "react";
import HeroBanner from "@/components/organisms/HeroBanner";
import CategoryBanner from "@/components/organisms/CategoryBanner";
import FeaturedProducts from "@/components/organisms/FeaturedProducts";
import CreateProductModal from "@/components/molecules/CreateProductModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import { categoryService } from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
const Home = ({ onAddToCart }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [featuredProductsKey, setFeaturedProductsKey] = useState(0);
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading type="grid" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadCategories} />
      </div>
    );
  }

const handleCreateSuccess = () => {
    // Force re-render of FeaturedProducts to show new product
    setFeaturedProductsKey(prev => prev + 1);
  };

  return (
    <div className="space-y-0">
      <HeroBanner />
      <CategoryBanner categories={categories} />
      
      {/* Create Product Button Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
            <p className="text-gray-600 mt-1">Add new products to your inventory</p>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
          >
            <ApperIcon name="Plus" size={20} />
            <span>Create Product</span>
          </Button>
        </div>
      </div>
      
      <FeaturedProducts key={featuredProductsKey} onAddToCart={onAddToCart} />
      
      <CreateProductModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default Home;