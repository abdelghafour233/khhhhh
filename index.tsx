
/**
 * storehalal v5.6 - Order Processing & Security Pro 🚀🇲🇦
 * تم إضافة: معاينة الطلبيات، معالجة الحالات، وأيقونة العين لكلمات السر.
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
    viewingOrder: null // لتخزين الطلب الذي يتم معاينته حالياً
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(INITIAL_PRODUCTS));
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
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

// --- وظيفة حقن الإعلانات المطورة (دعم JS SYNC) ---
const injectAds = () => {
    const isDashboard = window.location.hash.startsWith('#/dashboard');
    if (isDashboard) {
        document.querySelectorAll('.dynamic-ad-script').forEach(el => el.remove());
        state.adsInjected = false;
        return;
    }

    if (!state.adsInjected && state.settings.adsterraHeader) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = state.settings.adsterraHeader;
        const scripts = tempDiv.querySelectorAll('script');

        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            if (!oldScript.hasAttribute('async')) { newScript.async = false; }
            newScript.textContent = oldScript.textContent;
            newScript.classList.add('dynamic-ad-script');
            newScript.setAttribute('data-ad-type', 'sync');
            document.head.appendChild(newScript);
        });
        state.adsInjected = true;
    }
};

// --- وظيفة تبديل رؤية كلمة السر ---
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
    } else {
        const galleryContainer = document.getElementById('p-gallery-previews');
        for (let file of files) {
            const base64 = await handleImageUpload(file);
            const imgWrap = document.createElement('div');
            imgWrap.className = 'relative group w-20 h-20 rounded-lg overflow-hidden border bg-white';
            imgWrap.innerHTML = `
                <img src="${base64}" class="w-full h-full object-cover gallery-item-data">
                <button onclick="this.parentElement.remove()" class="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-bl-lg text-[10px]">×</button>
            `;
            galleryContainer?.appendChild(imgWrap);
        }
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
        status: 'pending', // الحالات: pending, completed, cancelled
        date: new Date().toISOString()
    });
    save();
    window.location.hash = '#/success';
};

// --- وظائف إدارة الطلبات ---
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
                    <span class="text-xl font-bold">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-2">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <div class="bg-blue-600 text-white py-12 px-4 text-center">
                <h1 class="text-3xl md:text-5xl font-black mb-2">${state.settings.siteName}</h1>
                <p class="opacity-80">أفضل العروض الحصرية في المغرب 🇲🇦</p>
            </div>
            <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col transition hover:shadow-md ${p.stock <= 0 ? 'opacity-75 grayscale-[0.5]' : ''}">
                        <div class="relative">
                            <img src="${p.image}" class="w-full aspect-square object-cover bg-slate-50">
                            ${p.stock <= 0 ? '<div class="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xs">نفذ من المخزن</div>' : ''}
                        </div>
                        <div class="p-4 flex flex-col flex-1">
                            <h3 class="font-bold text-sm mb-1 line-clamp-1">${p.name}</h3>
                            <p class="text-[10px] text-slate-400 mb-3 line-clamp-2">${p.description || ''}</p>
                            <div class="flex justify-between items-center mt-auto mb-4">
                                <div class="text-blue-600 font-black">${p.price} د.م.</div>
                                <div class="text-[9px] ${p.stock < 5 ? 'text-red-500 font-bold' : 'text-slate-400'}">باقي: ${p.stock}</div>
                            </div>
                            <button onclick="buyNow('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''} 
                                class="w-full ${p.stock <= 0 ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2.5 rounded-xl text-xs font-bold transition active:scale-95">
                                ${p.stock <= 0 ? 'غير متوفر' : 'شراء الآن'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    checkout: () => `
        <div class="max-w-md mx-auto py-12 px-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border dark:border-slate-800">
                <h2 class="text-2xl font-black mb-8 text-center">تأكيد الطلب 🚚</h2>
                <div class="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-4 border">
                   <img src="${state.checkoutItem.image}" class="w-16 h-16 rounded-lg object-cover">
                   <div>
                       <div class="font-bold text-sm">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>
                <form onsubmit="submitOrder(event)" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none">
                    <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none text-right" dir="ltr">
                    <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl mt-4 transition active:scale-95">إرسال الطلب ✅</button>
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
                        <button onclick="togglePassword('pass', this)" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale hover:grayscale-0 transition">👁️</button>
                    </div>
                    <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black">دخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-2">
                    <div class="text-xl font-black text-blue-500 mb-8 px-2">لوحة التحكم</div>
                    <button onclick="switchTab('orders')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold">🛍️ المخزون والمنتجات</button>
                    <button onclick="switchTab('settings')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold">⚙️ الإعدادات</button>
                    <button onclick="logout()" class="mt-auto p-4 text-red-400 font-bold border border-red-400/20 rounded-2xl text-center">خروج</button>
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
        if (state.viewingOrder) {
            const o = state.viewingOrder;
            const statusLabels: any = { pending: '⏳ قيد الانتظار', completed: '✅ تم التوصيل', cancelled: '❌ ملغى' };
            const statusColors: any = { pending: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
            
            panel.innerHTML = `
                <div class="max-w-3xl mx-auto animate-fadeIn">
                    <button onclick="closePreview()" class="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition">
                        <span>←</span> العودة للطلبيات
                    </button>
                    
                    <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-xl overflow-hidden relative">
                        <div class="absolute top-8 left-8">
                            <span class="px-4 py-2 rounded-full text-xs font-black ${statusColors[o.status]}">${statusLabels[o.status]}</span>
                        </div>
                        
                        <h2 class="text-3xl font-black mb-8 border-b pb-4">تفاصيل الطلبية #${o.id.slice(-4)}</h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div class="space-y-6">
                                <h3 class="text-lg font-black text-blue-600">بيانات الزبون</h3>
                                <div>
                                    <div class="text-xs text-slate-400 mb-1">الاسم الكامل:</div>
                                    <div class="font-bold text-xl">${o.name}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-slate-400 mb-1">رقم الهاتف:</div>
                                    <div class="font-bold text-xl text-blue-600" dir="ltr">${o.phone}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-slate-400 mb-1">المدينة:</div>
                                    <div class="font-bold text-xl">${o.city}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-slate-400 mb-1">التاريخ:</div>
                                    <div class="text-sm font-bold">${new Date(o.date).toLocaleString('ar-MA')}</div>
                                </div>
                            </div>
                            
                            <div class="space-y-6">
                                <h3 class="text-lg font-black text-blue-600">المنتج المطلوب</h3>
                                <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex gap-4 border">
                                    <img src="${o.productImage || FALLBACK_IMAGES.placeholder}" class="w-20 h-20 rounded-xl object-cover bg-white">
                                    <div class="flex-1">
                                        <div class="font-bold text-sm mb-1">${o.product}</div>
                                        <div class="text-blue-600 font-black text-lg">${o.total} د.م.</div>
                                    </div>
                                </div>
                                
                                <div class="pt-4 space-y-3">
                                    <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">تغيير الحالة</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <button onclick="updateOrderStatus('${o.id}', 'pending')" class="px-4 py-2 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-xl text-xs font-bold hover:bg-yellow-100 transition">⏳ قيد الانتظار</button>
                                        <button onclick="updateOrderStatus('${o.id}', 'completed')" class="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-xl text-xs font-bold hover:bg-green-100 transition">✅ تم التوصيل</button>
                                        <button onclick="updateOrderStatus('${o.id}', 'cancelled')" class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition">❌ إلغاء</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            panel.innerHTML = `
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-3xl font-black">إدارة الطلبات</h2>
                    <div class="text-xs font-bold bg-blue-100 text-blue-600 px-4 py-2 rounded-full">إجمالي الطلبات: ${state.orders.length}</div>
                </div>
                <div class="grid gap-4">
                    ${state.orders.map((o: any) => {
                        const statusColors: any = { pending: 'text-yellow-500', completed: 'text-green-500', cancelled: 'text-red-500' };
                        const statusDots: any = { pending: '●', completed: '●', cancelled: '●' };
                        return `
                            <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 flex justify-between items-center shadow-sm hover:shadow-md transition">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400">${o.id.slice(-2)}</div>
                                    <div>
                                        <div class="font-black text-lg mb-0.5">${o.name} <span class="text-[10px] ${statusColors[o.status] || ''} mr-2">${statusDots[o.status] || ''}</span></div>
                                        <div class="text-blue-600 font-bold text-sm" dir="ltr">${o.phone} | ${o.city}</div>
                                        <div class="text-[10px] text-slate-400 mt-1">${o.product} - ${new Date(o.date).toLocaleDateString('ar-MA')}</div>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="viewOrder('${o.id}')" class="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition">معاينة</button>
                                    <button onclick="deleteOrder('${o.id}')" class="text-red-400 hover:text-red-600 p-2.5 transition">🗑️</button>
                                </div>
                            </div>
                        `;
                    }).join('') || '<div class="text-center opacity-40 py-20 font-bold">لا توجد طلبات حتى الآن</div>'}
                </div>
            `;
        }
    } else if (tab === 'products') {
        const editing = state.editingProduct;
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-black">${editing ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}</h2>
                ${editing ? `<button onclick="cancelEdit()" class="bg-slate-200 px-6 py-2 rounded-xl text-sm font-bold">إلغاء التعديل</button>` : ''}
            </div>
            
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm mb-12">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold mb-2">اسم المنتج</label>
                            <input id="p-name" value="${editing?.name || ''}" placeholder="آيفون 15..." class="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold mb-2">السعر (د.م.)</label>
                                <input id="p-price" type="number" value="${editing?.price || ''}" class="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none">
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-2">الكمية المتوفرة</label>
                                <input id="p-stock" type="number" value="${editing?.stock || '10'}" class="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-2">وصف المنتج</label>
                            <textarea id="p-desc" placeholder="اكتب مواصفات المنتج هنا..." class="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-800 h-32 outline-none">${editing?.description || ''}</textarea>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-xs font-bold mb-3">الصورة الأساسية</label>
                            <div class="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative group">
                                <img id="p-img-preview" src="${editing?.image || FALLBACK_IMAGES.placeholder}" class="w-full h-full object-contain">
                                <input type="file" onchange="processFile(event, 'main')" class="absolute inset-0 opacity-0 cursor-pointer">
                                <input type="hidden" id="p-img-data" value="${editing?.image || ''}">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs pointer-events-none">تغيير الصورة</div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-3 text-blue-600">صور إضافية للمنتج</label>
                            <div id="p-gallery-previews" class="flex flex-wrap gap-2 mb-4">
                                ${editing?.gallery?.map((img: string) => `
                                    <div class="relative group w-20 h-20 rounded-lg overflow-hidden border bg-white">
                                        <img src="${img}" class="w-full h-full object-cover gallery-item-data">
                                        <button onclick="this.parentElement.remove()" class="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-bl-lg text-[10px]">×</button>
                                    </div>
                                `).join('') || ''}
                            </div>
                            <label class="inline-block bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-200">
                                📷 رفع صور المعرض
                                <input type="file" multiple onchange="processFile(event, 'gallery')" class="hidden">
                            </label>
                        </div>
                    </div>
                </div>
                <div class="mt-8">
                    <button onclick="saveProduct()" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition active:scale-95">
                        ${editing ? 'تحديث بيانات المنتج ✅' : 'إضافة المنتج للمخزن +'}
                    </button>
                </div>
            </div>

            <h3 class="text-2xl font-black mb-6">قائمة المخزون الحالية</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border dark:border-slate-800 flex flex-col gap-4 shadow-sm hover:shadow-md transition">
                        <div class="flex gap-4">
                            <img src="${p.image}" class="w-20 h-20 rounded-2xl object-cover bg-slate-50">
                            <div class="flex-1">
                                <div class="font-bold text-sm mb-1">${p.name}</div>
                                <div class="text-blue-600 font-black text-sm">${p.price} د.م.</div>
                                <div class="text-[10px] ${p.stock <= 3 ? 'text-red-500 font-bold' : 'text-slate-500'}">الكمية: ${p.stock}</div>
                            </div>
                        </div>
                        <div class="flex gap-2 pt-2">
                            <button onclick="editProduct('${p.id}')" class="flex-1 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition">تعديل</button>
                            <button onclick="deleteProduct('${p.id}')" class="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-8">إعدادات المتجر</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 space-y-6 max-w-2xl shadow-sm">
                <div>
                    <label class="block text-sm font-bold mb-2">اسم المتجر</label>
                    <input id="set-name" value="${state.settings.siteName}" class="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2 text-blue-600 font-black">تعديل كلمة سر الإدارة</label>
                    <div class="relative">
                        <input id="set-pass" type="password" value="${state.settings.adminPass}" class="w-full p-4 pl-12 border rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500">
                        <button onclick="togglePassword('set-pass', this)" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale hover:grayscale-0 transition">👁️</button>
                    </div>
                    <p class="text-[10px] text-slate-400 mt-2 italic">* استخدم أيقونة العين للتأكد من كلمة السر الجديدة قبل الحفظ.</p>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2">أكواد الإعلانات و Anti-Adblock (JS SYNC)</label>
                    <p class="text-[10px] text-slate-400 mb-2">الصق السكربتات هنا. سيتم تنفيذها بشكل متزامن (Synchronous) في رأس الصفحة.</p>
                    <textarea id="set-ads" class="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-800 h-48 font-mono text-[11px] outline-none" dir="ltr">${state.settings.adsterraHeader}</textarea>
                </div>
                <button onclick="saveSettings()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg transition active:scale-95">حفظ وتحديث المتجر</button>
            </div>
        `;
    }
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const stock = (document.getElementById('p-stock') as HTMLInputElement).value;
    const image = (document.getElementById('p-img-data') as HTMLInputElement).value;
    const description = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    
    const gallery: string[] = [];
    document.querySelectorAll('.gallery-item-data').forEach((img: any) => gallery.push(img.src));

    if (!name || !price) return alert('يرجى إدخال البيانات الأساسية');

    const productData = {
        id: state.editingProduct ? state.editingProduct.id : Date.now().toString(),
        name,
        price: Number(price),
        stock: Number(stock) || 0,
        image: image || FALLBACK_IMAGES.placeholder,
        description,
        gallery
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

(window as any).cancelEdit = () => {
    state.editingProduct = null;
    (window as any).switchTab('products');
};

(window as any).deleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
        state.products = state.products.filter((p: any) => p.id !== id);
        save();
        (window as any).switchTab('products');
    }
};

(window as any).saveSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.adminPass = (document.getElementById('set-pass') as HTMLInputElement).value;
    state.settings.adsterraHeader = (document.getElementById('set-ads') as HTMLTextAreaElement).value;
    save();
    alert('✅ تم حفظ الإعدادات بنجاح!');
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
            <div class="text-7xl mb-8">✅</div>
            <h1 class="text-4xl font-black mb-4">تم الطلب بنجاح!</h1>
            <p class="text-slate-500 mb-12 font-bold text-lg">سيتصل بك فريق العمل قريباً لتأكيد العنوان وتوصيل طلبك 🇲🇦</p>
            <a href="#/" class="inline-block bg-blue-600 text-white px-12 py-5 rounded-3xl font-black shadow-2xl transition hover:scale-105 active:scale-95">العودة للمتجر</a>
        </div>
    `;

    root!.innerHTML = html;
    
    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-900 text-white py-20 px-6 text-center border-t border-white/5">
            <div class="text-2xl font-black text-blue-500 mb-2">${state.settings.siteName}</div>
            <p class="text-slate-500 font-bold mb-8">تسوق آمن - دفع عند الاستلام - شحن سريع 🇲🇦</p>
            <div class="flex justify-center gap-6 text-slate-400 text-xs mb-8">
                <span>سياسة الخصوصية</span>
                <span>شروط الاستخدام</span>
                <span>اتصل بنا</span>
            </div>
            <div class="text-slate-700 text-[10px] font-mono tracking-widest uppercase">Powered by StoreHalal Platform</div>
        </footer>
    `;

    if (hash === '#/dashboard' && state.isAdmin) (window as any).switchTab('orders');
    
    injectAds();
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
