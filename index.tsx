
/**
 * storehalal v6.9 - Final Ad Exclusion & Stability Fix 🚀🇲🇦
 */

const AD_SCRIPTS = [
    'https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js',
    'https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js'
];

const MOROCCAN_CITIES = ["الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "مكناس", "وجدة", "تطوان", "القنيطرة", "آسفي", "تمارة", "المحمدية", "الناظور", "بني ملال", "الجديدة", "تازة", "سطات", "برشيد", "الخميسات", "العرائش", "القصر الكبير", "كلميم", "بركان"].sort();

let state: any = {
    products: [],
    orders: [],
    settings: { siteName: 'storehalal', adminPass: 'halal2025' },
    checkoutItem: null,
    isAdmin: false,
    currentTab: 'orders'
};

// --- نظام الحقن الذكي (يمنع الإعلانات في الإدارة) ---
const injectAds = () => {
    if (window.location.hash.includes('dashboard')) {
        console.log("🚫 Admin detected, ads suppressed.");
        return;
    }
    
    AD_SCRIPTS.forEach((src, idx) => {
        if (!document.getElementById(`ad-script-${idx}`)) {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.id = `ad-script-${idx}`;
            document.body.appendChild(script);
        }
    });
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify([
            { id: '1', name: 'آيفون 15 برو ماكس', price: 14500, stock: 5, image: 'https://picsum.photos/seed/iphone/600/400' },
            { id: '2', name: 'ساعة ذكية Ultra Series 9', price: 450, stock: 12, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' }
        ]));
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        state.settings = { ...state.settings, ...JSON.parse(localStorage.getItem('settings') || '{}') };
        state.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
        
        // تشغيل الإعلانات فقط إذا لم نكن في الإدارة
        setTimeout(injectAds, 1500);
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

// --- الموجه المحدث لمنع الاهتزاز ---
const router = () => {
    const root = document.getElementById('app-root');
    const hash = window.location.hash || '#/';
    
    // إضافة كلاس للبودي لإخفاء أي إعلانات منبثقة برمجياً عبر CSS
    if (hash.includes('dashboard')) {
        document.body.classList.add('admin-mode');
    } else {
        document.body.classList.remove('admin-mode');
    }

    let html = UI.header();
    
    if (hash === '#/') html += UI.store();
    else if (hash === '#/checkout') html += UI.checkout();
    else if (hash === '#/dashboard') {
        html += UI.dashboard();
        // تأخير بسيط لضمان استقرار الـ DOM قبل تحميل التبويبات
        setTimeout(() => { if(state.isAdmin) (window as any).switchTab(state.currentTab); }, 30);
    }
    else if (hash === '#/success') html += UI.success();
    
    root!.innerHTML = html;
    
    const footer = document.getElementById('dynamic-footer');
    if (footer && !hash.includes('dashboard')) {
        footer.innerHTML = `
            <footer class="bg-slate-950 text-white py-12 px-6 text-center border-t border-white/5">
                <div class="text-xl font-black text-blue-500 mb-2">${state.settings.siteName}</div>
                <p class="text-slate-500 font-bold text-[10px] opacity-60">توصيل سريع لكل مدن المغرب 🇲🇦</p>
                <div class="text-slate-800 text-[8px] mt-4 font-mono tracking-widest uppercase">© 2025 - Stable v6.9</div>
            </footer>
        `;
    } else if (footer) {
        footer.innerHTML = ''; // إخفاء الفوتر في الإدارة لتقليل التشتت
    }
};

const UI = {
    header: () => `
        <header class="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b dark:border-slate-800 shadow-sm h-16 flex items-center">
            <nav class="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
                <a href="#/" class="flex items-center gap-2 group">
                    <div class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black group-hover:scale-110 transition">S</div>
                    <span class="text-lg font-black">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-2">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <div class="bg-slate-900 text-white py-16 px-4 text-center">
                <h1 class="text-3xl font-black mb-3">${state.settings.siteName}</h1>
                <p class="opacity-60 text-xs mb-6 max-w-xs mx-auto">الدفع عند الاستلام - توصيل سريع 🇲🇦</p>
                <div class="ad-container" id="top-ad"></div>
            </div>
            <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col group transition-all">
                        <img src="${p.image}" class="w-full aspect-square object-cover img-stable">
                        <div class="p-4 flex flex-col flex-1">
                            <h3 class="font-black text-xs mb-2 line-clamp-1">${p.name}</h3>
                            <div class="text-blue-600 font-black text-sm mb-4">${p.price} د.م.</div>
                            <button onclick="buyNow('${p.id}')" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black active:scale-95 transition">🛒 اطلب الآن</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-32 px-4 animate-fadeIn">
                <div class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border dark:border-slate-800 text-center shadow-2xl">
                    <h2 class="text-xl font-black mb-6">دخول الإدارة</h2>
                    <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-3 mb-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-xl text-center outline-none font-black">
                    <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-black active:scale-95 transition">دخول</button>
                    <a href="#/" class="inline-block mt-4 text-[10px] font-bold text-slate-400 underline">← العودة للمتجر</a>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 animate-fadeIn">
                <aside class="w-full md:w-56 bg-slate-900 text-white p-4 flex md:flex-col gap-1 border-b md:border-b-0 border-white/5">
                    <div class="hidden md:block text-lg font-black text-blue-500 mb-8 px-2">غرفة التحكم</div>
                    <button onclick="switchTab('orders')" class="flex-1 md:flex-none p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs ${state.currentTab === 'orders' ? 'bg-blue-600' : ''}">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="flex-1 md:flex-none p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs ${state.currentTab === 'products' ? 'bg-blue-600' : ''}">🛍️ المنتجات</button>
                    <button onclick="logout()" class="md:mt-auto p-3 text-red-400 font-black rounded-xl text-center text-xs hover:bg-red-400/10 transition">خروج</button>
                </aside>
                <main id="dash-panel" class="flex-1 p-4 md:p-8 bg-white dark:bg-slate-950 overflow-y-auto"></main>
            </div>
        `;
    },
    checkout: () => `
        <div class="max-w-md mx-auto py-8 px-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-800">
                <h2 class="text-xl font-black mb-6 text-center">تأكيد الطلب 🚚</h2>
                <div class="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-3 border dark:border-slate-700">
                   <img src="${state.checkoutItem.image}" class="w-12 h-12 rounded-xl object-cover img-stable">
                   <div>
                       <div class="text-[10px] font-bold text-slate-400 line-clamp-1">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black text-lg">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>
                <form onsubmit="event.preventDefault(); window.location.hash='#/success';" class="space-y-3">
                    <input type="text" placeholder="الاسم الكامل" required class="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none font-bold text-sm">
                    <select required class="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none font-bold text-sm">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input type="tel" placeholder="رقم الهاتف" required class="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none text-right font-black" dir="ltr">
                    <button type="submit" class="w-full bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition">إرسال الطلب ✅</button>
                </form>
            </div>
        </div>
    `,
    success: () => `
        <div class="max-w-md mx-auto py-24 text-center px-4 animate-fadeIn">
            <div class="text-5xl mb-4">🎉</div>
            <h1 class="text-2xl font-black mb-2">طلبك قيد المعالجة!</h1>
            <p class="text-slate-500 text-xs mb-8 font-bold">سنتصل بك في أقل من 24 ساعة لتأكيد التوصيل 🇲🇦</p>
            <a href="#/" class="inline-block w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm shadow-xl active:scale-95 transition">العودة للرئيسية</a>
        </div>
    `
};

(window as any).switchTab = (tab: string) => {
    state.currentTab = tab;
    
    // تحديث شكل الأزرار في السايدبار أولاً لمنع التأخير البصري
    const aside = document.querySelector('aside');
    if (aside) {
        aside.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('bg-blue-600');
            if (btn.innerText.includes(tab === 'orders' ? 'الطلبات' : 'المنتجات')) btn.classList.add('bg-blue-600');
        });
    }

    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'orders') {
        panel.innerHTML = `
            <h2 class="text-xl font-black mb-6">الطلبات الواردة (${state.orders.length})</h2>
            <div class="grid gap-3">
                ${state.orders.map((o: any) => `
                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border dark:border-slate-800 flex justify-between items-center">
                        <div class="flex flex-col gap-1">
                            <div class="font-black text-sm">${o.name} <span class="text-[9px] text-slate-400 mr-2">${o.city}</span></div>
                            <div class="text-blue-500 font-black text-xs" dir="ltr">${o.phone}</div>
                        </div>
                        <div class="font-black text-blue-600 text-sm">${o.total} د.م.</div>
                    </div>
                `).join('') || '<p class="text-center opacity-30 py-16 font-black text-xs">لا توجد طلبات بعد</p>'}
            </div>
        `;
    } else if (tab === 'products') {
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-black">إدارة المخزون</h2>
                <button onclick="document.getElementById('add-p-form').classList.toggle('hidden')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black">+ إضافة</button>
            </div>
            
            <div id="add-p-form" class="hidden bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 mb-6 transition-all">
                <div class="grid md:grid-cols-2 gap-3">
                    <input id="p-name" placeholder="اسم المنتج" class="p-3 border dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 outline-none font-bold text-xs">
                    <input id="p-price" type="number" placeholder="السعر بالدرهم" class="p-3 border dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 outline-none font-bold text-xs">
                </div>
                <button onclick="saveProduct()" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-xl font-black mt-4 text-xs shadow-lg">حفظ المنتج</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border dark:border-slate-800 flex items-center gap-3">
                        <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover img-stable">
                        <div class="flex-1">
                            <div class="font-bold text-[10px] line-clamp-1">${p.name}</div>
                            <div class="text-blue-600 font-black text-xs">${p.price} د.م.</div>
                        </div>
                        <button onclick="deleteProduct('${p.id}')" class="text-red-400 p-2 hover:bg-red-400/10 rounded-lg">🗑️</button>
                    </div>
                `).join('')}
            </div>
        `;
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
    state.checkoutItem = state.products.find((i: any) => i.id === id);
    window.location.hash = '#/checkout';
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    if (!name || !price) return alert('املأ الحقول');
    state.products.unshift({ id: Date.now().toString(), name, price: Number(price), image: 'https://via.placeholder.com/400x400?text=Product' });
    save();
    (window as any).switchTab('products');
};

(window as any).deleteProduct = (id: string) => {
    if(confirm('هل تريد حذف هذا المنتج؟')) {
        state.products = state.products.filter((p:any) => p.id !== id);
        save();
        (window as any).switchTab('products');
    }
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
