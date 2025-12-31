
/**
 * storehalal v2.5 - Professional E-commerce & Ad Engine 🚀
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
    { id: 'p3', name: 'شاحن سريع 65W GaN', price: 180, image: FALLBACK_IMAGES.charger, category: 'إلكترونيات' }
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
    } catch (e) { console.error("Ad Injection Failed", e); }
};

// --- Actions ---
(window as any).addToCart = (id: string) => {
    const p = state.products.find((i: any) => i.id === id);
    if (!p) return;
    const exists = state.cart.find((i: any) => i.id === id);
    if (exists) exists.qty++; else state.cart.push({ ...p, qty: 1 });
    save();
    updateUI();
    alert('✅ تمت الإضافة للسلة');
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
                ${state.settings.smartlink ? `<a href="${state.settings.smartlink}" target="_blank" class="inline-block mt-6 bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-black animate-bounce">🔥 عروض حصرية اليوم</a>` : ''}
            </section>

            <div class="max-w-7xl mx-auto px-4 py-12">
                <h2 class="text-2xl font-black mb-8 border-r-4 border-blue-600 pr-4">وصل حديثاً 🔥</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    ${state.products.map((p: any) => `
                        <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                            <div class="relative aspect-square overflow-hidden bg-slate-100">
                                <img src="${p.image}" onerror="this.src='${FALLBACK_IMAGES.placeholder}'" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                            </div>
                            <div class="p-4 text-right flex flex-col flex-1">
                                <h3 class="font-bold text-sm dark:text-white line-clamp-1">${p.name}</h3>
                                <div class="text-blue-600 font-black text-lg my-2">${p.price} د.م.</div>
                                <button onclick="addToCart('${p.id}')" class="mt-auto w-full bg-slate-900 dark:bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">أضف للسلة 🛒</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `
};

// --- Dashboard Logic ---
(window as any).switchDashTab = (tab: string) => {
    state.currentTab = tab;
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'orders') {
        panel.innerHTML = `
            <h2 class="text-xl font-black mb-6">📦 إدارة الطلبات (${state.orders.length})</h2>
            <div class="space-y-4 text-right">
                ${state.orders.map((o: any) => `
                    <div class="bg-white p-4 rounded-xl border flex justify-between items-center">
                        <div>
                            <div class="font-bold">${o.name}</div>
                            <div class="text-xs text-blue-600" dir="ltr">${o.phone}</div>
                            <div class="text-[10px] text-slate-400">${o.city}</div>
                        </div>
                        <div class="text-left">
                            <div class="font-black text-green-600">${o.total} د.م.</div>
                            <button onclick="deleteOrder('${o.id}')" class="text-red-500 text-[10px] mt-2">حذف</button>
                        </div>
                    </div>
                `).join('')}
                ${state.orders.length === 0 ? '<p class="text-center py-10 text-slate-400">لا توجد طلبات بعد.</p>' : ''}
            </div>
        `;
    } else if (tab === 'ads') {
        panel.innerHTML = `
            <h2 class="text-xl font-black mb-2">💰 أرباح Adsterra</h2>
            <p class="text-xs text-slate-500 mb-6">الصق الأكواد الخاصة بك هنا لتفعيل الإعلانات.</p>
            <div class="space-y-6 text-right">
                <div class="bg-white p-6 rounded-2xl border space-y-4">
                    <div>
                        <label class="block text-sm font-bold mb-1">إعلانات الواجهة (Social Bar)</label>
                        <textarea id="ad-h" class="w-full p-3 bg-slate-50 font-mono text-[10px] h-24 border rounded-lg" dir="ltr" placeholder="<script ..."></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-1">رابط Smartlink</label>
                        <input id="ad-smart" class="w-full p-3 bg-slate-50 font-mono text-xs border rounded-lg" dir="ltr" placeholder="https://..." value="${state.settings.smartlink || ''}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-1">إعلانات الفوتر (Banner 728x90)</label>
                        <textarea id="ad-b" class="w-full p-3 bg-slate-50 font-mono text-[10px] h-24 border rounded-lg" dir="ltr" placeholder="<script ..."></textarea>
                    </div>
                    <button onclick="saveDashAds()" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">تفعيل الأرباح الآن 🚀</button>
                </div>
            </div>
        `;
        (document.getElementById('ad-h') as any).value = state.settings.adsterra.header;
        (document.getElementById('ad-b') as any).value = state.settings.adsterra.bottom;
    } else if (tab === 'products') {
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-black">🏷️ المنتجات</h2>
                <button onclick="openAddP()" class="bg-blue-600 text-white px-4 py-1 rounded-lg text-xs font-bold">+ إضافة</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${state.products.map((p:any) => `
                    <div class="bg-white p-3 rounded-xl border flex gap-3 text-right">
                        <img src="${p.image}" class="w-16 h-16 rounded object-cover">
                        <div class="flex-1">
                            <div class="font-bold text-sm">${p.name}</div>
                            <div class="text-blue-600 font-bold">${p.price} د.م.</div>
                        </div>
                        <button onclick="deleteProduct('${p.id}')" class="text-red-500 text-xs">حذف</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

(window as any).saveDashAds = () => {
    state.settings.adsterra.header = (document.getElementById('ad-h') as any).value;
    state.settings.adsterra.bottom = (document.getElementById('ad-b') as any).value;
    state.settings.smartlink = (document.getElementById('ad-smart') as any).value;
    save();
    alert('✅ تم الحفظ! سيتم عرض الإعلانات للزوار الآن.');
    location.reload();
};

(window as any).deleteOrder = (id:string) => { if(confirm('حذف الطلب؟')){state.orders=state.orders.filter((o:any)=>o.id!==id);save();(window as any).switchDashTab('orders');} };
(window as any).deleteProduct = (id:string) => { if(confirm('حذف المنتج؟')){state.products=state.products.filter((p:any)=>p.id!==id);save();(window as any).switchDashTab('products');} };

const renderDashboard = () => {
    if (!state.isAdmin) return `
        <div class="max-w-md mx-auto py-20 px-4 text-right animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-xl">
                <h2 class="text-2xl font-black mb-6 dark:text-white text-center">🔐 دخول الإدارة</h2>
                <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 text-center">
                <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">دخول</button>
            </div>
        </div>
    `;
    return `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-right animate-fadeIn">
            <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-2">
                <div class="text-xl font-black text-blue-500 mb-8 text-center">لوحة التحكم</div>
                <button onclick="switchDashTab('orders')" class="p-3 hover:bg-white/5 rounded-xl text-right font-bold transition">📦 الطلبات</button>
                <button onclick="switchDashTab('products')" class="p-3 hover:bg-white/5 rounded-xl text-right font-bold transition">🏷️ المنتجات</button>
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
    } else alert('خطأ!');
};

(window as any).logout = () => { state.isAdmin = false; sessionStorage.removeItem('isAdmin'); router(); };

const router = () => {
    const root = document.getElementById('app-root');
    if (!root) return;
    const hash = window.location.hash || '#/';
    window.scrollTo(0, 0);

    if (hash === '#/') root.innerHTML = UI.store();
    else if (hash === '#/cart') root.innerHTML = `<div class="p-12 text-center">السلة (قيد التطوير)</div>`;
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
            <div id="footer-ad-slot" class="flex justify-center py-4 bg-slate-100 dark:bg-slate-900"></div>
            <footer class="bg-slate-900 text-white py-12 text-center text-sm">
                <p>© ${new Date().getFullYear()} ${state.settings.siteName}. جميع الحقوق محفوظة.</p>
                <a href="#/dashboard" class="text-slate-600 mt-4 inline-block">🔐 دخول الإدارة</a>
            </footer>
        `;
    }
    if (state.settings.adsterra.header) safeInject('global-ad-scripts', state.settings.adsterra.header);
    if (state.settings.adsterra.bottom) safeInject('footer-ad-slot', state.settings.adsterra.bottom);
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
