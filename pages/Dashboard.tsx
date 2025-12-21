
import React, { useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { Product, Order, SiteSettings, CategoryType } from '../types';

interface DashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

const Dashboard: React.FC<DashboardProps> = ({ products, setProducts, orders, setOrders, settings, setSettings }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-blue-400">الإدارة</h2>
          <p className="text-xs text-gray-400 mt-1">متجر النخبة</p>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <Link to="/" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
            <span className="ml-3">🏠</span> الموقع الرئيسي
          </Link>
          <Link to="/dashboard" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
            <span className="ml-3">📦</span> المنتجات
          </Link>
          <Link to="/dashboard/orders" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
            <span className="ml-3">📝</span> الطلبات
          </Link>
          <Link to="/dashboard/marketing" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
            <span className="ml-3">📊</span> التسويق (البكسل)
          </Link>
          <Link to="/dashboard/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
            <span className="ml-3">⚙️</span> الإعدادات التقنية
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-10">
        <Routes>
          <Route path="/" element={<ProductManager products={products} setProducts={setProducts} />} />
          <Route path="/orders" element={<OrderManager orders={orders} setOrders={setOrders} />} />
          <Route path="/marketing" element={<MarketingManager settings={settings} setSettings={setSettings} />} />
          <Route path="/settings" element={<TechnicalSettings settings={settings} setSettings={setSettings} />} />
        </Routes>
      </main>
    </div>
  );
};

// Sub-components for Dashboard
const ProductManager: React.FC<{ products: Product[], setProducts: any }> = ({ products, setProducts }) => {
  const [newP, setNewP] = useState<Partial<Product>>({ category: CategoryType.ELECTRONICS });

  const addProduct = () => {
    if (!newP.name || !newP.price) return;
    const prod: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newP.name || '',
      description: newP.description || '',
      price: Number(newP.price),
      category: newP.category as CategoryType,
      image: `https://picsum.photos/seed/${newP.name}/600/400`,
      stock: 10
    };
    setProducts([...products, prod]);
    setNewP({ category: CategoryType.ELECTRONICS });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border grid grid-cols-2 gap-4">
        <input className="border p-3 rounded-xl" placeholder="اسم المنتج" value={newP.name || ''} onChange={e => setNewP({...newP, name: e.target.value})} />
        <input className="border p-3 rounded-xl" type="number" placeholder="السعر (د.م.)" value={newP.price || ''} onChange={e => setNewP({...newP, price: e.target.value})} />
        <select className="border p-3 rounded-xl" value={newP.category} onChange={e => setNewP({...newP, category: e.target.value as CategoryType})}>
          {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={addProduct} className="bg-blue-600 text-white p-3 rounded-xl font-bold">إضافة منتج جديد</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">المنتج</th>
              <th className="p-4">الفئة</th>
              <th className="p-4">السعر</th>
              <th className="p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id}>
                <td className="p-4 font-bold">{p.name}</td>
                <td className="p-4 text-gray-500">{p.category}</td>
                <td className="p-4">{p.price.toLocaleString()} د.م.</td>
                <td className="p-4">
                  <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="text-red-500">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderManager: React.FC<{ orders: Order[], setOrders: any }> = ({ orders, setOrders }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full text-right">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4">الزبون</th>
            <th className="p-4">المدينة / الهاتف</th>
            <th className="p-4">المجموع</th>
            <th className="p-4">الحالة</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map(o => (
            <tr key={o.id}>
              <td className="p-4">
                <div className="font-bold">{o.fullName}</div>
                <div className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('ar-MA')}</div>
              </td>
              <td className="p-4">
                <div>{o.city}</div>
                <div className="text-blue-600 text-sm" dir="ltr">{o.phone}</div>
              </td>
              <td className="p-4 font-bold">{o.total.toLocaleString()} د.م.</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {o.status === 'pending' ? 'قيد الانتظار' : 'مكتمل'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MarketingManager: React.FC<{ settings: SiteSettings, setSettings: any }> = ({ settings, setSettings }) => (
  <div className="space-y-8 max-w-2xl">
    <h2 className="text-2xl font-bold">إدارة البكسل (Tracking Pixels)</h2>
    <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
      <div className="space-y-2">
        <label className="block font-bold">Facebook Pixel ID</label>
        <input className="w-full border p-3 rounded-xl font-mono text-sm" value={settings.fbPixel} onChange={e => setSettings({...settings, fbPixel: e.target.value})} placeholder="مثال: 123456789012345" />
      </div>
      <div className="space-y-2">
        <label className="block font-bold">Google Analytics (G-ID)</label>
        <input className="w-full border p-3 rounded-xl font-mono text-sm" value={settings.googleAnalytics} onChange={e => setSettings({...settings, googleAnalytics: e.target.value})} placeholder="مثال: G-XXXXXXXXXX" />
      </div>
      <div className="space-y-2">
        <label className="block font-bold">TikTok Pixel ID</label>
        <input className="w-full border p-3 rounded-xl font-mono text-sm" value={settings.tiktokPixel} onChange={e => setSettings({...settings, tiktokPixel: e.target.value})} placeholder="مثال: C6XXXXXXXXXXXX" />
      </div>
      <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700">حفظ الإعدادات</button>
    </div>
  </div>
);

const TechnicalSettings: React.FC<{ settings: SiteSettings, setSettings: any }> = ({ settings, setSettings }) => (
  <div className="space-y-8 max-w-2xl">
    <h2 className="text-2xl font-bold">الإعدادات التقنية والربط</h2>
    <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
      <div className="space-y-2">
        <label className="block font-bold">رابط Google Sheets (Webhook URL)</label>
        <p className="text-xs text-gray-500 mb-2">سيتم إرسال الطلبات تلقائياً إلى هذا الرابط للربط مع جداول البيانات.</p>
        <input className="w-full border p-3 rounded-xl font-mono text-sm text-left" dir="ltr" value={settings.googleSheetsUrl} onChange={e => setSettings({...settings, googleSheetsUrl: e.target.value})} placeholder="https://script.google.com/macros/s/..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block font-bold">الدومين (Domain)</label>
          <input className="w-full border p-3 rounded-xl font-mono text-sm text-left" dir="ltr" value={settings.domain} onChange={e => setSettings({...settings, domain: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="block font-bold">Name Server</label>
          <input className="w-full border p-3 rounded-xl font-mono text-sm text-left" dir="ltr" value={settings.nameServer} onChange={e => setSettings({...settings, nameServer: e.target.value})} />
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
        💡 عند تغيير الدومين، تأكد من تحديث سجلات الـ DNS لتشير إلى الـ Name Server المذكور أعلاه.
      </div>
      <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800">تحديث الإعدادات التقنية</button>
    </div>
  </div>
);

export default Dashboard;
