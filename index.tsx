
/**
 * storehalal v2.9 - Ultra Responsive Edition 📱💻
 * متوافق تماماً مع جميع الشاشات مع الحفاظ على أكواد الإعلانات
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
        
        // الأكواد المقدمة من المستخدم (Popunder + Social Bar) - الحفاظ على الإعدادات الأصلية
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
            <section class="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-12 md:py-20 px-4 text-center">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-3xl md:text-6xl font-black mb-4 leading-tight">تسوق الأفضل مع <span class="text-yellow-400">${state.settings.siteName}</span></h1>
                    <p class="text-blue-50 text-sm md:text-xl opacity-90 mb-8">أحدث الإلكترونيات | شحن سريع | الدفع عند الاستلام 🇲🇦</p>
                    ${state.settings.smartlink ? `<a href="${state.settings.smartlink}" target="_blank" class="inline-block bg-yellow-400 text-blue-900 px-10 py-4 rounded-2xl font-black animate-bounce shadow-2xl text-lg">🔥 اكتشف عروض اليوم</a>` : ''}
                </div>
            </section>

            <div class="max-w-7xl mx-auto px-4 py-8 md:py-16">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-black dark:text-white">جديد المنتجات 🔥</h2>
                    <span class="text-blue-600 text-sm font-bold">عرض الكل</span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                    ${state.products.map((p: any) => `
                        <div class="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                            <div class="relative aspect-square overflow-hidden bg-slate-50">
                                <img src="${p.image}" onerror="this.src='${FALLBACK_IMAGES.placeholder}'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                                <div class="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-lg">${p.category}</div>
                            </div>
                            <div class="p-3 md:p-5 text-right flex flex-col flex-1">
                                <h3 class="font-bold text-xs md:text-base dark:text-white line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">${p.name}</h3>
                                <div class="text-blue-600 font-black text-sm md:text-xl my-2">${p.price} <span class="text-[10px] md:text-xs">د.م.</span></div>
                                <button onclick="addToCart('${p.id}')" class="mt-auto w-full bg-slate-900 dark:bg-blue-600 text-white py-2.5 md:py-3 rounded-xl text-[10px] md:text-sm font-bold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-500/10">أضف للسلة 🛒</button>
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
            <div class="max-w-4xl mx-auto px-4 py-8 md:py-12 text-right animate-fadeIn">
                <h1 class="text-2xl md:text-3xl font-black mb-8 dark:text-white">سلة المشتريات 🛒</h1>
                ${state.cart.length === 0 ? `
                    <div class="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div class="text-5xl mb-4">🛒</div>
                        <p class="text-slate-500 font-medium">سلتك فارغة حالياً..</p>
                        <a href="#/" class="inline-block mt-6 bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20">ابدأ التسوق</a>
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${state.cart.map((i: any) => `
                            <div class="bg-white dark:bg-slate-900 p-3 md:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
                                <div class="flex items-center gap-3 md:gap-5">
                                    <img src="${i.image}" class="w-16 h-16 md:w-24 md:h-24 rounded-xl object-cover shadow-sm">
                                    <div>
                                        <h3 class="font-bold text-sm md:text-lg dark:text-white">${i.name}</h3>
                                        <p class="text-blue-600 font-black text-sm md:text-lg mt-1">${i.price} د.م.</p>
                                        <div class="text-[10px] text-slate-400 mt-1">الكمية: ${i.qty}</div>
                                    </div>
                                </div>
                                <button onclick="removeFromCart('${i.id}')" class="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition active:scale-90">🗑️</button>
                            </div>
                        `).join('')}
                        <div class="bg-slate-900 dark:bg-slate-800 text-white p-6 md:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center mt-10 gap-6">
                            <div class="text-center md:text-right">
                                <p class="text-slate-400 text-sm mb-1 font-medium">المجموع الإجمالي:</p>
                                <h2 class="text-3xl md:text-4xl font-black text-yellow-400">${total} <span class="text-sm font-normal text-white">درهم</span></h2>
                            </div>
                            <a href="#/checkout" class="w-full md:w-auto bg-blue-600 px-12 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 text-center">إتمام الطلب ➔</a>
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
            <h2 class="text-xl md:text-2xl font-black mb-6 dark:text-white">💰 إعدادات الأرباح (Adsterra)</h2>
            <div class="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 text-right shadow-sm">
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800/30">
                    <p class="text-xs text-green-700 dark:text-green-300 font-bold">✅ نظام الأرباح نشط (Popunder + Social Bar).</p>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2 dark:text-slate-300">أكواد الإعلانات (Header Scripts)</label>
                    <textarea id="ad-h" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono text-[10px] h-48 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition" dir="ltr"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2 dark:text-slate-300">رابط Smartlink (عروض)</label>
                    <input id="ad-smart" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500" dir="ltr" value="${state.settings.smartlink}">
                </div>
                <button onclick="saveDashAds()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 transition active:scale-95">تحديث الأرباح 🚀</button>
            </div>
        `;
        (document.getElementById('ad-h') as any).value = state.settings.adsterra.header;
    } else if (tab === 'orders') {
        panel.innerHTML = `
            <h2 class="text-xl md:text-2xl font-black mb-6 dark:text-white">📦 الطلبات الواردة (${state.orders.length})</h2>
            <div class="grid grid-cols-1 gap-4">
                ${state.orders.map((o:any)=>`
                    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                        <div class="flex-1">
                            <div class="font-black text-lg dark:text-white mb-1">${o.name}</div>
                            <div class="text-xs md:text-sm text-blue-600 font-black mb-1" dir="ltr">${o.phone}</div>
                            <div class="text-[10px] text-slate-400 font-bold">${o.city} | ${new Date(o.date || Date.now()).toLocaleDateString('ar-MA')}</div>
                        </div>
                        <div class="text-left w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                            <div class="font-black text-xl text-green-600">${o.total} د.م.</div>
                            <button class="text-[10px] font-bold text-slate-400 mt-2 bg-slate-100 px-3 py-1 rounded-lg">قيد الانتظار ⏳</button>
                        </div>
                    </div>
                `).join('')}
                ${state.orders.length === 0 ? '<div class="text-center py-20 text-slate-400 font-bold">لا توجد طلبات بعد.</div>' : ''}
            </div>
        `;
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
        <div class="max-w-md mx-auto py-16 px-4 text-right animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
                <div class="text-4xl text-center mb-6">🔐</div>
                <h2 class="text-2xl font-black mb-6 dark:text-white text-center">دخول الإدارة</h2>
                <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border rounded-2xl mb-4 text-center outline-none focus:ring-2 focus:ring-blue-500 transition">
                <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition active:scale-95">دخول لوحة التحكم</button>
            </div>
        </div>
    `;
    return `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-right animate-fadeIn">
            <!-- Sidebar / Top Nav for Mobile -->
            <aside class="w-full md:w-72 bg-slate-900 text-white p-6 md:p-8 flex flex-col gap-2 shadow-2xl z-20">
                <div class="flex items-center justify-between md:flex-col md:items-center mb-8 gap-4">
                    <div class="text-xl font-black text-blue-500">storehalal <span class="text-white font-light text-sm">Admin</span></div>
                    <button onclick="logout()" class="md:hidden p-2 bg-white/10 rounded-lg text-xs">خروج 🚪</button>
                </div>
                
                <nav class="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <button onclick="switchDashTab('orders')" class="flex-shrink-0 md:flex-shrink-1 p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-right font-bold transition flex items-center gap-3">
                        <span class="text-xl">📦</span>
                        <span>الطلبات (${state.orders.length})</span>
                    </button>
                    <button onclick="switchDashTab('ads')" class="flex-shrink-0 md:flex-shrink-1 p-4 hover:bg-white/5 rounded-2xl text-right font-bold transition flex items-center gap-3">
                        <span class="text-xl">💰</span>
                        <span>إعدادات الأرباح</span>
                    </button>
                    <button onclick="window.location.hash='#/'" class="flex-shrink-0 md:flex-shrink-1 p-4 hover:bg-white/5 rounded-2xl text-right font-bold transition flex items-center gap-3">
                        <span class="text-xl">🏠</span>
                        <span>عرض المتجر</span>
                    </button>
                </nav>

                <button onclick="logout()" class="hidden md:flex p-4 text-red-400 mt-auto font-black border-t border-white/5 items-center gap-3 hover:text-red-300 transition">
                    <span>🚪</span>
                    <span>تسجيل الخروج</span>
                </button>
            </aside>
            
            <main class="flex-1 p-4 md:p-12 overflow-x-hidden" id="dash-panel"></main>
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
    window.scrollTo({ top: 0, behavior: 'smooth' });

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
            <footer class="bg-slate-900 text-white py-12 px-6 text-center text-sm">
                <div class="max-w-4xl mx-auto">
                    <div class="text-2xl font-black text-blue-500 mb-4">storehalal</div>
                    <p class="text-slate-400 mb-8 max-w-sm mx-auto">متجرك المغربي الأول للجودة والسعر المناسب. توصيل في أقل من 48 ساعة.</p>
                    <div class="flex justify-center gap-6 mb-8">
                        <a href="https://wa.me/${state.settings.whatsapp}" class="text-2xl hover:scale-110 transition">💬</a>
                        <a href="#" class="text-2xl hover:scale-110 transition">📸</a>
                        <a href="#" class="text-2xl hover:scale-110 transition">🎥</a>
                    </div>
                    <div class="border-t border-white/5 pt-8 text-slate-500 font-bold">
                        © ${new Date().getFullYear()} ${state.settings.siteName}. جميع الحقوق محفوظة 🇲🇦
                    </div>
                </div>
            </footer>
        `;
    }
    // تفعيل الإعلانات المدمجة
    if (state.settings.adsterra.header) {
        safeInject('global-ad-scripts', state.settings.adsterra.header);
    }
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
