
/**
 * storehalal v6.1 - Strategic Social Sharing & Mobile Ad Fix 🚀🇲🇦
 * تم التحديث: إضافة أزرار المشاركة تحت زر الشراء وتحت زر إرسال الطلب لزيادة التفاعل.
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

// --- محرك الإعلانات (حقن مباشر للجوال والحاسوب) ---
const injectAds = () => {
    const hash = window.location.hash || '#/';
    const isProtected = hash.startsWith('#/dashboard') || hash.startsWith('#/checkout') || hash.startsWith('#/success');
    
    document.querySelectorAll('.dynamic-ad-script').forEach(el => el.remove());

    if (isProtected) {
        state.adsInjected = false;
        return;
    }

    if (hash === '#/' && !state.adsInjected && state.settings.adsterraHeader) {
        const container = document.getElementById('global-ad-scripts') || document.body;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = state.settings.adsterraHeader;
        const scripts = tempDiv.querySelectorAll('script');

        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            if (!oldScript.src) {
                newScript.textContent = oldScript.textContent;
            }
            newScript.classList.add('dynamic-ad-script');
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
    const text = p ? `أعجبني هذا المنتج: ${p.name}` : `شاهد هذه العروض المذهلة في متجر ${state.settings.siteName}`;
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
                    <div class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black shadow-lg">S</div>
                    <span class="text-lg md:text-xl font-bold tracking-tight">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-3">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm transition-transform active:scale-90">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-3 py-2 rounded-xl text-[10px] font-bold shadow-md active:scale-95 transition-all">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <!-- Hero Section -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 md:py-24 px-4 text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-full bg-blue-600/10 pointer-events-none"></div>
                <h1 class="text-4xl md:text-6xl font-black mb-4 relative z-10">${state.settings.siteName}</h1>
                <p class="opacity-70 text-sm md:text-lg mb-8 max-w-2xl mx-auto relative z-10 px-4 leading-relaxed font-medium">تسوق أرقى المنتجات مع خدمة الدفع عند الاستلام وشحن سريع لكافة المدن المغربية 🇲🇦</p>
                <div class="flex justify-center gap-4 relative z-10">
                    <button onclick="shareContent('facebook')" class="bg-[#1877F2] p-3 rounded-2xl shadow-xl transition transform hover:scale-110 active:scale-90">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-5 h-5 invert">
                    </button>
                    <button onclick="shareContent('twitter')" class="bg-black p-3 rounded-2xl shadow-xl transition transform hover:scale-110 active:scale-90 border border-white/20">
                        <img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" class="w-5 h-5 invert">
                    </button>
                    <button onclick="shareContent('pinterest')" class="bg-[#E60023] p-3 rounded-2xl shadow-xl transition transform hover:scale-110 active:scale-90">
                        <img src="https://cdn-icons-png.flaticon.com/512/145/145808.png" class="w-5 h-5 invert">
                    </button>
                </div>
            </div>

            <!-- Products Grid -->
            <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col transition hover:shadow-xl group">
                        <div class="relative overflow-hidden aspect-square">
                            <img src="${p.image}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
                        </div>
                        <div class="p-4 md:p-6 flex flex-col flex-1">
                            <h3 class="font-black text-xs md:text-lg mb-2 line-clamp-1">${p.name}</h3>
                            <div class="flex justify-between items-center mb-4">
                                <div class="text-blue-600 font-black text-sm md:text-xl">${p.price} د.م.</div>
                                <div class="text-[8px] md:text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full font-bold opacity-60">باقي: ${p.stock}</div>
                            </div>
                            
                            <div class="mt-auto">
                                <button onclick="buyNow('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''} 
                                    class="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-black transition active:scale-95 shadow-md hover:bg-black dark:hover:bg-blue-700">
                                    🛒 شراء الآن
                                </button>
                                
                                <!-- أزرار المشاركة تحت المنتج مباشرة -->
                                <div class="mt-4 pt-3 border-t dark:border-slate-800">
                                    <div class="flex justify-center items-center gap-3">
                                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-auto">شارك:</span>
                                        <button onclick="shareContent('facebook', '${p.id}')" class="text-blue-500 transition-transform active:scale-110">
                                            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-4 h-4 md:w-5 md:h-5">
                                        </button>
                                        <button onclick="shareContent('twitter', '${p.id}')" class="text-slate-900 dark:text-white transition-transform active:scale-110">
                                            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" class="w-4 h-4 md:w-5 md:h-5 dark:invert">
                                        </button>
                                        <button onclick="shareContent('pinterest', '${p.id}')" class="text-red-500 transition-transform active:scale-110">
                                            <img src="https://cdn-icons-png.flaticon.com/512/145/145808.png" class="w-4 h-4 md:w-5 md:h-5">
                                        </button>
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
            <div class="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-2xl border dark:border-slate-800">
                <h2 class="text-xl md:text-2xl font-black mb-6 md:mb-8 text-center">تأكيد طلبك 🚚</h2>
                <div class="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-4 border dark:border-slate-700 shadow-inner">
                   <img src="${state.checkoutItem.image}" class="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm">
                   <div>
                       <div class="font-bold text-sm text-slate-500">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black text-lg">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>
                <form onsubmit="submitOrder(event)" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium">
                    <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-sm font-medium">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف الخاص بك" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-right text-sm font-bold" dir="ltr">
                    
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black text-lg md:text-xl mt-4 transition active:scale-95 shadow-lg shadow-green-500/20">
                        إرسال الطلب ✅
                    </button>
                    
                    <!-- أزرار المشاركة تحت إرسال الطلب -->
                    <div class="mt-8 pt-6 border-t dark:border-slate-800 text-center">
                        <p class="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-wider">هل تود مشاركة هذا العرض مع أصدقائك؟</p>
                        <div class="flex justify-center gap-4">
                            <button type="button" onclick="shareContent('facebook', '${state.checkoutItem.id}')" class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-4 py-2 rounded-xl text-xs font-black transition hover:scale-105 active:scale-90">
                                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-4 h-4"> فايسبوك
                            </button>
                            <button type="button" onclick="shareContent('twitter', '${state.checkoutItem.id}')" class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-xs font-black transition hover:scale-105 active:scale-90 border dark:border-slate-700">
                                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" class="w-4 h-4 dark:invert"> تويتر
                            </button>
                        </div>
                    </div>
                    
                    <p class="text-center text-[10px] text-slate-400 mt-6 leading-relaxed">بإرسالك للطلب، أنت توافق على شروط الخدمة. الدفع سيكون عند الاستلام.</p>
                </form>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-24 px-4 text-center">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-2xl animate-fadeIn">
                    <h2 class="text-2xl font-black mb-6">دخول الإدارة</h2>
                    <div class="relative mb-6">
                        <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-2xl text-center outline-none focus:ring-2 focus:ring-blue-500">
                        <button onclick="togglePassword('pass', this)" class="absolute left-4 top-1/2 -translate-y-1/2 p-1 text-xl opacity-40 hover:opacity-100">👁️</button>
                    </div>
                    <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black transition hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95">دخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden border-b md:border-b-0 md:border-l border-white/5">
                    <div class="hidden md:block text-xl font-black text-blue-500 mb-8 px-2">لوحة التحكم <span class="text-[8px] block opacity-40">v6.1</span></div>
                    <button onclick="switchTab('orders')" class="flex-shrink-0 p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs md:text-sm">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="flex-shrink-0 p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs md:text-sm">🛍️ المنتجات</button>
                    <button onclick="switchTab('settings')" class="flex-shrink-0 p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs md:text-sm">⚙️ الإعدادات</button>
                    <button onclick="logout()" class="md:mt-auto flex-shrink-0 p-3 text-red-400 font-bold border border-red-400/10 rounded-xl text-center text-xs md:text-sm hover:bg-red-400/10 transition">خروج</button>
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
                    <button onclick="closePreview()" class="mb-4 text-xs font-bold text-blue-500 hover:underline">← العودة للطلبات</button>
                    <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-xl text-right">
                        <h2 class="text-2xl font-black mb-8 border-b dark:border-slate-800 pb-4">تفاصيل الطلبية #${o.id.slice(-4)}</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div class="space-y-4">
                                <div><div class="text-[10px] font-bold text-slate-400 uppercase">اسم الزبون:</div><div class="font-black text-lg">${o.name}</div></div>
                                <div><div class="text-[10px] font-bold text-slate-400 uppercase">رقم الهاتف:</div><div class="font-black text-lg text-blue-600" dir="ltr">${o.phone}</div></div>
                                <div><div class="text-[10px] font-bold text-slate-400 uppercase">المدينة:</div><div class="font-black text-lg">${o.city}</div></div>
                            </div>
                            <div class="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl flex gap-4 border dark:border-slate-700 shadow-sm self-start">
                                <img src="${o.productImage || FALLBACK_IMAGES.placeholder}" class="w-16 h-16 rounded-xl object-cover bg-white shadow-sm">
                                <div>
                                    <div class="font-black text-sm text-slate-600 dark:text-slate-300">${o.product}</div>
                                    <div class="text-blue-600 font-black text-xl mt-1">${o.total} د.م.</div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 pt-6 border-t dark:border-slate-800">
                             <button onclick="updateOrderStatus('${o.id}', 'pending')" class="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-xl text-[10px] font-bold border border-yellow-200">⏳ قيد الانتظار</button>
                             <button onclick="updateOrderStatus('${o.id}', 'completed')" class="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-bold border border-green-200">✅ تم التوصيل</button>
                             <button onclick="updateOrderStatus('${o.id}', 'cancelled')" class="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold border border-red-200">❌ ملغى</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            panel.innerHTML = `
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-2xl font-black">الطلبات الواردة (${state.orders.length})</h2>
                </div>
                <div class="grid gap-4">
                    ${state.orders.map((o: any) => `
                        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-center gap-4 text-right">
                                <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 shadow-inner">${o.id.slice(-2)}</div>
                                <div>
                                    <div class="font-black text-sm md:text-base">${o.name} <span class="text-[10px] opacity-40 mr-2 font-normal">${new Date(o.date).toLocaleDateString('ar-MA')}</span></div>
                                    <div class="text-blue-600 font-bold text-xs" dir="ltr">${o.city} | ${o.phone}</div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="viewOrder('${o.id}')" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-blue-500/10 active:scale-95">معاينة</button>
                                <button onclick="deleteOrder('${o.id}')" class="text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">🗑️</button>
                            </div>
                        </div>
                    `).join('') || '<div class="text-center opacity-30 py-24 font-black text-xl">لا توجد طلبات بعد 📦</div>'}
                </div>
            `;
        }
    } else if (tab === 'products') {
        const editing = state.editingProduct;
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-black">${editing ? 'تعديل' : 'إضافة'} منتج جديد</h2>
                ${editing ? `<button onclick="cancelEdit()" class="text-xs font-bold text-slate-500 hover:underline">إلغاء</button>` : ''}
            </div>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm mb-12">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <input id="p-name" value="${editing?.name || ''}" placeholder="اسم المنتج" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                        <div class="grid grid-cols-2 gap-4">
                            <input id="p-price" type="number" value="${editing?.price || ''}" placeholder="السعر د.م." class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                            <input id="p-stock" type="number" value="${editing?.stock || '10'}" placeholder="المخزون" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div class="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-dashed dark:border-slate-700 flex items-center justify-center relative overflow-hidden group">
                        <img id="p-img-preview" src="${editing?.image || FALLBACK_IMAGES.placeholder}" class="w-full h-full object-contain p-2">
                        <input type="file" onchange="processFile(event, 'main')" class="absolute inset-0 opacity-0 cursor-pointer">
                        <input type="hidden" id="p-img-data" value="${editing?.image || ''}">
                        <div class="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">تغيير الصورة</div>
                    </div>
                </div>
                <button onclick="saveProduct()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-8 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-transform">
                    ${editing ? 'تحديث المنتج' : 'إضافة المنتج للمتجر'}
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 flex gap-4 shadow-sm">
                        <img src="${p.image}" class="w-16 h-16 rounded-xl object-cover bg-slate-50 border shadow-inner flex-shrink-0">
                        <div class="flex-1 min-w-0">
                            <div class="font-bold text-sm truncate">${p.name}</div>
                            <div class="text-blue-600 font-black text-sm">${p.price} د.م.</div>
                            <div class="flex gap-3 mt-3">
                                <button onclick="editProduct('${p.id}')" class="text-[10px] font-black text-blue-500 uppercase tracking-tighter hover:underline">تعديل</button>
                                <button onclick="deleteProduct('${p.id}')" class="text-[10px] font-black text-red-400 uppercase tracking-tighter hover:underline">حذف</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-8">إعدادات الموقع</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 space-y-6 max-w-xl shadow-sm">
                <div>
                    <label class="block text-xs font-black text-slate-400 uppercase mb-2 mr-1">اسم المتجر</label>
                    <input id="set-name" value="${state.settings.siteName}" placeholder="مثال: متجر الهلال" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-black text-slate-400 uppercase mb-2 mr-1">فيسبوك</label>
                        <input id="set-facebook" value="${state.settings.facebook}" placeholder="URL" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none text-left" dir="ltr">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-400 uppercase mb-2 mr-1">تويتر</label>
                        <input id="set-twitter" value="${state.settings.twitter}" placeholder="URL" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none text-left" dir="ltr">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-black text-slate-400 uppercase mb-2 mr-1">أكواد الإعلانات (JS SYNC)</label>
                    <textarea id="set-ads" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 h-32 font-mono text-[10px] outline-none focus:ring-2 focus:ring-blue-500" placeholder="إلصق كود Adsterra هنا..." dir="ltr">${state.settings.adsterraHeader}</textarea>
                </div>
                <button onclick="saveSettings()" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg transition transform active:scale-95">حفظ وتحديث المتجر ✅</button>
            </div>
        `;
    }
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const stock = (document.getElementById('p-stock') as HTMLInputElement).value;
    const image = (document.getElementById('p-img-data') as HTMLInputElement).value;
    if (!name || !price) return alert('يرجى تعبئة كافة الحقول المطلوبة');
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

(window as any).cancelEdit = () => {
    state.editingProduct = null;
    (window as any).switchTab('products');
};

(window as any).deleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف المنتج؟')) {
        state.products = state.products.filter((p: any) => p.id !== id);
        save();
        (window as any).switchTab('products');
    }
};

(window as any).saveSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.facebook = (document.getElementById('set-facebook') as HTMLInputElement).value;
    state.settings.twitter = (document.getElementById('set-twitter') as HTMLInputElement).value;
    state.settings.adsterraHeader = (document.getElementById('set-ads') as HTMLTextAreaElement).value;
    save();
    alert('✅ تم الحفظ بنجاح! المتجر سيعيد التشغيل لتطبيق التغييرات.');
    location.reload();
};

(window as any).deleteOrder = (id: string) => {
    if (confirm('حذف هذا الطلب نهائياً؟')) {
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
            <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                <div class="text-5xl">✅</div>
            </div>
            <h1 class="text-3xl font-black mb-4">تم استلام طلبك!</h1>
            <p class="text-slate-500 mb-12 font-bold leading-relaxed">شكراً لثقتك بنا. فريق المبيعات سيتصل بك قريباً عبر الهاتف لتأكيد العنوان وشحن المنتج 🇲🇦</p>
            <div class="space-y-4">
                <a href="#/" class="inline-block w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-500/10 active:scale-95 transition-transform">تصفح منتجات أخرى</a>
                <div class="pt-8 border-t dark:border-slate-800">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">ساعد أصدقائك في العثور على عروضنا</p>
                    <div class="flex justify-center gap-6">
                        <button onclick="shareContent('facebook')" class="p-3 bg-[#1877F2] rounded-2xl shadow-lg active:scale-90 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-5 h-5 invert"></button>
                        <button onclick="shareContent('twitter')" class="p-3 bg-black rounded-2xl shadow-lg active:scale-90 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" class="w-5 h-5 invert"></button>
                    </div>
                </div>
            </div>
        </div>
    `;
    root!.innerHTML = html;
    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-950 text-white py-12 md:py-20 px-6 text-center border-t border-white/5">
            <div class="text-2xl font-black text-blue-500 mb-2">${state.settings.siteName}</div>
            <p class="text-slate-500 font-bold text-xs mb-10">تسوق بكل أمان - دفع عند الاستلام - شحن لجميع المدن المغربية 🇲🇦</p>
            <div class="flex justify-center gap-8 mb-12 text-[10px] font-black uppercase tracking-widest">
                <button onclick="shareContent('facebook')" class="text-slate-400 hover:text-[#1877F2] transition-colors">Facebook</button>
                <button onclick="shareContent('twitter')" class="text-slate-400 hover:text-white transition-colors">Twitter</button>
                <button onclick="shareContent('pinterest')" class="text-slate-400 hover:text-[#E60023] transition-colors">Pinterest</button>
            </div>
            <div class="text-slate-800 text-[8px] font-mono tracking-[0.2em] uppercase">© 2025 ${state.settings.siteName} - Luxury Moroccan Experience</div>
        </footer>
    `;
    if (hash === '#/dashboard' && state.isAdmin) (window as any).switchTab('orders');
    injectAds();
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
