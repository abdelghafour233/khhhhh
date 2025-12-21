
/**
 * Elite Store - Vanilla JS Version
 * Professional E-commerce for Morocco
 */

// --- Constants ---
const MOROCCAN_CITIES = [
    "الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "وجدة", "مكناس", "قنيطرة",
    "تطوان", "تمارة", "سلا", "العيون", "الداخلة", "بني ملال", "خريبكة", "الجديدة", "الناظور",
    "آسفي", "المحمدية", "سطات", "برشيد", "تارودانت", "كلميم", "الرشيدية"
];

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
    shippingFee: 30,
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
    const { fbPixel } = state.settings;
    if (fbPixel) {
        const script = document.createElement('script');
        script.className = 'tracking-pixel';
        script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${fbPixel}');fbq('track', 'PageView');`;
        document.head.appendChild(script);
    }
};

// --- Renderers ---
const renderHome = () => `
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
                            <button onclick="removeFromCart('${item.productId}')" class="text-red-500 p-2 rounded-full transition hover:bg-red-50">🗑️</button>
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
            <h1 class="text-2xl font-bold text-center mb-8 font-black text-blue-600 underline">معلومات الشحن</h1>
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-bold text-gray-700">الاسم الكامل</label>
                    <input id="form-name" required class="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="مثال: أحمد العلوي">
                </div>
                <div>
                    <label class="block mb-2 font-bold text-gray-700">المدينة</label>
                    <select id="form-city" required class="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <option value="" disabled selected>اختر مدينتك</option>
                        ${MOROCCAN_CITIES.map(city => `<option value="${city}">${city}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block mb-2 font-bold text-gray-700">رقم الهاتف</label>
                    <input id="form-phone" type="tel" required class="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" placeholder="06XXXXXXXX">
                </div>
            </div>
            <button type="submit" class="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xl hover:bg-green-700 transition transform hover:scale-[1.02] shadow-xl">تأكيد الطلب 🛒</button>
            <p class="text-center text-sm text-gray-500 font-bold">🚚 الدفع عند الاستلام بجميع المدن</p>
        </form>
    </div>
`;

const renderDashboard = () => {
    const subRoute = window.location.hash.split('/dashboard/')[1] || 'products';
    const sidebar = `
        <aside class="w-64 bg-gray-900 text-white h-screen fixed right-0 top-0 pt-20 p-6 hidden md:block">
            <nav class="space-y-2">
                <a href="#/dashboard/products" class="flex items-center p-3 rounded-xl transition ${subRoute === 'products' ? 'bg-blue-600' : 'hover:bg-gray-800'}">📦 المنتجات</a>
                <a href="#/dashboard/orders" class="flex items-center p-3 rounded-xl transition ${subRoute === 'orders' ? 'bg-blue-600' : 'hover:bg-gray-800'}">📝 الطلبات</a>
                <a href="#/dashboard/settings" class="flex items-center p-3 rounded-xl transition ${subRoute === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-800'}">⚙️ الإعدادات</a>
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
                        <input id="p-name" class="p-3 border rounded-xl" placeholder="اسم المنتج">
                        <input id="p-price" type="number" class="p-3 border rounded-xl" placeholder="السعر">
                        <select id="p-cat" class="p-3 border rounded-xl"> <option>إلكترونيات</option> <option>منزل</option> <option>سيارات</option> </select>
                        <input id="p-image" type="file" accept="image/*" class="p-2 border rounded-xl">
                        <textarea id="p-desc" class="md:col-span-2 p-3 border rounded-xl h-24" placeholder="وصف المنتج..."></textarea>
                    </div>
                    <button onclick="addProductFromDash()" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">حفظ المنتج</button>
                </div>
                <div class="bg-white rounded-3xl border overflow-hidden">
                    <table class="w-full text-right">
                        <thead class="bg-gray-50 border-b"> <tr> <th class="p-4">الصورة</th> <th class="p-4">المنتج</th> <th class="p-4">السعر</th> <th class="p-4">حذف</th> </tr> </thead>
                        <tbody class="divide-y">
                            ${state.products.map((p: any) => `<tr> <td class="p-4"><img src="${p.image}" class="w-10 h-10 object-cover rounded-lg"></td> <td class="p-4">${p.name}</td> <td class="p-4">${p.price}</td> <td class="p-4"><button onclick="deleteProduct('${p.id}')">❌</button></td> </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (subRoute === 'orders') {
        content = `
            <div class="space-y-8">
                <h2 class="text-3xl font-bold">إدارة الطلبات</h2>
                <div class="bg-white rounded-3xl border overflow-hidden">
                    <table class="w-full text-right">
                        <thead class="bg-gray-50 border-b"> <tr> <th class="p-4">الزبون</th> <th class="p-4">المنتجات</th> <th class="p-4">المجموع</th> <th class="p-4">الحالة</th> </tr> </thead>
                        <tbody class="divide-y">
                            ${state.orders.map((o: any) => `
                                <tr>
                                    <td class="p-4"> <div class="font-bold">${o.fullName}</div> <div class="text-xs text-gray-500">${o.city} | ${o.phone}</div> </td>
                                    <td class="p-4 text-xs">${o.items.map((i:any)=> i.name).join(', ')}</td>
                                    <td class="p-4 font-bold text-blue-600">${o.total} ${state.settings.currency}</td>
                                    <td class="p-4">
                                        <select onchange="updateOrderStatus('${o.id}', this.value)" class="p-2 border rounded-lg text-xs font-bold">
                                            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>⏳ انتظار</option>
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
                <div class="bg-white p-8 rounded-3xl border space-y-4">
                    <input id="s-shipping" type="number" class="w-full p-3 border rounded-xl" value="${state.settings.shippingFee}" placeholder="مصاريف الشحن">
                    <input id="s-fb" class="w-full p-3 border rounded-xl" value="${state.settings.fbPixel}" placeholder="Facebook Pixel ID">
                    <input id="s-gs" class="w-full p-3 border rounded-xl text-left" dir="ltr" value="${state.settings.googleSheetsUrl}" placeholder="Google Sheets Webhook URL">
                    <button onclick="saveSettingsFromDash()" class="w-full bg-black text-white py-4 rounded-xl font-bold">حفظ الإعدادات</button>
                </div>
            </div>
        `;
    }

    return `<div class="min-h-screen bg-gray-50 flex">${sidebar}<div class="flex-grow md:mr-64 p-4 md:p-12 pb-32">${content}</div></div>`;
};

const renderProductDetail = (id: string) => {
    const p = state.products.find((x: any) => x.id === id);
    if (!p) return `<div class="text-center py-20">المنتج غير موجود</div>`;
    return `
        <div class="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 items-start">
            <div class="flex-1 w-full rounded-3xl overflow-hidden border shadow-lg bg-white"> <img src="${p.image}" class="w-full h-full object-cover"> </div>
            <div class="flex-1 space-y-6">
                <h1 class="text-4xl font-black text-gray-900">${p.name}</h1>
                <p class="text-3xl font-black text-blue-600">${p.price.toLocaleString()} ${state.settings.currency}</p>
                <div class="bg-white p-6 rounded-2xl border text-gray-600 whitespace-pre-line leading-relaxed">${p.description}</div>
                <button onclick="addToCart('${p.id}')" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl">🛒 أضف للسلة الآن</button>
            </div>
        </div>
    `;
};

// --- Routing ---
const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const loading = document.getElementById('loading');
    if (!root || !loading) return;
    loading.style.width = '100%';
    setTimeout(() => { loading.style.width = '0'; }, 300);
    const isDashboard = hash.startsWith('#/dashboard');
    document.getElementById('main-nav')!.style.display = isDashboard ? 'none' : 'block';
    document.getElementById('main-footer')!.style.display = isDashboard ? 'none' : 'block';
    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/cart') root.innerHTML = renderCart();
    else if (hash === '#/checkout') root.innerHTML = renderCheckout();
    else if (isDashboard) root.innerHTML = renderDashboard();
    else if (hash.startsWith('#/product/')) root.innerHTML = renderProductDetail(hash.split('#/product/')[1]);
    else root.innerHTML = `<div class="text-center py-20">404</div>`;
};

// --- Actions ---
(window as any).addToCart = (id: string) => {
    const p = state.products.find((x: any) => x.id === id);
    const existing = state.cart.find((x: any) => x.productId === id);
    if (existing) existing.quantity++;
    else if (p) state.cart.push({ productId: id, name: p.name, price: p.price, quantity: 1 });
    saveState();
    alert('✅ تمت الإضافة للسلة');
};

(window as any).removeFromCart = (id: string) => {
    state.cart = state.cart.filter((x: any) => x.productId !== id);
    saveState();
    router();
};

(window as any).handleOrder = (e: Event) => {
    e.preventDefault();
    const subtotal = state.cart.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
    const order = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: (document.getElementById('form-name') as HTMLInputElement).value,
        city: (document.getElementById('form-city') as HTMLSelectElement).value,
        phone: (document.getElementById('form-phone') as HTMLInputElement).value,
        items: [...state.cart],
        total: subtotal + state.settings.shippingFee,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    state.orders.unshift(order);
    state.cart = [];
    saveState();
    alert('🎉 تم إرسال طلبك! شكراً لتسوقك معنا.');
    window.location.hash = '#/';
};

(window as any).addProductFromDash = async () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const desc = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    const imgInput = document.getElementById('p-image') as HTMLInputElement;
    if (!name || !price) return;
    let imgUrl = 'https://picsum.photos/seed/'+name+'/600/400';
    if (imgInput.files?.[0]) {
        imgUrl = await new Promise(r => { const rd = new FileReader(); rd.onload = e => r(e.target!.result as string); rd.readAsDataURL(imgInput.files![0]); });
    }
    state.products.push({ id: Date.now().toString(), name, price: Number(price), description: desc, image: imgUrl, category: (document.getElementById('p-cat') as HTMLSelectElement).value });
    saveState();
    router();
};

(window as any).deleteProduct = (id: string) => { if(confirm('حذف؟')) { state.products = state.products.filter((x: any) => x.id !== id); saveState(); router(); } };
(window as any).updateOrderStatus = (id: string, s: string) => { const o = state.orders.find((x:any)=>x.id===id); if(o) { o.status = s; saveState(); router(); } };
(window as any).saveSettingsFromDash = () => {
    state.settings = { ...state.settings, fbPixel: (document.getElementById('s-fb') as HTMLInputElement).value, shippingFee: Number((document.getElementById('s-shipping') as HTMLInputElement).value), googleSheetsUrl: (document.getElementById('s-gs') as HTMLInputElement).value };
    saveState(); injectPixels(); alert('✅ تم الحفظ');
};

window.addEventListener('hashchange', router);
window.addEventListener('load', () => { router(); updateCartUI(); injectPixels(); });
