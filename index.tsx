
/**
 * storehalal v8.6 - Production Ready Order Flow 🛒✅
 */

const MOROCCAN_CITIES = ["الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "مكناس", "وجدة", "تطوان", "القنيطرة", "آسفي", "تمارة", "المحمدية", "الناظور", "بني ملال", "الجديدة", "تازة", "سطات", "برشيد", "الخميسات", "العرائش", "القصر الكبير", "كلميم", "بركان"].sort();

let state: any = {
    products: [],
    orders: [],
    settings: { 
        siteName: 'storehalal', 
        adminPass: 'halal2025',
        adsterraCodes: ``
    },
    checkoutItem: null,
    lastOrder: null,
    isAdmin: false,
    currentTab: 'orders',
    activeModalProduct: null 
};

const initStore = () => {
    try {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            state.products = JSON.parse(savedProducts);
        } else {
            state.products = [
                { id: '1', name: 'آيفون 15 برو ماكس', price: 14500, description: 'أحدث هاتف من شركة آبل مع معالج A17 Pro وكاميرا احترافية.', image: 'https://picsum.photos/seed/iphone/600/400' },
                { id: '2', name: 'ساعة ذكية Ultra 9', price: 450, description: 'ساعة ذكية متطورة تدعم الاتصال وتتبع الصحة بدقة عالية.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' }
            ];
            save();
        }
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        state.lastOrder = JSON.parse(localStorage.getItem('last_order') || 'null');
        
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
        }
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
    localStorage.setItem('last_order', JSON.stringify(state.lastOrder));
};

const router = () => {
    const root = document.getElementById('app-root');
    const hash = window.location.hash || '#/';
    
    // إزالة أي مودال سابق عند تغيير الصفحة
    const oldModal = document.getElementById('modal-overlay');
    if (oldModal) oldModal.remove();

    if (hash.includes('dashboard')) document.body.classList.add('admin-mode');
    else document.body.classList.remove('admin-mode');

    let html = UI.header();
    if (hash === '#/') html += `<div class="page-enter">${UI.store()}</div>`;
    else if (hash === '#/checkout') html += `<div class="page-enter">${UI.checkout()}</div>`;
    else if (hash === '#/dashboard') {
        html += `<div class="page-enter">${UI.dashboard()}</div>`;
        // Fix: Property 'switchTab' does not exist on type 'Window'. Cast window to any.
        setTimeout(() => { if(state.isAdmin) (window as any).switchTab(state.currentTab); }, 50);
    }
    else if (hash === '#/success') html += `<div class="page-enter">${UI.success()}</div>`;
    
    if (root) root.innerHTML = html;
    
    if (state.activeModalProduct && hash === '#/') {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = UI.productModal(state.activeModalProduct);
        if (modalDiv.firstElementChild) document.body.appendChild(modalDiv.firstElementChild);
    }
};

const UI = {
    header: () => `
        <header class="sticky top-0 z-[9999] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b dark:border-slate-800 h-16 flex items-center shadow-sm">
            <nav class="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
                <a href="#/" class="flex items-center gap-2">
                    <div class="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-xl font-black shadow-lg shadow-blue-500/30">H</div>
                    <span class="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-3">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black shadow-xl hover:-translate-y-0.5 transition-all">🔐 الإدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div class="bg-slate-900 text-white py-20 px-4 text-center">
                <h1 class="text-4xl md:text-5xl font-black mb-4 tracking-tighter">${state.settings.siteName}</h1>
                <p class="opacity-50 text-xs font-bold tracking-widest uppercase">المتجر المغربي رقم 1 للتوصيل السريع 🇲🇦</p>
            </div>
            <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div onclick="openProductModal('${p.id}')" class="aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer">
                           <img src="${p.image}" class="w-full h-full object-cover">
                        </div>
                        <div class="p-5">
                            <h3 class="font-black text-xs mb-3 line-clamp-1">${p.name}</h3>
                            <div class="text-blue-600 dark:text-blue-400 font-black text-lg mb-5">${p.price} <span class="text-[10px] opacity-60">د.م.</span></div>
                            <div class="flex gap-2">
                                <button onclick="buyNow('${p.id}')" class="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-3.5 rounded-2xl text-[11px] font-black active:scale-95 transition-all">طلب سريع 🛒</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    productModal: (p: any) => `
        <div id="modal-overlay" class="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border dark:border-slate-800">
                <button onclick="closeProductModal()" class="absolute top-6 right-6 z-50 bg-white dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center text-2xl">✕</button>
                <div class="w-full md:w-3/5 h-[40vh] md:h-auto"><img src="${p.image}" class="w-full h-full object-cover"></div>
                <div class="w-full md:w-2/5 p-10 overflow-y-auto">
                    <h2 class="text-3xl font-black mb-2">${p.name}</h2>
                    <div class="text-4xl font-black text-blue-600 mb-6">${p.price} د.م.</div>
                    <p class="text-slate-500 text-sm mb-10">${p.description || 'وصف المنتج غير متوفر.'}</p>
                    <button onclick="buyNow('${p.id}')" class="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl active:scale-95 transition-all">اطلب الآن</button>
                </div>
            </div>
        </div>
    `,
    checkout: () => {
        if (!state.checkoutItem) { setTimeout(() => window.location.hash = '#/', 10); return '<div>جارِ التوجيه...</div>'; }
        return `
        <div class="max-w-md mx-auto py-12 px-4">
            <div class="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border dark:border-slate-800">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-black">إتمام الطلب</h2>
                    <p class="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-widest">املأ معلوماتك للتوصيل</p>
                </div>
                <div class="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-4">
                   <div class="w-12 h-12 rounded-xl overflow-hidden"><img src="${state.checkoutItem.image}" class="w-full h-full object-cover"></div>
                   <div><div class="text-[10px] font-black opacity-50 uppercase">${state.checkoutItem.name}</div><div class="text-blue-600 font-black">${state.checkoutItem.price} د.م.</div></div>
                </div>
                <form id="main-order-form" onsubmit="event.preventDefault(); processOrder(this);" class="space-y-4">
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase mr-1">الاسم</label>
                        <input name="fullname" type="text" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-sm transition-all">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase mr-1">المدينة</label>
                        <select name="city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-sm appearance-none transition-all">
                            <option value="" disabled selected></option>
                            ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase mr-1">الهاتف</label>
                        <input name="phone" type="tel" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-right font-black transition-all" dir="ltr">
                    </div>
                    <button id="order-submit-btn" type="submit" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-6">تأكيد الشراء الآن ✅</button>
                </form>
            </div>
        </div>
        `;
    },
    success: () => {
        const order = state.lastOrder || (state.orders.length > 0 ? state.orders[0] : null);
        if (!order) { setTimeout(() => window.location.hash = '#/', 10); return '<div>جارِ التوجيه...</div>'; }
        return `
        <div class="max-w-md mx-auto py-24 text-center px-4">
            <div class="w-24 h-24 bg-green-500/10 text-green-500 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto mb-8">🎉</div>
            <h1 class="text-3xl font-black mb-4 uppercase">تم الشراء بنجاح!</h1>
            <p class="text-slate-500 text-sm mb-8 px-6">شكراً لك يا <span class="text-blue-600 font-black">${order.name}</span>. تم استلام طلبك لـ <span class="font-bold">${order.items[0]}</span> وسنتصل بك قريباً.</p>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 mb-10 text-right space-y-4 shadow-sm">
                <div class="flex justify-between text-xs border-b dark:border-slate-800 pb-3"><span class="opacity-50 font-black uppercase">رقم الطلب:</span> <span class="font-black">#${order.id.slice(-6)}</span></div>
                <div class="flex justify-between text-xs border-b dark:border-slate-800 pb-3"><span class="opacity-50 font-black uppercase">المدينة:</span> <span class="font-black">${order.city}</span></div>
                <div class="flex justify-between text-xs border-b dark:border-slate-800 pb-3"><span class="opacity-50 font-black uppercase">الهاتف:</span> <span class="font-black text-blue-600" dir="ltr">${order.phone}</span></div>
                <div class="flex justify-between text-sm pt-1"><span class="opacity-50 font-black uppercase">المجموع:</span> <span class="font-black text-blue-600 text-lg">${order.total} د.م.</span></div>
            </div>
            <a href="#/" class="inline-block w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-3xl font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all">العودة للمتجر</a>
        </div>
        `;
    },
    dashboard: () => {
        if (!state.isAdmin) return `<div class="max-w-sm mx-auto py-32 px-4"><div class="bg-white dark:bg-slate-900 p-12 rounded-[3rem] text-center shadow-2xl"><h2 class="text-2xl font-black mb-8">دخول المسؤول</h2><input id="pass" type="password" class="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center font-black mb-6 outline-none"><button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black">فتح النظام</button></div></div>`;
        return `
            <div class="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
                <aside class="w-full md:w-72 bg-slate-900 text-white flex md:flex-col p-4 gap-2">
                    <button onclick="switchTab('orders')" class="nav-btn p-4 rounded-2xl font-black text-xs text-right hover:bg-white/5 transition-all">📦 إدارة الطلبات</button>
                    <button onclick="logout()" class="p-4 bg-red-500/10 text-red-400 font-black rounded-2xl text-[10px] mt-auto">خروج</button>
                </aside>
                <main class="flex-1 p-8 md:p-12"><div id="dash-panel"></div></main>
            </div>
        `;
    }
};

// Fix: Property 'processOrder' does not exist on type 'Window'. Cast window to any.
(window as any).processOrder = (form: any) => {
    // Fix: Property 'disabled' does not exist on type 'HTMLElement'. Cast to HTMLButtonElement.
    const submitBtn = document.getElementById('order-submit-btn') as HTMLButtonElement | null;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "جارِ الحفظ...";
    }

    try {
        const fullname = (form.querySelector('[name="fullname"]') as HTMLInputElement).value;
        const city = (form.querySelector('[name="city"]') as HTMLSelectElement).value;
        const phone = (form.querySelector('[name="phone"]') as HTMLInputElement).value;

        if (!fullname || !city || !phone) {
            alert("يرجى ملء جميع الحقول");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "تأكيد الشراء الآن ✅";
            }
            return;
        }

        const newOrder = { 
            id: Date.now().toString(), 
            name: fullname, 
            city: city, 
            phone: phone, 
            total: state.checkoutItem.price, 
            items: [state.checkoutItem.name], 
            createdAt: new Date().toISOString() 
        };
        
        state.orders.unshift(newOrder);
        state.lastOrder = newOrder;
        save(); 

        // توجيه مضمون لصفحة النجاح
        setTimeout(() => {
            window.location.hash = '#/success';
        }, 100);

    } catch (e) {
        console.error(e);
        alert("حدث خطأ، يرجى إعادة المحاولة");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "تأكيد الشراء الآن ✅";
        }
    }
};

// Fix: Property 'switchTab' does not exist on type 'Window'. Cast window to any.
(window as any).switchTab = (tab: any) => {
    state.currentTab = tab;
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'orders') {
        const ordersHtml = state.orders.map((o: any) => `
            <tr class="text-sm font-bold border-b dark:border-slate-800">
                <td class="p-6">${o.name}</td>
                <td class="p-6 opacity-50">${o.city}</td>
                <td class="p-6 text-blue-600 font-black" dir="ltr">${o.phone}</td>
                <td class="p-6">${o.total} د.م.</td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="p-20 text-center opacity-30 font-black">لا توجد طلبات واردة حالياً</td></tr>';

        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-8">الطلبات الواردة (${state.orders.length})</h2>
            <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border dark:border-slate-800">
                <table class="w-full text-right">
                    <thead class="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black opacity-50 uppercase">
                        <tr><th class="p-6">الزبون</th><th class="p-6">المدينة</th><th class="p-6">الهاتف</th><th class="p-6">المجموع</th></tr>
                    </thead>
                    <tbody class="divide-y dark:divide-slate-800">${ordersHtml}</tbody>
                </table>
            </div>`;
    }
};

// Fix: Property 'buyNow' does not exist on type 'Window'. Cast window to any.
(window as any).buyNow = (id: any) => { 
    state.activeModalProduct = null; 
    state.checkoutItem = state.products.find((i: any) => i.id === id); 
    window.location.hash = '#/checkout'; 
};

// Fix: Property 'login' does not exist on type 'Window'. Cast window to any.
(window as any).login = () => { 
    // Fix: Property 'value' does not exist on type 'HTMLElement'. Cast to HTMLInputElement.
    const passInput = document.getElementById('pass') as HTMLInputElement | null;
    if (passInput && passInput.value === state.settings.adminPass) { 
        state.isAdmin = true; 
        sessionStorage.setItem('isAdmin', 'true'); 
        router(); 
    } else alert('كلمة مرور خاطئة');
};

// Fix: Property 'logout' does not exist on type 'Window'. Cast window to any.
(window as any).logout = () => { 
    state.isAdmin = false; 
    sessionStorage.removeItem('isAdmin'); 
    router(); 
};

// Fix: Property 'openProductModal' does not exist on type 'Window'. Cast window to any.
(window as any).openProductModal = (id: any) => { 
    state.activeModalProduct = state.products.find((p: any) => p.id === id); 
    router(); 
};

// Fix: Property 'closeProductModal' does not exist on type 'Window'. Cast window to any.
(window as any).closeProductModal = () => { 
    state.activeModalProduct = null; 
    router(); 
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
