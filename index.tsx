
/**
 * storehalal v6.0 - Mobile Ad Optimization & Universal Sharing 🚀🇲🇦
 * تم التحديث: تحسين محرك الإعلانات ليعمل على الهواتف والحواسيب، مع نظام مشاركة احترافي.
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
        image: 'https://picsum.photos/seed/iphone/600/400',
        description: 'أحدث هاتف من آبل مع كاميرا سينمائية ومعالج A17 Pro.',
        gallery: []
    },
    { 
        id: '2', 
        name: 'ساعة ذكية Ultra Series 9', 
        price: 450, 
        stock: 12,
        image: FALLBACK_IMAGES.watch,
        description: 'ساعة ذكية مقاومة للماء مع شاشة Amoled وبطارية تدوم طويلاً.',
        gallery: []
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
    editingProduct: null,
    viewingOrder: null
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(INITIAL_PRODUCTS));
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        const defaultAds = `<script src="https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js"></script>\n<script src="https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js"></script>`;

        const defaultSettings = {
            siteName: 'storehalal',
            adminPass: 'halal2025',
            adsterraHeader: defaultAds,
            facebook: 'https://facebook.com',
            twitter: 'https://twitter.com',
            instagram: 'https://instagram.com',
            pinterest: 'https://pinterest.com'
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

// --- محرك الإعلانات المطور للجوال والحاسوب ---
const injectAds = () => {
    const hash = window.location.hash || '#/';
    // المناطق المحمية (لا يتم حقن إعلانات فيها أبداً)
    const isProtected = hash.startsWith('#/dashboard') || hash.startsWith('#/checkout') || hash.startsWith('#/success');
    
    // إزالة السكربتات القديمة دائماً عند تغيير الصفحة
    document.querySelectorAll('.dynamic-ad-script').forEach(el => el.remove());

    if (isProtected) {
        state.adsInjected = false;
        return;
    }

    // الحقن فقط في واجهة المتجر الرئيسية
    if (hash === '#/' && !state.adsInjected && state.settings.adsterraHeader) {
        const container = document.getElementById('global-ad-scripts') || document.body;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = state.settings.adsterraHeader;
        const scripts = tempDiv.querySelectorAll('script');

        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            // نسخ كافة الخصائص (src, data-cfasync, الخ)
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            
            // تحسين التنفيذ للجوال: استخدام async=false فقط إذا لم يكن السكربت خارجياً
            if (!oldScript.src) {
                newScript.textContent = oldScript.textContent;
            }
            
            newScript.classList.add('dynamic-ad-script');
            // الحقن في الـ body بدلاً من الـ head لضمان العمل في متصفحات الجوال
            container.appendChild(newScript);
        });
        state.adsInjected = true;
    }
};

// --- وظائف المشاركة الاجتماعية ---
(window as any).shareContent = (platform: string, productId?: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = productId ? `${baseUrl}#/product/${productId}` : baseUrl;
    const p = productId ? state.products.find((i: any) => i.id === productId) : null;
    const text = p ? `تحقق من هذا المنتج الرائع: ${p.name}` : `اكتشف أفضل العروض في متجر ${state.settings.siteName}`;
    const image = p ? p.image : '';

    let url = '';
    switch (platform) {
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            break;
        case 'twitter':
            url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
            break;
        case 'pinterest':
            url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(text)}`;
            break;
        case 'instagram':
            window.open(state.settings.instagram, '_blank');
            return;
    }
    // استخدام نافذة منبثقة تتناسب مع الجوال والحاسوب
    window.open(url, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
};

(window as any).togglePassword = (inputId: string, btn: HTMLElement) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '👁️‍🗨️';
        btn.classList.add('text-blue-600');
    } else {
        input.type = 'password';
        btn.innerHTML = '👁️';
        btn.classList.remove('text-blue-600');
    }
};

const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
};

(window as any).processFile = async (event: any, target: 'main' | 'gallery') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    if (target === 'main') {
        const base64 = await handleImageUpload(files[0]);
        (document.getElementById('p-img-preview') as HTMLImageElement).src = base64;
        (document.getElementById('p-img-data') as HTMLInputElement).value = base64;
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
    if (p.stock <= 0) return alert('عذراً، هذا المنتج غير متوفر حالياً!');
    state.checkoutItem = p;
    window.location.hash = '#/checkout';
};

(window as any).submitOrder = async (e: Event) => {
    e.preventDefault();
    const name = (document.getElementById('order-name') as HTMLInputElement).value;
    const city = (document.getElementById('order-city') as HTMLSelectElement).value;
    const phone = (document.getElementById('order-phone') as HTMLInputElement).value;

    const currentProduct = state.products.find((p: any) => p.id === state.checkoutItem.id);
    if (currentProduct && currentProduct.stock > 0) {
        currentProduct.stock -= 1;
    }

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

(window as any).viewOrder = (id: string) => {
    state.viewingOrder = state.orders.find((o: any) => o.id === id);
    (window as any).switchTab('orders');
};

(window as any).closePreview = () => {
    state.viewingOrder = null;
    (window as any).switchTab('orders');
};

(window as any).updateOrderStatus = (id: string, newStatus: string) => {
    state.orders = state.orders.map((o: any) => o.id === id ? { ...o, status: newStatus } : o);
    save();
    if (state.viewingOrder) state.viewingOrder.status = newStatus;
    (window as any).switchTab('orders');
};

const UI = {
    header: () => `
        <header class="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b dark:border-slate-800">
            <nav class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center text-right">
                <a href="#/" class="flex items-center gap-2">
                    <div class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black">S</div>
                    <span class="text-lg md:text-xl font-bold">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-3">
                    <div class="hidden sm:flex gap-1">
                        <button onclick="shareContent('facebook')" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold hover:text-blue-600">FB</button>
                        <button onclick="shareContent('twitter')" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold hover:text-black">X</button>
                    </div>
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-3 py-2 rounded-xl text-[10px] font-bold transition hover:scale-105">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <!-- Hero Section -->
            <div class="bg-slate-900 text-white py-16 md:py-24 px-4 text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-full bg-blue-600/10 pointer-events-none"></div>
                <h1 class="text-3xl md:text-6xl font-black mb-4 relative z-10">${state.settings.siteName}</h1>
                <p class="opacity-60 text-sm md:text-lg mb-8 max-w-2xl mx-auto relative z-10 px-4">أفضل العروض والمنتجات الحصرية مع شحن سريع لجميع المدن المغربية 🇲🇦</p>
                <div class="flex justify-center gap-4 relative z-10">
                    <button onclick="shareContent('facebook')" class="bg-blue-600 p-3 md:p-4 rounded-2xl shadow-xl transition transform hover:scale-110">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-5 h-5 md:w-6 md:h-6 invert">
                    </button>
                    <button onclick="shareContent('twitter')" class="bg-black p-3 md:p-4 rounded-2xl shadow-xl transition transform hover:scale-110">
                        <img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" class="w-5 h-5 md:w-6 md:h-6 invert">
                    </button>
                    <button onclick="shareContent('pinterest')" class="bg-red-600 p-3 md:p-4 rounded-2xl shadow-xl transition transform hover:scale-110">
                        <img src="https://cdn-icons-png.flaticon.com/512/145/145808.png" class="w-5 h-5 md:w-6 md:h-6 invert">
                    </button>
                </div>
            </div>

            <!-- Products Grid -->
            <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col transition hover:shadow-xl group">
                        <div class="relative overflow-hidden aspect-square">
                            <img src="${p.image}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
                            <div class="absolute top-2 right-2 flex flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onclick="shareContent('facebook', '${p.id}')" class="bg-white/90 p-1.5 rounded-full shadow-lg text-[10px]">🔵</button>
                                <button onclick="shareContent('twitter', '${p.id}')" class="bg-white/90 p-1.5 rounded-full shadow-lg text-[10px]">⚫</button>
                            </div>
                        </div>
                        <div class="p-3 md:p-6 flex flex-col flex-1">
                            <h3 class="font-black text-xs md:text-lg mb-1 md:mb-2 line-clamp-1">${p.name}</h3>
                            <div class="flex justify-between items-center mb-4">
                                <div class="text-blue-600 font-black text-sm md:text-xl">${p.price} د.م.</div>
                                <div class="text-[8px] md:text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full font-bold">باقي: ${p.stock}</div>
                            </div>
                            
                            <div class="mt-auto space-y-2">
                                <button onclick="buyNow('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''} 
                                    class="w-full bg-slate-900 dark:bg-blue-600 text-white py-2.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black transition active:scale-95 shadow-md">
                                    🛒 شراء الآن
                                </button>
                                <div class="flex justify-center gap-3 py-1.5 border-t mt-2 md:mt-4 border-slate-100 dark:border-slate-800">
                                    <button onclick="shareContent('facebook', '${p.id}')" class="text-[8px] md:text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase">FB</button>
                                    <button onclick="shareContent('twitter', '${p.id}')" class="text-[8px] md:text-[10px] text-slate-400 hover:text-black font-bold uppercase">X</button>
                                    <button onclick="shareContent('pinterest', '${p.id}')" class="text-[8px] md:text-[10px] text-slate-400 hover:text-red-600 font-bold uppercase">Pin</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Final Share Box -->
            <div class="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center">
                <div class="bg-blue-600 text-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <h2 class="text-2xl md:text-3xl font-black mb-4">هل أعجبك متجرنا؟ 🌟</h2>
                    <p class="mb-8 text-blue-100 text-xs md:text-lg font-bold">ساعدنا في الوصول للمزيد من الناس بمشاركة رابط المتجر على حساباتك الاجتماعية.</p>
                    <div class="flex justify-center flex-wrap gap-4">
                        <button onclick="shareContent('facebook')" class="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-xs md:text-sm hover:scale-105 transition">
                            فايسبوك
                        </button>
                        <button onclick="shareContent('twitter')" class="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs md:text-sm hover:scale-105 transition">
                            تويتر (X)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    checkout: () => `
        <div class="max-w-md mx-auto py-8 md:py-12 px-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-xl border dark:border-slate-800">
                <h2 class="text-xl md:text-2xl font-black mb-6 md:mb-8 text-center">تأكيد الطلب 🚚</h2>
                <div class="mb-6 p-3 md:p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-4 border">
                   <img src="${state.checkoutItem.image}" class="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover">
                   <div>
                       <div class="font-bold text-xs md:text-sm">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black text-sm md:text-lg">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>
                <form onsubmit="submitOrder(event)" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-3 md:p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <select id="order-city" required class="w-full p-3 md:p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none text-sm">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف" required class="w-full p-3 md:p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none text-right text-sm" dir="ltr">
                    <button type="submit" class="w-full bg-green-600 text-white py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl mt-4 transition active:scale-95 shadow-lg">إرسال الطلب ✅</button>
                    <p class="text-center text-[8px] md:text-[10px] text-slate-400 mt-2">نظام دفع آمن ومحمي ومناسب للجوال 📱</p>
                </form>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-24 px-4 text-center">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-2xl">
                    <h2 class="text-2xl font-black mb-6">دخول الإدارة</h2>
                    <div class="relative mb-6">
                        <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-center outline-none">
                        <button onclick="togglePassword('pass', this)" class="absolute left-4 top-1/2 -translate-y-1/2 p-1">👁️</button>
                    </div>
                    <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black transition hover:bg-blue-700">دخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
                    <div class="hidden md:block text-xl font-black text-blue-500 mb-8 px-2 flex items-center justify-between">
                        <span>لوحة التحكم</span>
                        <span class="text-[10px] bg-blue-500/20 px-2 py-1 rounded text-blue-400">v6.0</span>
                    </div>
                    <button onclick="switchTab('orders')" class="flex-shrink-0 p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs md:text-base">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="flex-shrink-0 p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs md:text-base">🛍️ المنتجات</button>
                    <button onclick="switchTab('settings')" class="flex-shrink-0 p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs md:text-base">⚙️ الإعدادات</button>
                    <button onclick="logout()" class="md:mt-auto flex-shrink-0 p-3 text-red-400 font-bold border border-red-400/20 rounded-xl text-center text-xs md:text-base">خروج</button>
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
        if (state.viewingOrder) {
            const o = state.viewingOrder;
            panel.innerHTML = `
                <div class="max-w-3xl mx-auto animate-fadeIn">
                    <button onclick="closePreview()" class="mb-4 text-xs font-bold text-slate-500">← رجوع</button>
                    <div class="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border dark:border-slate-800 shadow-xl text-right">
                        <h2 class="text-xl font-black mb-6">تفاصيل الطلبية</h2>
                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div><div class="text-[10px] text-slate-400">الاسم:</div><div class="font-bold text-sm">${o.name}</div></div>
                                <div><div class="text-[10px] text-slate-400">الهاتف:</div><div class="font-bold text-sm" dir="ltr">${o.phone}</div></div>
                            </div>
                            <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex gap-4 border">
                                <img src="${o.productImage || FALLBACK_IMAGES.placeholder}" class="w-12 h-12 rounded object-cover">
                                <div>
                                    <div class="font-bold text-xs">${o.product}</div>
                                    <div class="text-blue-600 font-black">${o.total} د.م.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            panel.innerHTML = `
                <h2 class="text-2xl font-black mb-6">الطلبات الواردة</h2>
                <div class="grid gap-3">
                    ${state.orders.map((o: any) => `
                        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 flex justify-between items-center">
                            <div class="flex items-center gap-3 text-right">
                                <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black">${o.id.slice(-2)}</div>
                                <div>
                                    <div class="font-black text-xs">${o.name}</div>
                                    <div class="text-blue-600 font-bold text-[10px]">${o.city} | ${o.phone}</div>
                                </div>
                            </div>
                            <button onclick="viewOrder('${o.id}')" class="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-bold">معاينة</button>
                        </div>
                    `).join('') || '<div class="text-center opacity-40 py-10">لا توجد طلبات</div>'}
                </div>
            `;
        }
    } else if (tab === 'products') {
        const editing = state.editingProduct;
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-6">${editing ? 'تعديل' : 'إضافة'} منتج</h2>
            <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm mb-12">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input id="p-name" value="${editing?.name || ''}" placeholder="اسم المنتج" class="w-full p-4 border rounded-xl bg-slate-50 dark:bg-slate-800 text-sm outline-none">
                    <input id="p-price" type="number" value="${editing?.price || ''}" placeholder="السعر" class="w-full p-4 border rounded-xl bg-slate-50 dark:bg-slate-800 text-sm outline-none">
                    <input id="p-stock" type="number" value="${editing?.stock || '10'}" placeholder="الكمية" class="w-full p-4 border rounded-xl bg-slate-50 dark:bg-slate-800 text-sm outline-none">
                    <div class="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed flex items-center justify-center relative overflow-hidden">
                        <img id="p-img-preview" src="${editing?.image || FALLBACK_IMAGES.placeholder}" class="w-full h-full object-contain">
                        <input type="file" onchange="processFile(event, 'main')" class="absolute inset-0 opacity-0 cursor-pointer">
                        <input type="hidden" id="p-img-data" value="${editing?.image || ''}">
                    </div>
                </div>
                <button onclick="saveProduct()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-black mt-6 shadow-lg">حفظ المنتج</button>
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-6">الإعدادات</h2>
            <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 space-y-4 max-w-xl">
                <input id="set-name" value="${state.settings.siteName}" placeholder="اسم المتجر" class="w-full p-4 border rounded-xl bg-slate-50 dark:bg-slate-800 text-sm">
                <div class="grid grid-cols-2 gap-2">
                    <input id="set-facebook" value="${state.settings.facebook}" placeholder="رابط FB" class="w-full p-4 border rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                    <input id="set-twitter" value="${state.settings.twitter}" placeholder="رابط X" class="w-full p-4 border rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                </div>
                <textarea id="set-ads" class="w-full p-4 border rounded-xl bg-slate-50 dark:bg-slate-800 h-32 font-mono text-[10px] outline-none" placeholder="أكواد الإعلانات (JS SYNC)" dir="ltr">${state.settings.adsterraHeader}</textarea>
                <button onclick="saveSettings()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg">تحديث وحفظ</button>
            </div>
        `;
    }
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const stock = (document.getElementById('p-stock') as HTMLInputElement).value;
    const image = (document.getElementById('p-img-data') as HTMLInputElement).value;
    if (!name || !price) return alert('يرجى إدخال البيانات');
    const productData = {
        id: state.editingProduct ? state.editingProduct.id : Date.now().toString(),
        name,
        price: Number(price),
        stock: Number(stock) || 0,
        image: image || FALLBACK_IMAGES.placeholder,
        description: '',
        gallery: []
    };
    if (state.editingProduct) {
        state.products = state.products.map((p: any) => p.id === productData.id ? productData : p);
        state.editingProduct = null;
    } else {
        state.products.unshift(productData);
    }
    save();
    (window as any).switchTab('products');
};

(window as any).editProduct = (id: string) => {
    state.editingProduct = state.products.find((p: any) => p.id === id);
    (window as any).switchTab('products');
};

(window as any).saveSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.facebook = (document.getElementById('set-facebook') as HTMLInputElement).value;
    state.settings.twitter = (document.getElementById('set-twitter') as HTMLInputElement).value;
    state.settings.adsterraHeader = (document.getElementById('set-ads') as HTMLTextAreaElement).value;
    save();
    alert('✅ تم الحفظ!');
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
        <div class="max-w-md mx-auto py-24 text-center animate-fadeIn px-4">
            <div class="text-6xl mb-6">✅</div>
            <h1 class="text-3xl font-black mb-4">شكراً لطلبكم!</h1>
            <p class="text-slate-500 mb-8 font-bold">سنتصل بكم قريباً لتأكيد المعلومات 🇲🇦</p>
            <a href="#/" class="inline-block w-full bg-blue-600 text-white py-4 rounded-2xl font-black">العودة للمتجر</a>
        </div>
    `;
    root!.innerHTML = html;
    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-950 text-white py-12 md:py-20 px-6 text-center border-t border-white/5">
            <div class="text-xl font-black text-blue-500 mb-2">${state.settings.siteName}</div>
            <p class="text-slate-500 font-bold text-xs mb-8">تسوق آمن - شحن سريع لجميع مدن المغرب 🇲🇦</p>
            <div class="flex justify-center gap-6 mb-8 text-[10px]">
                <button onclick="shareContent('facebook')" class="text-slate-400 hover:text-blue-600 transition font-bold uppercase">Facebook</button>
                <button onclick="shareContent('twitter')" class="text-slate-400 hover:text-white transition font-bold uppercase">Twitter</button>
            </div>
            <div class="text-slate-800 text-[8px] font-mono tracking-widest uppercase">© 2025 ${state.settings.siteName} - Mobile Optimized</div>
        </footer>
    `;
    if (hash === '#/dashboard' && state.isAdmin) (window as any).switchTab('orders');
    
    // حقن الإعلانات مع مراعاة بيئة الجوال
    injectAds();
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
