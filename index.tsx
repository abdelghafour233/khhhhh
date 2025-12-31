
/**
 * storehalal v5.0 - Pro Inventory Management 🚀🇲🇦
 * تم إضافة ميزات: رفع الصور، تعديل المنتجات، الوصف المطول، ومعرض الصور الإضافية.
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
    { 
        id: '1', 
        name: 'آيفون 15 برو ماكس', 
        price: 14500, 
        image: 'https://picsum.photos/seed/iphone/600/400',
        description: 'أحدث هاتف من آبل مع كاميرا سينمائية ومعالج A17 Pro.',
        gallery: []
    },
    { 
        id: '2', 
        name: 'ساعة ذكية Ultra Series 9', 
        price: 450, 
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
    editingProduct: null // لتتبع المنتج الذي يتم تعديله حالياً
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify(INITIAL_PRODUCTS));
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        const defaultSettings = {
            siteName: 'storehalal',
            adminPass: 'halal2025',
            adsterraHeader: ''
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

// --- وظائف تحويل الصور ---
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
        // Fix: Changed 'HTMLHiddenElement' to 'HTMLInputElement' as hidden inputs use this type.
        (document.getElementById('p-img-data') as HTMLInputElement).value = base64;
    } else {
        const galleryContainer = document.getElementById('p-gallery-previews');
        for (let file of files) {
            const base64 = await handleImageUpload(file);
            const imgWrap = document.createElement('div');
            imgWrap.className = 'relative group w-20 h-20 rounded-lg overflow-hidden border';
            imgWrap.innerHTML = `
                <img src="${base64}" class="w-full h-full object-cover gallery-item-data">
                <button onclick="this.parentElement.remove()" class="absolute top-0 right-0 bg-red-500 text-white p-1 text-[8px]">حذف</button>
            `;
            galleryContainer?.appendChild(imgWrap);
        }
    }
};

// --- وظائف النظام ---
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

    state.orders.unshift({
        id: Date.now().toString(),
        name, city, phone,
        total: state.checkoutItem.price,
        product: state.checkoutItem.name,
        date: new Date().toISOString()
    });
    save();
    window.location.hash = '#/success';
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
                <p class="opacity-80">أفضل العروض في المغرب 🇲🇦</p>
            </div>
            <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col transition hover:shadow-md">
                        <img src="${p.image}" class="w-full aspect-square object-cover bg-slate-50">
                        <div class="p-4 flex flex-col flex-1">
                            <h3 class="font-bold text-sm mb-1 line-clamp-1">${p.name}</h3>
                            <p class="text-[10px] text-slate-400 mb-3 line-clamp-2">${p.description || ''}</p>
                            <div class="text-blue-600 font-black mb-4 mt-auto">${p.price} د.م.</div>
                            <button onclick="buyNow('${p.id}')" class="w-full bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold transition active:scale-95">شراء الآن</button>
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
                <form onsubmit="submitOrder(event)" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none">
                    <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none text-right" dir="ltr">
                    <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl mt-4">إرسال الطلب ✅</button>
                </form>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-24 px-4 text-center">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-2xl">
                    <h2 class="text-2xl font-black mb-6">دخول الإدارة</h2>
                    <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-center mb-6 outline-none">
                    <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black">دخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen text-right bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-2">
                    <div class="text-xl font-black text-blue-500 mb-8 px-2">لوحة التحكم</div>
                    <button onclick="switchTab('orders')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="p-3 text-right hover:bg-white/10 rounded-xl transition font-bold">🛍️ إدارة المخزون</button>
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
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-8">قائمة الطلبات</h2>
            <div class="grid gap-4">
                ${state.orders.map((o: any) => `
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 flex justify-between items-center shadow-sm">
                        <div>
                            <div class="font-black text-xl mb-1">${o.name}</div>
                            <div class="text-blue-600 font-bold">${o.phone} | ${o.city}</div>
                            <div class="text-sm text-slate-500">${o.product}</div>
                        </div>
                        <button onclick="deleteOrder('${o.id}')" class="text-red-500 font-bold p-2 hover:bg-red-50 rounded-lg">حذف</button>
                    </div>
                `).join('') || '<p class="text-center opacity-40 py-20">لا توجد طلبات</p>'}
            </div>
        `;
    } else if (tab === 'products') {
        const editing = state.editingProduct;
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-8">${editing ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
            
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm mb-12">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- القسم الأيمن: البيانات الأساسية -->
                    <div class="space-y-4">
                        <input id="p-name" value="${editing?.name || ''}" placeholder="اسم المنتج" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none">
                        <input id="p-price" type="number" value="${editing?.price || ''}" placeholder="السعر (د.م.)" class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none">
                        <textarea id="p-desc" placeholder="وصف المنتج..." class="w-full p-4 border dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 h-32 outline-none">${editing?.description || ''}</textarea>
                    </div>

                    <!-- القسم الأيسر: الصور -->
                    <div class="space-y-6">
                        <div class="flex items-start gap-4">
                            <div class="w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative group">
                                <img id="p-img-preview" src="${editing?.image || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover">
                                <input type="file" onchange="processFile(event, 'main')" class="absolute inset-0 opacity-0 cursor-pointer">
                                <input type="hidden" id="p-img-data" value="${editing?.image || ''}">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] pointer-events-none">تغيير الصورة</div>
                            </div>
                            <div class="flex-1">
                                <label class="block text-xs font-bold mb-2">صورة المنتج الأساسية</label>
                                <p class="text-[10px] text-slate-400">انقر على المربع لتحميل صورة من جهازك.</p>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold mb-3 text-blue-600">صور إضافية (معرض الصور)</label>
                            <div id="p-gallery-previews" class="flex flex-wrap gap-2 mb-4">
                                ${editing?.gallery?.map((img: string) => `
                                    <div class="relative group w-20 h-20 rounded-lg overflow-hidden border">
                                        <img src="${img}" class="w-full h-full object-cover gallery-item-data">
                                        <button onclick="this.parentElement.remove()" class="absolute top-0 right-0 bg-red-500 text-white p-1 text-[8px]">حذف</button>
                                    </div>
                                `).join('') || ''}
                            </div>
                            <label class="inline-block bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-50">
                                ➕ إضافة صور للمعرض
                                <input type="file" multiple onchange="processFile(event, 'gallery')" class="hidden">
                            </label>
                        </div>
                    </div>
                </div>

                <div class="mt-8 flex gap-4">
                    <button onclick="saveProduct()" class="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition active:scale-95">
                        ${editing ? 'حفظ التعديلات' : 'إضافة المنتج للمخزن'}
                    </button>
                    ${editing ? `<button onclick="cancelEdit()" class="bg-slate-200 dark:bg-slate-800 px-8 rounded-2xl font-bold">إلغاء</button>` : ''}
                </div>
            </div>

            <h3 class="text-2xl font-black mb-6">المنتجات الحالية (${state.products.length})</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border dark:border-slate-800 flex flex-col gap-4 shadow-sm hover:shadow-md transition">
                        <div class="flex gap-4">
                            <img src="${p.image}" class="w-20 h-20 rounded-2xl object-cover bg-slate-50">
                            <div class="flex-1">
                                <div class="font-bold text-sm mb-1">${p.name}</div>
                                <div class="text-blue-600 font-black text-sm">${p.price} د.م.</div>
                                <div class="text-[9px] text-slate-400 line-clamp-2">${p.description || 'بدون وصف'}</div>
                            </div>
                        </div>
                        <div class="flex gap-2 mt-auto pt-4 border-t dark:border-slate-800">
                            <button onclick="editProduct('${p.id}')" class="flex-1 bg-slate-100 dark:bg-slate-800 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition">تعديل</button>
                            <button onclick="deleteProduct('${p.id}')" class="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const image = (document.getElementById('p-img-data') as HTMLInputElement).value;
    const description = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    
    // جمع صور المعرض
    const gallery: string[] = [];
    document.querySelectorAll('.gallery-item-data').forEach((img: any) => gallery.push(img.src));

    if (!name || !price) return alert('يرجى إدخال الاسم والسعر');

    const productData = {
        id: state.editingProduct ? state.editingProduct.id : Date.now().toString(),
        name,
        price: Number(price),
        image: image || 'https://via.placeholder.com/400',
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
    if (confirm('هل تريد حذف هذا المنتج نهائياً؟')) {
        state.products = state.products.filter((p: any) => p.id !== id);
        save();
        (window as any).switchTab('products');
    }
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
        <div class="max-w-md mx-auto py-32 text-center animate-fadeIn px-4">
            <div class="text-7xl mb-8">🎯</div>
            <h1 class="text-4xl font-black mb-4">شكراً لك!</h1>
            <p class="text-slate-500 mb-12 font-bold text-lg">تم استلام طلبك بنجاح. سيتصل بك فريق العمل قريباً لتأكيد العنوان 🇲🇦</p>
            <a href="#/" class="inline-block bg-blue-600 text-white px-12 py-5 rounded-3xl font-black shadow-2xl shadow-blue-500/30 transition active:scale-95">العودة للمتجر</a>
        </div>
    `;

    root!.innerHTML = html;
    
    if (hash === '#/dashboard' && state.isAdmin) (window as any).switchTab('orders');
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
