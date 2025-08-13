import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import CartBadge from "@/components/molecules/CartBadge";
import CategoryDropdown from "@/components/molecules/CategoryDropdown";
import Button from "@/components/atoms/Button";
const Header = ({ cartItemCount = 0, onSearch, categories = [] }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onSearch?.(query);
    }
  };

  const handleCategorySelect = (category) => {
    navigate(`/category/${category.Id}`);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glassmorphism border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ApperIcon name="ShoppingBag" size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent font-display">
                ShopFlow
              </h1>
            </div>
          </motion.button>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <CategoryDropdown
              categories={categories}
              onCategorySelect={handleCategorySelect}
            />
            <Button
              variant="ghost"
              onClick={() => navigate("/deals")}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Zap" size={20} />
              <span>Deals</span>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Cart and User Actions */}
          <div className="flex items-center space-x-4">
            <CartBadge itemCount={cartItemCount} onClick={handleCartClick} />
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" size={20} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <ApperIcon name="Menu" size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;