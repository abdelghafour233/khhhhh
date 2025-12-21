
/**
 * Elite Store - Vanilla JS Version
 * Professional E-commerce for Morocco
 */

// --- Data Models & Initial Data ---
const INITIAL_PRODUCTS = [
    { id: '1', name: 'آيفون 15 برو ماكس', description: 'أحدث هاتف من شركة آبل مع معالج A17 Pro وكاميرا احترافية.', price: 14500, category: 'إلكترونيات', image: 'https://picsum.photos/seed/iphone/600/400' },
    { id: '2', name: 'صانعة قهوة إسبريسو', description: 'ماكينة احترافية لتحضير القهوة في المنزل بجودة المقاهي.', price: 2200, category: 'منزل', image: 'https://picsum.photos/seed/coffee/600/400' },
    { id: '3', name: 'مرسيدس بنز G-Class 2024', description: 'سيارة الدفع الرباعي الفاخرة، قوة وأناقة على جميع الطرقات.', price: 2500000, category: 'سيارات', image: 'https://picsum.photos/seed/gclass/600/400' }
];

const INITIAL_SETTINGS = {
    fbPixel: '',
    googleAnalytics: '',
    tiktokPixel: '',
    googleSheetsUrl: '',
    domain: 'myshop.com',
    nameServer: 'ns1.hosting.com',
    shippingFee: 30, // Default shipping fee in MAD
    currency: 'د.م.'
};

// --- App State ---
let state = {
    products: JSON.parse(localStorage.getItem('products') || 'null') || INITIAL_PRODUCTS,
    orders: JSON.parse(localStorage.getItem('orders') || '[]'),
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || 'null') || INITIAL_SETTINGS
};

// --- Utilities ---
const saveState = () => {
    localStorage.setItem('products', JSON.stringify(state.products));
    localStorage.setItem('orders', JSON.stringify(state.orders));
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('settings', JSON.stringify(state.settings));
    updateCartUI();
};

const updateCartUI = () => {
    const countEl = document.getElementById('cart-count');
    const totalCount = state.cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    if (countEl) {
        countEl.innerText = totalCount.toString();
        countEl.classList.toggle('hidden', totalCount === 0);
    }
};

const injectPixels = () => {
    document.querySelectorAll('.tracking-pixel').forEach(el => el.remove());
    const { fbPixel, googleAnalytics, tiktokPixel } = state.settings;

    if (fbPixel) {
        const script = document.createElement('script');
        script.className = 'tracking-pixel';
        script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${fbPixel}');fbq('track', 'PageView');`;
        document.head.appendChild(script);
    }
};

// --- Page Renderers ---

const renderHome = () => {
    return `
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
            <section class="relative h-64 md:h-96 rounded-3xl overflow-hidden bg-blue-600 flex items-center px-6 md:px-12 text-white">
                <div class="z-10 max-w-xl space-y-4">
                    <h1 class="text-3xl md:text-5xl font-extrabold leading-tight">أفضل المنتجات في المغرب</h1>
                    <p class="text-sm md:text-lg opacity-90">إلكترونيات، تجهيزات منزلية، وسيارات فاخرة بأسعار منافسة.</p>
                </div>
                <div class="absolute top-0 right-0 w-1/2 h-full opacity-20">
                    <img src="https://picsum.photos/seed/shop/800/600" class="object-cover w-full h-full" />
                </div>
            </section>

            <section>
                <h2 class="text-2xl font-bold mb-8">المنتجات المميزة</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${state.products.map((p: any) => `
                        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border group">
                            <a href="#/product/${p.id}" class="block h-52 overflow-hidden bg-gray-100">
                                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                            </a>
                            <div class="p-6 space-y-4">
                                <h3 class="font-bold text-lg truncate">${p.name}</h3>
                                <div class="flex justify-between items-center">
                                    <span class="text-xl font-extrabold text-blue-600">${p.price.toLocaleString()} ${state.settings.currency}</span>
                                </div>
                                <button onclick="addToCart('${p.id}')" class="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">أضف للسلة</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>
    `;
};

const renderCart = () => {
    const subtotal = state.cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? state.settings.shippingFee : 0;
    const total = subtotal + shipping;

    if (state.cart.length === 0) return `<div class="text-center py-32 space-y-4"> <h2 class="text-2xl font-bold">السلة فارغة</h2> <a href="#/" class="text-blue-600">عد للتسوق</a> </div>`;
    
    return `
        <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <h1 class="text-3xl font-bold text-center">سلة المشتريات</h1>
            <div class="bg-white rounded-3xl shadow-sm border overflow-hidden">
                <div class="divide-y">
                    ${state.cart.map((item: any) => `
                        <div class="p-6 flex items-center justify-between">
                            <div class="flex items-center space-x-4 space-x-reverse">
                                <div class="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border">
                                    <img src="${state.products.find((p:any)=>p.id === item.productId)?.image}" class="w-full h-full object-cover">
                                </div>
                                <div>
                                    <h3 class="font-bold">${item.name}</h3>
                                    <p class="text-sm text-gray-500">${item.price.toLocaleString()} ${state.settings.currency} × ${item.quantity}</p>
                                </div>
                            </div>
                            <button onclick="removeFromCart('${item.productId}')" class="text-red-500 hover:bg-red-50 p-2 rounded-full transition">🗑️</button>
                        </div>
                    `).join('')}
                </div>
                <div class="p-8 bg-gray-50 space-y-4 border-t">
                    <div class="flex justify-between text-gray-600"> <span>المجموع الفرعي:</span> <span>${subtotal.toLocaleString()} ${state.settings.currency}</span> </div>
                    <div class="flex justify-between text-gray-600"> <span>مصاريف الشحن:</span> <span>${shipping} ${state.settings.currency}</span> </div>
                    <div class="flex justify-between items-center pt-4 border-t">
                        <span class="text-lg font-bold">الإجمالي النهائي:</span>
                        <span class="text-3xl font-black text-blue-600">${total.toLocaleString()} ${state.settings.currency}</span>
                    </div>
                    <a href="#/checkout" class="block text-center w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">الاستمرار للدفع</a>
                </div>
            </div>
        </div>
    `;
};

const renderCheckout = () => `
    <div class="max-w-2xl mx-auto px-4 py-12">
        <form onsubmit="handleOrder(event)" class="bg-white p-8 rounded-3xl shadow-lg border space-y-6">
            <h1 class="text-2xl font-bold text-center mb-8 font-black text-blue-600 underline">تأكيد طلبك</h1>
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-bold text-gray-700">الاسم الكامل (ضروري)</label>
                    <input id="form-name" required class="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="مثال: محمد العالمي">
                </div>
                <div>
                    <label class="block mb-2 font-bold text-gray-700">المدينة</label>
                    <input id="form-city" required class="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="مثال: طنجة">
                </div>
                <div>
                    <label class="block mb-2 font-bold text-gray-700">رقم الهاتف (للتأكيد)</label>
                    <input id="form-phone" type="tel" required class="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-left" dir="ltr" placeholder="06XXXXXXXX">
                </div>
            </div>
            <div class="bg-blue-50 p-4 rounded-2xl text-blue-800 text-sm">
                📌 سيتم التواصل معكم هاتفياً لتأكيد الطلب قبل الإرسال. الدفع يتم عند الاستلام.
            </div>
            <button type="submit" class="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xl hover:bg-green-700 transition transform hover:scale-[1.02] shadow-xl">تأكيد الشراء الآن 🛒</button>
        </form>
    </div>
`;

const renderDashboard = () => {
    const subRoute = window.location.hash.split('/dashboard/')[1] || 'products';
    
    const sidebar = `
        <aside class="w-64 bg-gray-900 text-white h-screen fixed right-0 top-0 pt-20 p-6 hidden md:block border-l border-gray-800">
            <div class="mb-8 text-center">
                <div class="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-2 shadow-lg shadow-blue-500/20">👤</div>
                <p class="font-bold">لوحة التحكم</p>
            </div>
            <nav class="space-y-2">
                <a href="#/dashboard/products" class="flex items-center p-3 rounded-xl transition ${subRoute === 'products' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}">
                   <span class="ml-3">📦</span> المنتجات
                </a>
                <a href="#/dashboard/orders" class="flex items-center p-3 rounded-xl transition ${subRoute === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}">
                   <span class="ml-3">📝</span> الطلبات
                </a>
                <a href="#/dashboard/settings" class="flex items-center p-3 rounded-xl transition ${subRoute === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}">
                   <span class="ml-3">⚙️</span> الإعدادات
                </a>
            </nav>
        </aside>
    `;

    let content = '';
    if (subRoute === 'products') {
        content = `
            <div class="space-y-8">
                <h2 class="text-3xl font-black">إدارة المنتجات</h2>
                
                <div class="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
                    <h3 class="font-bold text-lg border-b pb-2">إضافة منتج جديد</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-600">اسم المنتج</label>
                            <input id="p-name" class="w-full p-3 border rounded-xl" placeholder="مثال: هاتف ذكي">
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-600">السعر (د.م.)</label>
                            <input id="p-price" type="number" class="w-full p-3 border rounded-xl" placeholder="0.00">
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-600">الفئة</label>
                            <select id="p-cat" class="w-full p-3 border rounded-xl"> 
                                <option>إلكترونيات</option> <option>منزل</option> <option>سيارات</option> 
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-600">صورة المنتج</label>
                            <input id="p-image" type="file" accept="image/*" class="w-full p-2 border border-dashed rounded-xl">
                        </div>
                        <div class="md:col-span-2 space-y-2">
                            <label class="text-sm font-bold text-gray-600">وصف المنتج</label>
                            <textarea id="p-desc" class="w-full p-3 border rounded-xl h-24" placeholder="اكتب وصفاً جذاباً للمنتج..."></textarea>
                        </div>
                    </div>
                    <button onclick="addProductFromDash()" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">حفظ المنتج</button>
                </div>

                <div class="bg-white rounded-3xl shadow-sm border overflow-hidden">
                    <table class="w-full text-right">
                        <thead class="bg-gray-50 border-b"> 
                            <tr> 
                                <th class="p-4">الصورة</th> <th class="p-4">المنتج</th> <th class="p-4">السعر</th> <th class="p-4">الإجراءات</th> 
                            </tr> 
                        </thead>
                        <tbody class="divide-y"> 
                            ${state.products.map((p: any) => `
                                <tr> 
                                    <td class="p-4"> <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover"> </td>
                                    <td class="p-4 font-bold">${p.name}</td> 
                                    <td class="p-4">${p.price.toLocaleString()} د.م.</td> 
                                    <td class="p-4">
                                        <button onclick="deleteProduct('${p.id}')" class="text-red-500 p-2 hover:bg-red-50 rounded-lg transition">🗑️ حذف</button>
                                    </td> 
                                </tr>
                            `).join('')} 
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (subRoute === 'orders') {
        content = `
            <div class="space-y-8">
                <h2 class="text-3xl font-bold">إدارة الطلبات</h2>
                <div class="bg-white rounded-3xl shadow-sm border overflow-hidden">
                    <table class="w-full text-right">
                        <thead class="bg-gray-50 border-b">
                            <tr>
                                <th class="p-4">الزبون</th>
                                <th class="p-4">المنتجات</th>
                                <th class="p-4">المجموع</th>
                                <th class="p-4">الحالة</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${state.orders.map((o: any) => `
                                <tr>
                                    <td class="p-4">
                                        <div class="font-bold">${o.fullName}</div>
                                        <div class="text-xs text-gray-500">${o.city} | ${o.phone}</div>
                                    </td>
                                    <td class="p-4 text-xs text-gray-600">
                                        ${o.items.map((i:any)=> `${i.name} (x${i.quantity})`).join(', ')}
                                    </td>
                                    <td class="p-4 font-bold text-blue-600">${o.total} د.م.</td>
                                    <td class="p-4">
                                        <select onchange="updateOrderStatus('${o.id}', this.value)" class="p-2 border rounded-lg text-xs font-bold ${o.status === 'completed' ? 'text-green-600 bg-green-50' : o.status === 'cancelled' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50'}">
                                            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>⏳ قيد الانتظار</option>
                                            <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>✅ مكتمل</option>
                                            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ ملغي</option>
                                        </select>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (subRoute === 'settings') {
        content = `
            <div class="space-y-8 max-w-xl">
                <h2 class="text-3xl font-bold">إعدادات المتجر</h2>
                
                <div class="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
                    <h3 class="font-bold text-lg border-b pb-2">إعدادات الطلبات والشحن</h3>
                    <div class="space-y-4">
                        <div> 
                            <label class="block text-sm font-bold text-gray-600 mb-1">مصاريف الشحن الثابتة (د.م.)</label> 
                            <input id="s-shipping" type="number" class="w-full p-3 border rounded-xl" value="${state.settings.shippingFee}"> 
                        </div>
                        <div> 
                            <label class="block text-sm font-bold text-gray-600 mb-1">العملة</label> 
                            <input id="s-curr" class="w-full p-3 border rounded-xl" value="${state.settings.currency}"> 
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
                    <h3 class="font-bold text-lg border-b pb-2">أكواد التتبع (Pixels)</h3>
                    <div class="space-y-4">
                        <div> <label class="block text-xs font-bold text-gray-400 mb-1">Facebook Pixel ID</label> <input id="s-fb" class="w-full p-2 border rounded-lg" value="${state.settings.fbPixel}"> </div>
                        <div> <label class="block text-xs font-bold text-gray-400 mb-1">TikTok Pixel ID</label> <input id="s-tk" class="w-full p-2 border rounded-lg" value="${state.settings.tiktokPixel}"> </div>
                        <div> <label class="block text-xs font-bold text-gray-400 mb-1">Google Sheets URL</label> <input id="s-gs" class="w-full p-2 border rounded-lg text-left" dir="ltr" value="${state.settings.googleSheetsUrl}"> </div>
                    </div>
                    <button onclick="saveSettingsFromDash()" class="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition">حفظ التغييرات</button>
                </div>
            </div>
        `;
    }

    return `
        <div class="min-h-screen bg-gray-50 flex">
            ${sidebar}
            <div class="flex-grow md:mr-64 p-4 md:p-12 pb-32">
                ${content}
            </div>
        </div>
    `;
};

const renderProductDetail = (id: string) => {
    const p = state.products.find((x: any) => x.id === id);
    if (!p) return `<div class="text-center py-20">المنتج غير موجود</div>`;
    return `
        <div class="max-w-6xl mx-auto px-4 py-12">
            <div class="flex flex-col md:flex-row gap-12 items-start">
                <div class="flex-1 w-full"> 
                    <div class="rounded-3xl overflow-hidden shadow-2xl border bg-white aspect-square">
                        <img src="${p.image}" class="w-full h-full object-cover"> 
                    </div>
                </div>
                <div class="flex-1 space-y-8 w-full">
                    <div class="space-y-4">
                        <h1 class="text-4xl font-black text-gray-900 leading-tight">${p.name}</h1>
                        <p class="text-3xl font-black text-blue-600">${p.price.toLocaleString()} ${state.settings.currency}</p>
                    </div>
                    <div class="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
                        <h3 class="font-bold text-lg border-b pb-2">وصف المنتج</h3>
                        <p class="text-gray-600 leading-relaxed whitespace-pre-line">${p.description}</p>
                    </div>
                    <div class="flex flex-col gap-4">
                        <button onclick="addToCart('${p.id}')" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 flex items-center justify-center">
                           <span class="ml-2">🛒</span> أضف إلى السلة
                        </button>
                        <a href="#/cart" class="text-center py-4 bg-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-200 transition">معاينة السلة</a>
                    </div>
                    <div class="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-4 rounded-2xl">
                        <span>🚚</span> شحن سريع متاح لجميع المدن المغربية
                    </div>
                </div>
            </div>
        </div>
    `;
};

// --- Routing Engine ---
const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const loading = document.getElementById('loading');
    
    if (!root || !loading) return;

    loading.style.width = '100%';
    setTimeout(() => { loading.style.width = '0'; }, 300);

    const isDashboard = hash.startsWith('#/dashboard');
    const mainNav = document.getElementById('main-nav');
    const mainFooter = document.getElementById('main-footer');
    if (mainNav) mainNav.style.display = isDashboard ? 'none' : 'block';
    if (mainFooter) mainFooter.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/cart') root.innerHTML = renderCart();
    else if (hash === '#/checkout') root.innerHTML = renderCheckout();
    else if (isDashboard) root.innerHTML = renderDashboard();
    else if (hash.startsWith('#/product/')) root.innerHTML = renderProductDetail(hash.split('#/product/')[1]);
    else if (hash.startsWith('#/category/')) root.innerHTML = renderCategory(decodeURIComponent(hash.split('#/category/')[1]));
    else root.innerHTML = `<div class="text-center py-20">404 - الصفحة غير موجودة</div>`;
};

// --- Actions ---
(window as any).addToCart = (id: string) => {
    const p = state.products.find((x: any) => x.id === id);
    const existing = state.cart.find((x: any) => x.productId === id);
    if (existing) existing.quantity++;
    else if (p) state.cart.push({ productId: id, name: p.name, price: p.price, quantity: 1 });
    saveState();
    alert('تمت الإضافة للسلة ✅');
};

(window as any).removeFromCart = (id: string) => {
    state.cart = state.cart.filter((x: any) => x.productId !== id);
    saveState();
    router();
};

(window as any).handleOrder = (e: Event) => {
    e.preventDefault();
    const subtotal = state.cart.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
    const total = subtotal + state.settings.shippingFee;
    
    const order = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: (document.getElementById('form-name') as HTMLInputElement).value,
        city: (document.getElementById('form-city') as HTMLInputElement).value,
        phone: (document.getElementById('form-phone') as HTMLInputElement).value,
        items: [...state.cart],
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    state.orders.unshift(order);
    state.cart = [];
    saveState();
    alert('🎉 تم إرسال طلبك بنجاح! شكراً لثقتك.');
    window.location.hash = '#/';
};

(window as any).addProductFromDash = async () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const cat = (document.getElementById('p-cat') as HTMLSelectElement).value;
    const desc = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    const imgInput = document.getElementById('p-image') as HTMLInputElement;

    if (!name || !price || !desc) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }

    let imgUrl = 'https://picsum.photos/seed/'+name+'/600/400';
    if (imgInput.files && imgInput.files[0]) {
        const reader = new FileReader();
        imgUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(imgInput.files![0]);
        });
    }

    state.products.push({ 
        id: Date.now().toString(), 
        name, 
        price: Number(price), 
        category: cat, 
        description: desc, 
        image: imgUrl 
    });
    saveState();
    alert('تمت إضافة المنتج بنجاح');
    router();
};

(window as any).deleteProduct = (id: string) => {
    if(confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        state.products = state.products.filter((x: any) => x.id !== id);
        saveState();
        router();
    }
};

(window as any).updateOrderStatus = (id: string, newStatus: string) => {
    const order = state.orders.find((o:any) => o.id === id);
    if(order) {
        order.status = newStatus;
        saveState();
        router();
    }
};

(window as any).saveSettingsFromDash = () => {
    state.settings = {
        ...state.settings,
        fbPixel: (document.getElementById('s-fb') as HTMLInputElement).value,
        tiktokPixel: (document.getElementById('s-tk') as HTMLInputElement).value,
        googleSheetsUrl: (document.getElementById('s-gs') as HTMLInputElement).value,
        shippingFee: Number((document.getElementById('s-shipping') as HTMLInputElement).value),
        currency: (document.getElementById('s-curr') as HTMLInputElement).value,
    };
    saveState();
    injectPixels();
    alert('تم حفظ الإعدادات بنجاح');
};

const renderCategory = (cat: string) => {
    const filtered = state.products.filter((p: any) => p.category === cat);
    return `
        <div class="max-w-7xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-8">قسم ${cat}</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                ${filtered.map((p: any) => `
                    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border p-4">
                        <img src="${p.image}" class="h-48 w-full object-cover rounded-xl mb-4">
                        <h3 class="font-bold mb-2">${p.name}</h3>
                        <p class="text-blue-600 font-bold mb-4">${p.price} ${state.settings.currency}</p>
                        <button onclick="addToCart('${p.id}')" class="w-full py-2 bg-gray-100 rounded-lg font-bold hover:bg-gray-200">أضف للسلة</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

// --- Initialization ---
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    router();
    updateCartUI();
    injectPixels();
});
