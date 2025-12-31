
/**
 * storehalal v4.6 - Optimized UI 🚀🇲🇦
 * تم إصلاح مشكلة التكرار وتحسين استجابة الهيدر.
 */

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
    { id: '1', name: 'آيفون 15 برو ماكس', price: 14500, image: 'https://picsum.photos/seed/iphone/600/400' },
    { id: '2', name: 'ساعة ذكية Ultra Series 9', price: 450, image: FALLBACK_IMAGES.watch },
    { id: '3', name: 'صانعة قهوة إسبريسو', price: 2200, image: 'https://picsum.photos/seed/coffee/600/400' },
    { id: '4', name: 'شاحن سريع 65W GaN', price: 180, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800' }
];

let state: any = {
    products: [],
    orders: [],
    settings: {},
    checkoutItem: null,
    isAdmin: false,
    currentTab: 'orders',
    adsInjected: false
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(INITIAL_PRODUCTS));
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        const defaultSettings = {
            siteName: 'storehalal',
            whatsapp: '212649075664',
            adminPass: 'halal2025',
            fbPixel: '',
            googleSheetsUrl: '',
            adsterraHeader: '<script src="https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js"></script>\n<script src="https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js"></script>'
        };

        state.settings = { ...defaultSettings, ...JSON.parse(localStorage.getItem('settings') || '{}') };
        state.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
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
        adContainer.innerHTML = '';
        state.adsInjected = false;
        return;
    }

    if (!state.adsInjected && state.settings.adsterraHeader) {
        try {
            const range = document.createRange();
            range.selectNode(adContainer);
            const fragment = range.createContextualFragment(state.settings.adsterraHeader);
            adContainer.appendChild(fragment);
            state.adsInjected = true;
        } catch (e) { console.error('Ad Error'); }
    }
};

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
    } else alert('❌ كلمة السر خاطئة!');
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
        date: new Date().toISOString()
    };

    state.orders.unshift(order);
    save();
    window.location.hash = '#/success';
};

const UI = {
    header: () => `
        <header class="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b dark:border-slate-800">
            <nav class="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center text-right">
                <a href="#/" class="flex items-center gap-2">
                    <div class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black">S</div>
                    <span class="text-xl font-bold tracking-tight">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-2">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-lg">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl text-[11px] font-black shadow-lg">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <div class="bg-blue-600 text-white py-12 px-4 text-center">
                <h1 class="text-3xl md:text-5xl font-black mb-2">متجر ${state.settings.siteName}</h1>
                <p class="opacity-80">أفضل العروض الحصرية في المغرب 🇲🇦</p>
            </div>
            <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col transition hover:shadow-md">
                        <img src="${p.image}" class="w-full aspect-square object-cover bg-slate-100">
                        <div class="p-4 flex flex-col flex-1">
                            <h3 class="font-bold text-sm mb-2 line-clamp-1">${p.name}</h3>
                            <div class="text-blue-600 font-black mb-4 mt-auto">${p.price} د.م.</div>
                            <button onclick="buyNow('${p.id}')" class="w-full bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold transition active:scale-95">اطلب الآن</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    checkout: () => `
        <div class="max-w-md mx-auto py-12 px-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border dark:border-slate-800">
                <h2 class="text-2xl font-black mb-8 text-center">معلومات الشحن 🚚</h2>
                <form onsubmit="submitOrder(event)" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500">
                    <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-right focus:ring-2 focus:ring-blue-500" dir="ltr">
                    <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg mt-4 transition active:scale-95">تأكيد الطلب ✅</button>
                </form>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-24 px-4 animate-fadeIn">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-2xl">
                    <h2 class="text-2xl font-black mb-6 text-center">دخول الإدارة</h2>
                    <div class="relative mb-6">
                        <input id="pass" type="password" placeholder="كلمة السر" 
                            class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-center outline-none focus:ring-2 focus:ring-blue-500 pr-12">
                        <button onclick="togglePass()" id="eye-icon" type="button" 
                            class="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🙈</button>
                    </div>
                    <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black transition active:scale-95">دخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-2">
                    <div class="text-xl font-black text-blue-500 mb-8 px-2">لوحة التحكم</div>
                    <button onclick="switchTab('orders')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold">🛍️ المنتجات</button>
                    <button onclick="switchTab('settings')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold">⚙️ الإعدادات</button>
                    <button onclick="logout()" class="mt-auto p-4 text-red-400 font-bold border border-red-400/20 rounded-2xl text-center transition hover:bg-red-400/10">خروج</button>
                </aside>
                <main id="dash-panel" class="flex-1 p-6 md:p-10"></main>
            </div>
        `;
    }
};

(window as any).switchTab = (tab: string) => {
    state.currentTab = tab;
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'orders') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-8">الطلبات الواردة</h2>
            <div class="grid gap-4">
                ${state.orders.map((o: any) => `
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                        <div>
                            <div class="font-black text-xl mb-1">${o.name}</div>
                            <div class="text-blue-600 font-bold mb-1">${o.phone} | ${o.city}</div>
                            <div class="text-sm text-slate-500">${o.product}</div>
                        </div>
                        <button onclick="deleteOrder('${o.id}')" class="bg-red-50 dark:bg-red-900/20 text-red-500 px-6 py-2 rounded-xl text-sm font-bold">حذف</button>
                    </div>
                `).join('') || '<div class="py-20 text-center opacity-40 font-bold">لا توجد طلبات</div>'}
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-8">الإعدادات العامة</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 space-y-6 max-w-2xl shadow-sm">
                <div>
                    <label class="block text-sm font-bold mb-2">اسم المتجر</label>
                    <input id="set-name" value="${state.settings.siteName}" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2">أكواد Adsterra</label>
                    <textarea id="set-ads" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 h-40 font-mono text-[11px] outline-none" dir="ltr">${state.settings.adsterraHeader}</textarea>
                </div>
                <button onclick="saveSettings()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition active:scale-95">حفظ وتحديث</button>
            </div>
        `;
    } else if (tab === 'products') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-8">إدارة المخزون</h2>
            <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 mb-8 flex flex-col md:flex-row gap-4">
                <input id="p-name" placeholder="اسم المنتج" class="flex-1 p-4 border dark:border-slate-700 rounded-2xl dark:bg-slate-800 outline-none">
                <input id="p-price" type="number" placeholder="السعر" class="w-full md:w-32 p-4 border dark:border-slate-700 rounded-2xl dark:bg-slate-800 outline-none text-center">
                <button onclick="addProduct()" class="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition active:scale-95">إضافة +</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border dark:border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <img src="${p.image}" class="w-12 h-12 rounded-xl object-cover bg-slate-50">
                            <div>
                                <div class="font-bold text-sm">${p.name}</div>
                                <div class="text-blue-600 font-bold text-xs">${p.price} د.م.</div>
                            </div>
                        </div>
                        <button onclick="deleteProduct('${p.id}')" class="text-red-500 p-2">🗑️</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

(window as any).addProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    if (!name || !price) return alert('أكمل البيانات');
    state.products.unshift({ id: Date.now().toString(), name, price: Number(price), image: 'https://picsum.photos/seed/'+Math.random()+'/400' });
    save(); (window as any).switchTab('products');
};

(window as any).deleteProduct = (id: string) => {
    state.products = state.products.filter((p: any) => p.id !== id);
    save(); (window as any).switchTab('products');
};

(window as any).saveSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.adsterraHeader = (document.getElementById('set-ads') as HTMLTextAreaElement).value;
    save();
    alert('✅ تم الحفظ بنجاح!');
    location.reload();
};

(window as any).deleteOrder = (id: string) => {
    if (confirm('حذف هذا الطلب؟')) {
        state.orders = state.orders.filter((o: any) => o.id !== id);
        save();
        (window as any).switchTab('orders');
    }
};

const router = () => {
    const root = document.getElementById('app-root');
    const hash = window.location.hash || '#/';
    
    let html = UI.header();
    if (hash === '#/') html += UI.store();
    else if (hash === '#/checkout') html += UI.checkout();
    else if (hash === '#/dashboard') html += UI.dashboard();
    else if (hash === '#/success') html += `
        <div class="max-w-md mx-auto py-32 text-center animate-fadeIn px-4">
            <div class="text-7xl mb-8">🎯</div>
            <h1 class="text-4xl font-black mb-4">شكراً لك!</h1>
            <p class="text-slate-500 mb-12 font-bold text-lg">تم استلام طلبك بنجاح. فريق العمل سيتواصل معك خلال ساعات قليلة لتأكيد العنوان 🇲🇦</p>
            <a href="#/" class="inline-block bg-blue-600 text-white px-12 py-5 rounded-3xl font-black shadow-2xl shadow-blue-500/30 transition active:scale-95">العودة للمتجر</a>
        </div>
    `;

    root!.innerHTML = html;
    
    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-900 text-white py-16 px-6 text-center border-t border-white/5">
            <div class="text-2xl font-black text-blue-500 mb-2">${state.settings.siteName}</div>
            <p class="text-slate-500 font-bold mb-8">الرائد في التجارة الإلكترونية بالمغرب 🇲🇦</p>
            <div class="text-slate-700 text-xs font-bold">© ${new Date().getFullYear()} جميع الحقوق محفوظة</div>
        </footer>
    `;

    if (hash === '#/dashboard' && state.isAdmin) (window as any).switchTab('orders');
    injectAds();
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
