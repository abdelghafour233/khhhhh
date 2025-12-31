
/**
 * storehalal v6.4 - Permanent Ads & Direct Social Integration 🚀🇲🇦
 * تم التحديث: تثبيت إعلانات ادستيرا للجوال + أزرار مشاركة مباشرة تحت الطلب.
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
    adsInjected: false,
    editingProduct: null
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(INITIAL_PRODUCTS));
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // كود ادستيرا الافتراضي (يمكنك تغييره من الإعدادات)
        const defaultAds = `<script src="https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js"></script>\n<script src="https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js"></script>`;

        const defaultSettings = {
            siteName: 'storehalal',
            adminPass: 'halal2025',
            adsterraHeader: defaultAds
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

// --- محرك الإعلانات القوي (حقن دائم لا يختفي) ---
const injectAdsPermanent = () => {
    // نحقن الإعلانات مرة واحدة فقط عند تحميل الموقع لضمان بقائها
    if (state.adsInjected) return;

    if (state.settings.adsterraHeader) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = state.settings.adsterraHeader;
        const scripts = tempDiv.querySelectorAll('script');

        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            // نقل جميع الخصائص (src, async, etc)
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            
            if (oldScript.src) {
                newScript.async = true;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            
            newScript.classList.add('permanent-ad-script');
            // الحقن في HEAD يجعله عصياً على الحذف من قبل المتصفح عند التنقل
            document.head.appendChild(newScript);
        });
        state.adsInjected = true;
        console.log("Ads Injected Permanently");
    }
};

// --- وظائف المشاركة المباشرة (واتساب وفيسبوك) ---
(window as any).shareAction = (platform: string, productId?: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = productId ? `${baseUrl}#/product/${productId}` : baseUrl;
    const p = productId ? state.products.find((i: any) => i.id === productId) : null;
    const title = p ? p.name : state.settings.siteName;
    const price = p ? `بثمن: ${p.price} د.م.` : '';
    const text = `السلام عليكم، أعجبني هذا العرض في متجر ${state.settings.siteName}:\n\n*${title}*\n${price}\n\nرابط المنتج:\n${shareUrl}`;

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
    if (p.stock <= 0) return alert('عذراً، هذا المنتج غير متوفر حالياً!');
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
        <header class="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b dark:border-slate-800">
            <nav class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <a href="#/" class="flex items-center gap-2">
                    <div class="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-xl font-black">S</div>
                    <span class="text-lg font-bold">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-3">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black">إدارة المتجر</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <!-- Hero -->
            <div class="bg-slate-900 text-white py-14 px-4 text-center">
                <h1 class="text-3xl font-black mb-3">${state.settings.siteName}</h1>
                <p class="opacity-60 text-sm mb-6">الدفع عند الاستلام والشحن سريع لكل المغرب 🇲🇦</p>
            </div>

            <!-- Products -->
            <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col transition hover:shadow-xl">
                        <img src="${p.image}" class="w-full aspect-square object-cover">
                        <div class="p-4 flex flex-col flex-1">
                            <h3 class="font-black text-xs md:text-sm mb-2 line-clamp-1">${p.name}</h3>
                            <div class="text-blue-600 font-black text-sm mb-4">${p.price} د.م.</div>
                            
                            <div class="mt-auto space-y-3">
                                <button onclick="buyNow('${p.id}')" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-xl text-xs font-black active:scale-95 transition">
                                    🛒 شراء الآن
                                </button>
                                
                                <!-- أزرار المشاركة المباشرة تحت زر الشراء -->
                                <div class="flex gap-2 justify-center pt-2 border-t dark:border-slate-800">
                                    <button onclick="shareAction('whatsapp', '${p.id}')" class="bg-[#25D366] text-white p-2 rounded-lg transition active:scale-125">
                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-4 h-4 invert">
                                    </button>
                                    <button onclick="shareAction('facebook', '${p.id}')" class="bg-[#1877F2] text-white p-2 rounded-lg transition active:scale-125">
                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-4 h-4 invert">
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
        <div class="max-w-md mx-auto py-10 px-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border dark:border-slate-800">
                <h2 class="text-xl font-black mb-8 text-center">تأكيد طلبك</h2>
                
                <div class="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center gap-4">
                   <img src="${state.checkoutItem.image}" class="w-14 h-14 rounded-xl object-cover">
                   <div class="text-sm font-black line-clamp-1">${state.checkoutItem.name}</div>
                </div>

                <form onsubmit="submitOrder(event)" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none font-bold">
                    <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none font-bold">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-right font-black" dir="ltr">
                    
                    <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg active:scale-95 transition shadow-lg shadow-green-500/20">
                        إرسال الطلب ✅
                    </button>

                    <!-- أزرار التواصل الاجتماعي تحت زر إرسال الطلب مباشرة -->
                    <div class="mt-8 pt-6 border-t dark:border-slate-800 text-center">
                        <p class="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">شارك هذا العرض مع عائلتك</p>
                        <div class="flex justify-center gap-4">
                            <button type="button" onclick="shareAction('whatsapp', '${state.checkoutItem.id}')" class="flex flex-1 items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-2xl text-xs font-black shadow-lg active:scale-95 transition">
                                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-4 h-4 invert"> واتساب
                            </button>
                            <button type="button" onclick="shareAction('facebook', '${state.checkoutItem.id}')" class="flex flex-1 items-center justify-center gap-2 bg-[#1877F2] text-white py-3 rounded-2xl text-xs font-black shadow-lg active:scale-95 transition">
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
            <div class="max-w-sm mx-auto py-24 px-4">
                <div class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border dark:border-slate-800 text-center shadow-2xl">
                    <h2 class="text-xl font-black mb-8">دخول الإدارة</h2>
                    <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 mb-6 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-2xl text-center outline-none font-black">
                    <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black active:scale-95 transition shadow-xl shadow-blue-500/20">دخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex md:flex-col gap-2 overflow-x-auto border-b md:border-b-0 border-white/5">
                    <div class="hidden md:block text-xl font-black text-blue-500 mb-8 px-2">لوحة التحكم <span class="text-[8px] block opacity-30">V6.4</span></div>
                    <button onclick="switchTab('orders')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-sm">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-sm">🛍️ المنتجات</button>
                    <button onclick="switchTab('settings')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-sm">⚙️ الإعدادات</button>
                    <button onclick="logout()" class="md:mt-auto p-3 text-red-400 font-black border border-red-400/20 rounded-xl text-center text-sm">خروج</button>
                </aside>
                <main id="dash-panel" class="flex-1 p-4 md:p-10"></main>
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
            <h2 class="text-2xl font-black mb-8">الطلبات (${state.orders.length})</h2>
            <div class="grid gap-4">
                ${state.orders.map((o: any) => `
                    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 flex justify-between items-center shadow-sm">
                        <div class="text-right">
                            <div class="font-black text-sm">${o.name} <span class="text-[9px] opacity-40 font-normal ml-2">${o.city}</span></div>
                            <div class="text-blue-600 font-bold text-xs" dir="ltr">${o.phone}</div>
                        </div>
                        <button onclick="deleteOrder('${o.id}')" class="text-red-400 p-2.5 hover:bg-red-50 rounded-xl">🗑️</button>
                    </div>
                `).join('') || '<div class="text-center opacity-30 py-24 font-black">لا توجد طلبات</div>'}
            </div>
        `;
    } else if (tab === 'products') {
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-8 text-right">إضافة منتج</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm mb-10 text-right">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input id="p-name" placeholder="اسم المنتج" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm font-bold">
                    <input id="p-price" type="number" placeholder="السعر" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm font-black">
                </div>
                <button onclick="saveProduct()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-6 active:scale-95 transition">إضافة المنتج</button>
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-8">إعدادات الإعلانات</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 space-y-6 max-w-xl shadow-sm text-right">
                <input id="set-name" value="${state.settings.siteName}" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm font-black outline-none">
                <textarea id="set-ads" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 h-44 font-mono text-[10px] outline-none" placeholder="إلصق كود Adsterra هنا..." dir="ltr">${state.settings.adsterraHeader}</textarea>
                <p class="text-[9px] text-slate-400 font-medium">سيتم حقن هذه الإعلانات في رأس الصفحة (Head) لضمان بقائها ظاهرة في متصفحات الجوال.</p>
                <button onclick="saveSettings()" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black active:scale-95 transition">حفظ وتحديث الإعلانات</button>
            </div>
        `;
    }
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    if (!name || !price) return alert('يرجى تعبئة الحقول');
    state.products.unshift({ id: Date.now().toString(), name, price: Number(price), stock: 10, image: FALLBACK_IMAGES.placeholder });
    save();
    (window as any).switchTab('products');
};

(window as any).saveSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.adsterraHeader = (document.getElementById('set-ads') as HTMLTextAreaElement).value;
    save();
    alert('✅ تم الحفظ! سيتم إعادة التحميل لضمان ثبات الإعلانات.');
    location.reload();
};

(window as any).deleteOrder = (id: string) => {
    if (confirm('حذف الطلب؟')) {
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
        <div class="max-w-md mx-auto py-24 text-center px-4">
            <h1 class="text-3xl font-black mb-4">تم استلام طلبك!</h1>
            <p class="text-slate-500 mb-12 font-bold px-4">فريقنا سيتصل بك قريباً لتأكيد الشحن لباب منزلك 🇲🇦</p>
            <div class="px-6"><a href="#/" class="inline-block w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl">العودة للمتجر</a></div>
        </div>
    `;
    
    root!.innerHTML = html;
    
    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-950 text-white py-14 px-6 text-center border-t border-white/5">
            <div class="text-2xl font-black text-blue-500 mb-2">${state.settings.siteName}</div>
            <p class="text-slate-500 font-bold text-[9px] mb-8">متجرك الأول في المغرب - شحن سريع لباب الدار 🇲🇦</p>
            <div class="flex justify-center gap-8 mb-10 text-[9px] font-black uppercase opacity-60">
                <button onclick="shareAction('whatsapp')">WhatsApp</button>
                <button onclick="shareAction('facebook')">Facebook</button>
            </div>
            <div class="text-slate-800 text-[8px] font-mono tracking-widest uppercase opacity-40">© 2025 ${state.settings.siteName} - Luxury COD v6.4</div>
        </footer>
    `;
    
    if (hash === '#/dashboard' && state.isAdmin) (window as any).switchTab('orders');
    
    // حقن الإعلانات بطريقة قوية في HEAD لضمان عدم الاختفاء
    injectAdsPermanent();
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
