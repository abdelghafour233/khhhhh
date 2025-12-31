
/**
 * storehalal v2.1 - Robust E-commerce Engine 🚀
 * تم إصلاح مشاكل التحميل واستقرار الصور
 */

// --- صور عالية الجودة ومستقرة جداً ---
const FALLBACK_IMAGES = {
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    charger: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800',
    cable: 'https://images.unsplash.com/photo-1610492421943-88d2f38f8176?auto=format&fit=crop&q=80&w=800',
    article: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    placeholder: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=10&w=10'
};

const DEFAULT_PRODUCTS = [
    { id: 'p1', name: 'ساعة ذكية Ultra Series 9', price: 450, image: FALLBACK_IMAGES.watch, category: 'إلكترونيات', description: 'ساعة متطورة تدعم المكالمات.' },
    { id: 'p2', name: 'سماعات Air-Pro لاسلكية', price: 290, image: FALLBACK_IMAGES.headphones, category: 'إكسسوارات', description: 'صوت محيطي نقي.' },
    { id: 'p3', name: 'شاحن سريع 65W GaN', price: 180, image: FALLBACK_IMAGES.charger, category: 'إلكترونيات', description: 'شحن فائق السرعة.' },
    { id: 'p4', name: 'كابل شحن Type-C متين', price: 45, image: FALLBACK_IMAGES.cable, category: 'إكسسوارات', description: 'جودة نقل بيانات عالية.' }
];

// --- نظام إدارة الحالة الآمن ---
let state: any = {
    products: [],
    articles: [],
    settings: {},
    cart: [],
    orders: [],
    isAdmin: false
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(DEFAULT_PRODUCTS));
        state.articles = JSON.parse(localStorage.getItem('articles') || '[]');
        state.settings = JSON.parse(localStorage.getItem('settings') || JSON.stringify({
            whatsapp: '212649075664',
            siteName: 'storehalal',
            adminPass: 'halal2025',
            smartlink: '',
            adsterra: { header: '', middle: '', bottom: '' }
        }));
        state.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        state.isAdmin = sessionStorage.getItem('isAdmin') === 'true';

        if (state.articles.length === 0) {
            state.articles = [{
                id: 'welcome',
                title: 'مرحباً بكم في storehalal',
                excerpt: 'متجرك الأول في المغرب للجودة والسرعة.',
                content: 'نحن فخورون بتقديم أفضل الخدمات لزبنائنا الكرام.',
                image: FALLBACK_IMAGES.article,
                date: new Date().toISOString()
            }];
        }
        // إصلاح الصور تلقائياً عند البداية
        autoFixData();
    } catch (e) {
        console.error("Storage Error:", e);
        localStorage.clear();
        location.reload();
    }
};

const autoFixData = () => {
    let fixed = false;
    state.products.forEach((p: any) => {
        if (!p.image || p.image.includes('picsum') || p.image === 'undefined') {
            const def = DEFAULT_PRODUCTS.find(dp => dp.id === p.id);
            p.image = def ? def.image : FALLBACK_IMAGES.placeholder;
            fixed = true;
        }
    });
    if (fixed) save();
};

const save = () => {
    localStorage.setItem('products', JSON.stringify(state.products));
    localStorage.setItem('articles', JSON.stringify(state.articles));
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('orders', JSON.stringify(state.orders));
};

// --- المساعدات ---
const notify = (msg: string) => alert(msg);

const safeInject = (id: string, code: string) => {
    const el = document.getElementById(id);
    if (!el || !code) return;
    try {
        el.innerHTML = '';
        const range = document.createRange();
        range.selectNode(el);
        const fragment = range.createContextualFragment(code);
        el.appendChild(fragment);
    } catch (e) { console.warn("Ad Injection Failed:", e); }
};

// --- الدوال العامة لربطها بالـ HTML ---
(window as any).addToCart = (id: string) => {
    const p = state.products.find((i: any) => i.id === id);
    if (!p) return;
    const exists = state.cart.find((i: any) => i.id === id);
    if (exists) exists.qty++; else state.cart.push({ ...p, qty: 1 });
    save();
    updateUI();
    notify('✅ تمت الإضافة');
};

(window as any).removeFromCart = (id: string) => {
    state.cart = state.cart.filter((i: any) => i.id !== id);
    save();
    router();
};

// --- واجهات العرض ---
const UI = {
    badge: () => {
        const count = state.cart.reduce((s: number, i: any) => s + i.qty, 0);
        document.querySelectorAll('.cart-badge').forEach(b => {
            b.innerHTML = count.toString();
            b.classList.toggle('hidden', count === 0);
        });
    },
    store: () => `
        <div class="animate-fadeIn">
            <section class="bg-blue-600 text-white py-12 md:py-20 px-4 text-center">
                <h1 class="text-3xl md:text-5xl font-black mb-4">تسوق الأفضل مع <span class="text-yellow-400">storehalal</span></h1>
                <p class="text-blue-100 max-w-xl mx-auto text-sm md:text-base">توصيل سريع لكل مدن المغرب | الدفع عند الاستلام</p>
                ${state.settings.smartlink ? `<a href="${state.settings.smartlink}" target="_blank" class="inline-block mt-6 bg-yellow-400 text-blue-900 px-8 py-2 rounded-full font-bold animate-bounce shadow-lg">🔥 عروض اليوم</a>` : ''}
            </section>

            <div class="max-w-7xl mx-auto px-4 py-12">
                <h2 class="text-2xl font-black mb-8 border-r-4 border-blue-600 pr-4">وصل حديثاً 🔥</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    ${state.products.map((p: any) => `
                        <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                            <div class="relative aspect-square overflow-hidden bg-slate-100">
                                <img src="${p.image}" onerror="this.src='${FALLBACK_IMAGES.placeholder}'" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                                <div class="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">${p.category}</div>
                            </div>
                            <div class="p-4 text-right flex flex-col flex-1">
                                <h3 class="font-bold text-sm md:text-base dark:text-white line-clamp-1">${p.name}</h3>
                                <div class="text-blue-600 font-black text-lg my-2">${p.price} <span class="text-xs">د.م.</span></div>
                                <button onclick="addToCart('${p.id}')" class="mt-auto w-full bg-slate-900 dark:bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">أضف للسلة 🛒</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,
    cart: () => {
        const total = state.cart.reduce((s: number, i: any) => s + (i.price * i.qty), 0);
        return `
            <div class="max-w-4xl mx-auto px-4 py-12 text-right">
                <h1 class="text-3xl font-black mb-8 dark:text-white">سلة المشتريات 🛒</h1>
                ${state.cart.length === 0 ? `
                    <div class="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p class="text-slate-500">سلتك فارغة..</p>
                        <a href="#/" class="inline-block mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">تسوق الآن</a>
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${state.cart.map((i: any) => `
                            <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <img src="${i.image}" class="w-16 h-16 rounded-lg object-cover">
                                    <div><h3 class="font-bold dark:text-white">${i.name}</h3><p class="text-blue-600 font-bold">${i.price} د.م.</p></div>
                                </div>
                                <button onclick="removeFromCart('${i.id}')" class="text-red-500">🗑️</button>
                            </div>
                        `).join('')}
                        <div class="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center mt-8">
                            <h2 class="text-2xl font-black">${total} د.م.</h2>
                            <a href="#/checkout" class="bg-blue-600 px-8 py-3 rounded-xl font-bold">إتمام الطلب ➔</a>
                        </div>
                    </div>
                `}
            </div>
        `;
    },
    checkout: () => `
        <div class="max-w-xl mx-auto px-4 py-12 text-right">
            <h1 class="text-3xl font-black mb-8 dark:text-white text-center">تأكيد الطلب ✅</h1>
            <form onsubmit="handleOrder(event)" class="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-xl space-y-4">
                <input name="name" required placeholder="الاسم الكامل" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none border focus:border-blue-500">
                <input name="phone" type="tel" required placeholder="رقم الهاتف (واتساب)" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none border focus:border-blue-500 text-left" dir="ltr">
                <input name="city" required placeholder="المدينة" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none border focus:border-blue-500">
                <textarea name="address" required placeholder="العنوان بالتفصيل" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none border focus:border-blue-500 h-24"></textarea>
                <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-green-700 transition">تأكيد الشراء 📦</button>
            </form>
        </div>
    `
};

(window as any).handleOrder = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const order = {
        id: Date.now().toString(),
        name: fd.get('name'),
        phone: fd.get('phone'),
        city: fd.get('city'),
        items: state.cart,
        total: state.cart.reduce((s: number, i: any) => s + (i.price * i.qty), 0),
        date: new Date().toISOString()
    };
    state.orders.unshift(order);
    const msg = `طلب جديد: ${order.name}\nالهاتف: ${order.phone}\nالمجموع: ${order.total} د.م.\nالمنتجات: ${order.items.map((i:any)=>i.name).join(', ')}`;
    state.cart = [];
    save();
    window.location.href = `https://wa.me/${state.settings.whatsapp}?text=${encodeURIComponent(msg)}`;
};

// --- نظام الراوتر المركزي ---
const router = () => {
    const root = document.getElementById('app-root');
    if (!root) return;
    
    const hash = window.location.hash || '#/';
    window.scrollTo(0, 0);

    try {
        if (hash === '#/') root.innerHTML = UI.store();
        else if (hash === '#/cart') root.innerHTML = UI.cart();
        else if (hash === '#/checkout') root.innerHTML = UI.checkout();
        else if (hash === '#/dashboard') root.innerHTML = renderDashboard();
        else root.innerHTML = `<div class="py-20 text-center">الصفحة غير موجودة</div>`;
    } catch (e) {
        root.innerHTML = `<div class="py-20 text-center text-red-500 font-bold">عذراً، حدث خطأ أثناء تحميل هذه الصفحة. <br><button onclick="location.reload()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">إعادة تحميل</button></div>`;
    }
    
    updateUI();
};

const updateUI = () => {
    UI.badge();
    renderFooter();
    if (state.settings.adsterra.header) safeInject('global-ad-scripts', state.settings.adsterra.header);
    if (state.settings.adsterra.bottom) safeInject('footer-ad-slot', state.settings.adsterra.bottom);
};

const renderFooter = () => {
    const f = document.getElementById('dynamic-footer');
    if (!f) return;
    f.innerHTML = `
        <div id="footer-ad-slot" class="flex justify-center py-4 bg-slate-50 dark:bg-slate-950"></div>
        <footer class="bg-slate-900 text-white py-12 text-center text-sm">
            <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                <div><h3 class="font-black text-xl text-blue-500 mb-4">${state.settings.siteName}</h3><p class="text-slate-400">متجرك الموثوق للجودة والسرعة.</p></div>
                <div><h4 class="font-bold mb-4">روابط</h4><a href="#/" class="block text-slate-400 mb-2">المتجر</a><a href="#/cart" class="block text-slate-400">السلة</a></div>
                <div><h4 class="font-bold mb-4">الدعم</h4><a href="https://wa.me/${state.settings.whatsapp}" class="inline-block bg-green-600 px-6 py-2 rounded-lg font-bold">تواصل واتساب</a></div>
            </div>
            <div class="mt-12 border-t border-white/5 pt-8 text-slate-600">© ${new Date().getFullYear()} storehalal. جميع الحقوق محفوظة.</div>
        </footer>
    `;
};

// --- لوحة التحكم المبسطة ---
const renderDashboard = () => {
    if (!state.isAdmin) return `
        <div class="max-w-md mx-auto py-20 px-4 text-right">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-xl">
                <h2 class="text-2xl font-black mb-6 dark:text-white text-center">🔐 الإدارة</h2>
                <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 text-center">
                <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">دخول</button>
            </div>
        </div>
    `;
    return `
        <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row text-right">
            <aside class="w-full md:w-64 bg-slate-900 text-white p-6">
                <h3 class="text-xl font-black text-blue-500 mb-10">لوحة التحكم</h3>
                <nav class="space-y-4">
                    <button onclick="router()" class="block w-full text-right p-2 hover:bg-white/5 rounded">📦 الطلبات (${state.orders.length})</button>
                    <button onclick="logout()" class="block w-full text-right p-2 text-red-400 mt-10">🚪 خروج</button>
                </nav>
            </aside>
            <main class="flex-1 p-8">
                <h2 class="text-2xl font-black mb-6">أحدث الطلبات</h2>
                <div class="space-y-4">
                    ${state.orders.map((o: any) => `
                        <div class="bg-white p-4 rounded-xl border flex justify-between">
                            <div><div class="font-bold">${o.name}</div><div class="text-xs text-blue-600">${o.phone}</div></div>
                            <div class="font-black">${o.total} د.م.</div>
                        </div>
                    `).join('')}
                    ${state.orders.length === 0 ? '<p>لا توجد طلبات بعد.</p>' : ''}
                </div>
            </main>
        </div>
    `;
};

(window as any).login = () => {
    if ((document.getElementById('pass') as HTMLInputElement).value === state.settings.adminPass) {
        state.isAdmin = true; sessionStorage.setItem('isAdmin', 'true'); router();
    } else notify('كلمة سر خاطئة');
};

(window as any).logout = () => {
    state.isAdmin = false; sessionStorage.removeItem('isAdmin'); router();
};

// --- البدء الفعلي للمتجر ---
window.addEventListener('load', () => {
    initStore();
    router();
});
window.addEventListener('hashchange', router);
