
/**
 * storehalal - Full E-commerce & Blog Engine (Adsterra & SEO Ready 💰)
 */

// --- الروابط الجديدة والمستقرة للصور ---
const IMAGES = {
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    charger: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800',
    cable: 'https://images.unsplash.com/photo-1610492421943-88d2f38f8176?auto=format&fit=crop&q=80&w=800',
    article: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    placeholder: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=10&w=10' // صورة ضبابية خفيفة كاحتياط
};

// --- البيانات الافتراضية ---
const INITIAL_PRODUCTS = [
    {
        id: 'p1',
        name: 'ساعة ذكية Ultra Series 9',
        description: 'ساعة ذكية متطورة مع شاشة AMOLED ودعم كامل للمكالمات وتتبع الصحة.',
        price: 450,
        image: IMAGES.watch,
        category: 'إلكترونيات'
    },
    {
        id: 'p2',
        name: 'سماعات Air-Pro لاسلكية',
        description: 'جودة صوت استثنائية مع خاصية إلغاء الضوضاء وبطارية تدوم طويلاً.',
        price: 290,
        image: IMAGES.headphones,
        category: 'إكسسوارات'
    },
    {
        id: 'p3',
        name: 'شاحن سريع 65W GaN',
        description: 'شاحن جداري فائق السرعة متوافق مع جميع الهواتف والحواسيب المحمولة.',
        price: 180,
        image: IMAGES.charger,
        category: 'إلكترونيات'
    },
    {
        id: 'p4',
        name: 'كابل شحن سريع Type-C',
        description: 'كابل متين مغطى بالنايلون يدعم الشحن السريع ونقل البيانات السريع.',
        price: 45,
        image: IMAGES.cable,
        category: 'إكسسوارات'
    }
];

const INITIAL_ARTICLES = [
    {
        id: 'why-storehalal',
        title: 'لماذا تختار storehalal للتسوق عبر الإنترنت؟',
        excerpt: 'تعرف على مميزات متجرنا والضمانات التي نقدمها لزبنائنا في المغرب.',
        content: `في storehalal، نسعى لتقديم أفضل المنتجات التقنية بأسعار تنافسية. جودة المنتجات هي أولويتنا القصوى، حيث نقوم بفحص كل قطعة قبل إرسالها.
        
نتميز بخدمة التوصيل السريع لجميع المدن المغربية، ونوفر ميزة الدفع عند الاستلام لضمان راحة بال زبنائنا.`,
        image: IMAGES.article,
        date: new Date().toISOString()
    }
];

const INITIAL_SETTINGS = {
    whatsapp: '212649075664',
    siteName: 'storehalal',
    adminPass: 'halal2025',
    adsterra: { 
        header: '<script src="https://bouncingbuzz.com/29/98/27/29982794e86cad0441c5d56daad519bd.js"></script>', 
        middle: '', 
        bottom: '' 
    }
};

// --- إدارة الحالة ---
let state = {
    products: JSON.parse(localStorage.getItem('products') || JSON.stringify(INITIAL_PRODUCTS)),
    articles: JSON.parse(localStorage.getItem('articles') || JSON.stringify(INITIAL_ARTICLES)),
    settings: JSON.parse(localStorage.getItem('settings') || JSON.stringify(INITIAL_SETTINGS)),
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    orders: JSON.parse(localStorage.getItem('orders') || '[]'),
    isAdmin: sessionStorage.getItem('isAdmin') === 'true',
    currentTab: 'orders'
};

// وظيفة لإصلاح الروابط المكسورة تلقائياً في LocalStorage
const autoFixImages = () => {
    let changed = false;
    state.products.forEach((p: any) => {
        if (!p.image || p.image.includes('picsum.photos') || p.image.includes('1617625818242')) {
            const match = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
            if (match) {
                p.image = match.image;
                changed = true;
            }
        }
    });
    if (changed) saveState();
};

const saveState = () => {
    localStorage.setItem('products', JSON.stringify(state.products));
    localStorage.setItem('articles', JSON.stringify(state.articles));
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('orders', JSON.stringify(state.orders));
};

// --- المساعدات ---
const updateSEO = (title: string, description: string) => {
    document.title = `${title} | ${state.settings.siteName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
};

const injectAd = (containerId: string, code: string) => {
    const container = document.getElementById(containerId);
    if (!container || !code) return;
    container.innerHTML = '';
    const range = document.createRange();
    range.selectNode(container);
    const documentFragment = range.createContextualFragment(code);
    container.appendChild(documentFragment);
};

const injectGlobalAds = () => {
    const globalAdContainer = document.getElementById('global-ad-scripts') || document.createElement('div');
    globalAdContainer.id = 'global-ad-scripts';
    if (!document.getElementById('global-ad-scripts')) document.body.appendChild(globalAdContainer);
    
    if (state.settings.adsterra.header) {
        injectAd('global-ad-scripts', state.settings.adsterra.header);
    }
};

// --- إدارة السلة ---
(window as any).addToCart = (productId: string) => {
    const product = state.products.find((p: any) => p.id === productId);
    if (!product) return;
    const existing = state.cart.find((item: any) => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        state.cart.push({ ...product, qty: 1 });
    }
    saveState();
    updateCartBadge();
    alert('✅ تمت الإضافة للسلة');
};

(window as any).removeFromCart = (productId: string) => {
    state.cart = state.cart.filter((item: any) => item.id !== productId);
    saveState();
    router();
};

const updateCartBadge = () => {
    const badges = document.querySelectorAll('.cart-badge');
    const total = state.cart.reduce((sum: number, item: any) => sum + item.qty, 0);
    badges.forEach(b => {
        b.innerHTML = total.toString();
        b.classList.toggle('hidden', total === 0);
    });
};

// --- ريندر الواجهات ---

const renderStore = () => {
    updateSEO("المتجر - تسوق أفضل المنتجات", "متجر storehalal يقدم لك أحدث الأجهزة والإكسسوارات بأسعار مذهلة في المغرب.");
    
    return `
        <div class="animate-fadeIn">
            <section class="bg-blue-600 text-white py-16 px-4 text-center">
                <h1 class="text-3xl md:text-5xl font-black mb-4">تسوق الأفضل مع <span class="text-yellow-400">storehalal</span></h1>
                <p class="text-blue-100 max-w-xl mx-auto">توصيل سريع | دفع عند الاستلام | جودة مضمونة</p>
            </section>

            <div class="max-w-7xl mx-auto px-4 py-12">
                <div class="flex justify-between items-center mb-8 border-r-4 border-blue-600 pr-4">
                    <h2 class="text-2xl font-black">وصل حديثاً 🔥</h2>
                    <span class="text-xs text-slate-400">تحديث تلقائي للصور ✅</span>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    ${state.products.map((p: any) => `
                        <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                            <div class="relative aspect-square overflow-hidden bg-slate-100">
                                <img src="${p.image}" 
                                     onerror="this.src='${IMAGES.placeholder}'; console.log('Image failed, using placeholder');" 
                                     alt="${p.name}" 
                                     class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                                <div class="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">${p.category}</div>
                            </div>
                            <div class="p-4 text-right">
                                <h3 class="font-bold text-sm md:text-base dark:text-white line-clamp-1">${p.name}</h3>
                                <div class="text-blue-600 font-black text-lg my-2">${p.price} <span class="text-xs">د.م.</span></div>
                                <button onclick="addToCart('${p.id}')" class="w-full bg-slate-900 dark:bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">أضف للسلة 🛒</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-20">
                    <h2 class="text-2xl font-black mb-8 border-r-4 border-slate-900 dark:border-white pr-4">آخر المقالات التقنية ✍️</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${state.articles.map((a: any) => `
                            <article onclick="window.location.hash='#/article/${a.id}'" class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex gap-4 p-3 cursor-pointer group">
                                <div class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src="${a.image}" onerror="this.src='${IMAGES.placeholder}'" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
                                </div>
                                <div>
                                    <h4 class="font-bold text-sm dark:text-white line-clamp-2">${a.title}</h4>
                                    <p class="text-xs text-slate-500 mt-2 line-clamp-2">${a.excerpt}</p>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderCart = () => {
    const total = state.cart.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
    return `
        <div class="max-w-4xl mx-auto px-4 py-12 animate-fadeIn text-right">
            <h1 class="text-3xl font-black mb-8 dark:text-white">سلة المشتريات 🛒</h1>
            ${state.cart.length === 0 ? `
                <div class="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p class="text-slate-500 text-lg">السلة فارغة حالياً..</p>
                    <a href="#/" class="inline-block mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">ابدأ التسوق</a>
                </div>
            ` : `
                <div class="space-y-4">
                    ${state.cart.map((item: any) => `
                        <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <img src="${item.image}" onerror="this.src='${IMAGES.placeholder}'" class="w-16 h-16 rounded-lg object-cover">
                                <div>
                                    <h3 class="font-bold dark:text-white">${item.name}</h3>
                                    <p class="text-blue-600 font-bold">${item.price} د.م.</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="font-bold">× ${item.qty}</span>
                                <button onclick="removeFromCart('${item.id}')" class="text-red-500">🗑️</button>
                            </div>
                        </div>
                    `).join('')}
                    <div class="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center mt-8">
                        <div>
                            <p class="text-slate-400 text-sm">المجموع الإجمالي:</p>
                            <h2 class="text-3xl font-black">${total} د.م.</h2>
                        </div>
                        <a href="#/checkout" class="bg-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition">إتمام الطلب ➔</a>
                    </div>
                </div>
            `}
        </div>
    `;
};

const renderCheckout = () => {
    const total = state.cart.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
    if (state.cart.length === 0) return `<script>window.location.hash='#/'</script>`;

    return `
        <div class="max-w-2xl mx-auto px-4 py-12 animate-fadeIn text-right">
            <h1 class="text-3xl font-black mb-8 dark:text-white text-center">إتمام الطلب ✅</h1>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <form id="checkout-form" onsubmit="handleCheckout(event)" class="space-y-6">
                    <div>
                        <label class="block font-bold mb-2 text-slate-500">الاسم الكامل</label>
                        <input name="name" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block font-bold mb-2 text-slate-500">رقم الهاتف (واتساب)</label>
                        <input name="phone" type="tel" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" placeholder="06XXXXXXXX">
                    </div>
                    <div>
                        <label class="block font-bold mb-2 text-slate-500">المدينة</label>
                        <input name="city" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block font-bold mb-2 text-slate-500">العنوان بالتفصيل</label>
                        <textarea name="address" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24"></textarea>
                    </div>
                    
                    <div class="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between items-center mb-6">
                            <span class="text-xl font-bold dark:text-white">المبلغ المطلوب عند الاستلام:</span>
                            <span class="text-3xl font-black text-blue-600">${total} د.م.</span>
                        </div>
                        <button type="submit" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-green-700 transition">تأكيد الطلب الآن 📦</button>
                    </div>
                </form>
            </div>
        </div>
    `;
};

(window as any).handleCheckout = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const order = {
        id: Date.now().toString(),
        name: fd.get('name'),
        phone: fd.get('phone'),
        city: fd.get('city'),
        address: fd.get('address'),
        items: state.cart,
        total: state.cart.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0),
        status: 'جديد',
        date: new Date().toISOString()
    };

    state.orders.unshift(order);
    
    const msg = `طلب جديد من ${order.name}\nالهاتف: ${order.phone}\nالمدينة: ${order.city}\nالمنتجات: ${order.items.map((i:any)=>i.name+' ('+i.qty+')').join(', ')}\nالمجموع: ${order.total} د.م.`;
    const waUrl = `https://wa.me/${state.settings.whatsapp}?text=${encodeURIComponent(msg)}`;
    
    state.cart = [];
    saveState();
    updateCartBadge();
    
    alert('تم استقبال طلبك! سيتم توجيهك الآن لتأكيد الطلب عبر واتساب.');
    window.location.href = waUrl;
};

const renderArticle = (id: string) => {
    const article = state.articles.find((a: any) => a.id === id);
    if (!article) return `<div class="py-20 text-center">المقال غير موجود</div>`;
    updateSEO(article.title, article.excerpt);
    setTimeout(() => {
        injectAd('ad-art-m', state.settings.adsterra.middle);
    }, 100);
    return `
        <div class="max-w-4xl mx-auto px-4 py-12 text-right animate-fadeIn">
            <h1 class="text-3xl font-black mb-6 dark:text-white">${article.title}</h1>
            <img src="${article.image}" onerror="this.src='${IMAGES.placeholder}'" class="w-full rounded-3xl mb-8 shadow-lg">
            <div id="ad-art-m" class="my-8 min-h-[250px]"></div>
            <div class="prose prose-lg dark:prose-invert max-w-none leading-loose">
                ${article.content.split('\n').map((p:string)=>`<p>${p}</p>`).join('')}
            </div>
        </div>
    `;
};

// --- لوحة التحكم ---

(window as any).switchDashTab = (tab: string) => {
    state.currentTab = tab;
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'orders') {
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-8 dark:text-white">إدارة الطلبات (${state.orders.length})</h2>
            <div class="space-y-4">
                ${state.orders.map((o: any) => `
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-start">
                        <div class="text-right">
                            <div class="font-black text-lg dark:text-white">${o.name}</div>
                            <div class="text-sm text-blue-600 font-bold" dir="ltr">${o.phone}</div>
                            <div class="text-xs text-slate-500 mt-1">${o.city} - ${o.address}</div>
                            <div class="mt-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-xs">
                                ${o.items.map((i:any)=>`• ${i.name} (${i.qty})`).join('<br>')}
                            </div>
                        </div>
                        <div class="text-left">
                            <div class="text-xl font-black text-green-600">${o.total} د.م.</div>
                            <button onclick="deleteOrder('${o.id}')" class="mt-4 text-red-500 text-xs font-bold">حذف الطلب</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'adsterra') {
        panel.innerHTML = `
            <h2 class="text-2xl font-black mb-8 dark:text-white">إعلانات Adsterra 💰</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                    <label class="block font-bold mb-2">كود الهيدر / الإعلانات المنبثقة (Header Script)</label>
                    <textarea id="ad-h" class="w-full p-3 bg-slate-50 dark:bg-slate-800 font-mono text-xs h-32" dir="ltr">${state.settings.adsterra.header}</textarea>
                </div>
                <div><label class="block font-bold mb-2">كود وسط المقال</label><textarea id="ad-m" class="w-full p-3 bg-slate-50 dark:bg-slate-800 font-mono text-xs h-32" dir="ltr">${state.settings.adsterra.middle}</textarea></div>
                <div><label class="block font-bold mb-2">كود الفوتر</label><textarea id="ad-b" class="w-full p-3 bg-slate-50 dark:bg-slate-800 font-mono text-xs h-32" dir="ltr">${state.settings.adsterra.bottom}</textarea></div>
                <button onclick="saveAds()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">تحديث الإعلانات ✅</button>
            </div>
        `;
    } else if (tab === 'products') {
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-black dark:text-white">إدارة المنتجات</h2>
                <div class="flex gap-2">
                    <button onclick="resetToDefaults()" class="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold">⚠️ استعادة الصور الافتراضية</button>
                    <button onclick="openProductModal()" class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">+ منتج جديد</button>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${state.products.map((p: any) => `
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <img src="${p.image}" onerror="this.src='${IMAGES.placeholder}'" class="w-full h-32 object-cover rounded-xl mb-4">
                        <h4 class="font-bold dark:text-white text-sm truncate">${p.name}</h4>
                        <div class="flex justify-between items-center mt-3">
                            <span class="text-blue-600 font-black">${p.price} د.م.</span>
                            <button onclick="deleteProduct('${p.id}')" class="text-red-500 text-xs">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div id="product-modal" class="fixed inset-0 bg-black/50 backdrop-blur hidden z-[200] items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-md shadow-2xl text-right">
                    <h3 class="text-xl font-black mb-6 dark:text-white">إضافة منتج جديد</h3>
                    <div class="space-y-4">
                        <input id="p-name" placeholder="اسم المنتج" class="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none dark:text-white">
                        <input id="p-price" type="number" placeholder="السعر" class="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none dark:text-white">
                        <input id="p-image" placeholder="رابط الصورة (Unsplash)" class="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none dark:text-white">
                        <textarea id="p-desc" placeholder="وصف قصير" class="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none dark:text-white h-24"></textarea>
                    </div>
                    <div class="flex gap-4 mt-8">
                        <button onclick="saveNewProduct()" class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">حفظ</button>
                        <button onclick="document.getElementById('product-modal').classList.replace('flex','hidden')" class="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-white py-3 rounded-xl font-bold">إلغاء</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        panel.innerHTML = `<div class="p-20 text-center dark:text-white italic">اختر من القائمة الجانبية لإدارة الموقع</div>`;
    }
};

(window as any).resetToDefaults = () => {
    if(confirm('سيتم حذف جميع تعديلاتك وإرجاع الصور الأصلية الشغالة. هل أنت متأكد؟')) {
        localStorage.removeItem('products');
        localStorage.removeItem('articles');
        location.reload();
    }
};

(window as any).openProductModal = () => document.getElementById('product-modal')?.classList.replace('hidden', 'flex');
(window as any).saveNewProduct = () => {
    const name = (document.getElementById('p-name') as HTMLInputElement).value;
    const price = Number((document.getElementById('p-price') as HTMLInputElement).value);
    const image = (document.getElementById('p-image') as HTMLInputElement).value || IMAGES.placeholder;
    const description = (document.getElementById('p-desc') as HTMLTextAreaElement).value;
    if(!name || !price) return alert('أكمل البيانات');
    state.products.unshift({ id: Date.now().toString(), name, price, image, description, category: 'عام' });
    saveState();
    (window as any).switchDashTab('products');
};
(window as any).deleteProduct = (id: string) => { if(confirm('حذف؟')){state.products = state.products.filter((p:any)=>p.id!==id); saveState(); (window as any).switchDashTab('products');} };
(window as any).deleteOrder = (id: string) => { if(confirm('حذف؟')){state.orders = state.orders.filter((o:any)=>o.id!==id); saveState(); (window as any).switchDashTab('orders');} };
(window as any).saveAds = () => {
    state.settings.adsterra.header = (document.getElementById('ad-h') as HTMLTextAreaElement).value;
    state.settings.adsterra.middle = (document.getElementById('ad-m') as HTMLTextAreaElement).value;
    state.settings.adsterra.bottom = (document.getElementById('ad-b') as HTMLTextAreaElement).value;
    saveState();
    alert('✅ تم حفظ أكواد Adsterra!');
    location.reload();
};

const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    if (!root) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    injectGlobalAds();
    autoFixImages(); // إصلاح الصور المكسورة عند التنقل

    if (hash === '#/') root.innerHTML = renderStore();
    else if (hash === '#/cart') root.innerHTML = renderCart();
    else if (hash === '#/checkout') root.innerHTML = renderCheckout();
    else if (hash.startsWith('#/article/')) root.innerHTML = renderArticle(hash.replace('#/article/', ''));
    else if (hash.startsWith('#/dashboard')) {
        root.innerHTML = (window as any).renderDashboard();
        if (state.isAdmin) (window as any).switchDashTab(state.currentTab || 'orders');
    }
    
    updateCartBadge();
    syncUI();
};

const syncUI = () => {
    const footer = document.getElementById('dynamic-footer');
    if (footer) {
        footer.innerHTML = `
            <footer class="bg-slate-900 text-white py-16 mt-20 text-center md:text-right">
                <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <div class="text-2xl font-black text-blue-500 mb-4">${state.settings.siteName}</div>
                        <p class="text-slate-400">متجرك الموثوق للحصول على أفضل المنتجات التقنية في المغرب.</p>
                    </div>
                    <div>
                        <h4 class="font-bold mb-6">روابط سريعة</h4>
                        <div class="flex flex-col gap-3 text-slate-400">
                            <a href="#/" class="hover:text-white">المتجر</a>
                            <a href="#/cart" class="hover:text-white">السلة</a>
                            <a href="#/dashboard" class="hover:text-white">🔐 الإدارة</a>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-bold mb-6">الدعم</h4>
                        <div class="flex flex-col gap-3 text-slate-400">
                            <a href="https://wa.me/${state.settings.whatsapp}" class="bg-green-600 text-white px-4 py-2 rounded-lg text-center font-bold">تواصل واتساب</a>
                        </div>
                    </div>
                </div>
                <div class="mt-16 text-slate-600 text-xs border-t border-white/5 pt-8 text-center">
                    جميع الحقوق محفوظة © ${new Date().getFullYear()} storehalal
                </div>
            </footer>
        `;
    }
};

(window as any).renderDashboard = () => {
    if (!state.isAdmin) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <div class="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl w-full max-w-md text-right border dark:border-slate-800">
                    <h2 class="text-2xl font-black mb-8 dark:text-white text-center">🔐 دخول الإدارة</h2>
                    <input type="password" id="login-pass" class="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl mb-4 text-center" placeholder="كلمة السر">
                    <button onclick="handleLogin()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg shadow-lg hover:bg-blue-700 transition">دخول</button>
                </div>
            </div>
        `;
    }
    return `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-right">
            <aside class="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col">
                <div class="text-xl font-black text-blue-500 mb-10">إدارة المتجر</div>
                <nav class="flex flex-col gap-2">
                    <button onclick="switchDashTab('orders')" class="text-right p-3 rounded-xl hover:bg-white/5 font-bold transition flex justify-between">📦 الطلبات <span class="bg-red-500 px-2 rounded-full text-[10px]">${state.orders.length}</span></button>
                    <button onclick="switchDashTab('products')" class="text-right p-3 rounded-xl hover:bg-white/5 font-bold transition">🏷️ المنتجات</button>
                    <button onclick="switchDashTab('adsterra')" class="text-right p-3 rounded-xl hover:bg-white/5 font-bold transition">💰 الإعلانات</button>
                    <button onclick="handleLogout()" class="text-right p-3 rounded-xl hover:bg-red-500/20 text-red-400 font-bold mt-10 transition">🚪 خروج</button>
                </nav>
            </aside>
            <main class="flex-1 p-8 overflow-x-hidden" id="dash-panel"></main>
        </div>
    `;
};

(window as any).handleLogin = () => {
    const pass = (document.getElementById('login-pass') as HTMLInputElement).value;
    if (pass === state.settings.adminPass) {
        state.isAdmin = true;
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else alert('كلمة سر خاطئة');
};

(window as any).handleLogout = () => {
    state.isAdmin = false;
    sessionStorage.removeItem('isAdmin');
    router();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
