
/**
 * Halal Digital Services - Professional Portfolio & Agency
 * Web Design & Development SEO Optimized - Version 2.1 (General Morocco)
 */

// --- Constants ---
const INITIAL_PROJECTS = [
    { 
        id: '1', 
        name: 'متجر "أناقة" للملابس المغربية', 
        description: 'تطوير متجر إلكتروني متكامل مع نظام دفع محلي وتصميم عصري متجاوب يزيد المبيعات بنسبة 40%. مبرمج خصيصاً لتحمل ضغط الزوار.', 
        price: 5500, 
        category: 'تطوير متاجر', 
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        id: '2', 
        name: 'موقع وكالة أسفار وطنية', 
        description: 'تصميم موقع سياحي احترافي يضم محرك بحث للرحلات ونظام حجز مباشر. تم تحسين السيو ليظهر في أولى نتائج البحث السياحي في المغرب.', 
        price: 4500, 
        category: 'مواقع تعريفية', 
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        id: '3', 
        name: 'نظام إدارة صيدليات المغرب', 
        description: 'تطبيق ويب سحابي (SaaS) لإدارة المخزون والمبيعات في الصيدليات مع واجهة مستخدم بسيطة وتقارير يومية مفصلة.', 
        price: 9000, 
        category: 'تطبيقات الويب', 
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800' 
    }
];

const INITIAL_SETTINGS = {
    fbPixel: '',
    shippingFee: 0,
    currency: 'د.م.',
    dashPassword: '1234',
    whatsappNumber: '0649075664',
    email: 'abdelghaforbahaddou@gmail.com'
};

const FAQS = [
    { q: "ما هي تكلفة إنشاء موقع إلكتروني في المغرب؟", a: "تختلف التكلفة حسب المتطلبات، لكن أسعارنا تبدأ من 3500 درهم للمواقع التعريفية و5000 درهم للمتاجر الإلكترونية الاحترافية." },
    { q: "هل الموقع يدعم اللغة العربية والفرنسية؟", a: "نعم، نقوم ببرمجة مواقع متعددة اللغات (Multilingual) تدعم العربية، الفرنسية، والإنجليزية بطلاقة مع واجهات متوافقة." },
    { q: "هل سأظهر في الصفحة الأولى من جوجل؟", a: "جميع مواقعنا مهيأة تقنياً للسيو (On-Page SEO). للحصول على النتائج الأولى، نقدم أيضاً باقات تسويق سيو شهرية مكثفة." },
    { q: "ما هي التقنيات التي تستخدمونها؟", a: "نستخدم أحدث التقنيات مثل React, Node.js, Next.js للمواقع المخصصة، وShopify و WordPress للمتاجر والتدوين." }
];

const REVIEWS = [
    { name: "محمد العلمي", role: "صاحب متجر إلكتروني", text: "تعاملت مع حلال ديجيتال لتطوير متجري، والنتيجة كانت مذهلة. السرعة في الأداء واحترافية التصميم فاقت توقعاتي." },
    { name: "سارة الفاسي", role: "مديرة شركة عقارات", text: "أفضل وكالة تصميم مواقع تعاملت معها. التزام تام بالمواعيد ودعم فني مستمر بعد تسليم المشروع." }
];

// --- App State ---
let state = {
    projects: JSON.parse(localStorage.getItem('projects') || 'null') || INITIAL_PROJECTS,
    requests: JSON.parse(localStorage.getItem('requests') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || 'null') || INITIAL_SETTINGS,
    isAuthenticated: false
};

const saveState = () => {
    localStorage.setItem('projects', JSON.stringify(state.projects));
    localStorage.setItem('requests', JSON.stringify(state.requests));
    localStorage.setItem('settings', JSON.stringify(state.settings));
};

// --- Renderers ---
const renderHome = () => `
    <div class="space-y-32">
        <!-- Hero Section -->
        <section class="relative min-h-[700px] flex items-center bg-gray-950 text-white overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600" alt="وكالة حلال ديجيتال المغرب" class="w-full h-full object-cover">
            </div>
            <div class="max-w-7xl mx-auto px-6 relative z-10 w-full py-20">
                <article class="max-w-4xl space-y-10 animate-fadeIn">
                    <div class="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-black">
                        <span class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>
                        أفضل خدمات برمجة المواقع بالمغرب
                    </div>
                    <h1 class="text-6xl md:text-8xl font-black leading-tight tracking-tight">خبراء <span class="text-blue-500">تصميم المواقع</span> <br>في المغرب</h1>
                    <p class="text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">نساعدك على مضاعفة مبيعاتك من خلال <strong>مواقع إلكترونية</strong> سريعة كأنها تطبيق هاتف، ومتصدرة لمحركات البحث في كافة أنحاء المغرب.</p>
                    <div class="flex flex-wrap gap-6">
                        <button onclick="document.getElementById('portfolio').scrollIntoView({behavior:'smooth'})" class="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-3xl font-black text-xl transition-all shadow-3xl shadow-blue-600/20 transform hover:-translate-y-1">اكتشف أعمالنا المميزة</button>
                        <a href="https://wa.me/212${state.settings.whatsappNumber.substring(1)}" class="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white px-12 py-6 rounded-3xl font-black text-xl transition-all border border-white/10 flex items-center gap-3">تحدث مع المبرمج 💬</a>
                    </div>
                </article>
            </div>
            <div class="absolute bottom-0 right-0 p-10 hidden xl:block">
                <div class="bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 space-y-4 max-w-xs animate-pulse">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl">✅</div>
                        <div class="font-black text-sm">أكثر من 15 مشروع تم تسليمها بنجاح هذا الشهر</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Logo Cloud / Trusted By -->
        <section class="max-w-7xl mx-auto px-6 opacity-40 grayscale hover:grayscale-0 transition duration-1000">
            <div class="flex flex-wrap justify-between items-center gap-12">
                <span class="text-3xl font-black">SHOPiFY</span>
                <span class="text-3xl font-black">WORDPRESS</span>
                <span class="text-3xl font-black">NEXT.JS</span>
                <span class="text-3xl font-black">NODE.JS</span>
                <span class="text-3xl font-black">TAiLWIND</span>
            </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                <div class="space-y-4">
                    <h2 class="text-5xl font-black text-gray-900">خدماتنا الرقمية المتكاملة</h2>
                    <p class="text-gray-400 font-medium text-xl">حلول تقنية شاملة لنمو تجارتك وأعمالك عبر الإنترنت في المغرب.</p>
                </div>
                <a href="#/request" class="text-blue-600 font-black text-lg underline underline-offset-8">اطلب عرض سعر مخصص</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                ${['تصميم المتاجر', 'المواقع التعريفية', 'تطوير التطبيقات'].map((s, i) => `
                    <div class="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-3xl transition-all group relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-600 transition-colors duration-500 opacity-20 group-hover:opacity-10"></div>
                        <div class="text-5xl mb-8">${i === 0 ? '🛒' : i === 1 ? '🏢' : '⚙️'}</div>
                        <h3 class="text-2xl font-black text-gray-800 mb-4">${s}</h3>
                        <p class="text-gray-500 leading-relaxed font-medium">نحن متخصصون في <strong>${s}</strong> مع التركيز على تجربة المستخدم (UX) وقابلية التوسع المستقبلي.</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Portfolio Section -->
        <section id="portfolio" class="max-w-7xl mx-auto px-6">
            <div class="text-center space-y-4 mb-20">
                <h2 class="text-5xl font-black text-gray-900">أحدث أعمالنا الاحترافية</h2>
                <p class="text-gray-400 text-xl font-medium">قصص نجاح سطرناها مع زبنائنا من خلال الابتكار الرقمي في المغرب.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                ${state.projects.map((p: any) => `
                    <article class="bg-white rounded-[3.5rem] overflow-hidden shadow-sm border border-gray-50 group hover:shadow-4xl transition duration-500">
                        <div class="relative h-72 overflow-hidden">
                            <img src="${p.image}" alt="${p.name} - تصميم حلال ديجيتال" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                            <div class="absolute inset-0 bg-blue-600/90 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col items-center justify-center p-8 text-white text-center">
                                <p class="font-bold mb-6">${p.description}</p>
                                <button onclick="window.location.hash='#/request'" class="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black">اطلب نسخة مماثلة</button>
                            </div>
                        </div>
                        <div class="p-10 space-y-4">
                            <div class="text-sm font-black text-blue-600 uppercase tracking-widest">${p.category}</div>
                            <h3 class="text-3xl font-black text-gray-800">${p.name}</h3>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>

        <!-- Testimonials -->
        <section class="bg-blue-50 py-32 rounded-[5rem] mx-6">
            <div class="max-w-7xl mx-auto px-6 text-center space-y-16">
                <h2 class="text-4xl font-black text-gray-900">ماذا يقول عنا شركاء النجاح؟</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    ${REVIEWS.map(r => `
                        <div class="bg-white p-12 rounded-[3.5rem] shadow-xl text-right relative">
                            <div class="text-6xl text-blue-100 absolute top-8 left-8">"</div>
                            <p class="text-gray-600 text-xl leading-relaxed font-medium mb-8 relative z-10">${r.text}</p>
                            <div>
                                <h4 class="font-black text-gray-900 text-lg">${r.name}</h4>
                                <p class="text-blue-500 font-bold text-sm">${r.role}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="max-w-4xl mx-auto px-6">
            <h2 class="text-4xl font-black text-gray-900 text-center mb-16">الأسئلة الأكثر شيوعاً</h2>
            <div class="space-y-6">
                ${FAQS.map((f, i) => `
                    <div class="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-blue-200 transition-colors shadow-sm">
                        <h3 class="text-xl font-black text-gray-800 mb-4 flex items-center gap-4">
                            <span class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm">${i+1}</span>
                            ${f.q}
                        </h3>
                        <p class="text-gray-500 font-medium leading-relaxed pr-14">${f.a}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Final CTA -->
        <section class="max-w-7xl mx-auto px-6 pb-20">
            <div class="bg-gray-900 rounded-[4rem] p-16 md:p-24 text-white text-center space-y-10 relative overflow-hidden shadow-4xl shadow-blue-500/10">
                <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                <h2 class="text-5xl md:text-6xl font-black relative z-10">جاهز لنقل مشروعك لمستوى آخر؟</h2>
                <p class="text-2xl text-gray-400 relative z-10 max-w-2xl mx-auto">توقف عن البحث عن <strong>مبرمج مواقع</strong> عشوائي، وابدأ العمل مع مبرمج يضمن لك النتيجة والسيو والجودة في المغرب.</p>
                <div class="flex flex-wrap justify-center gap-8 relative z-10">
                    <a href="https://wa.me/212${state.settings.whatsappNumber.substring(1)}" class="bg-blue-600 text-white px-12 py-6 rounded-3xl font-black text-2xl hover:bg-blue-700 transition transform hover:scale-105 shadow-2xl shadow-blue-600/40">تواصل معي الآن</a>
                    <a href="mailto:${state.settings.email}" class="bg-white/5 border border-white/10 text-white px-12 py-6 rounded-3xl font-black text-2xl hover:bg-white/10 transition">ارسل إيميل 📧</a>
                </div>
            </div>
        </section>
    </div>
`;

const renderConsultation = () => `
    <div class="max-w-4xl mx-auto px-6 py-24 animate-fadeIn">
        <div class="bg-white p-16 rounded-[4rem] shadow-4xl border border-gray-50 space-y-12">
            <div class="text-center space-y-4">
                <div class="text-7xl mb-6">🖋️</div>
                <h1 class="text-4xl font-black text-gray-900">طلب استشارة تقنية</h1>
                <p class="text-xl text-gray-400 font-medium">سنقوم بدراسة مشروعك بدقة وإرسال عرض مفصل لك أينما كنت في المغرب.</p>
            </div>
            <form onsubmit="handleRequest(event)" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-3">
                        <label class="font-black text-sm text-gray-400 mr-4">اسم الزبون / الشركة</label>
                        <input id="req-name" required class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-lg" placeholder="أدخل اسمك هنا">
                    </div>
                    <div class="space-y-3">
                        <label class="font-black text-sm text-gray-400 mr-4">رقم الهاتف (واتساب)</label>
                        <input id="req-phone" required type="tel" class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-lg text-left" dir="ltr" placeholder="06XXXXXXXX">
                    </div>
                    <div class="md:col-span-2 space-y-3">
                        <label class="font-black text-sm text-gray-400 mr-4">نوع الخدمة المطلوبة</label>
                        <select id="req-type" class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-lg">
                            <option>إنشاء متجر إلكتروني احترافي</option>
                            <option>تصميم موقع تعريفي للشركة</option>
                            <option>برمجة تطبيق خاص (SaaS)</option>
                            <option>تحسين السيو SEO وتصدر النتائج</option>
                        </select>
                    </div>
                    <div class="md:col-span-2 space-y-3">
                        <label class="font-black text-sm text-gray-400 mr-4">وصف مختصر للمشروع</label>
                        <textarea id="req-desc" required class="w-full p-6 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-100 font-black text-lg h-44" placeholder="أخبرنا عن فكرة موقعك وماذا تريد تحقيقه..."></textarea>
                    </div>
                </div>
                <button type="submit" class="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl hover:bg-blue-700 transition shadow-2xl shadow-blue-100 active:scale-95">ارسال الطلب للمراجعة 📤</button>
            </form>
        </div>
    </div>
`;

// --- Logic (Login, Logout, Requests, Router) ---
(window as any).login = () => {
    const pass = (document.getElementById('dash-pass') as HTMLInputElement).value;
    if (pass === state.settings.dashPassword) { state.isAuthenticated = true; router(); }
    else alert('❌ كلمة السر خاطئة');
};

(window as any).logout = () => { state.isAuthenticated = false; window.location.hash = '#/'; };

(window as any).handleRequest = (e: Event) => {
    e.preventDefault();
    const req = {
        id: Date.now().toString(),
        name: (document.getElementById('req-name') as HTMLInputElement).value,
        phone: (document.getElementById('req-phone') as HTMLInputElement).value,
        type: (document.getElementById('req-type') as HTMLSelectElement).value,
        desc: (document.getElementById('req-desc') as HTMLTextAreaElement).value,
        createdAt: new Date().toISOString()
    };
    state.requests.unshift(req);
    saveState();
    alert('🎉 تم إرسال طلبك بنجاح! فريق حلال ديجيتال سيتصل بك قريباً جداً لمناقشة التفاصيل التقنية لمشروعك.');
    window.location.hash = '#/';
};

(window as any).togglePassword = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
};

const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const loading = document.getElementById('loading');
    if (!root || !loading) return;

    loading.style.width = '100%';
    setTimeout(() => loading.style.width = '0', 300);

    const isDashboard = hash.startsWith('#/dashboard');
    const headerEl = document.getElementById('main-nav')?.closest('header');
    if (headerEl) headerEl.style.display = isDashboard ? 'none' : 'block';
    
    const footerEl = document.getElementById('main-footer');
    if (footerEl) footerEl.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/request') root.innerHTML = renderConsultation();
    else if (isDashboard) {
        root.innerHTML = `<div class="p-20 text-center font-black">لوحة التحكم مفعلة - الرجاء تسجيل الدخول</div>`;
    }
    else root.innerHTML = `<div class="text-center py-40 font-black text-3xl">404 - لم نجد الصفحة المطلوبة</div>`;
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
