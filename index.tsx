
/**
 * Elite Store - Premium Vanilla JS Version
 * Professional E-commerce for Morocco
 */

// --- Constants ---
const MOROCCAN_CITIES = [
    "الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أكادير", "وجدة", "مكناس", "قنيطرة",
    "تطوان", "تمارة", "سلا", "العيون", "الداخلة", "بني ملال", "خريبكة", "الجديدة", "الناظور",
    "آسفي", "المحمدية", "سطات", "برشيد", "تارودانت", "كلميم", "الرشيدية"
];

const INITIAL_PRODUCTS = [
    { id: '1', name: 'آيفون 15 برو ماكس', description: 'أحدث هاتف من شركة آبل مع معالج A17 Pro وكاميرا احترافية.', price: 14500, category: 'إلكترونيات', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800' },
    { id: '2', name: 'صانعة قهوة إسبريسو', description: 'ماكينة احترافية لتحضير القهوة في المنزل بجودة المقاهي.', price: 2200, category: 'منزل', image: 'https://images.unsplash.com/photo-1513267048258-f721f35418f1?auto=format&fit=crop&q=80&w=800' },
    { id: '3', name: 'مرسيدس بنز G-Class 2024', description: 'سيارة الدفع الرباعي الفاخرة، قوة وأناقة على جميع الطرقات.', price: 2500000, category: 'سيارات', image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800' }
];

const INITIAL_SETTINGS = {
    fbPixel: '',
    googleAnalytics: '',
    tiktokPixel: '',
    googleSheetsUrl: '',
    domain: 'myshop.com',
    nameServer: 'ns1.hosting.com',
    shippingFee: 30,
    currency: 'د.م.',
    dashPassword: '1234',
    whatsappNumber: '0649075664'
};

// --- App State ---
let state = {
    products: JSON.parse(localStorage.getItem('products') || 'null') || INITIAL_PRODUCTS,
    orders: JSON.parse(localStorage.getItem('orders') || '[]'),
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || 'null') || INITIAL_SETTINGS,
    directBuyProduct: null as any,
    isAuthenticated: false
};

// --- Utilities ---
const saveState = () => {
    localStorage.setItem('products', JSON.stringify(state.products));
    localStorage.setItem('orders', JSON.stringify(state.orders));
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('settings', JSON.stringify(state.settings));
    updateCartUI();
};

const updateCartUI = () => {
    const countEl = document.getElementById('cart-count');
    const totalCount = state.cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    if (countEl) {
        countEl.innerText = totalCount.toString();
        countEl.classList.toggle('hidden', totalCount === 0);
    }
};

const injectPixels = () => {
    document.querySelectorAll('.tracking-pixel').forEach(el => el.remove());
    const { fbPixel } = state.settings;
    if (fbPixel) {
        const script = document.createElement('script');
        script.className = 'tracking-pixel';
        script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${fbPixel}');fbq('track', 'PageView');`;
        document.head.appendChild(script);
    }
};

// --- Helper Functions ---
(window as any).togglePassword = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
};

// --- Components ---
const renderWhatsAppButton = () => `
    <a href="https://wa.me/212${state.settings.whatsappNumber.startsWith('0') ? state.settings.whatsappNumber.substring(1) : state.settings.whatsappNumber}" target="_blank" class="fixed bottom-8 left-8 z-[100] bg-green-500 text-white p-5 rounded-full shadow-[0_10px_25px_rgba(34,197,94,0.4)] hover:bg-green-600 transition duration-300 transform hover:scale-110 flex items-center justify-center animate-bounce" title="تواصل معنا عبر واتساب">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
    </a>
`;

const renderDashboardLogin = () => `
    <div class="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
        <div class="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border w-full max-w-md space-y-8 animate-fadeIn">
            <div class="text-center space-y-4">
                <div class="text-7xl">⚡</div>
                <h1 class="text-4xl font-black text-gray-900">نظام الإدارة</h1>
                <p class="text-gray-400 font-medium">أدخل كلمة المرور السرية للمتابعة</p>
            </div>
            <div class="space-y-6">
                <div class="relative group">
                    <input id="dash-pass-input" type="password" class="w-full p-6 border-none rounded-[1.5rem] text-center text-3xl tracking-[0.2em] outline-none ring-2 ring-gray-100 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 font-bold" placeholder="••••">
                    <button onclick="togglePassword('dash-pass-input')" class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
                <button onclick="checkDashboardAuth()" class="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 active:scale-95">فتح اللوحة</button>
            </div>
            <div class="text-center">
                <a href="#/" class="text-gray-400 font-bold hover:text-blue-600 transition">العودة للمتجر الرئيسي</a>
            </div>
        </div>
    </div>
`;

// --- Renderers ---
const renderHome = () => `
    <div class="max-w-7xl mx-auto px-6 py-12 space-y-20">
        <!-- Hero Section -->
        <section class="relative h-[450px] md:h-[550px] rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center px-8 md:px-20 text-white shadow-2xl shadow-blue-200">
            <div class="z-10 max-w-2xl space-y-8">
                <div class="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-bold tracking-wider uppercase">متجر النخبة المغربي 🇲🇦</div>
                <h1 class="text-4xl md:text-7xl font-black leading-[1.1]">تسوق بذكاء، <br/><span class="text-blue-200">عش برفاهية</span></h1>
                <p class="text-lg md:text-xl opacity-80 font-medium max-w-lg">أفضل المنتجات المختارة بعناية مع خدمة التوصيل السريع والدفع عند الاستلام في جميع مدن المملكة.</p>
                <div class="flex flex-wrap gap-4">
                    <button onclick="document.getElementById('products-grid').scrollIntoView({behavior: 'smooth'})" class="bg-white text-blue-900 px-10 py-5 rounded-full font-black shadow-xl hover:bg-blue-50 transition transform hover:-translate-y-1">اكتشف الآن</button>
                    <a href="#/category/إلكترونيات" class="px-10 py-5 rounded-full font-black border-2 border-white/30 hover:bg-white/10 transition">الإلكترونيات</a>
                </div>
            </div>
            <div class="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl"></div>
            <div class="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-30 md:opacity-50">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000" class="object-cover w-full h-full" />
            </div>
        </section>

        <!-- Categories Quick Links -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${['إلكترونيات', 'منزل', 'سيارات', 'إكسسوارات'].map(cat => `
                <a href="#/category/${cat}" class="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center gap-4 hover:border-blue-200 hover:shadow-xl transition group">
                    <span class="text-4xl group-hover:scale-125 transition duration-500">${cat === 'إلكترونيات' ? '📱' : cat === 'منزل' ? '🏠' : cat === 'سيارات' ? '🏎️' : '✨'}</span>
                    <span class="font-black text-gray-800">${cat}</span>
                </a>
            `).join('')}
        </div>

        <!-- Products Section -->
        <section id="products-grid">
            <div class="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
                <div>
                    <h2 class="text-4xl font-black text-gray-900">أحدث الإضافات</h2>
                    <p class="text-gray-400 font-medium mt-2">منتجات أصلية مع ضمان الجودة 100%</p>
                </div>
                <div class="flex gap-2 bg-gray-100 p-1.5 rounded-2xl">
                    <button class="bg-white px-6 py-2 rounded-xl font-bold shadow-sm">الكل</button>
                    <button class="px-6 py-2 rounded-xl font-bold text-gray-500">الأكثر مبيعاً</button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                ${state.products.map((p: any) => `
                    <div class="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 group transition hover:shadow-2xl hover:-translate-y-2">
                        <a href="#/product/${p.id}" class="block h-72 overflow-hidden bg-gray-50 relative">
                            <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                            <div class="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-blue-600 shadow-sm uppercase tracking-wider">${p.category}</div>
                        </a>
                        <div class="p-8 space-y-6">
                            <h3 class="font-black text-xl text-gray-800 truncate">${p.name}</h3>
                            <div class="flex justify-between items-center">
                                <div class="flex flex-col">
                                    <span class="text-xs text-gray-400 font-bold uppercase">السعر الحالي</span>
                                    <span class="text-3xl font-black text-blue-600">${p.price.toLocaleString()} <span class="text-sm font-bold text-blue-400">${state.settings.currency}</span></span>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <button onclick="addToCart('${p.id}')" class="p-4 bg-gray-50 text-gray-600 rounded-[1.2rem] hover:bg-gray-100 transition"><span class="text-xl">🛒</span></button>
                                <button onclick="buyNow('${p.id}')" class="flex-grow py-4 bg-blue-600 text-white rounded-[1.2rem] font-black text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-50">اشتري الآن</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        ${renderWhatsAppButton()}
    </div>
`;

const renderProductDetail = (id: string) => {
    const product = state.products.find((p: any) => p.id === id);
    if (!product) return `<div class="text-center py-20 font-black text-gray-400">المنتج غير موجود</div>`;
    return `
        <div class="max-w-6xl mx-auto px-6 py-20">
            <div class="flex flex-col lg:flex-row gap-16 items-start">
                <div class="flex-1 w-full sticky top-32">
                    <div class="rounded-[3.5rem] overflow-hidden shadow-2xl border bg-white aspect-square relative group">
                        <img src="${product.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-1000">
                        <div class="absolute top-8 right-8 bg-blue-600 text-white px-6 py-2 rounded-full font-black shadow-xl">جديد 🔥</div>
                    </div>
                </div>
                <div class="flex-1 space-y-10 w-full text-right">
                    <nav class="flex items-center gap-3 text-sm font-bold text-gray-400">
                        <a href="#/" class="hover:text-blue-600 transition">الرئيسية</a> 
                        <span>/</span> 
                        <span class="text-blue-600 uppercase tracking-widest">${product.category}</span>
                    </nav>
                    <div class="space-y-4">
                        <h1 class="text-5xl md:text-6xl font-black text-gray-900 leading-tight">${product.name}</h1>
                        <div class="text-4xl font-black text-blue-600">${product.price.toLocaleString()} <span class="text-xl text-blue-300 font-bold">${state.settings.currency}</span></div>
                    </div>
                    <div class="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 space-y-4">
                        <h3 class="font-black text-xl text-gray-800">وصف المنتج</h3>
                        <p class="text-gray-500 leading-relaxed text-lg whitespace-pre-line">${product.description}</p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button onclick="buyNow('${product.id}')" class="flex-grow py-6 bg-blue-600 text-white rounded-[1.5rem] text-2xl font-black hover:bg-blue-700 transition shadow-2xl shadow-blue-100 transform active:scale-95"> تأكيد الطلب الآن 📦 </button>
                        <button onclick="addToCart('${product.id}')" class="px-8 py-6 bg-gray-100 text-gray-700 rounded-[1.5rem] font-bold hover:bg-gray-200 transition"> 🛒 السلة </button>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                            <span class="text-2xl">🚚</span>
                            <span class="text-sm font-bold text-green-700">شحن سريع 24/48 ساعة</span>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                            <span class="text-2xl">✅</span>
                            <span class="text-sm font-bold text-blue-700">الدفع بعد فحص المنتج</span>
                        </div>
                    </div>
                </div>
            </div>
            ${renderWhatsAppButton()}
        </div>
    `;
};

const renderCart = () => {
    const subtotal = state.cart.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
    if (state.cart.length === 0) return `<div class="text-center py-40 space-y-6"> <div class="text-7xl">🛒</div> <h2 class="text-3xl font-black text-gray-400">سلة المشتريات فارغة</h2> <a href="#/" class="inline-block bg-blue-600 text-white px-10 py-4 rounded-full font-black">ابدأ التسوق</a> </div>`;
    
    return `
        <div class="max-w-4xl mx-auto px-6 py-20 space-y-10">
            <h1 class="text-4xl font-black text-gray-900">سلة المشتريات</h1>
            <div class="bg-white rounded-[3rem] shadow-2xl border border-gray-50 overflow-hidden">
                <div class="divide-y divide-gray-100">
                    ${state.cart.map((item: any) => {
                        const product = state.products.find((p: any) => p.id === item.productId);
                        return `
                            <div class="p-8 flex items-center justify-between gap-6">
                                <div class="flex items-center gap-6">
                                    <div class="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border">
                                        <img src="${product?.image}" class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <h3 class="font-black text-xl text-gray-800">${item.name}</h3>
                                        <p class="text-gray-400 font-bold">${item.price.toLocaleString()} ${state.settings.currency} × ${item.quantity}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-8">
                                    <span class="text-2xl font-black text-blue-600">${(item.price * item.quantity).toLocaleString()} <span class="text-sm font-bold text-blue-400">${state.settings.currency}</span></span>
                                    <button onclick="removeFromCart('${item.productId}')" class="text-red-400 hover:text-red-600 transition text-2xl">🗑️</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="bg-gray-50 p-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t">
                    <div class="text-center md:text-right">
                        <p class="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">المجموع الصافي</p>
                        <p class="text-4xl font-black text-blue-600">${subtotal.toLocaleString()} <span class="text-lg font-bold text-blue-400">${state.settings.currency}</span></p>
                    </div>
                    <button onclick="window.location.hash = '#/checkout'" class="bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-xl hover:bg-blue-700 transition shadow-xl shadow-blue-100">إتمام الطلب الآن</button>
                </div>
            </div>
            <div class="text-center">
                <a href="#/" class="text-gray-400 font-bold hover:text-blue-600 transition">العودة للتسوق</a>
            </div>
        </div>
    `;
};

const renderCheckout = () => {
    let itemsToBuy = [];
    let subtotal = 0;
    if (state.directBuyProduct) { itemsToBuy = [{ ...state.directBuyProduct, quantity: 1 }]; subtotal = state.directBuyProduct.price; }
    else { itemsToBuy = state.cart; subtotal = state.cart.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0); }
    const total = subtotal + state.settings.shippingFee;
    if (itemsToBuy.length === 0) return `<div class="text-center py-40 space-y-6"> <div class="text-7xl">🛒</div> <h2 class="text-3xl font-black text-gray-400">لا توجد منتجات للطلب</h2> <a href="#/" class="inline-block bg-blue-600 text-white px-10 py-4 rounded-full font-black">ابدأ التسوق</a> </div>`;
    return `
        <div class="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16">
            <div class="flex-grow order-2 lg:order-1">
                <form onsubmit="handleOrder(event)" class="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-50 space-y-8">
                    <h1 class="text-3xl font-black text-gray-900 border-r-8 border-blue-600 pr-6">أين تريد استقبال الطلب؟</h1>
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="block mr-4 font-black text-gray-500 text-sm uppercase">الاسم الكامل</label>
                            <input id="form-name" required class="w-full p-5 border-none rounded-[1.5rem] bg-gray-50 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-lg" placeholder="اكتب اسمك هنا">
                        </div>
                        <div class="space-y-2">
                            <label class="block mr-4 font-black text-gray-500 text-sm uppercase">المدينة</label>
                            <select id="form-city" required class="w-full p-5 border-none rounded-[1.5rem] bg-gray-50 focus:ring-4 focus:ring-blue-100 cursor-pointer transition-all font-bold text-lg">
                                <option value="" disabled selected>اختر مدينتك</option>
                                ${MOROCCAN_CITIES.map(city => `<option value="${city}">${city}</option>`).join('')}
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="block mr-4 font-black text-gray-500 text-sm uppercase">رقم الهاتف</label>
                            <input id="form-phone" type="tel" required class="w-full p-5 border-none rounded-[1.5rem] bg-gray-50 focus:ring-4 focus:ring-blue-100 text-left outline-none transition-all font-bold text-lg" dir="ltr" placeholder="06XXXXXXXX">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-6 bg-green-600 text-white rounded-[1.5rem] font-black text-2xl hover:bg-green-700 transition transform hover:scale-[1.02] shadow-2xl shadow-green-100">تأكيد الطلب (الدفع عند الاستلام) 👋</button>
                    <p class="text-center text-sm text-gray-400 font-bold uppercase tracking-widest">🔒 جميع بياناتك محمية ومشفرة</p>
                </form>
            </div>
            <div class="w-full lg:w-[400px] order-1 lg:order-2">
                <div class="bg-gray-900 text-white p-10 rounded-[3rem] sticky top-32 space-y-8 shadow-2xl">
                    <h2 class="font-black text-2xl">ملخص السلة</h2>
                    <div class="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        ${itemsToBuy.map((item: any) => `
                            <div class="flex items-center gap-4 group">
                                <div class="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                                    <img src="${state.products.find((p:any)=>p.id === (item.productId || item.id))?.image}" class="w-full h-full object-cover group-hover:scale-110 transition">
                                </div>
                                <div class="flex-grow">
                                    <p class="font-black text-sm truncate w-40">${item.name}</p>
                                    <p class="text-xs text-blue-300 font-bold">${item.price.toLocaleString()} ${state.settings.currency}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="border-t border-white/10 pt-8 space-y-4">
                        <div class="flex justify-between text-gray-400 font-bold"> <span>المجموع:</span> <span>${subtotal.toLocaleString()} ${state.settings.currency}</span> </div>
                        <div class="flex justify-between text-gray-400 font-bold"> <span>الشحن:</span> <span>${state.settings.shippingFee} ${state.settings.currency}</span> </div>
                        <div class="flex justify-between font-black text-3xl text-blue-400 pt-4"> 
                            <span>الإجمالي:</span> 
                            <span>${total.toLocaleString()}</span> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderDashboard = () => {
    if (!state.isAuthenticated) return renderDashboardLogin();
    const subRoute = window.location.hash.split('/dashboard/')[1] || 'products';
    const sidebar = `
        <aside class="w-72 bg-gray-950 text-white h-screen fixed right-0 top-0 p-8 hidden lg:flex flex-col z-40">
            <div class="mb-12">
                <h2 class="text-3xl font-black text-blue-500">Elite <span class="text-white">Panel</span></h2>
            </div>
            <nav class="flex-grow space-y-4 font-bold">
                <a href="#/dashboard/products" class="flex items-center gap-4 p-4 rounded-2xl transition ${subRoute === 'products' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}">
                    <span class="text-xl">📦</span> المنتجات
                </a>
                <a href="#/dashboard/orders" class="flex items-center gap-4 p-4 rounded-2xl transition ${subRoute === 'orders' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}">
                    <span class="text-xl">📝</span> الطلبات
                    ${state.orders.length > 0 ? `<span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full mr-auto">${state.orders.length}</span>` : ''}
                </a>
                <a href="#/dashboard/settings" class="flex items-center gap-4 p-4 rounded-2xl transition ${subRoute === 'settings' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}">
                    <span class="text-xl">⚙️</span> الإعدادات
                </a>
            </nav>
            <button onclick="logout()" class="p-4 rounded-2xl text-red-500 hover:bg-red-950/30 transition flex items-center gap-4 font-bold">
                <span>🚪</span> تسجيل الخروج
            </button>
        </aside>
    `;

    let content = '';
    if (subRoute === 'products') {
        content = `
            <div class="space-y-12">
                <h2 class="text-4xl font-black text-gray-900">المتجر الحالي</h2>
                <div class="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 space-y-8">
                    <h3 class="font-black text-xl text-blue-600">إضافة منتج جديد</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input id="p-name" class="p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold" placeholder="اسم المنتج">
                        <input id="p-price" type="number" class="p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold" placeholder="السعر">
                        <select id="p-cat" class="p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold"> <option>إلكترونيات</option> <option>منزل</option> <option>سيارات</option> </select>
                        <input id="p-image" type="file" accept="image/*" class="p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold">
                        <textarea id="p-desc" class="md:col-span-2 p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold h-32" placeholder="اكتب وصفاً جذاباً للمنتج..."></textarea>
                    </div>
                    <button onclick="addProductFromDash()" class="bg-black text-white px-12 py-5 rounded-[1.2rem] font-black hover:bg-blue-600 transition shadow-xl">نشر المنتج في المتجر 🚀</button>
                </div>
                <div class="bg-white rounded-[3rem] border border-gray-50 overflow-hidden shadow-xl">
                    <table class="w-full text-right">
                        <thead class="bg-gray-50 border-b"> <tr> <th class="p-6 text-gray-400 font-bold uppercase text-xs">الصورة</th> <th class="p-6 text-gray-400 font-bold uppercase text-xs">المنتج</th> <th class="p-6 text-gray-400 font-bold uppercase text-xs">السعر</th> <th class="p-6 text-gray-400 font-bold uppercase text-xs">الإجراءات</th> </tr> </thead>
                        <tbody class="divide-y divide-gray-50">
                            ${state.products.map((p: any) => `<tr> <td class="p-6"><img src="${p.image}" class="w-16 h-16 object-cover rounded-2xl border"></td> <td class="p-6 font-black text-gray-800">${p.name}</td> <td class="p-6 font-bold text-blue-600">${p.price.toLocaleString()} د.م.</td> <td class="p-6"><button onclick="deleteProduct('${p.id}')" class="text-red-400 hover:text-red-600 font-black">حذف</button></td> </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (subRoute === 'orders') {
        content = `
            <div class="space-y-12">
                <h2 class="text-4xl font-black text-gray-900">طلبات الزبائن</h2>
                <div class="bg-white rounded-[3rem] border border-gray-50 overflow-hidden shadow-xl">
                    <table class="w-full text-right">
                        <thead class="bg-gray-50 border-b"> <tr> <th class="p-6 text-gray-400 font-bold uppercase text-xs">الزبون</th> <th class="p-6 text-gray-400 font-bold uppercase text-xs">المنتجات</th> <th class="p-6 text-gray-400 font-bold uppercase text-xs">الحالة</th> <th class="p-6 text-gray-400 font-bold uppercase text-xs">العمليات</th> </tr> </thead>
                        <tbody class="divide-y divide-gray-50">
                            ${state.orders.map((o: any) => `
                                <tr class="hover:bg-gray-50 transition">
                                    <td class="p-6"> <div class="font-black text-gray-800">${o.fullName}</div> <div class="text-xs text-gray-400 mt-1 font-bold">${o.city} • <span dir="ltr">${o.phone}</span></div> </td>
                                    <td class="p-6 text-xs font-bold text-gray-500">${o.items.map((i:any)=> i.name).join(', ')}</td>
                                    <td class="p-6">
                                        <select onchange="updateOrderStatus('${o.id}', this.value)" class="p-3 bg-gray-50 border-none rounded-xl text-xs font-black ${o.status === 'completed' ? 'text-green-600' : o.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}">
                                            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>⏳ معالجة</option>
                                            <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>✅ تم الإرسال</option>
                                            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ ملغي</option>
                                        </select>
                                    </td>
                                    <td class="p-6">
                                        <button onclick="deleteOrder('${o.id}')" class="text-red-300 hover:text-red-600 text-sm font-black">🗑️</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (subRoute === 'settings') {
        content = `
            <div class="space-y-12 max-w-2xl">
                <h2 class="text-4xl font-black text-gray-900">إعدادات المتجر</h2>
                <div class="bg-white p-12 rounded-[3rem] border border-gray-50 shadow-xl space-y-8">
                    <div class="space-y-4">
                        <label class="block mr-4 font-black text-gray-400 text-xs uppercase">إدارة كلمة السر</label>
                        <div class="relative">
                            <input id="s-pass" type="password" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold" value="${state.settings.dashPassword}" placeholder="تغيير كلمة السر">
                            <button onclick="togglePassword('s-pass')" class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block mr-4 font-black text-gray-400 text-xs uppercase">رقم واتساب المبيعات</label>
                        <input id="s-wa" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold text-left" dir="ltr" value="${state.settings.whatsappNumber}">
                    </div>
                    <div class="space-y-2">
                        <label class="block mr-4 font-black text-gray-400 text-xs uppercase">تكلفة الشحن (بالدرهم)</label>
                        <input id="s-shipping" type="number" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold" value="${state.settings.shippingFee}">
                    </div>
                    <div class="space-y-2">
                        <label class="block mr-4 font-black text-gray-400 text-xs uppercase">Facebook Pixel ID</label>
                        <input id="s-fb" class="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold" value="${state.settings.fbPixel}">
                    </div>
                    <button onclick="saveSettingsFromDash()" class="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-2xl shadow-blue-100">تحديث كافة الإعدادات ✅</button>
                </div>
            </div>
        `;
    }

    return `<div class="min-h-screen bg-[#fcfdfe] flex font-tajawal animate-fadeIn">${sidebar}<div class="flex-grow lg:mr-72 p-6 md:p-16 pb-40">${content}</div></div>`;
};

// --- Actions ---
(window as any).checkDashboardAuth = () => {
    const input = document.getElementById('dash-pass-input') as HTMLInputElement;
    if (input.value === state.settings.dashPassword) {
        state.isAuthenticated = true;
        router();
    } else {
        alert('❌ كلمة السر غير صحيحة، حاول مجدداً');
    }
};

(window as any).logout = () => {
    state.isAuthenticated = false;
    window.location.hash = '#/';
};

(window as any).deleteOrder = (id: string) => {
    if(confirm('سيتم حذف الطلب نهائياً، هل أنت متأكد؟')) {
        state.orders = state.orders.filter((o: any) => o.id !== id);
        saveState(); router();
    }
};

(window as any).buyNow = (id: string) => {
    const p = state.products.find((x: any) => x.id === id);
    if (p) { state.directBuyProduct = p; window.location.hash = '#/checkout'; }
};

(window as any).checkoutCart = () => {
    state.directBuyProduct = null;
    window.location.hash = '#/checkout';
};

(window as any).addToCart = (id: string) => {
    const p = state.products.find((x: any) => x.id === id);
    const existing = state.cart.find((x: any) => x.productId === id);
    if (existing) existing.quantity++;
    else if (p) state.cart.push({ productId: id, name: p.name, price: p.price, quantity: 1 });
    saveState(); alert('✅ رائع! تمت إضافة المنتج للسلة');
};

(window as any).removeFromCart = (id: string) => {
    state.cart = state.cart.filter((x: any) => x.productId !== id);
    saveState(); router();
};

(window as any).handleOrder = (e: Event) => {
    e.preventDefault();
    let items = [];
    let subtotal = 0;
    if (state.directBuyProduct) { items = [{ ...state.directBuyProduct, quantity: 1 }]; subtotal = state.directBuyProduct.price; }
    else { items = [...state.cart]; subtotal = state.cart.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0); }

    const order = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: (document.getElementById('form-name') as HTMLInputElement).value,
        city: (document.getElementById('form-city') as HTMLSelectElement).value,
        phone: (document.getElementById('form-phone') as HTMLInputElement).value,
        items: items,
        total: subtotal + state.settings.shippingFee,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    state.orders.unshift(order);
    if (!state.directBuyProduct) state.cart = [];
    state.directBuyProduct = null;
    saveState();
    alert('🎉 مبروك! طلبك قيد المعالجة، سنتصل بك قريباً.');
    window.location.hash = '#/';
};

(window as any).addProductFromDash = async () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = (document.getElementById('p-price') as HTMLInputElement).value;
    const desc = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    const imgInput = document.getElementById('p-image') as HTMLInputElement;
    if (!name || !price) return;
    let imgUrl = 'https://picsum.photos/seed/'+name+'/800/800';
    if (imgInput.files?.[0]) { imgUrl = await new Promise(r => { const rd = new FileReader(); rd.onload = e => r(e.target!.result as string); rd.readAsDataURL(imgInput.files![0]); }); }
    state.products.push({ id: Date.now().toString(), name, price: Number(price), description: desc, image: imgUrl, category: (document.getElementById('p-cat') as HTMLSelectElement).value });
    saveState(); router();
};

(window as any).deleteProduct = (id: string) => { if(confirm('حذف؟')) { state.products = state.products.filter((x: any) => x.id !== id); saveState(); router(); } };
(window as any).updateOrderStatus = (id: string, s: string) => { const o = state.orders.find((x:any)=>x.id===id); if(o) { o.status = s; saveState(); router(); } };
(window as any).saveSettingsFromDash = () => {
    state.settings = { 
        ...state.settings, 
        fbPixel: (document.getElementById('s-fb') as HTMLInputElement).value, 
        shippingFee: Number((document.getElementById('s-shipping') as HTMLInputElement).value), 
        dashPassword: (document.getElementById('s-pass') as HTMLInputElement).value,
        whatsappNumber: (document.getElementById('s-wa') as HTMLInputElement).value
    };
    saveState(); injectPixels(); alert('✅ تم تحديث النظام بنجاح'); router();
};

// --- Routing ---
const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const loading = document.getElementById('loading');
    if (!root || !loading) return;
    loading.style.width = '100%';
    setTimeout(() => { loading.style.width = '0'; }, 300);
    const isDashboard = hash.startsWith('#/dashboard');
    document.getElementById('main-nav')!.style.display = isDashboard ? 'none' : 'block';
    document.getElementById('main-footer')!.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') { state.directBuyProduct = null; root.innerHTML = renderHome(); }
    else if (hash === '#/cart') { state.directBuyProduct = null; root.innerHTML = renderCart(); }
    else if (hash === '#/checkout') { root.innerHTML = renderCheckout(); }
    else if (isDashboard) root.innerHTML = renderDashboard();
    else if (hash.startsWith('#/product/')) root.innerHTML = renderProductDetail(hash.split('#/product/')[1]);
    else root.innerHTML = `<div class="text-center py-40 font-black text-3xl">404 - لم نجد ما تبحث عنه</div>`;
};

window.addEventListener('hashchange', router);
window.addEventListener('load', () => { router(); updateCartUI(); injectPixels(); });
