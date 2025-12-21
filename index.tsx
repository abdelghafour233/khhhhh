
/**
 * Elite Store - Vanilla JS Version
 * No React, No NPM, Pure JavaScript
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
    nameServer: 'ns1.hosting.com'
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
    // Similar for Google and TikTok...
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
                            <a href="#/product/${p.id}" class="block h-52 overflow-hidden">
                                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                            </a>
                            <div class="p-6 space-y-4">
                                <h3 class="font-bold text-lg">${p.name}</h3>
                                <div class="flex justify-between items-center">
                                    <span class="text-xl font-extrabold text-blue-600">${p.price.toLocaleString()} د.م.</span>
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
    const total = state.cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    if (state.cart.length === 0) return `<div class="text-center py-32 space-y-4"> <h2 class="text-2xl font-bold">السلة فارغة</h2> <a href="#/" class="text-blue-600">عد للتسوق</a> </div>`;
    
    return `
        <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <h1 class="text-3xl font-bold text-center">سلة المشتريات</h1>
            <div class="bg-white rounded-3xl shadow-sm border overflow-hidden">
                <div class="divide-y">
                    ${state.cart.map((item: any) => `
                        <div class="p-6 flex items-center justify-between">
                            <div class="flex items-center space-x-4 space-x-reverse">
                                <div class="w-16 h-16 bg-gray-100 rounded-lg"></div>
                                <div>
                                    <h3 class="font-bold">${item.name}</h3>
                                    <p class="text-sm text-gray-500">${item.price.toLocaleString()} د.م. × ${item.quantity}</p>
                                </div>
                            </div>
                            <button onclick="removeFromCart('${item.productId}')" class="text-red-500">🗑️</button>
                        </div>
                    `).join('')}
                </div>
                <div class="p-8 bg-gray-50 flex justify-between items-center">
                    <div> <p class="text-gray-500">المجموع:</p> <p class="text-2xl font-bold text-blue-600">${total.toLocaleString()} د.م.</p> </div>
                    <a href="#/checkout" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">إتمام الطلب</a>
                </div>
            </div>
        </div>
    `;
};

const renderCheckout = () => `
    <div class="max-w-2xl mx-auto px-4 py-12">
        <form onsubmit="handleOrder(event)" class="bg-white p-8 rounded-3xl shadow-lg border space-y-6">
            <h1 class="text-2xl font-bold text-center mb-8">معلومات الشحن والدفع</h1>
            <div>
                <label class="block mb-2 font-bold">الاسم الكامل</label>
                <input id="form-name" required class="w-full p-3 border rounded-xl" placeholder="أحمد العلوي">
            </div>
            <div>
                <label class="block mb-2 font-bold">المدينة</label>
                <input id="form-city" required class="w-full p-3 border rounded-xl" placeholder="الدار البيضاء">
            </div>
            <div>
                <label class="block mb-2 font-bold">رقم الهاتف</label>
                <input id="form-phone" type="tel" required class="w-full p-3 border rounded-xl text-left" dir="ltr" placeholder="06XXXXXXXX">
            </div>
            <button type="submit" class="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition">تأكيد الطلب (الدفع عند الاستلام)</button>
        </form>
    </div>
`;

const renderDashboard = () => {
    const subRoute = window.location.hash.split('/dashboard/')[1] || 'products';
    
    const sidebar = `
        <aside class="w-64 bg-gray-900 text-white h-screen fixed right-0 top-0 pt-20 p-6 hidden md:block">
            <nav class="space-y-4">
                <a href="#/dashboard/products" class="block p-3 rounded-lg hover:bg-gray-800 transition">📦 المنتجات</a>
                <a href="#/dashboard/orders" class="block p-3 rounded-lg hover:bg-gray-800 transition">📝 الطلبات</a>
                <a href="#/dashboard/settings" class="block p-3 rounded-lg hover:bg-gray-800 transition">⚙️ الإعدادات</a>
            </nav>
        </aside>
    `;

    let content = '';
    if (subRoute === 'products') {
        content = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold">إدارة المنتجات</h2>
                <div class="bg-white p-6 rounded-xl border grid grid-cols-2 gap-4">
                    <input id="p-name" class="p-2 border rounded" placeholder="اسم المنتج">
                    <input id="p-price" type="number" class="p-2 border rounded" placeholder="السعر">
                    <select id="p-cat" class="p-2 border rounded"> <option>إلكترونيات</option> <option>منزل</option> <option>سيارات</option> </select>
                    <button onclick="addProductFromDash()" class="bg-blue-600 text-white rounded p-2">إضافة</button>
                </div>
                <table class="w-full bg-white rounded-xl overflow-hidden border">
                    <thead class="bg-gray-50"> <tr> <th class="p-4 text-right">المنتج</th> <th class="p-4 text-right">السعر</th> <th class="p-4">حذف</th> </tr> </thead>
                    <tbody> ${state.products.map((p: any) => `<tr> <td class="p-4 border-t">${p.name}</td> <td class="p-4 border-t">${p.price}</td> <td class="p-4 border-t text-center"><button onclick="deleteProduct('${p.id}')">❌</button></td> </tr>`).join('')} </tbody>
                </table>
            </div>
        `;
    } else if (subRoute === 'orders') {
        content = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold">طلبات الزبائن</h2>
                <div class="bg-white rounded-xl border divide-y">
                    ${state.orders.map((o: any) => `
                        <div class="p-4 flex justify-between items-center">
                            <div> <p class="font-bold">${o.fullName}</p> <p class="text-sm text-gray-500">${o.city} - ${o.phone}</p> </div>
                            <div class="text-left"> <p class="font-bold text-blue-600">${o.total} د.م.</p> <p class="text-xs text-gray-400">${new Date(o.createdAt).toLocaleDateString()}</p> </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (subRoute === 'settings') {
        content = `
            <div class="space-y-6 max-w-xl">
                <h2 class="text-2xl font-bold">إعدادات الموقع والتتبع</h2>
                <div class="bg-white p-6 rounded-xl border space-y-4">
                    <div> <label class="block text-xs mb-1">Facebook Pixel ID</label> <input id="s-fb" class="w-full p-2 border rounded" value="${state.settings.fbPixel}"> </div>
                    <div> <label class="block text-xs mb-1">Google Analytics ID</label> <input id="s-ga" class="w-full p-2 border rounded" value="${state.settings.googleAnalytics}"> </div>
                    <div> <label class="block text-xs mb-1">TikTok Pixel ID</label> <input id="s-tk" class="w-full p-2 border rounded" value="${state.settings.tiktokPixel}"> </div>
                    <div> <label class="block text-xs mb-1">Google Sheets URL</label> <input id="s-gs" class="w-full p-2 border rounded text-left" dir="ltr" value="${state.settings.googleSheetsUrl}"> </div>
                    <button onclick="saveSettingsFromDash()" class="w-full bg-black text-white p-3 rounded-xl">حفظ كل الإعدادات</button>
                </div>
            </div>
        `;
    }

    return `
        <div class="flex">
            ${sidebar}
            <div class="flex-grow md:mr-64 p-8">
                ${content}
            </div>
        </div>
    `;
};

const renderProduct = (id: string) => {
    const p = state.products.find((x: any) => x.id === id);
    if (!p) return `<div class="text-center py-20">المنتج غير موجود</div>`;
    return `
        <div class="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
            <div class="flex-1"> <img src="${p.image}" class="w-full rounded-3xl shadow-lg"> </div>
            <div class="flex-1 space-y-6">
                <h1 class="text-4xl font-bold">${p.name}</h1>
                <p class="text-2xl font-bold text-blue-600">${p.price.toLocaleString()} د.م.</p>
                <p class="text-gray-600 bg-gray-50 p-6 rounded-2xl border">${p.description}</p>
                <button onclick="addToCart('${p.id}')" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg">أضف للسلة</button>
            </div>
        </div>
    `;
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
                        <p class="text-blue-600 font-bold mb-4">${p.price} د.م.</p>
                        <button onclick="addToCart('${p.id}')" class="w-full py-2 bg-gray-100 rounded-lg">أضف للسلة</button>
                    </div>
                `).join('')}
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

    // Simple UI transitions
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
    else if (hash.startsWith('#/product/')) root.innerHTML = renderProduct(hash.split('#/product/')[1]);
    else if (hash.startsWith('#/category/')) root.innerHTML = renderCategory(decodeURIComponent(hash.split('#/category/')[1]));
    else root.innerHTML = `<div class="text-center py-20">404 - الصفحة غير موجودة</div>`;
};

// --- Actions (Global exposure for onclick) ---
// Fix: Use casting to (window as any) to resolve "Property does not exist on type Window" errors
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
    // Fix: Cast document.getElementById results to HTMLInputElement to access .value property
    const order = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: (document.getElementById('form-name') as HTMLInputElement).value,
        city: (document.getElementById('form-city') as HTMLInputElement).value,
        phone: (document.getElementById('form-phone') as HTMLInputElement).value,
        items: [...state.cart],
        total: state.cart.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0),
        createdAt: new Date().toISOString()
    };
    state.orders.unshift(order);
    state.cart = [];
    saveState();
    
    // Simulate Sheets Sync
    if (state.settings.googleSheetsUrl) {
        console.log("Sending to Sheets...", order);
    }
    
    alert('شكراً لطلبك! سنتصل بك لتأكيد الطلب.');
    window.location.hash = '#/';
};

(window as any).addProductFromDash = () => {
    // Fix: Cast document.getElementById results to HTMLInputElement/HTMLSelectElement to access .value property
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const cat = (document.getElementById('p-cat') as HTMLSelectElement).value;
    if (!name || !price) return;
    state.products.push({ id: Date.now().toString(), name, price: Number(price), category: cat, description: 'وصف المنتج الجديد', image: 'https://picsum.photos/seed/'+name+'/600/400' });
    saveState();
    router();
};

(window as any).deleteProduct = (id: string) => {
    state.products = state.products.filter((x: any) => x.id !== id);
    saveState();
    router();
};

(window as any).saveSettingsFromDash = () => {
    // Fix: Cast document.getElementById results to HTMLInputElement to access .value property
    state.settings = {
        fbPixel: (document.getElementById('s-fb') as HTMLInputElement).value,
        googleAnalytics: (document.getElementById('s-ga') as HTMLInputElement).value,
        tiktokPixel: (document.getElementById('s-tk') as HTMLInputElement).value,
        googleSheetsUrl: (document.getElementById('s-gs') as HTMLInputElement).value,
        domain: state.settings.domain,
        nameServer: state.settings.nameServer
    };
    saveState();
    injectPixels();
    alert('تم حفظ الإعدادات وتحديث الأكواد');
};

// --- Initialization ---
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    router();
    updateCartUI();
    injectPixels();
});
