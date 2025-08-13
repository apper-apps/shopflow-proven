import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { categoryService } from "@/services/api/categoryService";
import CartSidebar from "@/components/organisms/CartSidebar";
import Header from "@/components/organisms/Header";
import Home from "@/components/pages/Home";
import Cart from "@/components/pages/Cart";
import Callback from "@/components/pages/Callback";
import Signup from "@/components/pages/Signup";
import Checkout from "@/components/pages/Checkout";
import ProductDetail from "@/components/pages/ProductDetail";
import CreateProductModal from "@/components/molecules/CreateProductModal";
import Login from "@/components/pages/Login";
import PromptPassword from "@/components/pages/PromptPassword";
import ErrorPage from "@/components/pages/ErrorPage";
import Search from "@/components/pages/Search";
import Category from "@/components/pages/Category";
import ResetPassword from "@/components/pages/ResetPassword";
import { clearUser, setUser } from "@/store/userSlice";
// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const loadCategories = async () => {
        try {
          const data = await categoryService.getAll();
          setCategories(data);
        } catch (error) {
          console.error("Failed to load categories:", error);
        }
      };
      loadCategories();
    }
  }, [isAuthenticated]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === product.Id);
      
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.Id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, {
        productId: product.Id,
        title: product.title_c || product.title,
        price: product.price_c || product.price,
        image: (product.images_c || product.images)?.[0],
        quantity: 1
      }];
    });
    setCartSidebarOpen(true);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSearch = (query) => {
    // Search logic is handled by individual pages
  };
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }
return (
    <div className="min-h-screen bg-background">
      <AuthContext.Provider value={authMethods}>
        <div className="min-h-screen bg-background">
<Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
            <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
            
{isAuthenticated ? (
              <>
                <Route path="/products/create" element={<>
                    <Header cartItemCount={getTotalItems()} onSearch={handleSearch} categories={categories} />
                    <main className="min-h-screen bg-background py-8">
                      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <CreateProductModal 
                          isOpen={true} 
                          onClose={() => navigate('/')} 
                          onSuccess={() => navigate('/')} 
                        />
                      </div>
                    </main>
                    <CartSidebar isOpen={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} cartItems={cartItems} onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} />
                  </>} />
                <Route path="/" element={
                  <>
                    <Header
                      cartItemCount={getTotalItems()}
                      onSearch={handleSearch}
                      categories={categories}
                    />
                    <main className="min-h-screen">
                      <Home onAddToCart={addToCart} />
                    </main>
                    <CartSidebar
                      isOpen={cartSidebarOpen}
                      onClose={() => setCartSidebarOpen(false)}
                      cartItems={cartItems}
                      onUpdateQuantity={updateCartQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  </>
                } />
                
                <Route path="/product/:id" element={
                  <>
                    <Header
                      cartItemCount={getTotalItems()}
                      onSearch={handleSearch}
                      categories={categories}
                    />
                    <main className="min-h-screen">
                      <ProductDetail onAddToCart={addToCart} />
                    </main>
                    <CartSidebar
                      isOpen={cartSidebarOpen}
                      onClose={() => setCartSidebarOpen(false)}
                      cartItems={cartItems}
                      onUpdateQuantity={updateCartQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  </>
                } />
                
                <Route path="/category/:categoryId" element={
                  <>
                    <Header
                      cartItemCount={getTotalItems()}
                      onSearch={handleSearch}
                      categories={categories}
                    />
                    <main className="min-h-screen">
                      <Category onAddToCart={addToCart} />
                    </main>
                    <CartSidebar
                      isOpen={cartSidebarOpen}
                      onClose={() => setCartSidebarOpen(false)}
                      cartItems={cartItems}
                      onUpdateQuantity={updateCartQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  </>
                } />
                
                <Route path="/search" element={
                  <>
                    <Header
                      cartItemCount={getTotalItems()}
                      onSearch={handleSearch}
                      categories={categories}
                    />
                    <main className="min-h-screen">
                      <Search onAddToCart={addToCart} />
                    </main>
                    <CartSidebar
                      isOpen={cartSidebarOpen}
                      onClose={() => setCartSidebarOpen(false)}
                      cartItems={cartItems}
                      onUpdateQuantity={updateCartQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  </>
                } />
                
                <Route path="/cart" element={
                  <>
                    <Header
                      cartItemCount={getTotalItems()}
                      onSearch={handleSearch}
                      categories={categories}
                    />
                    <main className="min-h-screen">
                      <Cart 
                        cartItems={cartItems}
                        onUpdateQuantity={updateCartQuantity}
                        onRemoveItem={removeFromCart}
                      />
                    </main>
                    <CartSidebar
                      isOpen={cartSidebarOpen}
                      onClose={() => setCartSidebarOpen(false)}
                      cartItems={cartItems}
                      onUpdateQuantity={updateCartQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  </>
                } />
                
                <Route path="/checkout" element={
                  <>
                    <Header
                      cartItemCount={getTotalItems()}
                      onSearch={handleSearch}
                      categories={categories}
                    />
                    <main className="min-h-screen">
                      <Checkout 
                        cartItems={cartItems}
                        onOrderComplete={clearCart}
                      />
                    </main>
                    <CartSidebar
                      isOpen={cartSidebarOpen}
                      onClose={() => setCartSidebarOpen(false)}
                      cartItems={cartItems}
                      onUpdateQuantity={updateCartQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  </>
                } />
              </>
            ) : (
              <Route path="*" element={<Login />} />
            )}
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </AuthContext.Provider>
</div>
  );
}

export default App;