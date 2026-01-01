
/**
 * storehalal v6.5 - Ultimate Global Ads Injection 🚀🇲🇦
 * تم التحديث: إصلاح شامل لظهور إعلانات ادستيرا (تظهر للجميع وفي كل مكان) + أزرار مشاركة مباشرة.
 */

const FALLBACK_IMAGES = {
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    placeholder: 'https://via.placeholder.com/400x400?text=No+Image'
};

const MOROCCAN_CITIES = [
    "الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "مكناس", "وجدة", "تطوان", 
    "القنيطرة", "آسفي", "تمارة", "المحمدية", "الناظور", "بني ملال", "الجديدة", "تازة", "سطات",
    "برشيد", "الخميسات", "العرائش", "القصر الكبير", "كلميم", "بركان"
].sort();

const INITIAL_PRODUCTS = [
    { 
        id: '1', 
        name: 'آيفون 15 برو ماكس', 
        price: 14500, 
        stock: 5,
        image: 'https://picsum.photos/seed/iphone/600/400'
    },
    { 
        id: '2', 
        name: 'ساعة ذكية Ultra Series 9', 
        price: 450, 
        stock: 12,
        image: FALLBACK_IMAGES.watch
    }
];

let state: any = {
    products: [],
    orders: [],
    settings: {},
    checkoutItem: null,
    isAdmin: false,
    currentTab: 'orders',
    adsLoaded: false,
    editingProduct: null
};

// --- محرك الإعلانات العالمي (يُستدعى فوراً وبشكل مستقل) ---
const runGlobalAdsEngine = () => {
    if (state.adsLoaded) return;
    
    const adCode = state.settings.adsterraHeader;
    if (!adCode) return;

    console.log("🚀 Global Ads Engine: Starting Injection...");

    const container = document.createElement('div');
    container.innerHTML = adCode;
    const scripts = container.querySelectorAll('script');

    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // نسخ جميع السمات (src, async, defer, etc)
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // إذا كان السكربت يحتوي على كود داخلي (Inline Script)
        if (oldScript.textContent) {
            newScript.textContent = oldScript.textContent;
        }

        // الحقن في آخر الجسم (Body) يضمن عدم تداخل الإعلانات مع تحميل الموقع
        document.body.appendChild(newScript);
    });

    state.adsLoaded = true;
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(INITIAL_PRODUCTS));
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // كود ادستيرا الافتراضي (سيظهر للجميع)
        const defaultAds = `
            <script src="https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js"></script>
            <script src="https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js"></script>
        `;

        const defaultSettings = {
            siteName: 'storehalal',
            adminPass: 'halal2025',
            adsterraHeader: defaultAds
        };

        state.settings = { ...defaultSettings, ...JSON.parse(localStorage.getItem('settings') || '{}') };
        state.isAdmin = sessionStorage.getItem('isAdmin') === 'true';

        // تشغيل الإعلانات فوراً عند تحميل المتجر
        runGlobalAdsEngine();
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

// --- وظائف المشاركة المباشرة ---
(window as any).shareAction = (platform: string, productId?: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = productId ? `${baseUrl}#/product/${productId}` : baseUrl;
    const p = productId ? state.products.find((i: any) => i.id === productId) : null;
    const title = p ? p.name : state.settings.siteName;
    const text = `أعجبني هذا العرض في متجر ${state.settings.siteName}:\n\n*${title}*\n\nرابط المنتج:\n${shareUrl}`;

    let url = '';
    if (platform === 'whatsapp') {
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    } else if (platform === 'facebook') {
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    }
    window.open(url, '_blank');
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
    if (!p || p.stock <= 0) return alert('عذراً، المنتج غير متوفر حالياً!');
    state.checkoutItem = p;
    window.location.hash = '#/checkout';
};

(window as any).submitOrder = async (e: Event) => {
    e.preventDefault();
    const name = (document.getElementById('order-name') as HTMLInputElement).value;
    const city = (document.getElementById('order-city') as HTMLSelectElement).value;
    const phone = (document.getElementById('order-phone') as HTMLInputElement).value;

    state.orders.unshift({
        id: Date.now().toString(),
        name, city, phone,
        total: state.checkoutItem.price,
        product: state.checkoutItem.name,
        productImage: state.checkoutItem.image,
        status: 'pending',
        date: new Date().toISOString()
    });
    save();
    window.location.hash = '#/success';
};

const UI = {
    header: () => `
        <header class="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b dark:border-slate-800 shadow-sm">
            <nav class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <a href="#/" class="flex items-center gap-2 group">
                    <div class="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-xl font-black shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">S</div>
                    <span class="text-xl font-black tracking-tighter">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-3">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black hover:opacity-90 transition-opacity">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <!-- Hero -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4 text-center">
                <h1 class="text-4xl md:text-6xl font-black mb-4 tracking-tight">${state.settings.siteName}</h1>
                <p class="opacity-60 text-sm md:text-lg mb-8 max-w-xl mx-auto font-medium">عروض حصرية، دفع عند الاستلام، وشحن مجاني لجميع مدن المغرب 🇲🇦</p>
                <div class="flex justify-center gap-4">
                    <button onclick="shareAction('whatsapp')" class="bg-[#25D366] p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-5 h-5 invert"></button>
                    <button onclick="shareAction('facebook')" class="bg-[#1877F2] p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-5 h-5 invert"></button>
                </div>
            </div>

            <!-- Products Grid -->
            <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group">
                        <div class="relative overflow-hidden aspect-square">
                            <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                        </div>
                        <div class="p-5 flex flex-col flex-1">
                            <h3 class="font-black text-sm md:text-base mb-2 line-clamp-1">${p.name}</h3>
                            <div class="text-blue-600 font-black text-lg mb-4">${p.price} د.م.</div>
                            
                            <div class="mt-auto space-y-4">
                                <button onclick="buyNow('${p.id}')" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl text-xs font-black shadow-lg active:scale-95 transition">
                                    🛒 اطلب الآن
                                </button>
                                
                                <!-- أزرار المشاركة المباشرة تحت زر الشراء -->
                                <div class="flex gap-4 justify-center pt-3 border-t dark:border-slate-800">
                                    <button onclick="shareAction('whatsapp', '${p.id}')" class="bg-[#25D366]/10 text-[#25D366] p-2.5 rounded-xl hover:bg-[#25D366] hover:text-white transition-all">
                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-4 h-4 currentColor">
                                    </button>
                                    <button onclick="shareAction('facebook', '${p.id}')" class="bg-[#1877F2]/10 text-[#1877F2] p-2.5 rounded-xl hover:bg-[#1877F2] hover:text-white transition-all">
                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-4 h-4 currentColor">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    checkout: () => `
        <div class="max-w-md mx-auto py-12 px-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border dark:border-slate-800">
                <h2 class="text-2xl font-black mb-8 text-center tracking-tighter">معلومات التوصيل 🚚</h2>
                
                <div class="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center gap-4 border dark:border-slate-700 shadow-inner">
                   <img src="${state.checkoutItem.image}" class="w-16 h-16 rounded-2xl object-cover shadow-md">
                   <div>
                       <div class="text-xs font-bold text-slate-500 mb-1">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black text-xl">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>

                <form onsubmit="submitOrder(event)" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                    <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none font-bold text-sm">
                        <option value="" disabled selected>اختر مدينتك</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف (06XXXXXXXX)" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-right font-black tracking-widest" dir="ltr">
                    
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-3xl font-black text-xl mt-4 active:scale-95 transition shadow-xl shadow-green-500/20">
                        تأكيد الطلب الآن ✅
                    </button>

                    <!-- أزرار التواصل الاجتماعي تحت زر إرسال الطلب مباشرة -->
                    <div class="mt-10 pt-8 border-t dark:border-slate-800 text-center">
                        <p class="text-[10px] font-black text-slate-400 mb-5 uppercase tracking-[0.2em]">شارك العرض قبل نفاذ المخزون</p>
                        <div class="flex gap-4">
                            <button type="button" onclick="shareAction('whatsapp', '${state.checkoutItem.id}')" class="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl text-xs font-black shadow-lg hover:brightness-110 active:scale-95 transition">
                                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-4 h-4 invert"> واتساب
                            </button>
                            <button type="button" onclick="shareAction('facebook', '${state.checkoutItem.id}')" class="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-4 rounded-2xl text-xs font-black shadow-lg hover:brightness-110 active:scale-95 transition">
                                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-4 h-4 invert"> فيسبوك
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-32 px-4">
                <div class="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border dark:border-slate-800 text-center shadow-2xl">
                    <h2 class="text-2xl font-black mb-8 tracking-tighter">دخول المسؤول</h2>
                    <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 mb-6 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-2xl text-center outline-none font-black text-lg">
                    <button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black active:scale-95 transition shadow-xl shadow-blue-500/20">تسجيل الدخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex md:flex-col gap-2 border-b md:border-b-0 border-white/5">
                    <div class="hidden md:block text-2xl font-black text-blue-500 mb-10 px-2 tracking-tighter">لوحة التحكم</div>
                    <button onclick="switchTab('orders')" class="p-4 text-right hover:bg-white/10 rounded-2xl transition font-bold text-sm">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="p-4 text-right hover:bg-white/10 rounded-2xl transition font-bold text-sm">🛍️ المنتجات</button>
                    <button onclick="switchTab('settings')" class="p-4 text-right hover:bg-white/10 rounded-2xl transition font-bold text-sm">⚙️ الإعدادات</button>
                    <button onclick="logout()" class="md:mt-auto p-4 text-red-400 font-black border border-red-400/20 rounded-2xl text-center text-sm hover:bg-red-400/10 transition">خروج آمن</button>
                </aside>
                <main id="dash-panel" class="flex-1 p-6 md:p-12 animate-fadeIn"></main>
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
            <h2 class="text-3xl font-black mb-10">الطلبات الواردة (${state.orders.length})</h2>
            <div class="grid gap-6">
                ${state.orders.map((o: any) => `
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                        <div class="text-right">
                            <div class="font-black text-lg">${o.name} <span class="text-xs text-slate-400 font-normal mr-3">${o.city}</span></div>
                            <div class="text-blue-600 font-black text-sm mt-1" dir="ltr">${o.phone}</div>
                        </div>
                        <div class="flex items-center gap-4 font-black">
                            <div class="text-slate-900 dark:text-white">${o.total} د.م.</div>
                            <button onclick="deleteOrder('${o.id}')" class="text-red-400 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors">🗑️</button>
                        </div>
                    </div>
                `).join('') || '<div class="text-center opacity-30 py-32 font-black text-2xl">لا توجد طلبات بعد</div>'}
            </div>
        `;
    } else if (tab === 'products') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-10">إدارة المنتجات</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm mb-12">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input id="p-name" placeholder="اسم المنتج" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <input id="p-price" type="number" placeholder="السعر بالدرهم" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 font-black outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <button onclick="saveProduct()" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black mt-8 shadow-xl hover:brightness-110 active:scale-[0.98] transition-all text-lg">إضافة المنتج للمتجر</button>
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-10">إعدادات الموقع والإعلانات</h2>
            <div class="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border dark:border-slate-800 space-y-8 max-w-2xl shadow-sm text-right">
                <div>
                    <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 mr-2">اسم المتجر</label>
                    <input id="set-name" value="${state.settings.siteName}" class="w-full p-5 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 font-black outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <div>
                    <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 mr-2">أكواد إعلانات ادستيرا (Adsterra Scripts)</label>
                    <textarea id="set-ads" class="w-full p-5 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 h-56 font-mono text-[10px] outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed" placeholder="إلصق جميع سكربتات ادستيرا هنا..." dir="ltr">${state.settings.adsterraHeader}</textarea>
                    <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-[10px] text-blue-600 font-bold leading-relaxed">
                        ⚠️ ملاحظة هامة: النظام الآن يقوم بحقن الإعلانات بشكل "عالمي" (Global Injection). هذا يضمن ظهور إعلانات Social Bar و Popunders للجميع وفي كل الصفحات بلا استثناء.
                    </div>
                </div>
                <button onclick="saveSettings()" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-6 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-all">تحديث الإعدادات والإعلانات ✅</button>
            </div>
        `;
    }
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    if (!name || !price) return alert('يرجى ملء كافة الحقول');
    state.products.unshift({ id: Date.now().toString(), name, price: Number(price), stock: 10, image: FALLBACK_IMAGES.placeholder });
    save();
    (window as any).switchTab('products');
};

(window as any).saveSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.adsterraHeader = (document.getElementById('set-ads') as HTMLTextAreaElement).value;
    save();
    alert('✅ تم الحفظ! سيتم إعادة تشغيل الموقع لتفعيل نظام الإعلانات العالمي الجديد.');
    location.reload();
};

(window as any).deleteOrder = (id: string) => {
    if (confirm('هل تريد حذف هذا الطلب؟')) {
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
        <div class="max-w-md mx-auto py-32 text-center px-4 animate-fadeIn">
            <div class="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">✅</div>
            <h1 class="text-4xl font-black mb-4 tracking-tighter">تم استلام طلبك بنجاح!</h1>
            <p class="text-slate-500 mb-12 font-bold px-4 leading-relaxed">شكراً لثقتك بنا. سنتصل بك قريباً عبر الهاتف لتأكيد العنوان وشحن طلبيتك 🇲🇦</p>
            <div class="px-8"><a href="#/" class="inline-block w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:scale-105 transition-transform">تصفح المزيد من العروض</a></div>
        </div>
    `;
    
    root!.innerHTML = html;
    
    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-950 text-white py-16 px-6 text-center border-t border-white/5">
            <div class="text-3xl font-black text-blue-500 mb-3 tracking-tighter">${state.settings.siteName}</div>
            <p class="text-slate-500 font-bold text-xs mb-10 max-w-sm mx-auto opacity-70">متجر مغربي موثوق يقدم أجود المنتجات مع خدمة الدفع عند الاستلام في جميع أنحاء المملكة 🇲🇦</p>
            <div class="flex justify-center gap-12 mb-12 text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                <button onclick="shareAction('whatsapp')" class="hover:text-[#25D366] transition-colors">WhatsApp</button>
                <button onclick="shareAction('facebook')" class="hover:text-[#1877F2] transition-colors">Facebook</button>
            </div>
            <div class="text-slate-800 text-[9px] font-mono tracking-widest uppercase">© 2025 ${state.settings.siteName} - Power Injection Engine v6.5</div>
        </footer>
    `;
    
    if (hash === '#/dashboard' && state.isAdmin) (window as any).switchTab('orders');
};

window.addEventListener('load', () => { 
    initStore(); 
    router(); 
});
window.addEventListener('hashchange', router);
