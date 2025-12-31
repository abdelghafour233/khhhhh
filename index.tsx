
/**
 * storehalal v4.2 - Multi-Ad Integration 🚀🇲🇦
 * تم دمج أكواد Adsterra (Popunder + SocialBar) مع نظام حماية لوحة التحكم.
 */

// --- الثوابت والإعدادات الافتراضية ---
const FALLBACK_IMAGES = {
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    placeholder: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=10&w=10'
};

const MOROCCAN_CITIES = [
    "الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "مكناس", "وجدة", "تطوان", 
    "القنيطرة", "آسفي", "تمارة", "المحمدية", "الناظور", "بني ملال", "الجديدة", "تازة", "سطات",
    "برشيد", "الخميسات", "العرائش", "القصر الكبير", "كلميم", "بركان"
].sort();

const INITIAL_PRODUCTS = [
    { id: '1', name: 'آيفون 15 برو ماكس', price: 14500, image: 'https://picsum.photos/seed/iphone/600/400', category: 'إلكترونيات' },
    { id: '2', name: 'ساعة ذكية Ultra Series 9', price: 450, image: FALLBACK_IMAGES.watch, category: 'إلكترونيات' },
    { id: '3', name: 'صانعة قهوة إسبريسو', price: 2200, image: 'https://picsum.photos/seed/coffee/600/400', category: 'منزل' },
    { id: '4', name: 'شاحن سريع 65W GaN', price: 180, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800', category: 'إلكترونيات' }
];

// --- حالة التطبيق ---
let state: any = {
    products: [],
    orders: [],
    settings: {},
    checkoutItem: null,
    isAdmin: false,
    currentTab: 'orders',
    adsInjected: false
};

// --- الوظائف الأساسية ---
const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(INITIAL_PRODUCTS));
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        const defaultSettings = {
            siteName: 'storehalal',
            whatsapp: '212649075664',
            adminPass: 'halal2025',
            fbPixel: '',
            tiktokPixel: '',
            gaId: '',
            googleSheetsUrl: '',
            // الأكواد التي قدمتها (Popunder + SocialBar)
            adsterraHeader: '<script src="https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js"></script>\n<script src="https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js"></script>'
        };

        state.settings = { ...defaultSettings, ...JSON.parse(localStorage.getItem('settings') || '{}') };
        state.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
        
        injectPixels();
    } catch (e) {
        localStorage.clear();
        location.reload();
    }
};

const save = () => {
    localStorage.setItem('products', JSON.stringify(state.products));
    localStorage.setItem('orders', JSON.stringify(state.orders));
    localStorage.setItem('settings', JSON.stringify(state.settings));
};

const injectAds = () => {
    const isDashboard = window.location.hash.startsWith('#/dashboard');
    const adContainer = document.getElementById('global-ad-scripts');
    
    if (!adContainer) return;

    if (isDashboard) {
        adContainer.style.display = 'none';
        adContainer.innerHTML = ''; 
        state.adsInjected = false;
        return;
    }

    adContainer.style.display = 'block';
    if (!state.adsInjected && state.settings.adsterraHeader) {
        try {
            const range = document.createRange();
            range.selectNode(adContainer);
            const fragment = range.createContextualFragment(state.settings.adsterraHeader);
            adContainer.appendChild(fragment);
            state.adsInjected = true;
        } catch (e) { console.error('فشل حقن الإعلانات', e); }
    }
};

const injectPixels = () => {
    document.querySelectorAll('.tracking-pixel').forEach(el => el.remove());
    if (state.settings.fbPixel) {
        const s = document.createElement('script');
        s.className = 'tracking-pixel';
        s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${state.settings.fbPixel}');fbq('track','PageView');`;
        document.head.appendChild(s);
    }
};

// --- تفاعلات المستخدم ---
(window as any).togglePass = () => {
    const input = document.getElementById('pass') as HTMLInputElement;
    const btn = document.getElementById('eye-icon');
    if (input.type === 'password') {
        input.type = 'text';
        btn!.innerHTML = '👁️';
    } else {
        input.type = 'password';
        btn!.innerHTML = '🙈';
    }
};

(window as any).login = () => {
    const val = (document.getElementById('pass') as HTMLInputElement).value;
    if (val === state.settings.adminPass) {
        state.isAdmin = true;
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else alert('كلمة السر خاطئة!');
};

(window as any).logout = () => {
    state.isAdmin = false;
    sessionStorage.removeItem('isAdmin');
    router();
};

(window as any).buyNow = (id: string) => {
    const p = state.products.find((i: any) => i.id === id);
    state.checkoutItem = p;
    window.location.hash = '#/checkout';
};

(window as any).submitOrder = async (e: Event) => {
    e.preventDefault();
    const name = (document.getElementById('order-name') as HTMLInputElement).value;
    const city = (document.getElementById('order-city') as HTMLSelectElement).value;
    const phone = (document.getElementById('order-phone') as HTMLInputElement).value;

    const order = {
        id: Date.now().toString(),
        name, city, phone,
        total: state.checkoutItem.price,
        product: state.checkoutItem.name,
        date: new Date().toISOString(),
        status: 'pending'
    };

    state.orders.unshift(order);
    save();

    if (state.settings.googleSheetsUrl) {
        fetch(state.settings.googleSheetsUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(order)
        }).catch(err => console.log('خطأ في مزامنة الجداول', err));
    }

    window.location.hash = '#/success';
};

// --- واجهة المستخدم ---
const UI = {
    header: () => `
        <header class="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b dark:border-slate-800">
            <nav class="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                <a href="#/" class="flex items-center gap-2">
                    <div class="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black">S</div>
                    <span class="text-xl font-black">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-3">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition hover:scale-105 active:scale-95">🔐 لوحة الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <section class="bg-blue-600 text-white py-16 px-4 text-center">
                <h1 class="text-4xl md:text-6xl font-black mb-4 leading-tight">متجر <span class="text-yellow-400">${state.settings.siteName}</span> للأجهزة الحديثة</h1>
                <p class="opacity-90 max-w-2xl mx-auto">نقدم لك أحدث المنتجات التقنية مع ضمان الجودة، شحن مجاني، والدفع فقط عند الاستلام في جميع مدن المملكة 🇲🇦</p>
            </section>
            <div class="max-w-7xl mx-auto px-4 py-12">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    ${state.products.map((p: any) => `
                        <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                            <img src="${p.image}" onerror="this.src='${FALLBACK_IMAGES.placeholder}'" class="w-full aspect-square object-cover">
                            <div class="p-4 text-right flex flex-col flex-1">
                                <h3 class="font-bold text-sm md:text-base mb-2 line-clamp-2">${p.name}</h3>
                                <div class="text-blue-600 font-black text-lg mb-4 mt-auto">${p.price} د.م.</div>
                                <button onclick="buyNow('${p.id}')" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xs transition active:scale-95">شراء الآن</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,
    checkout: () => `
        <div class="max-w-xl mx-auto px-4 py-12 animate-fadeIn text-right">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border dark:border-slate-800">
                <div class="flex items-center gap-4 mb-8 pb-4 border-b dark:border-slate-800">
                    <img src="${state.checkoutItem.image}" class="w-16 h-16 rounded-xl object-cover">
                    <div>
                        <h4 class="font-bold text-sm">${state.checkoutItem.name}</h4>
                        <div class="text-blue-600 font-black">${state.checkoutItem.price} د.م.</div>
                    </div>
                </div>
                <h2 class="text-2xl font-black mb-8 text-center">أدخل معلومات الشحن 🚚</h2>
                <form onsubmit="submitOrder(event)" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500">
                    <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-right focus:ring-2 focus:ring-blue-500" dir="ltr">
                    <div class="pt-6 border-t dark:border-slate-800 mt-6">
                        <div class="flex justify-between items-center mb-6">
                            <span class="font-bold">المجموع:</span>
                            <span class="text-2xl font-black text-green-600">${state.checkoutItem.price} د.م.</span>
                        </div>
                        <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-green-700 transition active:scale-95">تأكيد الطلب الآن ✅</button>
                    </div>
                </form>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-md mx-auto py-20 px-4 text-right animate-fadeIn">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-2xl">
                    <h2 class="text-2xl font-black mb-6 text-center">دخول الإدارة</h2>
                    <div class="relative mb-6">
                        <input id="pass" type="password" placeholder="كلمة السر" 
                            class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-center outline-none focus:ring-2 focus:ring-blue-500 pr-12">
                        <button onclick="togglePass()" id="eye-icon" type="button" 
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-xl transition hover:bg-slate-300">
                            🙈
                        </button>
                    </div>
                    <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black transition hover:bg-blue-700 active:scale-95">دخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-4 shadow-xl">
                    <div class="text-xl font-black text-blue-500 mb-6">لوحة التحكم</div>
                    <button onclick="switchTab('orders')" class="p-3 text-right hover:bg-white/5 rounded-xl font-bold transition">📦 الطلبات الواردة</button>
                    <button onclick="switchTab('products')" class="p-3 text-right hover:bg-white/5 rounded-xl font-bold transition">🛍️ إدارة المنتجات</button>
                    <button onclick="switchTab('settings')" class="p-3 text-right hover:bg-white/5 rounded-xl font-bold transition">⚙️ إعدادات المتجر</button>
                    <button onclick="logout()" class="mt-auto p-3 text-red-400 font-bold transition border border-red-400/20 rounded-xl text-center">🚪 تسجيل الخروج</button>
                </aside>
                <main id="dash-panel" class="flex-1 p-6 bg-slate-50 dark:bg-slate-950"></main>
            </div>
        `;
    }
};

// --- منطق علامات التبويب في الإدارة ---
(window as any).switchTab = (tab: string) => {
    state.currentTab = tab;
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'orders') {
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-black">قائمة الطلبات (${state.orders.length})</h2>
                <button onclick="location.reload()" class="p-2 bg-white rounded-lg border text-xs">تحديث 🔄</button>
            </div>
            <div class="space-y-4">
                ${state.orders.length ? state.orders.map((o: any) => `
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:shadow-md transition">
                        <div class="space-y-1">
                            <div class="font-black text-lg">${o.name}</div>
                            <div class="text-sm text-blue-600 font-bold" dir="ltr">${o.phone}</div>
                            <div class="text-xs text-slate-400">${o.city} • ${o.product}</div>
                        </div>
                        <div class="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div class="text-xl font-black text-green-600">${o.total} د.م.</div>
                            <button onclick="deleteOrder('${o.id}')" class="bg-red-50 text-red-500 p-2 rounded-lg text-xs font-bold hover:bg-red-100 transition">حذف 🗑️</button>
                        </div>
                    </div>
                `).join('') : '<div class="text-center py-20 opacity-50 font-bold">لا توجد طلبات بعد</div>'}
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-6">إعدادات الأرباح والتتبع</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 space-y-6 shadow-sm">
                <div>
                    <label class="block text-sm font-bold mb-2">اسم الموقع</label>
                    <input id="set-name" value="${state.settings.siteName}" class="w-full p-4 border dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2">رابط Google Sheets (تصدير البيانات)</label>
                    <input id="set-sheets" value="${state.settings.googleSheetsUrl}" class="w-full p-4 border dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-left outline-none focus:ring-2 focus:ring-blue-500" dir="ltr">
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2">أكواد Adsterra المعتمدة</label>
                    <textarea id="set-ads" class="w-full p-4 border dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 h-40 font-mono text-xs text-left outline-none focus:ring-2 focus:ring-blue-500" dir="ltr">${state.settings.adsterraHeader}</textarea>
                    <p class="text-[10px] text-slate-400 mt-2 font-bold">سيتم إيقاف هذه الأكواد تلقائياً عند دخولك للوحة الإدارة.</p>
                </div>
                <button onclick="saveSettings()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition">حفظ التغييرات</button>
            </div>
        `;
    } else if (tab === 'products') {
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-6">إدارة المنتجات</h2>
            <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 mb-8 shadow-sm">
                <h3 class="font-bold mb-4">إضافة منتج جديد</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input id="p-name" placeholder="اسم المنتج" class="p-3 border rounded-xl outline-none dark:bg-slate-800">
                    <input id="p-price" type="number" placeholder="السعر" class="p-3 border rounded-xl outline-none dark:bg-slate-800">
                    <input id="p-img" placeholder="رابط الصورة" class="p-3 border rounded-xl outline-none dark:bg-slate-800">
                    <button onclick="addProduct()" class="bg-blue-600 text-white p-3 rounded-xl font-bold">إضافة +</button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 flex justify-between items-center shadow-sm">
                        <div class="flex items-center gap-3">
                            <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover">
                            <div class="font-bold text-sm">${p.name}</div>
                        </div>
                        <button onclick="deleteProduct('${p.id}')" class="text-red-500 text-xs font-bold">حذف</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

(window as any).addProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const image = (document.getElementById('p-img') as HTMLInputElement).value;
    if (!name || !price) return alert('أكمل البيانات');
    state.products.unshift({ id: Date.now().toString(), name, price: Number(price), image });
    save(); (window as any).switchTab('products');
};

(window as any).deleteProduct = (id: string) => {
    state.products = state.products.filter((p: any) => p.id !== id);
    save(); (window as any).switchTab('products');
};

(window as any).saveSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.googleSheetsUrl = (document.getElementById('set-sheets') as HTMLInputElement).value;
    state.settings.adsterraHeader = (document.getElementById('set-ads') as HTMLTextAreaElement).value;
    save();
    alert('✅ تم الحفظ بنجاح! سيتم إعادة تشغيل الإعلانات بالبيانات الجديدة.');
    location.reload();
};

(window as any).deleteOrder = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        state.orders = state.orders.filter((o: any) => o.id !== id);
        save();
        (window as any).switchTab('orders');
    }
};

// --- نظام التوجيه (Router) ---
const router = () => {
    const root = document.getElementById('app-root');
    const hash = window.location.hash || '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let html = UI.header();
    if (hash === '#/') html += UI.store();
    else if (hash === '#/checkout') html += UI.checkout();
    else if (hash === '#/dashboard') html += UI.dashboard();
    else if (hash === '#/success') html += `
        <div class="max-w-md mx-auto py-24 text-center animate-fadeIn px-4">
            <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
            <h1 class="text-3xl font-black mb-4">تم استلام طلبك!</h1>
            <p class="text-slate-500 mb-10 font-bold leading-relaxed">شكراً لثقتك بنا. فريق المبيعات سيتصل بك قريباً عبر الهاتف لتأكيد العنوان وموعد التوصيل.</p>
            <a href="#/" class="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95">العودة للمتجر</a>
        </div>
    `;

    root!.innerHTML = html;

    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-900 text-white py-12 px-6 text-center text-xs md:text-sm border-t border-white/5">
            <div class="max-w-4xl mx-auto">
                <div class="text-2xl font-black text-blue-500 mb-2">${state.settings.siteName}</div>
                <p class="text-slate-500 mb-8 font-bold">الرائد في المغرب للتسوق الإلكتروني الآمن 🇲🇦</p>
                <div class="flex justify-center gap-6 opacity-40 mb-8 font-bold">
                    <span>الدفع عند الاستلام</span>
                    <span>توصيل سريع</span>
                    <span>جودة مضمونة</span>
                </div>
                <div class="text-slate-600 font-bold">© ${new Date().getFullYear()} جميع الحقوق محفوظة</div>
            </div>
        </footer>
    `;

    if (hash === '#/dashboard' && state.isAdmin) (window as any).switchTab('orders');
    
    // إدارة الإعلانات بشكل ديناميكي بناءً على المسار
    injectAds();
};

// تشغيل التطبيق
window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
