
/**
 * storehalal v3.8 - Password Visibility Toggle 🚀🇲🇦
 * إضافة ميزة إظهار وإخفاء كلمة السر في لوحة التحكم
 */

const FALLBACK_IMAGES = {
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    charger: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800',
    cable: 'https://images.unsplash.com/photo-1610492421943-88d2f38f8176?auto=format&fit=crop&q=80&w=800',
    placeholder: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=10&w=10'
};

const MOROCCAN_CITIES = [
    "الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "مكناس", "وجدة", "تطوان", 
    "القنيطرة", "آسفي", "تمارة", "المحمدية", "الناظور", "بني ملال", "الجديدة", "تازة", "سطات",
    "برشيد", "الخميسات", "العرائش", "القصر الكبير", "كلميم", "بركان"
].sort();

const DEFAULT_PRODUCTS = [
    { id: 'p1', name: 'ساعة ذكية Ultra Series 9', price: 450, image: FALLBACK_IMAGES.watch, category: 'إلكترونيات' },
    { id: 'p2', name: 'سماعات Air-Pro لاسلكية', price: 290, image: FALLBACK_IMAGES.headphones, category: 'إكسسوارات' },
    { id: 'p3', name: 'شاحن سريع 65W GaN', price: 180, image: FALLBACK_IMAGES.charger, category: 'إلكترونيات' },
    { id: 'p4', name: 'كابل شحن Type-C متين', price: 45, image: FALLBACK_IMAGES.cable, category: 'إكسسوارات' }
];

const STATUS_LABELS: any = {
    pending: { label: 'قيد الانتظار', class: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'تم التأكيد', class: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'تم الإرسال', class: 'bg-green-100 text-green-700' },
    cancelled: { label: 'ملغي', class: 'bg-red-100 text-red-700' }
};

let state: any = {
    products: [],
    settings: {},
    checkoutItem: null,
    orders: [],
    isAdmin: false,
    currentTab: 'orders',
    adsInjected: false
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(DEFAULT_PRODUCTS));
        
        const popunderScript = '<script src="https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js"></script>';
        const socialBarScript = '<script src="https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js"></script>';
        
        const defaultAds = {
            header: popunderScript + '\n' + socialBarScript,
            middle: '',
            bottom: ''
        };

        const storedSettings = JSON.parse(localStorage.getItem('settings') || '{}');
        state.settings = {
            whatsapp: '212649075664',
            siteName: 'storehalal',
            adminPass: 'halal2025',
            smartlink: '',
            adsterra: defaultAds,
            ...storedSettings
        };

        if (!state.settings.adsterra || !state.settings.adsterra.header) {
            state.settings.adsterra = defaultAds;
        }

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
    localStorage.setItem('orders', JSON.stringify(state.orders));
};

const injectAdsOnce = () => {
    if (state.adsInjected || !state.settings.adsterra?.header) return;
    const el = document.getElementById('global-ad-scripts');
    if (!el) return;
    try {
        const range = document.createRange();
        range.selectNode(el);
        const fragment = range.createContextualFragment(state.settings.adsterra.header);
        el.appendChild(fragment);
        state.adsInjected = true;
    } catch (e) { console.error('Error injecting ads:', e); }
};

// --- Actions ---
(window as any).buyNow = (id: string) => {
    const p = state.products.find((i: any) => i.id === id);
    if (!p) return;
    state.checkoutItem = { ...p, qty: 1 };
    window.location.hash = '#/checkout';
};

(window as any).submitOrder = (e: Event) => {
    e.preventDefault();
    const name = (document.getElementById('order-name') as HTMLInputElement).value;
    const city = (document.getElementById('order-city') as HTMLSelectElement).value;
    const phone = (document.getElementById('order-phone') as HTMLInputElement).value;
    if (!name || !city || !phone || !state.checkoutItem) return alert('يرجى ملء الحقول');
    const newOrder = {
        id: Date.now().toString(),
        name, city, phone,
        total: state.checkoutItem.price,
        items: [state.checkoutItem],
        date: new Date().toISOString(),
        status: 'pending'
    };
    state.orders.unshift(newOrder);
    state.checkoutItem = null;
    save();
    window.location.hash = '#/success';
};

(window as any).deleteOrder = (id: string) => {
    if (!confirm('هل أنت متأكد؟')) return;
    state.orders = state.orders.filter((o: any) => o.id !== id);
    save();
    (window as any).switchDashTab('orders');
};

(window as any).updateOrderStatus = (id: string, newStatus: string) => {
    const order = state.orders.find((o: any) => o.id === id);
    if (order) { order.status = newStatus; save(); (window as any).switchDashTab('orders'); }
};

// وظيفة إظهار/إخفاء كلمة السر
(window as any).togglePass = () => {
    const passInput = document.getElementById('pass') as HTMLInputElement;
    const eyeBtn = document.getElementById('eye-icon');
    if (!passInput || !eyeBtn) return;
    
    if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeBtn.innerHTML = '👁️'; // عين مفتوحة
    } else {
        passInput.type = 'password';
        eyeBtn.innerHTML = '🙈'; // قرد يغطي عينيه أو عين مغلقة
    }
};

// --- UI Components ---
const UI = {
    store: () => `
        <div class="animate-fadeIn">
            <section class="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-12 md:py-20 px-4 text-center">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-3xl md:text-6xl font-black mb-4 leading-tight">أفضل العروض في <span class="text-yellow-400">${state.settings.siteName}</span></h1>
                    <p class="text-blue-50 text-sm md:text-xl opacity-90 mb-8">تسوق الآن والدفع عند الاستلام مع توصيل مجاني 🇲🇦</p>
                    <div class="inline-block bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl font-bold border border-white/20 text-xs md:text-base">🚚 التوصيل بالمجان لجميع المدن</div>
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
                                <button onclick="buyNow('${p.id}')" class="mt-auto w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-xl text-[10px] md:text-sm font-black hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95">شراء الآن ➔</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,
    checkout: () => {
        if (!state.checkoutItem) { window.location.hash = '#/'; return ''; }
        const item = state.checkoutItem;
        return `
            <div class="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fadeIn text-right">
                <div class="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
                    <div class="flex items-center gap-4 mb-8 pb-6 border-b dark:border-slate-800">
                        <img src="${item.image}" class="w-20 h-20 rounded-2xl object-cover">
                        <div>
                            <h2 class="font-black text-lg dark:text-white">${item.name}</h2>
                            <p class="text-blue-600 font-black">${item.price} د.م.</p>
                        </div>
                    </div>
                    <h1 class="text-2xl font-black mb-8 dark:text-white text-center">معلومات الشحن 🚚</h1>
                    <form onsubmit="submitOrder(event)" class="space-y-6">
                        <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition">
                        <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer">
                            <option value="" disabled selected>اختر مدينتك</option>
                            ${MOROCCAN_CITIES.map(city => `<option value="${city}">${city}</option>`).join('')}
                        </select>
                        <input id="order-phone" type="tel" placeholder="06XXXXXXXX" required dir="ltr" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-right">
                        <div class="pt-8 border-t dark:border-slate-800">
                            <div class="flex justify-between items-center mb-6">
                                <span class="font-bold text-lg dark:text-white">المجموع الإجمالي:</span>
                                <span class="text-3xl font-black text-green-600">${item.price} د.م.</span>
                            </div>
                            <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-green-500/20 hover:bg-green-700 transition active:scale-95">تأكيد الشراء الآن ✅</button>
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
                <p class="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">فريقنا سيقوم بالاتصال بك خلال الـ 24 ساعة القادمة لتأكيد الطلب.</p>
                <a href="#/" class="inline-block bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95">العودة للمتجر 🏠</a>
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
                <textarea id="ad-h" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono text-[10px] h-48 border rounded-2xl outline-none" dir="ltr"></textarea>
                <button onclick="saveDashAds()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 transition">حفظ التغييرات</button>
            </div>
        `;
        (document.getElementById('ad-h') as any).value = state.settings.adsterra.header;
    } else if (tab === 'orders') {
        panel.innerHTML = `
            <h2 class="text-xl md:text-2xl font-black mb-6 dark:text-white text-right">📦 الطلبات الواردة (${state.orders.length})</h2>
            <div class="grid grid-cols-1 gap-6">
                ${state.orders.map((o:any)=> {
                    const status = STATUS_LABELS[o.status || 'pending'];
                    return `
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm text-right">
                        <div class="flex-1 space-y-2">
                            <div class="flex items-center gap-3">
                                <span class="px-3 py-1 rounded-full text-[10px] font-black ${status.class}">${status.label}</span>
                                <div class="font-black text-lg dark:text-white">${o.name}</div>
                            </div>
                            <div class="text-sm text-blue-600 font-black" dir="ltr">${o.phone}</div>
                            <div class="text-xs text-slate-500 font-bold">${o.city} • المنتج: ${o.items[0]?.name || 'غير معروف'}</div>
                        </div>
                        <div class="flex flex-col md:items-end gap-3 w-full md:w-auto">
                            <div class="font-black text-2xl text-green-600">${o.total} د.م.</div>
                            <div class="flex gap-2 flex-wrap">
                                <select onchange="updateOrderStatus('${o.id}', this.value)" class="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold p-2 rounded-lg outline-none cursor-pointer">
                                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
                                    <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>تم التأكيد</option>
                                    <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>تم الإرسال</option>
                                    <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                                </select>
                                <button onclick="deleteOrder('${o.id}')" class="bg-red-50 text-red-500 dark:bg-red-900/20 p-2 rounded-lg text-[10px] font-bold hover:bg-red-100 transition">حذف 🗑️</button>
                            </div>
                        </div>
                    </div>
                `}).join('')}
            </div>
        `;
    }
};

(window as any).saveDashAds = () => {
    state.settings.adsterra.header = (document.getElementById('ad-h') as any).value;
    save(); alert('✅ تم الحفظ!'); location.reload();
};

const renderDashboard = () => {
    if (!state.isAdmin) return `
        <div class="max-w-md mx-auto py-16 px-4 text-right animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border shadow-2xl">
                <h2 class="text-2xl font-black mb-6 dark:text-white text-center">دخول الإدارة</h2>
                
                <div class="relative mb-4">
                    <input id="pass" type="password" placeholder="كلمة السر" 
                        class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-center pr-4 pl-12">
                    
                    <button onclick="togglePass()" id="eye-icon" type="button" 
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-xl hover:opacity-80 transition text-lg">
                        🙈
                    </button>
                </div>
                
                <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95">دخول</button>
            </div>
        </div>
    `;
    return `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-right animate-fadeIn">
            <aside class="w-full md:w-72 bg-slate-900 text-white p-6 md:p-8 flex flex-col gap-2 shadow-2xl z-20">
                <div class="text-xl font-black text-blue-500 mb-8">إدارة المتجر</div>
                <nav class="flex md:flex-col gap-2">
                    <button onclick="switchDashTab('orders')" class="p-4 bg-white/5 rounded-2xl font-bold">📦 الطلبات</button>
                    <button onclick="switchDashTab('ads')" class="p-4 hover:bg-white/5 rounded-2xl font-bold">💰 الأرباح</button>
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

const router = () => {
    const root = document.getElementById('app-root');
    if (!root) return;
    const hash = window.location.hash || '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (hash === '#/') root.innerHTML = UI.store();
    else if (hash === '#/checkout') root.innerHTML = UI.checkout();
    else if (hash === '#/success') root.innerHTML = UI.success();
    else if (hash === '#/dashboard') {
        root.innerHTML = renderDashboard();
        if(state.isAdmin) (window as any).switchDashTab('orders');
    }
    updateUI();
};

const updateUI = () => {
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
    injectAdsOnce();
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
