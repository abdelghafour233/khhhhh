
/**
 * storehalal v6.3 - Persistent Mobile Ads & Strategic Social Sharing 🚀🇲🇦
 * تم التحديث: حل مشكلة اختفاء الإعلانات في الجوال + أزرار مشاركة تحت المنتجات والطلب.
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

// --- محرك الإعلانات المطور للجوال (حقن مستمر لمنع الاختفاء) ---
const injectAds = () => {
    const hash = window.location.hash || '#/';
    const isProtected = hash.startsWith('#/dashboard') || hash.startsWith('#/checkout') || hash.startsWith('#/success');
    
    // إذا دخلنا منطقة محظورة (لوحة التحكم)، نمسح الإعلانات
    if (isProtected) {
        document.querySelectorAll('.dynamic-ad-script').forEach(el => el.remove());
        state.adsInjected = false;
        return;
    }

    // الحقن يتم مرة واحدة فقط في الواجهة الرئيسية لمنع "الظهور ثم الاختفاء"
    if (!state.adsInjected && state.settings.adsterraHeader) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = state.settings.adsterraHeader;
        const scripts = tempDiv.querySelectorAll('script');

        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            
            if (oldScript.src) {
                newScript.async = true;
                newScript.defer = true;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            
            newScript.classList.add('dynamic-ad-script');
            // الحقن في HEAD يجعله أكثر استقراراً في متصفحات الجوال
            document.head.appendChild(newScript);
        });
        state.adsInjected = true;
    }
};

// --- وظائف المشاركة الاجتماعية المطورة ---
(window as any).shareContent = (platform: string, productId?: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = productId ? `${baseUrl}#/product/${productId}` : baseUrl;
    const p = productId ? state.products.find((i: any) => i.id === productId) : null;
    const text = p ? `تحقق من هذا العرض: ${p.name}` : `اكتشف أفضل المنتجات في متجر ${state.settings.siteName}`;
    const image = p ? p.image : '';

    let url = '';
    switch (platform) {
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            break;
        case 'twitter':
            url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
            break;
        case 'whatsapp':
            url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareUrl)}`;
            break;
        case 'pinterest':
            url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(text)}`;
            break;
    }
    window.open(url, '_blank', 'width=600,height=500');
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
        const img = document.getElementById('p-img-preview') as HTMLImageElement;
        if(img) img.src = base64;
        const input = document.getElementById('p-img-data') as HTMLInputElement;
        if(input) input.value = base64;
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
        <header class="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b dark:border-slate-800">
            <nav class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center text-right">
                <a href="#/" class="flex items-center gap-2">
                    <div class="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-xl font-black shadow-lg">S</div>
                    <span class="text-lg md:text-xl font-bold tracking-tight">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-3">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm active:scale-90 transition-transform">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-3.5 py-2.5 rounded-xl text-[10px] font-black shadow-md active:scale-95 transition-all">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <!-- Hero Section -->
            <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 md:py-24 px-4 text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-full bg-blue-600/5 pointer-events-none"></div>
                <h1 class="text-3xl md:text-6xl font-black mb-4 relative z-10 leading-tight tracking-tight">${state.settings.siteName}</h1>
                <p class="opacity-70 text-sm md:text-lg mb-8 max-w-2xl mx-auto relative z-10 px-4 font-medium">تسوق الآن واستفد من عروض الدفع عند الاستلام مع شحن سريع 🇲🇦</p>
                
                <div class="flex justify-center gap-4 relative z-10">
                    <button onclick="shareContent('facebook')" class="bg-[#1877F2] p-3.5 rounded-2xl shadow-xl transition transform active:scale-90"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-5 h-5 invert"></button>
                    <button onclick="shareContent('whatsapp')" class="bg-[#25D366] p-3.5 rounded-2xl shadow-xl transition transform active:scale-90"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-5 h-5 invert"></button>
                    <button onclick="shareContent('twitter')" class="bg-black p-3.5 rounded-2xl shadow-xl transition transform active:scale-90 border border-white/10"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" class="w-5 h-5 invert"></button>
                </div>
            </div>

            <!-- Products Grid -->
            <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col transition hover:shadow-2xl group">
                        <div class="relative overflow-hidden aspect-square">
                            <img src="${p.image}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110">
                        </div>
                        <div class="p-4 md:p-6 flex flex-col flex-1">
                            <h3 class="font-black text-xs md:text-lg mb-2 line-clamp-1">${p.name}</h3>
                            <div class="flex justify-between items-center mb-4">
                                <div class="text-blue-600 font-black text-sm md:text-xl tracking-tight">${p.price} د.م.</div>
                            </div>
                            
                            <div class="mt-auto space-y-4">
                                <button onclick="buyNow('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''} 
                                    class="w-full bg-slate-900 dark:bg-blue-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-black transition active:scale-95 shadow-md">
                                    🛒 شراء الآن
                                </button>
                                
                                <!-- أزرار المشاركة تحت المنتج مباشرة -->
                                <div class="pt-3 border-t dark:border-slate-800">
                                    <p class="text-[8px] font-bold text-slate-400 mb-2 text-center uppercase tracking-widest">شارك المنتج</p>
                                    <div class="flex justify-center items-center gap-5">
                                        <button onclick="shareContent('facebook', '${p.id}')" class="transition-transform active:scale-125"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-4 h-4 md:w-5 md:h-5"></button>
                                        <button onclick="shareContent('whatsapp', '${p.id}')" class="transition-transform active:scale-125"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-4 h-4 md:w-5 md:h-5"></button>
                                        <button onclick="shareContent('twitter', '${p.id}')" class="transition-transform active:scale-125"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" class="w-4 h-4 md:w-5 md:h-5 dark:invert"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    checkout: () => `
        <div class="max-w-md mx-auto py-8 md:py-12 px-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-2xl border dark:border-slate-800">
                <h2 class="text-xl md:text-2xl font-black mb-8 text-center">تأكيد طلبك 🚚</h2>
                
                <div class="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center gap-4 border dark:border-slate-700 shadow-inner">
                   <img src="${state.checkoutItem.image}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm">
                   <div>
                       <div class="font-bold text-xs text-slate-500 line-clamp-1">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black text-xl">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>

                <form onsubmit="submitOrder(event)" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                    <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-sm font-bold">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-right text-sm font-black" dir="ltr">
                    
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-2xl font-black text-lg md:text-xl mt-4 transition active:scale-95 shadow-lg shadow-green-500/20">
                        إرسال الطلب ✅
                    </button>
                    
                    <!-- أزرار المشاركة تحت إرسال الطلب مباشرة -->
                    <div class="mt-8 pt-6 border-t dark:border-slate-800 text-center">
                        <p class="text-[10px] font-black text-slate-400 mb-5 uppercase tracking-widest">شارك هذا العرض قبل تأكيد الطلب</p>
                        <div class="flex justify-center gap-6">
                            <button type="button" onclick="shareContent('whatsapp', '${state.checkoutItem.id}')" class="flex flex-col items-center gap-2 group">
                                <div class="bg-[#25D366] p-3 rounded-full shadow-lg group-active:scale-125 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-4 h-4 invert"></div>
                                <span class="text-[8px] font-bold text-slate-400">واتساب</span>
                            </button>
                            <button type="button" onclick="shareContent('facebook', '${state.checkoutItem.id}')" class="flex flex-col items-center gap-2 group">
                                <div class="bg-[#1877F2] p-3 rounded-full shadow-lg group-active:scale-125 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-4 h-4 invert"></div>
                                <span class="text-[8px] font-bold text-slate-400">فايسبوك</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-24 px-4 text-center">
                <div class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border dark:border-slate-800 shadow-2xl animate-fadeIn">
                    <h2 class="text-2xl font-black mb-8 tracking-tighter">دخول الإدارة</h2>
                    <div class="relative mb-6">
                        <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-2xl text-center outline-none focus:ring-2 focus:ring-blue-500 font-black">
                    </div>
                    <button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black transition active:scale-95 shadow-xl shadow-blue-500/20">دخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden border-b md:border-b-0 border-white/5">
                    <div class="hidden md:block text-xl font-black text-blue-500 mb-8 px-2">الإدارة <span class="text-[8px] block opacity-30 tracking-widest">VER 6.3</span></div>
                    <button onclick="switchTab('orders')" class="flex-shrink-0 p-3.5 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs md:text-sm">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="flex-shrink-0 p-3.5 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs md:text-sm">🛍️ المنتجات</button>
                    <button onclick="switchTab('settings')" class="flex-shrink-0 p-3.5 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs md:text-sm">⚙️ الإعدادات</button>
                    <button onclick="logout()" class="md:mt-auto flex-shrink-0 p-3.5 text-red-400 font-black border border-red-400/20 rounded-xl text-center text-xs md:text-sm hover:bg-red-400/10 transition">خروج</button>
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
            <h2 class="text-2xl font-black mb-8">الطلبات الواردة (${state.orders.length})</h2>
            <div class="grid gap-4">
                ${state.orders.map((o: any) => `
                    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 flex justify-between items-center shadow-sm hover:shadow-lg transition-all">
                        <div class="text-right">
                            <div class="font-black text-sm md:text-base">${o.name} <span class="text-[9px] opacity-40 font-normal ml-2">${o.city}</span></div>
                            <div class="text-blue-600 font-bold text-xs" dir="ltr">${o.phone}</div>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="deleteOrder('${o.id}')" class="text-red-400 p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">🗑️</button>
                        </div>
                    </div>
                `).join('') || '<div class="text-center opacity-30 py-24 font-black text-xl">لا توجد طلبات بعد 📦</div>'}
            </div>
        `;
    } else if (tab === 'products') {
        const editing = state.editingProduct;
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-8"><h2 class="text-2xl font-black">${editing ? 'تعديل' : 'إضافة'} منتج</h2></div>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm mb-12 animate-fadeIn">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input id="p-name" value="${editing?.name || ''}" placeholder="اسم المنتج" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                    <input id="p-price" type="number" value="${editing?.price || ''}" placeholder="السعر" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-black">
                    <div class="w-full h-44 bg-slate-100 dark:bg-slate-800 rounded-3xl border-2 border-dashed flex items-center justify-center relative overflow-hidden group">
                        <img id="p-img-preview" src="${editing?.image || FALLBACK_IMAGES.placeholder}" class="w-full h-full object-contain p-4 transition-transform group-hover:scale-105">
                        <input type="file" onchange="processFile(event, 'main')" class="absolute inset-0 opacity-0 cursor-pointer z-20">
                        <input type="hidden" id="p-img-data" value="${editing?.image || ''}">
                    </div>
                </div>
                <button onclick="saveProduct()" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black mt-8 shadow-xl active:scale-95 transition-all">حفظ وتنشيط المنتج</button>
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-8">إعدادات المتجر والإعلانات</h2>
            <div class="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border dark:border-slate-800 space-y-8 max-w-xl shadow-sm">
                <input id="set-name" value="${state.settings.siteName}" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm font-black outline-none focus:ring-2 focus:ring-blue-500">
                <textarea id="set-ads" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 h-40 font-mono text-[10px] outline-none" placeholder="إلصق كود Adsterra هنا..." dir="ltr">${state.settings.adsterraHeader}</textarea>
                <p class="text-[9px] text-slate-400 font-medium">ملاحظة: النظام يحقن الإعلانات بطريقة "الحقن المستمر" لضمان بقاء الإعلانات ظاهرة في متصفحات الجوال.</p>
                <button onclick="saveSettings()" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">حفظ التغييرات</button>
            </div>
        `;
    }
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const image = (document.getElementById('p-img-data') as HTMLInputElement).value;
    if (!name || !price) return alert('يرجى تعبئة كافة الحقول');
    const productData = {
        id: state.editingProduct ? state.editingProduct.id : Date.now().toString(),
        name,
        price: Number(price),
        stock: 10,
        image: image || FALLBACK_IMAGES.placeholder
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

(window as any).saveSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.adsterraHeader = (document.getElementById('set-ads') as HTMLTextAreaElement).value;
    save();
    alert('✅ تم الحفظ! سيتم إعادة تحميل الموقع لضمان استقرار الإعلانات على الجوال.');
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
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">✅</div>
            <h1 class="text-3xl font-black mb-4 tracking-tighter">شكراً لطلبكم!</h1>
            <p class="text-slate-500 mb-12 font-bold px-4 leading-relaxed">فريقنا سيتصل بكم قريباً عبر الهاتف لتأكيد العنوان وشحن طلبكم 🇲🇦</p>
            <div class="px-6"><a href="#/" class="inline-block w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl active:scale-95 transition-transform">العودة للمتجر</a></div>
        </div>
    `;
    
    root!.innerHTML = html;
    
    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-950 text-white py-14 px-6 text-center border-t border-white/5 relative z-10">
            <div class="text-2xl font-black text-blue-500 mb-2">${state.settings.siteName}</div>
            <p class="text-slate-500 font-bold text-[10px] mb-10">تسوق آمن - دفع عند الاستلام - شحن لجميع مدن المغرب 🇲🇦</p>
            <div class="flex justify-center gap-10 mb-12 text-[9px] font-black uppercase tracking-widest opacity-60">
                <button onclick="shareContent('facebook')">Facebook</button>
                <button onclick="shareContent('whatsapp')">WhatsApp</button>
                <button onclick="shareContent('twitter')">Twitter</button>
            </div>
            <div class="text-slate-800 text-[8px] font-mono tracking-widest uppercase opacity-50">© 2025 ${state.settings.siteName} - Mobile Optimized v6.3</div>
        </footer>
    `;
    
    if (hash === '#/dashboard' && state.isAdmin) (window as any).switchTab('orders');
    
    // حقن الإعلانات بطريقة "الحقن المستمر" لضمان ثباتها على الجوال
    injectAds();
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
