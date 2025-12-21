
import React from 'react';
import { Link } from 'react-router-dom';
import { OrderItem } from '../types';

interface CartProps {
  cart: OrderItem[];
  removeFromCart: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-32 space-y-6">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-bold">سلة المشتريات فارغة</h2>
        <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold">ابدأ التسوق الآن</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">سلة المشتريات</h1>
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="divide-y">
          {cart.map(item => (
            <div key={item.productId} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-6 space-x-reverse">
                <div className="h-20 w-20 rounded-xl bg-gray-100 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-500">{item.price.toLocaleString()} د.م. × {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 space-x-reverse">
                <span className="font-bold text-xl">{(item.price * item.quantity).toLocaleString()} د.م.</span>
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700 text-xl"
                >🗑️</button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-8 flex justify-between items-center border-t">
          <div>
            <p className="text-gray-500">الإجمالي:</p>
            <p className="text-3xl font-extrabold text-blue-600">{total.toLocaleString()} د.م.</p>
          </div>
          <Link to="/checkout" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-extrabold text-lg hover:bg-gray-800 transition">
            إتمام الطلب
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
