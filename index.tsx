
/**
 * storehalal v3.2 - Internal Checkout Edition 🛒
 * تحويل مسار الطلبات ليكون داخلياً بالكامل مع صفحة نجاح مخصصة
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
    currentTab: 'orders',
    isSafeMode: false
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(DEFAULT_PRODUCTS));
        
        const urlParams = new URLSearchParams(window.location.search);
        state.isSafeMode = urlParams.has('fbclid') || urlParams.has('gclid') || urlParams.has('utm_source');

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
    if (state.isSafeMode) return;
    const el = document.getElementById(id);
    if (!el || !code) return;
    try {
        el.innerHTML = '';
        const range = document.createRange();
        range.selectNode(el);
        const fragment = range.createContextualFragment(code);
        el.appendChild(fragment);
    } catch (e) {}
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

(window as any).submitOrder = (e: Event) => {
    e.preventDefault();
    const name = (document.getElementById('order-name') as HTMLInputElement).value;
    const city = (document.getElementById('order-city') as HTMLInputElement).value;
    const phone = (document.getElementById('order-phone') as HTMLInputElement).value;

    if (!name || !city || !phone) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }

    const total = state.cart.reduce((s: number, i: any) => s + (i.price * i.qty), 0);
    const newOrder = {
        id: Date.now().toString(),
        name,
        city,
        phone,
        total,
        items: [...state.cart],
        date: new Date().toISOString(),
        status: 'pending'
    };

    state.orders.unshift(newOrder);
    state.cart = [];
    save();
    
    // توجيه لصفحة النجاح الداخلية بدلاً من الواتساب
    window.location.hash = '#/success';
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
                    <div class="flex justify-center gap-3 md:gap-4 flex-wrap">
                        <div class="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl font-bold border border-white/20 text-xs md:text-base">🚚 التوصيل بالمجان</div>
                    </div>
                </div>
            </section>

            <div class="max-w-7xl mx-auto px-4 py-8 md:py-16">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                    ${state.products.map((p: any) => `
                        <div class="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                            <div class="relative aspect-square overflow-hidden bg-slate-50">
                                <img src="${p.image}" onerror="this.src='${FALLBACK_IMAGES.placeholder}'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                                <div class="absolute top-2 right-2 bg-green-500 text-white text-[8px] md:text-[10px] font-black px-2 py-1 rounded-lg">شحن مجاني 🚚</div>
                            </div>
                            <div class="p-3 md:p-5 text-right flex flex-col flex-1">
                                <h3 class="font-bold text-xs md:text-base dark:text-white line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">${p.name}</h3>
                                <div class="text-blue-600 font-black text-sm md:text-xl my-2">${p.price} <span class="text-[10px] md:text-xs font-bold">د.م.</span></div>
                                <button onclick="addToCart('${p.id}')" class="mt-auto w-full bg-slate-900 dark:bg-blue-600 text-white py-2.5 md:py-3 rounded-xl text-[10px] md:text-sm font-bold hover:bg-blue-700 transition">أضف للسلة 🛒</button>
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
                        <p class="text-slate-500 font-medium">سلتك فارغة..</p>
                        <a href="#/" class="inline-block mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">تسوق الآن</a>
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${state.cart.map((i: any) => `
                            <div class="bg-white dark:bg-slate-900 p-3 md:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
                                <div class="flex items-center gap-3 md:gap-5">
                                    <img src="${i.image}" class="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-sm">
                                    <div>
                                        <h3 class="font-bold text-sm md:text-base dark:text-white">${i.name}</h3>
                                        <p class="text-blue-600 font-black text-sm mt-1">${i.price} د.م.</p>
                                    </div>
                                </div>
                                <button onclick="removeFromCart('${i.id}')" class="text-red-500 font-bold">حذف</button>
                            </div>
                        `).join('')}
                        <div class="bg-slate-900 dark:bg-slate-800 text-white p-6 rounded-3xl mt-8 shadow-2xl">
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-slate-400">المجموع:</span>
                                <span class="text-xl font-black">${total} د.م.</span>
                            </div>
                            <div class="flex justify-between items-center mb-6 text-green-400 text-sm font-bold">
                                <span>الشحن:</span>
                                <span>توصيل بالمجان ✅</span>
                            </div>
                            <a href="#/checkout" class="block w-full bg-blue-600 py-4 rounded-2xl font-black text-lg text-center shadow-xl shadow-blue-500/20">تأكيد الطلب ➔</a>
                        </div>
                    </div>
                `}
            </div>
        `;
    },
    checkout: () => {
        const total = state.cart.reduce((s: number, i: any) => s + (i.price * i.qty), 0);
        if (state.cart.length === 0) { window.location.hash = '#/'; return ''; }
        
        return `
            <div class="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fadeIn text-right">
                <div class="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
                    <h1 class="text-2xl md:text-3xl font-black mb-2 dark:text-white text-center">تأكيد طلبك 🚚</h1>
                    <p class="text-slate-500 mb-8 text-sm text-center">أدخل معلومات الشحن لإنهاء عملية الشراء</p>
                    
                    <form onsubmit="submitOrder(event)" class="space-y-5">
                        <div class="space-y-2">
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">الاسم الكامل</label>
                            <input id="order-name" type="text" placeholder="مثال: أحمد العلوي" required 
                                class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition">
                        </div>
                        
                        <div class="space-y-2">
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">المدينة</label>
                            <input id="order-city" type="text" placeholder="مثال: الدار البيضاء" required 
                                class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition">
                        </div>
                        
                        <div class="space-y-2">
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">رقم الهاتف</label>
                            <input id="order-phone" type="tel" placeholder="06XXXXXXXX" required dir="ltr"
                                class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-right">
                        </div>

                        <div class="pt-6 border-t dark:border-slate-800">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-bold dark:text-white">المجموع الإجمالي:</span>
                                <span class="text-2xl font-black text-blue-600">${total} د.م.</span>
                            </div>
                            <div class="text-green-600 font-bold text-sm mb-6 flex items-center gap-2">
                                <span>✨ التوصيل بالمجان لجميع المدن</span>
                                <span class="text-lg">🚚</span>
                            </div>
                            <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-green-500/20 hover:bg-green-700 transition active:scale-95">تأكيد الشراء الآن ✅</button>
                            <p class="text-center text-[10px] text-slate-400 mt-4">الدفع يكون عند الاستلام. سيتم الاتصال بك لتأكيد العنوان.</p>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },
    success: () => `
        <div class="max-w-xl mx-auto px-4 py-20 text-center animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-50 dark:border-slate-800">
                <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">✓</div>
                <h1 class="text-3xl font-black mb-4 dark:text-white">تم استلام طلبك بنجاح! 🎉</h1>
                <p class="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">شكرًا لثقتك بنا. فريقنا سيقوم بالاتصال بك خلال الـ 24 ساعة القادمة عبر الهاتف لتأكيد العنوان وترتيب عملية التوصيل المجانية.</p>
                <a href="#/" class="inline-block bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95">العودة للمتجر 🏠</a>
                <div class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-bold">رقم الطلب: #${Math.floor(Math.random()*900000)+100000}</div>
            </div>
        </div>
    `
};

// --- Dashboard Logic ---
(window as any).switchDashTab = (tab: string) => {
    state.currentTab = tab;
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'ads') {
        panel.innerHTML = `
            <h2 class="text-xl md:text-2xl font-black mb-6 dark:text-white text-right">💰 إعدادات الأرباح</h2>
            <div class="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 text-right shadow-sm">
                <div>
                    <label class="block text-sm font-bold mb-2 dark:text-slate-300">أكواد Adsterra</label>
                    <textarea id="ad-h" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono text-[10px] h-48 border rounded-2xl outline-none" dir="ltr"></textarea>
                </div>
                <button onclick="saveDashAds()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 transition">حفظ التغييرات</button>
            </div>
        `;
        (document.getElementById('ad-h') as any).value = state.settings.adsterra.header;
    } else if (tab === 'orders') {
        panel.innerHTML = `
            <h2 class="text-xl md:text-2xl font-black mb-6 dark:text-white text-right">📦 الطلبات الواردة (${state.orders.length})</h2>
            <div class="grid grid-cols-1 gap-4">
                ${state.orders.map((o:any)=>`
                    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm text-right">
                        <div class="flex-1">
                            <div class="font-black text-lg dark:text-white mb-1">${o.name}</div>
                            <div class="text-xs md:text-sm text-blue-600 font-black mb-1" dir="ltr">${o.phone}</div>
                            <div class="text-[10px] text-slate-400 font-bold">${o.city}</div>
                        </div>
                        <div class="text-left w-full md:w-auto">
                            <div class="font-black text-xl text-green-600">${o.total} د.م.</div>
                            <div class="text-[9px] text-slate-400 mt-1">${new Date(o.date).toLocaleString('ar-MA')}</div>
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
    save();
    alert('✅ تم الحفظ!');
    location.reload();
};

const renderDashboard = () => {
    if (!state.isAdmin) return `
        <div class="max-w-md mx-auto py-16 px-4 text-right animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border shadow-2xl">
                <h2 class="text-2xl font-black mb-6 dark:text-white text-center">دخول الإدارة</h2>
                <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border rounded-2xl mb-4 text-center">
                <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl">دخول</button>
            </div>
        </div>
    `;
    return `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-right animate-fadeIn">
            <aside class="w-full md:w-72 bg-slate-900 text-white p-6 md:p-8 flex flex-col gap-2 shadow-2xl z-20">
                <div class="text-xl font-black text-blue-500 mb-8">إدارة المتجر</div>
                <nav class="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <button onclick="switchDashTab('orders')" class="flex-shrink-0 p-4 bg-white/5 rounded-2xl font-bold">📦 الطلبات</button>
                    <button onclick="switchDashTab('ads')" class="flex-shrink-0 p-4 hover:bg-white/5 rounded-2xl font-bold">💰 الأرباح</button>
                    <button onclick="logout()" class="p-4 text-red-400 font-black mt-auto">🚪 تسجيل الخروج</button>
                </nav>
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
    else if (hash === '#/checkout') root.innerHTML = UI.checkout();
    else if (hash === '#/success') root.innerHTML = UI.success();
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
            <footer class="bg-slate-900 text-white py-12 px-6 text-center text-sm border-t border-white/5">
                <div class="max-w-4xl mx-auto">
                    <div class="text-2xl font-black text-blue-500 mb-4 text-center">storehalal</div>
                    <p class="text-slate-400 mb-8 text-center">توصيل مجاني لجميع المدن المغربية 🇲🇦 | الدفع عند الاستلام</p>
                    <div class="border-t border-white/5 pt-8 text-slate-500 font-bold text-center">
                        © ${new Date().getFullYear()} ${state.settings.siteName}. جميع الحقوق محفوظة
                    </div>
                </div>
            </footer>
        `;
    }
    if (state.settings.adsterra.header) {
        safeInject('global-ad-scripts', state.settings.adsterra.header);
    }
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
