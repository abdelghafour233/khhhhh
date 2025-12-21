
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderItem, Order } from '../types';

interface CheckoutProps {
  cart: OrderItem[];
  clearCart: () => void;
  addOrder: (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart, addOrder }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    phone: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    addOrder({
      ...formData,
      items: cart,
      total
    });
    
    clearCart();
    alert('تم استقبال طلبك بنجاح! سنتصل بك قريباً.');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">إتمام الطلب</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
        <div className="space-y-2">
          <label className="block font-bold text-gray-700">الاسم الكامل</label>
          <input 
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="مثال: أحمد العلوي"
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="block font-bold text-gray-700">المدينة</label>
          <input 
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="مثال: الدار البيضاء"
            value={formData.city}
            onChange={e => setFormData({...formData, city: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="block font-bold text-gray-700">رقم الهاتف</label>
          <input 
            required
            type="tel"
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-left"
            placeholder="06XXXXXXXX"
            dir="ltr"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div className="border-t pt-6 mt-6 space-y-4">
          <div className="flex justify-between font-bold text-xl">
            <span>المجموع النهائي:</span>
            <span className="text-blue-600">{total.toLocaleString()} د.م.</span>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-green-600 text-white rounded-2xl text-xl font-extrabold hover:bg-green-700 transition"
          >
            تأكيد الطلب الآن
          </button>
          <p className="text-center text-sm text-gray-500">الدفع عند الاستلام (COD)</p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
