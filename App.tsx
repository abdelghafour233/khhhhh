
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Product, Order, CategoryType, SiteSettings, OrderItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './constants';
import { injectPixels } from './services/pixelService';

// Pages
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Sync state to local storage
  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    injectPixels(settings);
  }, [settings]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    
    // Simulate Google Sheets Sync
    if (settings.googleSheetsUrl) {
      console.log('Syncing order to Google Sheets:', settings.googleSheetsUrl, newOrder);
      // In a real scenario: fetch(settings.googleSheetsUrl, { method: 'POST', body: JSON.stringify(newOrder) })
    }
  };

  return (
    <Router>
      <Layout cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}>
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/category/:cat" element={<Category products={products} addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} addOrder={addOrder} />} />
          <Route path="/dashboard/*" element={
            <Dashboard 
              products={products} 
              setProducts={setProducts} 
              orders={orders} 
              setOrders={setOrders}
              settings={settings}
              setSettings={setSettings}
            />
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, cartCount }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-8 space-x-reverse">
                <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
                  <span className="ml-2">🏪</span>
                  متجر النخبة
                </Link>
                <div className="hidden md:flex space-x-6 space-x-reverse text-gray-600">
                  <Link to="/category/إلكترونيات" className="hover:text-blue-600">إلكترونيات</Link>
                  <Link to="/category/منزل" className="hover:text-blue-600">منزل</Link>
                  <Link to="/category/سيارات" className="hover:text-blue-600">سيارات</Link>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
                  <span className="text-xl">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/dashboard" className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                  لوحة التحكم
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className={`flex-grow ${isDashboard ? '' : 'max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full'}`}>
        {children}
      </main>
      {!isDashboard && (
        <footer className="bg-white border-t py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500">© 2024 متجر النخبة. جميع الحقوق محفوظة.</p>
            <div className="mt-4 flex justify-center space-x-4 space-x-reverse">
              <span className="text-sm text-gray-400">سياسة الخصوصية</span>
              <span className="text-sm text-gray-400">شروط الاستخدام</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
