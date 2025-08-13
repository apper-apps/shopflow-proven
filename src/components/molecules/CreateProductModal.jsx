import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { productService } from '@/services/api/productService';
import { categoryService } from '@/services/api/categoryService';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { cn } from '@/utils/cn';

const CreateProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title_c: '',
    price_c: '',
    description_c: '',
    images_c: '',
    rating_c: 0,
    review_count_c: 0,
    in_stock_c: true,
    Tags: '',
    category_c: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title_c.trim()) {
      newErrors.title_c = 'Title is required';
    }
    
    if (!formData.price_c || formData.price_c <= 0) {
      newErrors.price_c = 'Valid price is required';
    }
    
    if (!formData.description_c.trim()) {
      newErrors.description_c = 'Description is required';
    }
    
    if (!formData.category_c) {
      newErrors.category_c = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        ...formData,
        price_c: parseFloat(formData.price_c),
        rating_c: parseInt(formData.rating_c),
        review_count_c: parseInt(formData.review_count_c) || 0,
        category_c: parseInt(formData.category_c)
      };

      await productService.create(productData);
      
      toast.success('Product created successfully!');
      
      // Reset form
      setFormData({
        title_c: '',
        price_c: '',
        description_c: '',
        images_c: '',
        rating_c: 0,
        review_count_c: 0,
        in_stock_c: true,
        Tags: '',
        category_c: ''
      });
      setErrors({});
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Create New Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <Input
              value={formData.title_c}
              onChange={(e) => handleInputChange('title_c', e.target.value)}
              placeholder="Enter product title"
              className={cn(errors.title_c && "border-red-500")}
            />
            {errors.title_c && (
              <p className="text-red-500 text-sm mt-1">{errors.title_c}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price_c}
              onChange={(e) => handleInputChange('price_c', e.target.value)}
              placeholder="0.00"
              className={cn(errors.price_c && "border-red-500")}
            />
            {errors.price_c && (
              <p className="text-red-500 text-sm mt-1">{errors.price_c}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description_c}
              onChange={(e) => handleInputChange('description_c', e.target.value)}
              placeholder="Enter product description"
              rows={3}
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none",
                errors.description_c && "border-red-500"
              )}
            />
            {errors.description_c && (
              <p className="text-red-500 text-sm mt-1">{errors.description_c}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category_c}
              onChange={(e) => handleInputChange('category_c', e.target.value)}
              className={cn(
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                errors.category_c && "border-red-500"
              )}
              disabled={categoriesLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.Id}>
                  {category.Name}
                </option>
              ))}
            </select>
            {errors.category_c && (
              <p className="text-red-500 text-sm mt-1">{errors.category_c}</p>
            )}
          </div>

          {/* Images URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <Input
              value={formData.images_c}
              onChange={(e) => handleInputChange('images_c', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-gray-500 text-xs mt-1">
              Multiple URLs can be separated by commas
            </p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleInputChange('rating_c', star)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors",
                    star <= formData.rating_c
                      ? "text-yellow-400 hover:text-yellow-500"
                      : "text-gray-300 hover:text-gray-400"
                  )}
                >
                  ★
                </button>
              ))}
              <span className="text-sm text-gray-500">
                ({formData.rating_c}/5)
              </span>
            </div>
          </div>

          {/* Review Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Count
            </label>
            <Input
              type="number"
              min="0"
              value={formData.review_count_c}
              onChange={(e) => handleInputChange('review_count_c', e.target.value)}
              placeholder="0"
            />
          </div>

          {/* In Stock */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.in_stock_c}
                onChange={(e) => handleInputChange('in_stock_c', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <Input
              value={formData.Tags}
              onChange={(e) => handleInputChange('Tags', e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-gray-500 text-xs mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;