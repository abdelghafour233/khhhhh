
/**
 * storehalal v7.6 - Advanced Gallery & Product Details Modal 🛍️🇲🇦
 */

const MOROCCAN_CITIES = ["الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "مكناس", "وجدة", "تطوان", "القنيطرة", "آسفي", "تمارة", "المحمدية", "الناظور", "بني ملال", "الجديدة", "تازة", "سطات", "برشيد", "الخميسات", "العرائش", "القصر الكبير", "كلميم", "بركان"].sort();

let state: any = {
    products: [],
    orders: [],
    settings: { 
        siteName: 'storehalal', 
        adminPass: 'halal2025',
        adsterraCodes: `<!-- Adsterra Script Links -->
<script type='text/javascript' src='https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js'></script>
<script type='text/javascript' src='https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js'></script>`
    },
    checkoutItem: null,
    isAdmin: false,
    currentTab: 'orders',
    editingId: null,
    tempImage: null,
    tempGallery: [],
    activeModalProduct: null // لتخزين المنتج المعروض في النافذة المنبثقة
};

const injectAds = () => {
    document.querySelectorAll('.adsterra-dynamic-script').forEach(el => el.remove());
    if (window.location.hash.includes('dashboard')) return;

    const div = document.createElement('div');
    div.className = 'adsterra-dynamic-script';
    div.innerHTML = state.settings.adsterraCodes;
    
    const scripts = div.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        document.body.appendChild(newScript);
        oldScript.remove();
    });
};

const initStore = () => {
    try {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            state.products = JSON.parse(savedProducts);
        } else {
            state.products = [
                { id: '1', name: 'آيفون 15 برو ماكس', price: 14500, description: 'أحدث هاتف من شركة آبل مع معالج A17 Pro وكاميرا احترافية.', image: 'https://picsum.photos/seed/iphone/600/400', gallery: [] },
                { id: '2', name: 'ساعة ذكية Ultra 9', price: 450, description: 'ساعة ذكية متطورة تدعم الاتصال وتتبع الصحة بدقة عالية.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', gallery: [] }
            ];
            save();
        }
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
        }
        state.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
        setTimeout(injectAds, 1000);
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

const router = () => {
    const root = document.getElementById('app-root');
    const hash = window.location.hash || '#/';
    
    if (hash.includes('dashboard')) document.body.classList.add('admin-mode');
    else document.body.classList.remove('admin-mode');

    let html = UI.header();
    if (hash === '#/') html += `<div class="page-enter">${UI.store()}</div>`;
    else if (hash === '#/checkout') html += `<div class="page-enter">${UI.checkout()}</div>`;
    else if (hash === '#/dashboard') {
        html += `<div class="page-enter">${UI.dashboard()}</div>`;
        setTimeout(() => { if(state.isAdmin) (window as any).switchTab(state.currentTab); }, 20);
    }
    else if (hash === '#/success') html += `<div class="page-enter">${UI.success()}</div>`;
    
    root!.innerHTML = html;
    
    // حقن مودال التفاصيل إذا كان موجوداً
    if (state.activeModalProduct) {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = UI.productModal(state.activeModalProduct);
        document.body.appendChild(modalDiv.firstElementChild!);
    }
    
    injectAds();
};

const UI = {
    header: () => `
        <header class="sticky top-0 z-[99999] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b dark:border-slate-800 shadow-sm h-16 flex items-center">
            <nav class="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
                <a href="#/" class="flex items-center gap-2 group">
                    <div class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black transition">S</div>
                    <span class="text-lg font-black">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-2 admin-btn-layer">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-md hover:scale-105 transition">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div>
            <div class="bg-slate-900 text-white py-16 px-4 text-center">
                <h1 class="text-3xl font-black mb-3 tracking-tighter">${state.settings.siteName}</h1>
                <p class="opacity-60 text-[10px] mb-6 max-w-xs mx-auto">الدفع عند الاستلام - توصيل سريع لجميع المدن المغربية 🇲🇦</p>
            </div>
            <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col group transition-all hover:shadow-lg">
                        <div onclick="openProductModal('${p.id}')" class="aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative cursor-zoom-in">
                           <img src="${p.image}" class="w-full h-full object-cover img-stable group-hover:scale-105 transition duration-500">
                           ${p.gallery && p.gallery.length > 0 ? `<div class="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] px-2 py-1 rounded-md backdrop-blur-md font-bold">🖼️ +${p.gallery.length}</div>` : ''}
                        </div>
                        <div class="p-4 flex flex-col flex-1">
                            <h3 class="font-black text-[11px] mb-2 line-clamp-1">${p.name}</h3>
                            <div class="text-blue-600 font-black text-sm mb-4">${p.price} د.م.</div>
                            <div class="grid grid-cols-5 gap-1">
                                <button onclick="buyNow('${p.id}')" class="col-span-4 bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black active:scale-95 transition">🛒 اطلب الآن</button>
                                <button onclick="openProductModal('${p.id}')" class="col-span-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-3 rounded-xl flex items-center justify-center active:scale-95 transition">👁️</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    productModal: (p: any) => `
        <div id="modal-overlay" class="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row relative shadow-2xl">
                <button onclick="closeProductModal()" class="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center text-xl">✕</button>
                
                <!-- معرض الصور في المودال -->
                <div class="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    <div id="modal-gallery-main" class="w-full h-full">
                        <img src="${p.image}" class="w-full h-full object-cover animate-fadeIn">
                    </div>
                    ${p.gallery && p.gallery.length > 0 ? `
                        <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2">
                            <img onclick="updateModalMainImage('${p.image}')" src="${p.image}" class="w-12 h-12 rounded-lg border-2 border-white cursor-pointer object-cover shadow-md">
                            ${p.gallery.map((img: string) => `<img onclick="updateModalMainImage('${img}')" src="${img}" class="w-12 h-12 rounded-lg border-2 border-transparent hover:border-white cursor-pointer object-cover shadow-md transition">`).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- تفاصيل المنتج -->
                <div class="w-full md:w-1/2 p-8 overflow-y-auto">
                    <div class="mb-6">
                        <h2 class="text-2xl font-black mb-2">${p.name}</h2>
                        <div class="text-3xl font-black text-blue-600">${p.price} د.م.</div>
                    </div>
                    
                    <div class="prose dark:prose-invert max-w-none mb-8">
                        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">${p.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}</p>
                    </div>

                    <div class="space-y-4 pt-4 border-t dark:border-slate-800">
                        <div class="flex items-center gap-3 text-green-600 dark:text-green-400 font-bold text-xs">
                            <span class="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">🚚</span>
                            توصيل مجاني وسريع لجميع المدن
                        </div>
                        <button onclick="buyNow('${p.id}')" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition">اطلب الآن - الدفع عند الاستلام</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-32 px-4">
                <div class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border dark:border-slate-800 text-center shadow-2xl">
                    <h2 class="text-xl font-black mb-6">دخول الإدارة</h2>
                    <div class="relative mb-4">
                        <input id="pass" type="password" placeholder="كلمة السر" class="w-full p-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 rounded-xl text-center outline-none font-black pl-10">
                        <button type="button" onclick="togglePass()" id="eye-btn" class="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity text-lg p-1">👁️</button>
                    </div>
                    <button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-black active:scale-95 transition">دخول</button>
                </div>
            </div>
        `;
        return `
            <div class="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-56 bg-slate-900 text-white p-4 flex md:flex-col gap-1 border-b md:border-b-0 border-white/5">
                    <div class="hidden md:block text-lg font-black text-blue-500 mb-8 px-2">غرفة التحكم</div>
                    <button onclick="switchTab('orders')" class="flex-1 md:flex-none p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs ${state.currentTab === 'orders' ? 'bg-blue-600' : ''}">📦 الطلبات</button>
                    <button onclick="switchTab('products')" class="flex-1 md:flex-none p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs ${state.currentTab === 'products' ? 'bg-blue-600' : ''}">🛍️ المنتجات</button>
                    <button onclick="switchTab('settings')" class="flex-1 md:flex-none p-3 text-right hover:bg-white/10 rounded-xl transition font-bold text-xs ${state.currentTab === 'settings' ? 'bg-blue-600' : ''}">⚙️ الإعدادات</button>
                    <button onclick="logout()" class="md:mt-auto p-3 text-red-400 font-black rounded-xl text-center text-xs hover:bg-red-400/10 transition">خروج</button>
                </aside>
                <main id="dash-panel" class="flex-1 p-4 md:p-8 bg-white dark:bg-slate-950 overflow-y-auto"></main>
            </div>
        `;
    },
    checkout: () => `
        <div class="max-w-md mx-auto py-8 px-4">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-800">
                <h2 class="text-xl font-black mb-6 text-center">تأكيد الطلب 🚚</h2>
                <div class="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-3">
                   <div class="img-container"><img src="${state.checkoutItem.image}" class="img-stable"></div>
                   <div>
                       <div class="text-[10px] font-bold text-slate-400 line-clamp-1">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black text-lg">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>
                <form onsubmit="event.preventDefault(); (window as any).processOrder(this);" class="space-y-3">
                    <input name="fullname" type="text" placeholder="الاسم الكامل" required class="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none font-bold text-sm">
                    <select name="city" required class="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none font-bold text-sm">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input name="phone" type="tel" placeholder="رقم الهاتف" required class="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none text-right font-black" dir="ltr">
                    <button type="submit" class="w-full bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition">إرسال الطلب ✅</button>
                </form>
            </div>
        </div>
    `,
    success: () => `
        <div class="max-w-md mx-auto py-24 text-center px-4">
            <div class="text-5xl mb-4">🎉</div>
            <h1 class="text-2xl font-black mb-2">طلبك قيد المعالجة!</h1>
            <p class="text-slate-500 text-xs mb-8 font-bold">سنتصل بك في أقل من 24 ساعة لتأكيد التوصيل 🇲🇦</p>
            <a href="#/" class="inline-block w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm shadow-xl active:scale-95 transition">العودة للرئيسية</a>
        </div>
    `
};

(window as any).togglePass = () => {
    const input = document.getElementById('pass') as HTMLInputElement;
    const btn = document.getElementById('eye-btn');
    if (input.type === 'password') {
        input.type = 'text';
        if (btn) btn.innerText = '👓';
    } else {
        input.type = 'password';
        if (btn) btn.innerText = '👁️';
    }
};

(window as any).openProductModal = (id: string) => {
    state.activeModalProduct = state.products.find((p: any) => p.id === id);
    router();
};

(window as any).closeProductModal = () => {
    state.activeModalProduct = null;
    document.getElementById('modal-overlay')?.remove();
};

(window as any).updateModalMainImage = (url: string) => {
    const container = document.getElementById('modal-gallery-main');
    if (container) {
        container.innerHTML = `<img src="${url}" class="w-full h-full object-cover animate-fadeIn">`;
    }
};

(window as any).switchTab = (tab: string) => {
    state.currentTab = tab;
    state.editingId = null;
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    document.querySelectorAll('aside button').forEach(btn => {
        btn.classList.remove('bg-blue-600');
        if (btn.getAttribute('onclick')?.includes(tab)) btn.classList.add('bg-blue-600');
    });

    if (tab === 'orders') {
        panel.innerHTML = `
            <h2 class="text-xl font-black mb-6">الطلبات الواردة (${state.orders.length})</h2>
            <div class="grid gap-3">
                ${state.orders.map((o: any) => `
                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border dark:border-slate-800 flex justify-between items-center transition-none">
                        <div>
                            <div class="font-black text-sm">${o.name} <span class="text-[9px] text-slate-400 mr-2">${o.city}</span></div>
                            <div class="text-blue-500 font-black text-xs" dir="ltr">${o.phone}</div>
                        </div>
                        <div class="font-black text-blue-600 text-sm">${o.total} د.م.</div>
                    </div>
                `).join('') || '<p class="text-center opacity-30 py-16 font-black text-xs">لا توجد طلبات بعد</p>'}
            </div>
        `;
    } else if (tab === 'products') {
        renderProductTab(panel);
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-xl font-black mb-6">إعدادات المتجر والإعلانات</h2>
            <div class="space-y-6 max-w-3xl">
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 space-y-4">
                        <h3 class="font-black text-xs border-b dark:border-slate-800 pb-2 mb-4">⚙️ عام</h3>
                        <div class="space-y-2">
                            <label class="text-[10px] font-bold opacity-50 px-1">اسم المتجر</label>
                            <input id="set-name" value="${state.settings.siteName}" class="w-full p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none font-bold text-xs">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-bold opacity-50 px-1">كلمة المرور</label>
                            <input id="set-pass" value="${state.settings.adminPass}" type="text" class="w-full p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none font-bold text-xs">
                        </div>
                    </div>

                    <div class="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 space-y-4">
                        <h3 class="font-black text-xs border-b dark:border-slate-800 pb-2 mb-4 text-blue-500">📊 أكواد Adsterra</h3>
                        <textarea id="set-ads" class="w-full p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl outline-none font-mono text-[9px] h-32" dir="ltr">${state.settings.adsterraCodes}</textarea>
                    </div>
                </div>

                <button onclick="saveSettings()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm shadow-lg active:scale-95 transition">حفظ وتطبيق الإعدادات ✅</button>
            </div>
        `;
    }
};

const renderProductTab = (panel: HTMLElement) => {
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-black">إدارة المخزون</h2>
            <button onclick="showEditForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black">+ إضافة منتج</button>
        </div>
        <div id="product-form-container" class="hidden mb-10"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            ${state.products.map((p: any) => `
                <div class="bg-white dark:bg-slate-900 p-3 rounded-xl border dark:border-slate-800 flex items-center gap-3 shadow-sm hover:shadow-md transition">
                    <div class="img-container"><img src="${p.image}" class="img-stable"></div>
                    <div class="flex-1">
                        <div class="font-bold text-[10px] line-clamp-1">${p.name} ${p.gallery?.length > 0 ? '🖼️' : ''}</div>
                        <div class="text-blue-600 font-black text-xs">${p.price} د.م.</div>
                    </div>
                    <div class="flex gap-1">
                        <button onclick="showEditForm('${p.id}')" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">✏️</button>
                        <button onclick="deleteProduct('${p.id}')" class="p-2 bg-red-50 text-red-500 dark:bg-red-900/20 rounded-lg text-xs">🗑️</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

(window as any).handleFileSelect = (input: HTMLInputElement, type: 'main' | 'gallery') => {
    const files = input.files;
    if (!files || files.length === 0) return;

    const processFile = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
        });
    };

    if (type === 'main') {
        processFile(files[0]).then(base64 => {
            state.tempImage = base64;
            const preview = document.getElementById('image-preview') as HTMLImageElement;
            if (preview) {
                preview.src = base64;
                preview.classList.remove('hidden');
                document.getElementById('upload-placeholder')?.classList.add('hidden');
            }
        });
    } else {
        const promises = Array.from(files).map(f => processFile(f));
        Promise.all(promises).then(images => {
            state.tempGallery = [...state.tempGallery, ...images];
            updateGalleryUI();
        });
    }
};

const updateGalleryUI = () => {
    const container = document.getElementById('gallery-grid');
    if (!container) return;
    container.innerHTML = state.tempGallery.map((img: string, idx: number) => `
        <div class="relative w-20 h-20 rounded-lg overflow-hidden border dark:border-slate-700 group shadow-sm">
            <img src="${img}" class="w-full h-full object-cover">
            <button onclick="removeFromGallery(${idx})" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[8px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity">×</button>
        </div>
    `).join('');
};

(window as any).removeFromGallery = (idx: number) => {
    state.tempGallery.splice(idx, 1);
    updateGalleryUI();
};

(window as any).showEditForm = (id?: string) => {
    const container = document.getElementById('product-form-container');
    if (!container) return;
    container.classList.remove('hidden');
    state.editingId = id || null;
    const p = id ? state.products.find((item: any) => item.id === id) : { name: '', price: '', image: '', description: '', gallery: [] };
    
    state.tempImage = p.image || null;
    state.tempGallery = [...(p.gallery || [])];

    container.innerHTML = `
        <div class="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border-2 border-blue-600/20 animate-fadeIn">
            <h3 class="font-black text-sm mb-4">${id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold opacity-50 px-1">الصورة الرئيسية للمنتج</label>
                        <div onclick="document.getElementById('main-input').click()" class="cursor-pointer w-full h-44 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800 hover:border-blue-500 transition">
                            <img id="image-preview" src="${p.image || ''}" class="w-full h-full object-cover ${p.image ? '' : 'hidden'}">
                            <div id="upload-placeholder" class="${p.image ? 'hidden' : ''} text-center">
                                <span class="text-3xl">📸</span>
                                <div class="text-[9px] font-bold mt-1 uppercase tracking-wider">الخلفية / الصورة الأولى</div>
                            </div>
                        </div>
                        <input id="main-input" type="file" accept="image/*" class="hidden" onchange="handleFileSelect(this, 'main')">
                    </div>

                    <input id="p-name" value="${p.name}" placeholder="اسم المنتج" class="w-full p-3.5 border dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 outline-none font-bold text-xs shadow-sm">
                    <input id="p-price" value="${p.price}" type="number" placeholder="السعر (د.م.)" class="w-full p-3.5 border dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 outline-none font-bold text-xs shadow-sm">
                </div>
                
                <div class="space-y-4">
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold opacity-50 px-1">المعرض (صور إضافية للمعاينة)</label>
                        <div class="flex flex-wrap gap-2 mb-2 p-3 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-800 min-h-[100px]" id="gallery-grid"></div>
                        <button onclick="document.getElementById('gallery-input').click()" class="w-full py-3 bg-slate-200 dark:bg-slate-800 text-[10px] font-black rounded-xl border-2 border-dotted border-slate-400 dark:border-slate-700 hover:bg-slate-300 transition">+ رفع صور إضافية</button>
                        <input id="gallery-input" type="file" accept="image/*" multiple class="hidden" onchange="handleFileSelect(this, 'gallery')">
                    </div>

                    <textarea id="p-desc" placeholder="أدخل وصفاً تفصيلياً للمنتج ومميزاته..." class="w-full p-3 border dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800 outline-none font-bold text-xs h-[100px] shadow-sm">${p.description || ''}</textarea>
                </div>
            </div>
            
            <div class="flex gap-2 mt-8">
                <button onclick="saveProduct()" class="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black text-xs shadow-lg active:scale-95 transition">حفظ التغييرات ✅</button>
                <button onclick="document.getElementById('product-form-container').classList.add('hidden')" class="px-8 bg-slate-200 dark:bg-slate-800 py-4 rounded-xl font-black text-xs hover:bg-slate-300 transition">إلغاء</button>
            </div>
        </div>
    `;
    updateGalleryUI();
    container.scrollIntoView({ behavior: 'smooth' });
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const description = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    const image = state.tempImage;
    const gallery = state.tempGallery;

    if (!name || !price || !image) return alert('يرجى التأكد من إدخال الاسم، السعر، والصورة الأساسية.');

    if (state.editingId) {
        const index = state.products.findIndex((p: any) => p.id === state.editingId);
        state.products[index] = { ...state.products[index], name, price: Number(price), image, description, gallery };
    } else {
        state.products.unshift({ id: Date.now().toString(), name, price: Number(price), image, description, gallery });
    }
    save();
    (window as any).switchTab('products');
};

(window as any).deleteProduct = (id: string) => {
    if(confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟')) {
        state.products = state.products.filter((p:any) => p.id !== id);
        save();
        (window as any).switchTab('products');
    }
};

(window as any).saveSettings = () => {
    const name = (document.getElementById('set-name') as HTMLInputElement).value;
    const pass = (document.getElementById('set-pass') as HTMLInputElement).value;
    const ads = (document.getElementById('set-ads') as HTMLTextAreaElement).value;
    state.settings = { ...state.settings, siteName: name, adminPass: pass, adsterraCodes: ads };
    save();
    alert('تم حفظ الإعدادات وتطبيقها بنجاح!');
    location.reload(); 
};

(window as any).login = () => {
    const val = (document.getElementById('pass') as HTMLInputElement).value;
    if (val === state.settings.adminPass) {
        state.isAdmin = true;
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else alert('❌ كلمة المرور غير صحيحة');
};

(window as any).logout = () => {
    state.isAdmin = false;
    sessionStorage.removeItem('isAdmin');
    router();
};

(window as any).buyNow = (id: string) => {
    state.activeModalProduct = null;
    state.checkoutItem = state.products.find((i: any) => i.id === id);
    window.location.hash = '#/checkout';
};

(window as any).processOrder = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const newOrder = {
        id: Date.now().toString(),
        name: formData.get('fullname'),
        city: formData.get('city'),
        phone: formData.get('phone'),
        total: state.checkoutItem.price,
        items: [state.checkoutItem.name],
        createdAt: new Date().toISOString()
    };
    state.orders.unshift(newOrder);
    save();
    window.location.hash = '#/success';
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
