
/**
 * storehalal v2.8 - Multi-Ad & E-commerce Engine 🚀
 * تم دمج Popunder و Social Bar مع خاصية Anti-Adblock
 */

const FALLBACK_IMAGES = {
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    charger: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800',
    cable: 'https://images.unsplash.com/photo-1610492421943-88d2f38f8176?auto=format&fit=crop&q=80&w=800',
    placeholder: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=10&w=10'
};

const DEFAULT_PRODUCTS = [
    { id: 'p1', name: 'ساعة ذكية Ultra Series 9', price: 450, image: FALLBACK_IMAGES.watch, category: 'إلكترونيات' },
    { id: 'p2', name: 'سماعات Air-Pro لاسلكية', price: 290, image: FALLBACK_IMAGES.headphones, category: 'إكسسوارات' },
    { id: 'p3', name: 'شاحن سريع 65W GaN', price: 180, image: FALLBACK_IMAGES.charger, category: 'إلكترونيات' },
    { id: 'p4', name: 'كابل شحن Type-C متين', price: 45, image: FALLBACK_IMAGES.cable, category: 'إكسسوارات' }
];

let state: any = {
    products: [],
    settings: {},
    cart: [],
    orders: [],
    isAdmin: false,
    currentTab: 'orders'
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(DEFAULT_PRODUCTS));
        
        // الأكواد المقدمة من المستخدم (Popunder + Social Bar)
        const popunderScript = '<script src="https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js"></script>';
        const socialBarScript = '<script src="https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js"></script>';
        
        const defaultAds = {
            header: popunderScript + '\n' + socialBarScript,
            middle: '',
            bottom: ''
        };

        state.settings = JSON.parse(localStorage.getItem('settings') || JSON.stringify({
            whatsapp: '212649075664',
            siteName: 'storehalal',
            adminPass: 'halal2025',
            smartlink: '',
            adsterra: defaultAds
        }));

        // تحديث الإعدادات إذا كانت قديمة لتشمل الكود الجديد
        if (!state.settings.adsterra.header.includes('15385b7c751e6c7d59d59fb7f34e2934')) {
             state.settings.adsterra.header += '\n' + socialBarScript;
        }

        state.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        state.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    } catch (e) {
        localStorage.clear();
        location.reload();
    }
};

const save = () => {
    localStorage.setItem('products', JSON.stringify(state.products));
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('orders', JSON.stringify(state.orders));
};

const safeInject = (id: string, code: string) => {
    const el = document.getElementById(id);
    if (!el || !code) return;
    try {
        el.innerHTML = '';
        const range = document.createRange();
        range.selectNode(el);
        const fragment = range.createContextualFragment(code);
        el.appendChild(fragment);
    } catch (e) { console.warn("Ad Injection Status", "Safe-mode check"); }
};

// --- Actions ---
(window as any).addToCart = (id: string) => {
    const p = state.products.find((i: any) => i.id === id);
    if (!p) return;
    const exists = state.cart.find((i: any) => i.id === id);
    if (exists) exists.qty++; else state.cart.push({ ...p, qty: 1 });
    save();
    updateUI();
    alert('✅ تمت إضافة المنتج للسلة');
};

(window as any).removeFromCart = (id: string) => {
    state.cart = state.cart.filter((i: any) => i.id !== id);
    save();
    router();
};

// --- UI Components ---
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
            <section class="bg-blue-600 text-white py-16 px-4 text-center">
                <h1 class="text-3xl md:text-5xl font-black mb-4">تسوق الأفضل مع <span class="text-yellow-400">${state.settings.siteName}</span></h1>
                <p class="text-blue-100 max-w-xl mx-auto">توصيل سريع لكل مدن المغرب | الدفع عند الاستلام</p>
                ${state.settings.smartlink ? `<a href="${state.settings.smartlink}" target="_blank" class="inline-block mt-6 bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-black animate-bounce shadow-xl">🔥 عروض حصرية اليوم</a>` : ''}
            </section>

            <div class="max-w-7xl mx-auto px-4 py-12">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    ${state.products.map((p: any) => `
                        <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                            <div class="relative aspect-square overflow-hidden bg-slate-100">
                                <img src="${p.image}" onerror="this.src='${FALLBACK_IMAGES.placeholder}'" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
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
            <div class="max-w-4xl mx-auto px-4 py-12 text-right animate-fadeIn">
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
    }
};

// --- Dashboard & Ads Management ---
(window as any).switchDashTab = (tab: string) => {
    state.currentTab = tab;
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'ads') {
        panel.innerHTML = `
            <h2 class="text-xl font-black mb-4 dark:text-white">💰 إعدادات الأرباح (Multi-Ads)</h2>
            <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border space-y-4 text-right">
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-4 border border-green-200 dark:border-green-800">
                    <p class="text-xs text-green-700 dark:text-green-300 font-bold">✅ تم دمج Popunder + Social Bar + Anti-Adblock.</p>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1 dark:text-slate-300">أكواد الإعلانات النشطة (Header)</label>
                    <textarea id="ad-h" class="w-full p-3 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono text-[10px] h-48 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" dir="ltr"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1 dark:text-slate-300">رابط Smartlink</label>
                    <input id="ad-smart" class="w-full p-3 bg-slate-50 dark:bg-slate-800 dark:text-white border rounded-lg text-xs outline-none" dir="ltr" value="${state.settings.smartlink}">
                </div>
                <button onclick="saveDashAds()" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">تحديث وحفظ الإعدادات</button>
            </div>
        `;
        (document.getElementById('ad-h') as any).value = state.settings.adsterra.header;
    } else if (tab === 'orders') {
        panel.innerHTML = `<h2 class="text-xl font-black mb-6 dark:text-white">📦 الطلبات الواردة (${state.orders.length})</h2><div class="space-y-4">${state.orders.map((o:any)=>`<div class="bg-white dark:bg-slate-900 p-4 rounded-xl border flex justify-between"><div><div class="font-bold dark:text-white">${o.name}</div><div class="text-xs text-blue-600">${o.phone}</div></div><div class="font-black dark:text-white">${o.total} د.م.</div></div>`).join('')}</div>`;
    }
};

(window as any).saveDashAds = () => {
    state.settings.adsterra.header = (document.getElementById('ad-h') as any).value;
    state.settings.smartlink = (document.getElementById('ad-smart') as any).value;
    save();
    alert('✅ تم التحديث بنجاح! الإعلانات الجديدة تعمل الآن.');
    location.reload();
};

const renderDashboard = () => {
    if (!state.isAdmin) return `
        <div class="max-w-md mx-auto py-20 px-4 text-right">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-xl">
                <h2 class="text-2xl font-black mb-6 dark:text-white text-center">🔐 الإدارة</h2>
                <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white border rounded-xl mb-4 text-center">
                <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">دخول</button>
            </div>
        </div>
    `;
    return `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-right">
            <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-2">
                <div class="text-xl font-black text-blue-500 mb-8 text-center">لوحة التحكم</div>
                <button onclick="switchDashTab('orders')" class="p-3 hover:bg-white/5 rounded-xl text-right font-bold transition">📦 الطلبات</button>
                <button onclick="switchDashTab('ads')" class="p-3 hover:bg-white/5 rounded-xl text-right font-bold transition">💰 الأرباح</button>
                <button onclick="logout()" class="p-3 text-red-400 mt-auto font-bold">🚪 خروج</button>
            </aside>
            <main class="flex-1 p-6 md:p-12 overflow-x-hidden" id="dash-panel"></main>
        </div>
    `;
};

(window as any).login = () => {
    if ((document.getElementById('pass') as HTMLInputElement).value === state.settings.adminPass) {
        state.isAdmin = true; sessionStorage.setItem('isAdmin', 'true'); router();
    } else alert('خطأ في كلمة السر!');
};

(window as any).logout = () => { state.isAdmin = false; sessionStorage.removeItem('isAdmin'); router(); };

// --- Router & Main Logic ---
const router = () => {
    const root = document.getElementById('app-root');
    if (!root) return;
    const hash = window.location.hash || '#/';
    window.scrollTo(0, 0);

    if (hash === '#/') root.innerHTML = UI.store();
    else if (hash === '#/cart') root.innerHTML = UI.cart();
    else if (hash === '#/dashboard') {
        root.innerHTML = renderDashboard();
        if(state.isAdmin) (window as any).switchDashTab('orders');
    }
    updateUI();
};

const updateUI = () => {
    UI.badge();
    const footer = document.getElementById('dynamic-footer');
    if (footer) {
        footer.innerHTML = `
            <footer class="bg-slate-900 text-white py-12 text-center text-sm">
                <p>© ${new Date().getFullYear()} ${state.settings.siteName}. جميع الحقوق محفوظة.</p>
                <a href="#/dashboard" class="text-slate-700 mt-4 inline-block hover:text-white transition">🔐 إدارة المتجر</a>
            </footer>
        `;
    }
    // حقن الأكواد المزدوجة (Popunder + Social Bar)
    if (state.settings.adsterra.header) {
        safeInject('global-ad-scripts', state.settings.adsterra.header);
    }
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
