
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
    settings: JSON.parse(localStorage.getItem('settings') || 'null') || INITIAL_SETTINGS,
    directBuyProduct: null as any // المنتج الذي يتم شراؤه مباشرة
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
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <section class="relative h-64 md:h-96 rounded-3xl overflow-hidden bg-blue-600 flex items-center px-6 md:px-12 text-white">
            <div class="z-10 max-w-xl space-y-4">
                <h1 class="text-3xl md:text-5xl font-black leading-tight">عروض حصرية لليوم</h1>
                <p class="text-sm md:text-lg opacity-90">شحن سريع والدفع عند الاستلام في كل أنحاء المغرب.</p>
            </div>
            <div class="absolute top-0 right-0 w-1/2 h-full opacity-20">
                <img src="https://picsum.photos/seed/shop/800/600" class="object-cover w-full h-full" />
            </div>
        </section>

        <section>
            <h2 class="text-2xl font-bold mb-8">أحدث المنتجات</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                ${state.products.map((p: any) => `
                    <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group transition hover:shadow-xl">
                        <a href="#/product/${p.id}" class="block h-64 overflow-hidden bg-gray-50">
                            <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                        </a>
                        <div class="p-6 space-y-4">
                            <h3 class="font-bold text-lg truncate">${p.name}</h3>
                            <div class="flex justify-between items-center">
                                <span class="text-2xl font-black text-blue-600">${p.price.toLocaleString()} ${state.settings.currency}</span>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <button onclick="addToCart('${p.id}')" class="py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition">سلة</button>
                                <button onclick="buyNow('${p.id}')" class="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">اشتري الآن</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    </div>
`;

const renderCheckout = () => {
    let itemsToBuy = [];
    let subtotal = 0;

    if (state.directBuyProduct) {
        // حالة الشراء المباشر
        itemsToBuy = [state.directBuyProduct];
        subtotal = state.directBuyProduct.price;
    } else {
        // حالة شراء السلة
        itemsToBuy = state.cart;
        subtotal = state.cart.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
    }

    const total = subtotal + state.settings.shippingFee;

    if (itemsToBuy.length === 0) return `<div class="text-center py-32 space-y-4"> <h2 class="text-2xl font-bold">لا يوجد منتج محدد</h2> <a href="#/" class="text-blue-600">عد للرئيسية</a> </div>`;

    return `
        <div class="max-w-5xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
            <!-- Form Section -->
            <div class="flex-grow order-2 lg:order-1">
                <form onsubmit="handleOrder(event)" class="bg-white p-8 rounded-3xl shadow-lg border space-y-6">
                    <h1 class="text-2xl font-black text-blue-600 mb-8 border-b pb-4">معلومات المستلم</h1>
                    <div class="space-y-4">
                        <div>
                            <label class="block mb-2 font-bold text-gray-700">الاسم الكامل</label>
                            <input id="form-name" required class="w-full p-4 border rounded-2xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="الاسم الشخصي والعائلي">
                        </div>
                        <div>
                            <label class="block mb-2 font-bold text-gray-700">المدينة</label>
                            <select id="form-city" required class="w-full p-4 border rounded-2xl bg-gray-50 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                                <option value="" disabled selected>اختر مدينتك</option>
                                ${MOROCCAN_CITIES.map(city => `<option value="${city}">${city}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block mb-2 font-bold text-gray-700">رقم الهاتف</label>
                            <input id="form-phone" type="tel" required class="w-full p-4 border rounded-2xl bg-gray-50 focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" placeholder="06XXXXXXXX">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-2xl hover:bg-green-700 transition transform hover:scale-[1.02] shadow-xl">تأكيد الطلب الآن 📦</button>
                    <p class="text-center text-sm text-gray-500 font-bold">✅ الدفع عند الاستلام | 🚚 شحن سريع</p>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="w-full lg:w-96 order-1 lg:order-2">
                <div class="bg-white p-6 rounded-3xl border shadow-sm sticky top-24 space-y-6">
                    <h2 class="font-bold text-xl">ملخص الطلب</h2>
                    <div class="space-y-4">
                        ${itemsToBuy.map((item: any) => `
                            <div class="flex items-center gap-4">
                                <div class="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src="${state.products.find((p:any)=>p.id === (item.productId || item.id))?.image}" class="w-full h-full object-cover">
                                </div>
                                <div class="flex-grow">
                                    <p class="font-bold text-sm">${item.name}</p>
                                    <p class="text-xs text-gray-500">${item.price} ${state.settings.currency} ${item.quantity ? '× ' + item.quantity : ''}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="border-t pt-4 space-y-2 text-sm">
                        <div class="flex justify-between"> <span>المجموع:</span> <span>${subtotal} ${state.settings.currency}</span> </div>
                        <div class="flex justify-between"> <span>الشحن:</span> <span>${state.settings.shippingFee} ${state.settings.currency}</span> </div>
                        <div class="flex justify-between font-black text-xl text-blue-600 border-t pt-2 mt-2"> 
                            <span>الإجمالي:</span> 
                            <span>${total} ${state.settings.currency}</span> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderProductDetail = (id: string) => {
    const p = state.products.find((x: any) => x.id === id);
    if (!p) return `<div class="text-center py-20">المنتج غير موجود</div>`;
    return `
        <div class="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 items-start">
            <div class="flex-1 w-full"> 
                <div class="rounded-[2.5rem] overflow-hidden shadow-2xl border bg-white aspect-square">
                    <img src="${p.image}" class="w-full h-full object-cover"> 
                </div>
            </div>
            <div class="flex-1 space-y-8 w-full">
                <div class="space-y-4">
                    <h1 class="text-4xl font-black text-gray-900 leading-tight">${p.name}</h1>
                    <p class="text-3xl font-black text-blue-600">${p.price.toLocaleString()} ${state.settings.currency}</p>
                </div>
                <div class="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
                    <h3 class="font-bold text-lg border-b pb-2">تفاصيل المنتج</h3>
                    <p class="text-gray-600 leading-relaxed whitespace-pre-line">${p.description}</p>
                </div>
                <div class="flex flex-col gap-4">
                    <button onclick="buyNow('${p.id}')" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 transform active:scale-95">
                       اشتري الآن (دفع عند الاستلام)
                    </button>
                    <button onclick="addToCart('${p.id}')" class="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition">
                       أضف إلى السلة
                    </button>
                </div>
            </div>
        </div>
    `;
};

const renderCart = () => {
    const subtotal = state.cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const total = subtotal + state.settings.shippingFee;
    if (state.cart.length === 0) return `<div class="text-center py-32 space-y-4"> <h2 class="text-2xl font-bold">السلة فارغة</h2> <a href="#/" class="text-blue-600">عد للتسوق</a> </div>`;
    return `
        <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <h1 class="text-3xl font-black text-center">سلة المشتريات</h1>
            <div class="bg-white rounded-3xl shadow-sm border overflow-hidden">
                <div class="divide-y">
                    ${state.cart.map((item: any) => `
                        <div class="p-6 flex items-center justify-between">
                            <div class="flex items-center space-x-4 space-x-reverse">
                                <div class="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border">
                                    <img src="${state.products.find((p:any)=>p.id === item.productId)?.image}" class="w-full h-full object-cover">
                                </div>
                                <div>
                                    <h3 class="font-bold">${item.name}</h3>
                                    <p class="text-sm text-gray-500 font-bold">${item.price} ${state.settings.currency} × ${item.quantity}</p>
                                </div>
                            </div>
                            <button onclick="removeFromCart('${item.productId}')" class="text-red-500 p-2 rounded-full hover:bg-red-50 transition">🗑️</button>
                        </div>
                    `).join('')}
                </div>
                <div class="p-8 bg-gray-50 border-t space-y-4">
                    <div class="flex justify-between font-black text-2xl text-blue-600"> <span>الإجمالي:</span> <span>${total} ${state.settings.currency}</span> </div>
                    <button onclick="checkoutCart()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition">إتمام الطلب</button>
                </div>
            </div>
        </div>
    `;
};

const renderDashboard = () => {
    const subRoute = window.location.hash.split('/dashboard/')[1] || 'products';
    const sidebar = `
        <aside class="w-64 bg-gray-900 text-white h-screen fixed right-0 top-0 pt-20 p-6 hidden md:block">
            <nav class="space-y-4">
                <a href="#/dashboard/products" class="block p-3 rounded-xl transition ${subRoute === 'products' ? 'bg-blue-600' : 'hover:bg-gray-800'}">📦 المنتجات</a>
                <a href="#/dashboard/orders" class="block p-3 rounded-xl transition ${subRoute === 'orders' ? 'bg-blue-600' : 'hover:bg-gray-800'}">📝 الطلبات</a>
                <a href="#/dashboard/settings" class="block p-3 rounded-xl transition ${subRoute === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-800'}">⚙️ الإعدادات</a>
            </nav>
        </aside>
    `;

    let content = '';
    if (subRoute === 'products') {
        content = `
            <div class="space-y-8">
                <h2 class="text-3xl font-black">إدارة المنتجات</h2>
                <div class="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                    <h3 class="font-bold text-lg">إضافة منتج جديد</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input id="p-name" class="p-4 border rounded-2xl" placeholder="اسم المنتج">
                        <input id="p-price" type="number" class="p-4 border rounded-2xl" placeholder="السعر">
                        <select id="p-cat" class="p-4 border rounded-2xl"> <option>إلكترونيات</option> <option>منزل</option> <option>سيارات</option> </select>
                        <input id="p-image" type="file" accept="image/*" class="p-3 border rounded-2xl">
                        <textarea id="p-desc" class="md:col-span-2 p-4 border rounded-2xl h-32" placeholder="وصف المنتج التفصيلي..."></textarea>
                    </div>
                    <button onclick="addProductFromDash()" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold">حفظ المنتج في المتجر</button>
                </div>
                <div class="bg-white rounded-3xl border overflow-hidden">
                    <table class="w-full text-right">
                        <thead class="bg-gray-50 border-b"> <tr> <th class="p-4">الصورة</th> <th class="p-4">المنتج</th> <th class="p-4">السعر</th> <th class="p-4">الإجراءات</th> </tr> </thead>
                        <tbody class="divide-y">
                            ${state.products.map((p: any) => `<tr> <td class="p-4"><img src="${p.image}" class="w-12 h-12 object-cover rounded-xl"></td> <td class="p-4 font-bold">${p.name}</td> <td class="p-4">${p.price} د.م.</td> <td class="p-4"><button onclick="deleteProduct('${p.id}')" class="text-red-500 font-bold">حذف</button></td> </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (subRoute === 'orders') {
        content = `
            <div class="space-y-8">
                <h2 class="text-3xl font-bold">طلبات الزبائن</h2>
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
                <h2 class="text-3xl font-bold">الإعدادات</h2>
                <div class="bg-white p-8 rounded-3xl border space-y-6">
                    <input id="s-shipping" type="number" class="w-full p-4 border rounded-2xl" value="${state.settings.shippingFee}" placeholder="مصاريف الشحن">
                    <input id="s-fb" class="w-full p-4 border rounded-2xl" value="${state.settings.fbPixel}" placeholder="Facebook Pixel ID">
                    <input id="s-gs" class="w-full p-4 border rounded-2xl text-left" dir="ltr" value="${state.settings.googleSheetsUrl}" placeholder="Google Sheets Webhook URL">
                    <button onclick="saveSettingsFromDash()" class="w-full bg-black text-white py-4 rounded-2xl font-bold">حفظ التغييرات</button>
                </div>
            </div>
        `;
    }

    return `<div class="min-h-screen bg-gray-50 flex">${sidebar}<div class="flex-grow md:mr-64 p-4 md:p-12 pb-32">${content}</div></div>`;
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

    if (hash === '#/') { state.directBuyProduct = null; root.innerHTML = renderHome(); }
    else if (hash === '#/cart') { state.directBuyProduct = null; root.innerHTML = renderCart(); }
    else if (hash === '#/checkout') { root.innerHTML = renderCheckout(); }
    else if (isDashboard) root.innerHTML = renderDashboard();
    else if (hash.startsWith('#/product/')) root.innerHTML = renderProductDetail(hash.split('#/product/')[1]);
    else root.innerHTML = `<div class="text-center py-20">404</div>`;
};

// --- Actions ---
(window as any).buyNow = (id: string) => {
    const p = state.products.find((x: any) => x.id === id);
    if (p) {
        state.directBuyProduct = p;
        window.location.hash = '#/checkout';
    }
};

(window as any).checkoutCart = () => {
    state.directBuyProduct = null;
    window.location.hash = '#/checkout';
};

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
    let items = [];
    let subtotal = 0;

    if (state.directBuyProduct) {
        items = [{ ...state.directBuyProduct, quantity: 1 }];
        subtotal = state.directBuyProduct.price;
    } else {
        items = [...state.cart];
        subtotal = state.cart.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
    }

    const order = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: (document.getElementById('form-name') as HTMLInputElement).value,
        city: (document.getElementById('form-city') as HTMLSelectElement).value,
        phone: (document.getElementById('form-phone') as HTMLInputElement).value,
        items: items,
        total: subtotal + state.settings.shippingFee,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    state.orders.unshift(order);
    if (!state.directBuyProduct) state.cart = [];
    state.directBuyProduct = null;
    saveState();
    alert('🎉 شكراً لك! تم استقبال طلبك بنجاح.');
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
