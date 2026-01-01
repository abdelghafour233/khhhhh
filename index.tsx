
/**
 * storehalal v6.8 - Professional Ad & Dashboard Fix 🚀🇲🇦
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

// --- نظام حقن الإعلانات المتقدم (v6.8) ---
const injectAds = () => {
    console.log("🛠️ Injecting Ad System...");
    AD_SCRIPTS.forEach((src, idx) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.setAttribute('data-cfasync', 'false'); // لتعطيل Cloudflare Rocket Loader
        script.id = `ad-script-${idx}`;
        document.body.appendChild(script);
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
        
        // تشغيل الإعلانات بعد استقرار الصفحة
        setTimeout(injectAds, 2000);
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

// --- وظائف عامة ---
(window as any).shareAction = (platform: string, productId?: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = productId ? `${baseUrl}#/product/${productId}` : baseUrl;
    const p = productId ? state.products.find((i: any) => i.id === productId) : null;
    const text = `أعجبني هذا العرض في متجر ${state.settings.siteName}:\n\n*${p ? p.name : state.settings.siteName}*\n\nرابط المنتج:\n${shareUrl}`;
    const url = platform === 'whatsapp' ? `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}` : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
};

(window as any).login = () => {
    const val = (document.getElementById('pass') as HTMLInputElement).value;
    if (val === state.settings.adminPass) {
        state.isAdmin = true;
        sessionStorage.setItem('isAdmin', 'true');
        router(); // تحديث فوري للصفحة
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

const UI = {
    header: () => `
        <header class="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b dark:border-slate-800 shadow-sm">
            <nav class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <a href="#/" class="flex items-center gap-2 group">
                    <div class="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-xl font-black group-hover:rotate-12 transition">S</div>
                    <span class="text-xl font-black">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-2">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:scale-105 transition">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:opacity-90 transition">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn pb-20">
            <div class="bg-slate-900 text-white py-20 px-4 text-center">
                <h1 class="text-4xl md:text-5xl font-black mb-4 tracking-tighter">${state.settings.siteName}</h1>
                <p class="opacity-60 text-sm md:text-lg mb-8 max-w-lg mx-auto">الدفع عند الاستلام - توصيل سريع لجميع المدن 🇲🇦</p>
                <div class="ad-container" id="top-ad"></div>
            </div>
            
            <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col group hover:shadow-2xl transition-all duration-500">
                        <div class="relative overflow-hidden aspect-square">
                            <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                        </div>
                        <div class="p-6 flex flex-col flex-1">
                            <h3 class="font-black text-sm md:text-base mb-2 line-clamp-1">${p.name}</h3>
                            <div class="text-blue-600 font-black text-lg mb-5">${p.price} د.م.</div>
                            <div class="mt-auto space-y-4">
                                <button onclick="buyNow('${p.id}')" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl text-xs font-black shadow-lg active:scale-95 transition">🛒 اطلب الآن</button>
                                <div class="flex gap-4 justify-center pt-3 border-t dark:border-slate-800">
                                    <button onclick="shareAction('whatsapp', '${p.id}')" class="text-[#25D366] p-2 hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-5 h-5"></button>
                                    <button onclick="shareAction('facebook', '${p.id}')" class="text-[#1877F2] p-2 hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-5 h-5"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="ad-container" id="bottom-ad"></div>
        </div>
    `,
    checkout: () => `
        <div class="max-w-md mx-auto py-12 px-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border dark:border-slate-800">
                <h2 class="text-2xl font-black mb-8 text-center tracking-tighter">معلومات التوصيل 🚚</h2>
                <div class="mb-8 p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center gap-4 border dark:border-slate-700">
                   <img src="${state.checkoutItem.image}" class="w-16 h-16 rounded-2xl object-cover shadow-sm">
                   <div>
                       <div class="text-xs font-bold text-slate-400 mb-1 line-clamp-1">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black text-xl">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>
                <form onsubmit="event.preventDefault(); window.location.hash='#/success';" class="space-y-4">
                    <input type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none font-bold">
                    <select required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none font-bold">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input type="tel" placeholder="رقم الهاتف" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-right font-black tracking-widest" dir="ltr">
                    <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl hover:brightness-110 active:scale-95 transition">تأكيد الطلب ✅</button>
                    
                    <div class="mt-8 pt-8 border-t dark:border-slate-800">
                        <p class="text-[10px] font-black text-slate-400 text-center mb-5 uppercase tracking-widest">للاستفسار تواصل معنا</p>
                        <div class="flex gap-4">
                            <button type="button" onclick="shareAction('whatsapp')" class="flex-1 bg-[#25D366] text-white py-4 rounded-2xl text-xs font-black shadow-lg hover:scale-105 transition">واتساب</button>
                            <button type="button" onclick="shareAction('facebook')" class="flex-1 bg-[#1877F2] text-white py-4 rounded-2xl text-xs font-black shadow-lg hover:scale-105 transition">فيسبوك</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-32 px-4 animate-fadeIn">
                <div class="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border dark:border-slate-800 text-center shadow-2xl">
                    <h2 class="text-2xl font-black mb-8 tracking-tighter">دخول المسؤول</h2>
                    <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 mb-6 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-2xl text-center outline-none font-black text-lg focus:ring-2 focus:ring-blue-500 transition">
                    <button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black active:scale-95 transition shadow-xl shadow-blue-500/20">دخول</button>
                    <a href="#/" class="inline-block mt-6 text-xs font-bold text-slate-400 hover:text-blue-500 transition">← العودة للمتجر</a>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right bg-slate-50 dark:bg-slate-950 animate-fadeIn">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex md:flex-col gap-2 border-b md:border-b-0 border-white/5 shadow-2xl z-10">
                    <div class="hidden md:block text-2xl font-black text-blue-500 mb-10 px-2 tracking-tighter">لوحة التحكم</div>
                    <button onclick="switchTab('orders')" class="p-4 text-right hover:bg-white/10 rounded-2xl transition font-bold text-sm ${state.currentTab === 'orders' ? 'bg-blue-600' : ''}">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="p-4 text-right hover:bg-white/10 rounded-2xl transition font-bold text-sm ${state.currentTab === 'products' ? 'bg-blue-600' : ''}">🛍️ المنتجات</button>
                    <button onclick="logout()" class="md:mt-auto p-4 text-red-400 font-black border border-red-400/10 rounded-2xl text-center text-sm hover:bg-red-400/10 transition mt-4">خروج آمن</button>
                </aside>
                <main id="dash-panel" class="flex-1 p-6 md:p-12"></main>
            </div>
        `;
    }
};

(window as any).switchTab = (tab: string) => {
    state.currentTab = tab;
    router(); // إعادة الرندرة لتحديث تبويبات الإدارة
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'orders') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-10">الطلبات (${state.orders.length})</h2>
            <div class="grid gap-4">
                ${state.orders.map((o: any) => `
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 flex justify-between items-center shadow-sm">
                        <div>
                            <div class="font-black text-lg">${o.name} <span class="text-xs opacity-40 mr-2">${o.city}</span></div>
                            <div class="text-blue-500 font-black" dir="ltr">${o.phone}</div>
                        </div>
                        <div class="font-black text-blue-600">${o.total} د.م.</div>
                    </div>
                `).join('') || '<p class="text-center opacity-30 py-20 font-black">لا يوجد طلبات</p>'}
            </div>
        `;
    } else if (tab === 'products') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-10">إدارة المنتجات</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 mb-10">
                <div class="grid md:grid-cols-2 gap-4">
                    <input id="p-name" placeholder="اسم المنتج" class="p-4 border dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none font-bold">
                    <input id="p-price" type="number" placeholder="السعر" class="p-4 border dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none font-bold">
                </div>
                <button onclick="saveProduct()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-6 shadow-lg shadow-blue-500/20 active:scale-95 transition">إضافة المنتج</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border dark:border-slate-800 flex items-center justify-between">
                        <div class="font-bold">${p.name}</div>
                        <div class="text-blue-600 font-black">${p.price} د.م.</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    if (!name || !price) return alert('املأ الحقول');
    state.products.unshift({ id: Date.now().toString(), name, price: Number(price), image: 'https://via.placeholder.com/400x400' });
    save();
    (window as any).switchTab('products');
};

const router = () => {
    const root = document.getElementById('app-root');
    const hash = window.location.hash || '#/';
    let html = UI.header();
    
    if (hash === '#/') html += UI.store();
    else if (hash === '#/checkout') html += UI.checkout();
    else if (hash === '#/dashboard') {
        html += UI.dashboard();
        setTimeout(() => { if(state.isAdmin) (window as any).switchTab(state.currentTab); }, 50);
    }
    else if (hash === '#/success') html += `
        <div class="max-w-md mx-auto py-32 text-center px-4 animate-fadeIn">
            <div class="text-6xl mb-6">🎉</div>
            <h1 class="text-4xl font-black mb-4">تم استلام طلبك!</h1>
            <p class="text-slate-500 mb-10 font-bold leading-relaxed">سنتصل بك قريباً عبر الهاتف لتأكيد الشحن 🇲🇦</p>
            <a href="#/" class="inline-block w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition">العودة للمتجر</a>
        </div>
    `;
    
    root!.innerHTML = html;
    
    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-950 text-white py-16 px-6 text-center border-t border-white/5">
            <div class="text-2xl font-black text-blue-500 mb-3">${state.settings.siteName}</div>
            <p class="text-slate-500 font-bold text-xs mb-8 opacity-60">توصيل سريع لكل مدن المغرب 🇲🇦</p>
            <div class="text-slate-800 text-[9px] font-mono tracking-widest uppercase">© 2025 ${state.settings.siteName} - Stable v6.8</div>
        </footer>
    `;
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
