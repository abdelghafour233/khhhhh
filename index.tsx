
/**
 * storehalal v6.7 - Final Stability Version 🚀🇲🇦
 * تم التحديث: إصلاح نهائي للإعلانات في الدومين المدفوع عبر تعطيل Rocket Loader يدوياً + أزرار التواصل.
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

let state: any = {
    products: [],
    orders: [],
    settings: { siteName: 'storehalal', adminPass: 'halal2025' },
    checkoutItem: null,
    isAdmin: false
};

const initStore = () => {
    try {
        state.products = JSON.parse(localStorage.getItem('products') || JSON.stringify([
            { id: '1', name: 'آيفون 15 برو ماكس', price: 14500, stock: 5, image: 'https://picsum.photos/seed/iphone/600/400' },
            { id: '2', name: 'ساعة ذكية Ultra Series 9', price: 450, stock: 12, image: FALLBACK_IMAGES.watch }
        ]));
        state.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        state.settings = { ...state.settings, ...JSON.parse(localStorage.getItem('settings') || '{}') };
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

// --- وظائف المشاركة ---
(window as any).shareAction = (platform: string, productId?: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = productId ? `${baseUrl}#/product/${productId}` : baseUrl;
    const p = productId ? state.products.find((i: any) => i.id === productId) : null;
    const title = p ? p.name : state.settings.siteName;
    const text = `أعجبني هذا العرض في متجر ${state.settings.siteName}:\n\n*${title}*\n\nرابط المنتج:\n${shareUrl}`;

    let url = '';
    if (platform === 'whatsapp') url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    else if (platform === 'facebook') url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
};

(window as any).buyNow = (id: string) => {
    state.checkoutItem = state.products.find((i: any) => i.id === id);
    window.location.hash = '#/checkout';
};

(window as any).login = () => {
    const val = (document.getElementById('pass') as HTMLInputElement).value;
    if (val === state.settings.adminPass) {
        state.isAdmin = true;
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else alert('كلمة السر خاطئة!');
};

(window as any).logout = () => {
    state.isAdmin = false;
    sessionStorage.removeItem('isAdmin');
    router();
};

const UI = {
    header: () => `
        <header class="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b dark:border-slate-800">
            <nav class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <a href="#/" class="flex items-center gap-2">
                    <div class="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-xl font-black">S</div>
                    <span class="text-xl font-black">${state.settings.siteName}</span>
                </a>
                <div class="flex items-center gap-3">
                    <button onclick="document.documentElement.classList.toggle('dark')" class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">🌓</button>
                    <a href="#/dashboard" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black">🔐 إدارة</a>
                </div>
            </nav>
        </header>
    `,
    store: () => `
        <div class="animate-fadeIn">
            <div class="bg-slate-900 text-white py-16 px-4 text-center">
                <h1 class="text-4xl font-black mb-4">${state.settings.siteName}</h1>
                <p class="opacity-60 text-sm mb-8">الدفع عند الاستلام - توصيل سريع لكل المغرب 🇲🇦</p>
            </div>
            <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border dark:border-slate-800 shadow-sm flex flex-col group transition hover:shadow-2xl">
                        <img src="${p.image}" class="w-full aspect-square object-cover group-hover:scale-105 transition duration-500">
                        <div class="p-5 flex flex-col flex-1">
                            <h3 class="font-black text-sm mb-2">${p.name}</h3>
                            <div class="text-blue-600 font-black text-lg mb-4">${p.price} د.م.</div>
                            <div class="mt-auto space-y-4">
                                <button onclick="buyNow('${p.id}')" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl text-xs font-black active:scale-95 transition shadow-lg">🛒 اطلب الآن</button>
                                <!-- أزرار المشاركة تحت الشراء -->
                                <div class="flex gap-4 justify-center pt-3 border-t dark:border-slate-800">
                                    <button onclick="shareAction('whatsapp', '${p.id}')" class="text-[#25D366] hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-5 h-5"></button>
                                    <button onclick="shareAction('facebook', '${p.id}')" class="text-[#1877F2] hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-5 h-5"></button>
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
                <h2 class="text-2xl font-black mb-8 text-center">تأكيد طلبك 🚚</h2>
                <div class="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center gap-4">
                   <img src="${state.checkoutItem.image}" class="w-16 h-16 rounded-2xl object-cover shadow-md">
                   <div>
                       <div class="text-xs font-bold opacity-50 mb-1">${state.checkoutItem.name}</div>
                       <div class="text-blue-600 font-black text-xl">${state.checkoutItem.price} د.م.</div>
                   </div>
                </div>
                <form onsubmit="event.preventDefault(); window.location.hash='#/success';" class="space-y-4">
                    <input id="order-name" type="text" placeholder="الاسم الكامل" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none font-bold">
                    <select id="order-city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none font-bold">
                        <option value="" disabled selected>اختر المدينة</option>
                        ${MOROCCAN_CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <input id="order-phone" type="tel" placeholder="رقم الهاتف" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none text-right font-black" dir="ltr">
                    <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition">إرسال الطلب ✅</button>
                    <!-- أزرار المشاركة تحت إرسال الطلب -->
                    <div class="mt-10 pt-8 border-t dark:border-slate-800 text-center">
                        <p class="text-[10px] font-black text-slate-400 mb-5">تواصل معنا عبر الشبكات الاجتماعية</p>
                        <div class="flex gap-4">
                            <button type="button" onclick="shareAction('whatsapp')" class="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl text-xs font-black shadow-lg">واتساب</button>
                            <button type="button" onclick="shareAction('facebook')" class="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-4 rounded-2xl text-xs font-black shadow-lg">فيسبوك</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};

const router = () => {
    const root = document.getElementById('app-root');
    const hash = window.location.hash || '#/';
    let html = UI.header();
    
    if (hash === '#/') html += UI.store();
    else if (hash === '#/checkout') html += UI.checkout();
    else if (hash === '#/success') html += `
        <div class="max-w-md mx-auto py-32 text-center px-4 animate-fadeIn">
            <h1 class="text-4xl font-black mb-4">شكراً لك!</h1>
            <p class="text-slate-500 mb-12 font-bold px-4">سنتصل بك قريباً لتأكيد طلبك 🇲🇦</p>
            <div class="px-8"><a href="#/" class="inline-block w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl">العودة للمتجر</a></div>
        </div>
    `;
    
    root!.innerHTML = html;
    
    const footer = document.getElementById('dynamic-footer');
    if (footer) footer.innerHTML = `
        <footer class="bg-slate-950 text-white py-16 px-6 text-center border-t border-white/5">
            <div class="text-2xl font-black text-blue-500 mb-3">${state.settings.siteName}</div>
            <p class="text-slate-500 font-bold text-xs mb-10 opacity-70">دفع عند الاستلام - توصيل لكل المغرب 🇲🇦</p>
            <div class="text-slate-800 text-[9px] font-mono tracking-widest uppercase">© 2025 ${state.settings.siteName} - Stable v6.7</div>
        </footer>
    `;
};

window.addEventListener('load', () => { initStore(); router(); });
window.addEventListener('hashchange', router);
