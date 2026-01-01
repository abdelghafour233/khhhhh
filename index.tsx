
/**
 * storehalal v8.0 - Professional Checkout & Order Success System 🛒✅
 */

const MOROCCAN_CITIES = ["الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "مكناس", "وجدة", "تطوان", "القنيطرة", "آسفي", "تمارة", "المحمدية", "الناظور", "بني ملال", "الجديدة", "تازة", "سطات", "برشيد", "الخميسات", "العرائش", "القصر الكبير", "كلميم", "بركان"].sort();

let state: any = {
    products: [],
    orders: [],
    settings: { 
        siteName: 'storehalal', 
        adminPass: 'halal2025',
        adsterraCodes: `<!-- Adsterra Codes -->
<script type='text/javascript' src='https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js'></script>
<script type='text/javascript' src='https://bouncingbuzz.com/15/38/5b/15385b7c751e6c7d59d59fb7f34e2934.js'></script>`
    },
    checkoutItem: null,
    lastOrder: null, // لتخزين آخر طلب وعرضه في صفحة النجاح
    isAdmin: false,
    currentTab: 'orders',
    editingId: null,
    tempImage: null,
    tempGallery: [],
    activeModalProduct: null 
};

const injectAds = () => {
    document.querySelectorAll('.adsterra-dynamic-script').forEach(el => el.remove());
    const hash = window.location.hash;
    if (hash.includes('dashboard') || hash.includes('checkout') || hash.includes('success')) return;

    const adSlot = document.getElementById('ad-placement-slot');
    if (!adSlot) return;

    const div = document.createElement('div');
    div.className = 'adsterra-dynamic-script';
    div.innerHTML = state.settings.adsterraCodes;
    
    const scripts = div.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        adSlot.appendChild(newScript);
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
    
    if (state.activeModalProduct) {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = UI.productModal(state.activeModalProduct);
        document.body.appendChild(modalDiv.firstElementChild!);
    }
    
    injectAds();
};

const UI = {
    header: () => `
        <header class="sticky top-0 z-[9999999] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b dark:border-slate-800 h-16 flex items-center shadow-sm">
            <nav class="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
                <a href="#/" class="flex items-center gap-2">
                    <div class="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-xl font-black shadow-lg shadow-blue-500/30">H</div>
                    <span class="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-3">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">🌓</button>
                    <div class="relative z-[99999999]">
                        <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all block">🔐 الإدارة</a>
                    </div>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div class="bg-slate-900 text-white py-20 px-4 text-center relative overflow-hidden">
                <div class="absolute inset-0 opacity-10 pointer-events-none">
                    <div class="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
                    <div class="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]"></div>
                </div>
                <h1 class="text-4xl md:text-5xl font-black mb-4 tracking-tighter relative z-10">${state.settings.siteName}</h1>
                <p class="opacity-50 text-xs font-bold tracking-widest uppercase relative z-10">المتجر المغربي رقم 1 للتوصيل السريع 🇲🇦</p>
            </div>
            
            <div id="ad-placement-slot" class="max-w-7xl mx-auto px-4 py-4 empty:hidden flex justify-center"></div>

            <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                        <div onclick="openProductModal('${p.id}')" class="aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative cursor-pointer">
                           <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                        </div>
                        <div class="p-5 flex flex-col flex-1">
                            <h3 class="font-black text-xs mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">${p.name}</h3>
                            <div class="text-blue-600 dark:text-blue-400 font-black text-lg mb-5">${p.price} <span class="text-[10px] opacity-60">د.م.</span></div>
                            <div class="flex gap-2">
                                <button onclick="buyNow('${p.id}')" class="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-3.5 rounded-2xl text-[11px] font-black active:scale-95 transition-all shadow-lg hover:shadow-blue-500/20">طلب سريع 🛒</button>
                                <button onclick="openProductModal('${p.id}')" class="w-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors text-lg">👁️</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    productModal: (p: any) => `
        <div id="modal-overlay" class="fixed inset-0 z-[1000000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div class="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border dark:border-slate-800">
                <button onclick="closeProductModal()" class="absolute top-6 right-6 z-50 bg-white dark:bg-slate-800 w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform">✕</button>
                <div class="w-full md:w-3/5 h-[40vh] md:h-auto bg-slate-100 dark:bg-slate-800 relative overflow-hidden group">
                    <div id="modal-gallery-main" class="w-full h-full">
                        <img src="${p.image}" class="w-full h-full object-cover animate-fadeIn">
                    </div>
                </div>
                <div class="w-full md:w-2/5 p-10 overflow-y-auto bg-white dark:bg-slate-900">
                    <div class="mb-8">
                        <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">منتج أصلي 💯</span>
                        <h2 class="text-3xl font-black mt-4 mb-2 leading-tight">${p.name}</h2>
                        <div class="text-4xl font-black text-blue-600">${p.price} <span class="text-sm opacity-50 font-bold uppercase">د.م.</span></div>
                    </div>
                    <div class="prose dark:prose-invert mb-10">
                        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">${p.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}</p>
                    </div>
                    <div class="space-y-4 pt-6 border-t dark:border-slate-800">
                        <button onclick="buyNow('${p.id}')" class="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all">اطلب الآن - الدفع عند الاستلام</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    dashboard: () => {
        if (!state.isAdmin) return `
            <div class="max-w-sm mx-auto py-32 px-4">
                <div class="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border dark:border-slate-800 text-center shadow-2xl">
                    <div class="w-20 h-20 bg-blue-600/10 text-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8">🔐</div>
                    <h2 class="text-2xl font-black mb-8">دخول المسؤول</h2>
                    <div class="relative mb-6">
                        <input id="pass" type="password" placeholder="كلمة المرور" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 dark:border-slate-800 rounded-2xl text-center outline-none font-black transition-all">
                    </div>
                    <button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:shadow-blue-500/30 active:scale-95 transition-all">فتح النظام</button>
                </div>
            </div>
        `;

        return `
            <div class="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-72 bg-slate-900 text-white flex md:flex-col border-b md:border-b-0 border-white/10 z-[100] sticky top-0 md:h-screen">
                    <div class="p-8 hidden md:block border-b border-white/5 mb-6">
                        <div class="flex items-center gap-3">
                            <div class="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-black">S</div>
                            <div class="text-white font-black text-lg tracking-tighter uppercase">STORE CORE</div>
                        </div>
                    </div>
                    <div class="flex flex-1 md:flex-col p-4 gap-2 overflow-x-auto md:overflow-x-visible">
                        <button onclick="switchTab('orders')" class="nav-btn group flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-xs whitespace-nowrap ${state.currentTab === 'orders' ? 'active-nav' : 'text-slate-400 hover:text-white hover:bg-white/5'}">📦 إدارة الطلبات</button>
                        <button onclick="switchTab('products')" class="nav-btn group flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-xs whitespace-nowrap ${state.currentTab === 'products' ? 'active-nav' : 'text-slate-400 hover:text-white hover:bg-white/5'}">🛍️ مستودع المنتجات</button>
                        <button onclick="switchTab('settings')" class="nav-btn group flex items-center gap-4 p-4 rounded-2xl transition-all font-black text-xs whitespace-nowrap ${state.currentTab === 'settings' ? 'active-nav' : 'text-slate-400 hover:text-white hover:bg-white/5'}">⚙️ إعدادات المنصة</button>
                    </div>
                    <div class="p-6 mt-auto border-t border-white/5 hidden md:block">
                        <button onclick="logout()" class="w-full p-4 bg-red-500/10 text-red-400 font-black rounded-2xl text-[10px] hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">خروج آمن</button>
                    </div>
                </aside>

                <main class="flex-1 overflow-y-auto">
                    <header class="bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-8 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 class="text-3xl font-black text-slate-900 dark:text-white" id="dash-title">لوحة التحكم</h1>
                        </div>
                        <div id="stats-header-box" class="flex items-center gap-4"></div>
                    </header>
                    <div id="dash-panel" class="p-8 md:p-12 max-w-7xl mx-auto"></div>
                </main>
            </div>
            <style>
               .active-nav { background: #2563eb; color: white; box-shadow: 0 10px 25px -5px rgba(37,99,235,0.4); transform: translateX(-5px); }
               .nav-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
               .admin-mode [class*="adsterra"], .admin-mode iframe, .admin-mode [id*="at-cv"] { display: none !important; pointer-events: none !important; }
            </style>
        `;
    },
    checkout: () => `
        <div class="max-w-md mx-auto py-12 px-4">
            <div class="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border dark:border-slate-800 animate-fadeIn">
                <div class="text-center mb-8">
                    <div class="inline-flex bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-4 rounded-3xl mb-4">🛒</div>
                    <h2 class="text-2xl font-black tracking-tight">إعداد طلبية جديدة</h2>
                    <p class="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-widest">املأ معلوماتك للتوصيل</p>
                </div>

                <div class="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-4 border dark:border-slate-800">
                   <div class="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0"><img src="${state.checkoutItem.image}" class="w-full h-full object-cover"></div>
                   <div class="min-w-0">
                       <div class="text-[10px] font-black text-slate-400 uppercase truncate">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black text-sm">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>

                <form onsubmit="event.preventDefault(); (window as any).processOrder(this);" class="space-y-4">
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-slate-400 uppercase mr-1">الاسم الكامل</label>
                        <div class="relative">
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">👤</span>
                            <input name="fullname" type="text" placeholder="مثال: أحمد العلوي" required class="w-full p-4 pr-11 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-sm transition-all">
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-slate-400 uppercase mr-1">المدينة</label>
                        <div class="relative">
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">📍</span>
                            <select name="city" required class="w-full p-4 pr-11 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-sm appearance-none transition-all">
                                <option value="" disabled selected>اختر مدينتك</option>
                                ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-slate-400 uppercase mr-1">رقم الهاتف (واتساب)</label>
                        <div class="relative">
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">📞</span>
                            <input name="phone" type="tel" placeholder="06XX-XXXXXX" required class="w-full p-4 pr-11 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-right font-black transition-all" dir="ltr">
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-6">تأكيد الشراء الآن ✅</button>
                    <p class="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest pt-2">الدفع عند الاستلام متاح حالياً 🇲🇦</p>
                </form>
            </div>
        </div>
    `,
    success: () => `
        <div class="max-w-md mx-auto py-24 text-center px-4 animate-fadeIn">
            <div class="w-24 h-24 bg-green-500/10 text-green-500 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto mb-8">🎉</div>
            <h1 class="text-3xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">تم الشراء بنجاح!</h1>
            <p class="text-slate-500 text-sm mb-8 font-medium leading-relaxed px-6">شكراً لك يا <span class="text-blue-600 font-black">${state.lastOrder?.name}</span> على ثقتك بنا. لقد استلمنا طلبك لـ <span class="font-bold text-slate-800 dark:text-slate-200">${state.lastOrder?.items[0]}</span> بنجاح.</p>
            
            <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 mb-10 text-right space-y-3 shadow-sm">
                <div class="flex justify-between text-xs border-b dark:border-slate-800 pb-2"><span class="text-slate-400 font-bold uppercase">رقم الطلب:</span> <span class="font-black">#${state.lastOrder?.id.slice(-6)}</span></div>
                <div class="flex justify-between text-xs border-b dark:border-slate-800 pb-2"><span class="text-slate-400 font-bold uppercase">المدينة:</span> <span class="font-black">${state.lastOrder?.city}</span></div>
                <div class="flex justify-between text-xs"><span class="text-slate-400 font-bold uppercase">المجموع:</span> <span class="font-black text-blue-600">${state.lastOrder?.total} د.م.</span></div>
            </div>

            <p class="text-[11px] text-slate-400 font-bold mb-10">سنتصل بك قريباً على الرقم <span dir="ltr">${state.lastOrder?.phone}</span> لتأكيد الشحن.</p>
            
            <a href="#/" class="inline-block w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-3xl font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all">العودة للمتجر الرئيسي</a>
        </div>
    `
};

(window as any).switchTab = (tab: string) => {
    state.currentTab = tab;
    state.editingId = null;
    const panel = document.getElementById('dash-panel');
    const title = document.getElementById('dash-title');
    const statsBox = document.getElementById('stats-header-box');
    if (!panel || !title || !statsBox) return;

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active-nav');
        if (btn.getAttribute('onclick')?.includes(tab)) btn.classList.add('active-nav');
    });

    const totalRevenue = state.orders.reduce((acc:any, o:any) => acc + (Number(o.total) || 0), 0);
    statsBox.innerHTML = `<div class="bg-blue-600/10 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">الإيرادات: ${totalRevenue} د.م.</div>`;

    if (tab === 'orders') {
        title.innerText = "إدارة الطلبيات";
        panel.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-[3rem] border dark:border-slate-800 overflow-hidden shadow-sm">
                <div class="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 class="font-black text-xs uppercase tracking-widest">آخر الطلبات (الاسم - المدينة - الهاتف)</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-right">
                        <thead>
                            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-800">
                                <th class="p-6">الزبون</th>
                                <th class="p-6">المدينة</th>
                                <th class="p-6">الهاتف</th>
                                <th class="p-6">المنتج والمبلغ</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y dark:divide-slate-800">
                            ${state.orders.map((o: any) => `
                                <tr class="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                    <td class="p-6 font-black text-xs text-slate-900 dark:text-white">${o.name}</td>
                                    <td class="p-6 font-bold text-[10px] text-slate-500 uppercase">${o.city}</td>
                                    <td class="p-6 font-black text-xs text-blue-600" dir="ltr">${o.phone}</td>
                                    <td class="p-6">
                                        <div class="text-[10px] font-bold text-slate-400 truncate max-w-[120px] mb-1">${o.items[0]}</div>
                                        <div class="font-black text-xs">${o.total} د.م.</div>
                                    </td>
                                </tr>
                            `).join('') || `<tr><td colspan="4" class="p-24 text-center opacity-30 font-black text-xs uppercase tracking-[0.3em]">لا يوجد طلبات بعد</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (tab === 'products') {
        title.innerText = "إدارة المنتجات";
        renderProductTab(panel);
    } else if (tab === 'settings') {
        title.innerText = "الإعدادات العامة";
        panel.innerHTML = `
            <div class="max-w-xl space-y-6">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm space-y-6">
                    <div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">اسم الموقع</label><input id="set-name" value="${state.settings.siteName}" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-black text-xs transition-all"></div>
                    <div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">كلمة المرور</label><input id="set-pass" value="${state.settings.adminPass}" type="text" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-black text-xs transition-all"></div>
                    <button onclick="saveSettings()" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all">حفظ التغييرات ✅</button>
                </div>
            </div>
        `;
    }
};

const renderProductTab = (panel: HTMLElement) => {
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <div class="font-black text-sm uppercase tracking-tighter">المخزون (${state.products.length})</div>
            <button onclick="showEditForm()" class="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black shadow-lg">+ إضافة صنف</button>
        </div>
        <div id="product-form-container" class="hidden mb-12"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${state.products.map((p: any) => `
                <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border dark:border-slate-800 flex items-center gap-4 shadow-sm group">
                    <div class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"><img src="${p.image}" class="w-full h-full object-cover"></div>
                    <div class="flex-1 min-w-0"><div class="font-black text-xs truncate">${p.name}</div><div class="text-blue-600 font-black text-sm">${p.price} د.م.</div></div>
                    <div class="flex gap-1"><button onclick="showEditForm('${p.id}')" class="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] hover:bg-blue-600 hover:text-white transition-colors">✏️</button></div>
                </div>
            `).join('')}
        </div>
    `;
};

(window as any).showEditForm = (id?: string) => {
    const container = document.getElementById('product-form-container');
    if (!container) return;
    container.classList.remove('hidden');
    const p = id ? state.products.find((item: any) => item.id === id) : { name: '', price: '', image: '', description: '' };
    state.editingId = id || null;
    state.tempImage = p.image || null;
    container.innerHTML = `
        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-blue-600/10 shadow-sm animate-fadeIn">
            <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-4">
                    <input id="p-name" value="${p.name}" placeholder="اسم المنتج" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none font-black text-xs">
                    <input id="p-price" value="${p.price}" type="number" placeholder="السعر" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none font-black text-xs">
                </div>
                <div class="space-y-4">
                    <input id="p-image" value="${p.image}" placeholder="رابط الصورة" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none font-black text-xs">
                    <textarea id="p-desc" placeholder="وصف سريع..." class="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl outline-none font-black text-xs h-[80px]">${p.description || ''}</textarea>
                </div>
            </div>
            <div class="flex gap-3 mt-8"><button onclick="saveProduct()" class="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-xl transition-all">حفظ المنتج ✅</button><button onclick="document.getElementById('product-form-container').classList.add('hidden')" class="px-8 bg-slate-100 dark:bg-slate-800 text-slate-500 py-4 rounded-2xl font-black text-xs">إلغاء</button></div>
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth' });
};

(window as any).saveProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const image = (document.getElementById('p-image') as HTMLInputElement).value;
    const description = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    if (!name || !price || !image) return alert('المرجو ملء جميع الحقول');
    if (state.editingId) {
        const index = state.products.findIndex((p: any) => p.id === state.editingId);
        state.products[index] = { ...state.products[index], name, price: Number(price), image, description };
    } else {
        state.products.unshift({ id: Date.now().toString(), name, price: Number(price), image, description, gallery: [] });
    }
    save(); (window as any).switchTab('products');
};

(window as any).saveSettings = () => {
    const name = (document.getElementById('set-name') as HTMLInputElement).value;
    const pass = (document.getElementById('set-pass') as HTMLInputElement).value;
    state.settings = { ...state.settings, siteName: name, adminPass: pass };
    save(); alert('تم الحفظ!'); location.reload();
};

(window as any).login = () => { const val = (document.getElementById('pass') as HTMLInputElement).value; if (val === state.settings.adminPass) { state.isAdmin = true; sessionStorage.setItem('isAdmin', 'true'); router(); } else alert('خطأ!'); };
(window as any).logout = () => { state.isAdmin = false; sessionStorage.removeItem('isAdmin'); router(); };
(window as any).buyNow = (id: string) => { state.activeModalProduct = null; state.checkoutItem = state.products.find((i: any) => i.id === id); window.location.hash = '#/checkout'; };

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
    state.lastOrder = newOrder; // حفظ آخر طلب لعرضه في صفحة النجاح
    save(); 
    window.location.hash = '#/success';
};

(window as any).openProductModal = (id: string) => { state.activeModalProduct = state.products.find((p: any) => p.id === id); router(); };
(window as any).closeProductModal = () => { state.activeModalProduct = null; document.getElementById('modal-overlay')?.remove(); };

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
