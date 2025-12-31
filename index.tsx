
/**
 * Halal Digital Blog - Version 6.5
 * Fully Responsive Tech Blog for Desktop & Mobile
 */

// --- البيانات الأساسية (المقالات) ---
const INITIAL_ARTICLES = [
    {
        id: 'tech-morocco-2025',
        title: 'مستقبل البرمجة والذكاء الاصطناعي في المغرب 2025',
        excerpt: 'تحليل شامل للفرص المتاحة للمبرمجين المغاربة في ظل التطور السريع لتقنيات الذكاء الاصطناعي.',
        content: `يشهد قطاع التكنولوجيا في المغرب طفرة غير مسبوقة. مع توجه الشركات الكبرى نحو التحول الرقمي، أصبح الطلب على المبرمجين المبدعين أكبر من أي وقت مضى.\n\nفي هذه المقالة، نستعرض أهم اللغات البرمجية المطلوبة في السوق المغربي، وكيف يمكنك تطوير مهاراتك لتواكب تطلعات الشركات العالمية.\n\nأولاً: تعلم البرمجة المعتمدة على الذكاء الاصطناعي.\nثانياً: التركيز على تطوير تطبيقات الويب السريعة (Next.js & React).\nثالثاً: بناء بورتفوليو احترافي يعكس قدراتك الحقيقية.`,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    },
    {
        id: 'ecommerce-seo-guide',
        title: 'دليل السيو (SEO) للمتاجر الإلكترونية المغربية',
        excerpt: 'كيف تتصدر نتائج البحث في جوجل وتجلب زواراً مجانيين لمتجرك الإلكتروني في المغرب.',
        content: `السيو هو حجر الزاوية لأي مشروع ناجح على الإنترنت. بدون ظهور في الصفحة الأولى لجوجل، أنت تخسر آلاف الزبائن المحتملين يومياً.\n\nنصائح ذهبية للسيو المحلي:\n1. استهداف الكلمات المفتاحية بالدارجة المغربية واللغة العربية.\n2. تحسين سرعة الموقع على الهواتف المحمولة.\n3. بناء روابط خلفية (Backlinks) من مواقع مغربية موثوقة.`,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    }
];

const INITIAL_SETTINGS = {
    whatsapp: '212649075664',
    siteName: 'حلال ديجيتال',
    social: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        telegram: '#'
    }
};

// --- إدارة الحالة (State Management) ---
let state = {
    articles: JSON.parse(localStorage.getItem('articles') || JSON.stringify(INITIAL_ARTICLES)),
    settings: JSON.parse(localStorage.getItem('settings') || JSON.stringify(INITIAL_SETTINGS)),
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    isAdmin: sessionStorage.getItem('isAdmin') === 'true'
};

const saveState = () => {
    localStorage.setItem('articles', JSON.stringify(state.articles));
    localStorage.setItem('settings', JSON.stringify(state.settings));
};

// --- وظائف المساعدة (Helper Functions) ---
const syncUI = () => {
    const wa = `https://wa.me/${state.settings.whatsapp}`;
    const mobileWa = document.getElementById('mobile-wa-link') as HTMLAnchorElement;
    if (mobileWa) mobileWa.href = wa;

    const footer = document.getElementById('dynamic-footer');
    if (footer) {
        footer.innerHTML = `
            <footer class="bg-slate-900 dark:bg-black text-white py-16 mt-20 border-t border-slate-800">
                <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">
                    <div class="space-y-4">
                        <div class="text-2xl font-black text-blue-500">${state.settings.siteName}</div>
                        <p class="text-slate-400 text-sm leading-relaxed">منصة مغربية متخصصة في نشر المعرفة التقنية ودعم المبرمجين والمقاولين الرقميين.</p>
                    </div>
                    <div class="space-y-4">
                        <h4 class="text-lg font-bold text-white">روابط سريعة</h4>
                        <ul class="text-slate-400 space-y-2 text-sm">
                            <li><a href="#/" class="hover:text-blue-500 transition">الرئيسية</a></li>
                            <li><a href="#/blog" class="hover:text-blue-500 transition">المدونة التقنية</a></li>
                            <li><a href="#/privacy" class="hover:text-blue-500 transition">سياسة الخصوصية</a></li>
                            <li><a href="#/dashboard" class="hover:text-blue-500 transition">لوحة التحكم</a></li>
                        </ul>
                    </div>
                    <div class="space-y-6">
                        <h4 class="text-lg font-bold text-white">تواصل معنا</h4>
                        <p class="text-slate-400 text-sm">واتساب: ${state.settings.whatsapp}</p>
                        <div class="flex justify-center md:justify-start gap-4">
                            <a href="${state.settings.social.facebook}" class="p-3 bg-blue-600 rounded-full hover:scale-110 transition">FB</a>
                            <a href="${state.settings.social.twitter}" class="p-3 bg-slate-800 rounded-full hover:scale-110 transition">TW</a>
                        </div>
                    </div>
                </div>
                <div class="text-center pt-12 text-slate-600 text-[10px] font-bold border-t border-slate-800 mt-12">
                    © 2025 ${state.settings.siteName} - جميع الحقوق محفوظة
                </div>
            </footer>
        `;
    }
};

// --- المكونات البرمجية (Renderers) ---
const renderHome = () => {
    return `
        <div class="animate-fadeIn">
            <!-- Hero -->
            <section class="bg-slate-950 text-white py-20 px-6 relative overflow-hidden">
                <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div class="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div class="flex-1 text-center md:text-right space-y-8">
                        <h1 class="text-4xl md:text-7xl font-black leading-tight">عالم البرمجة <br><span class="text-blue-500">بين يديك</span></h1>
                        <p class="text-slate-400 text-lg md:text-xl">مدونة متخصصة في تقديم أحدث الحلول البرمجية، شروحات السيو، وتطوير الويب في المغرب.</p>
                        <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                            <a href="#/blog" class="bg-blue-600 px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition">تصفح المقالات</a>
                            <a href="#/privacy" class="bg-slate-800 px-10 py-4 rounded-2xl font-black text-lg border border-slate-700">سياسة الخصوصية</a>
                        </div>
                    </div>
                    <div class="hidden md:block flex-1">
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" class="rounded-[3rem] shadow-2xl border-4 border-slate-800 rotate-2">
                    </div>
                </div>
            </section>

            <!-- Featured Articles -->
            <section class="max-w-7xl mx-auto px-6 py-20">
                <h2 class="text-3xl md:text-5xl font-black mb-12 dark:text-white">آخر التدوينات</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    ${state.articles.map((a: any) => `
                        <article onclick="window.location.hash='#/article/${a.id}'" class="group cursor-pointer bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all">
                            <div class="aspect-video overflow-hidden">
                                <img src="${a.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                            </div>
                            <div class="p-8 space-y-4">
                                <h3 class="text-2xl font-black dark:text-white line-clamp-2 leading-snug group-hover:text-blue-500 transition">${a.title}</h3>
                                <p class="text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">${a.excerpt}</p>
                                <div class="pt-4 text-blue-600 font-black text-sm">اقرأ المقال الكامل ↗</div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        </div>
    `;
};

const renderArticle = (id: string) => {
    const article = state.articles.find((a: any) => a.id === id);
    if (!article) return `<div class="py-40 text-center font-black text-2xl">المقال غير موجود!</div>`;

    return `
        <article class="max-w-4xl mx-auto px-6 py-12 md:py-24 animate-fadeIn text-right">
            <a href="#/" class="text-blue-600 font-bold mb-8 inline-block">← العودة للرئيسية</a>
            <h1 class="text-3xl md:text-6xl font-black dark:text-white mb-10 leading-tight">${article.title}</h1>
            <div class="text-slate-400 text-sm font-bold mb-10">نُشر في: ${new Date(article.date).toLocaleDateString('ar-MA')}</div>
            <img src="${article.image}" class="w-full h-auto rounded-[3rem] shadow-2xl mb-12">
            <div class="prose prose-lg md:prose-2xl dark:prose-invert max-w-none text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
                ${article.content.split('\n').map((p: string) => p.trim() ? `<p class="mb-8">${p}</p>` : '').join('')}
            </div>
            <div class="mt-20 p-10 bg-slate-100 dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 text-center">
                <h4 class="text-xl font-black mb-4 dark:text-white">هل أعجبك المقال؟</h4>
                <p class="text-slate-500 mb-6">شاركنا رأيك أو اطلب خدمة برمجية مباشرة عبر واتساب.</p>
                <a href="https://wa.me/${state.settings.whatsapp}" target="_blank" class="inline-block bg-green-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl">تحدث معنا الآن 💬</a>
            </div>
        </article>
    `;
};

// --- التوجيه (Routing System) ---
const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    if (!root) return;

    // إغلاق القائمة في الهاتف عند تغيير الصفحة
    document.getElementById('mobile-menu')?.classList.remove('active');
    document.body.classList.remove('overflow-hidden');

    if (hash === '#/') {
        root.innerHTML = renderHome();
    } else if (hash === '#/blog') {
        root.innerHTML = `<div class="max-w-7xl mx-auto px-6 py-24 text-right"><h1 class="text-5xl font-black mb-16 dark:text-white">المدونة التقنية</h1><div class="grid grid-cols-1 md:grid-cols-2 gap-10">${state.articles.map((a:any) => `<article onclick="window.location.hash='#/article/${a.id}'" class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border cursor-pointer"><img src="${a.image}" class="h-60 w-full object-cover"><div class="p-6"><h3 class="text-xl font-black dark:text-white">${a.title}</h3></div></article>`).join('')}</div></div>`;
    } else if (hash.startsWith('#/article/')) {
        const id = hash.replace('#/article/', '');
        root.innerHTML = renderArticle(id);
    } else if (hash === '#/privacy') {
        root.innerHTML = `<div class="max-w-4xl mx-auto px-6 py-24 text-right animate-fadeIn"><h1 class="text-5xl font-black mb-10 dark:text-white">سياسة الخصوصية</h1><div class="prose prose-xl dark:prose-invert text-slate-600 dark:text-slate-400"><p>نحن في ${state.settings.siteName} نحترم خصوصيتك. نجمع فقط البيانات الضرورية لتحسين تجربة المستخدم وعرض الإعلانات المناسبة من Adsterra.</p></div></div>`;
    } else if (hash === '#/dashboard') {
        if (!state.isAdmin) {
            root.innerHTML = `<div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-right"><div class="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl w-full max-w-md space-y-8"><h2 class="text-2xl font-black dark:text-white">تسجيل الدخول للإدارة</h2><input type="password" id="admin-pass" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl text-center" placeholder="كلمة السر"><button onclick="login()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-xl">دخول</button></div></div>`;
        } else {
            root.innerHTML = `<div class="p-10 text-center"><h1 class="text-3xl font-black mb-8 dark:text-white">لوحة الإدارة</h1><button onclick="sessionStorage.removeItem('isAdmin'); location.reload();" class="bg-red-500 text-white px-8 py-3 rounded-xl font-bold">تسجيل الخروج</button></div>`;
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    syncUI();
};

// --- العمليات (Operations) ---
(window as any).login = () => {
    const pass = (document.getElementById('admin-pass') as HTMLInputElement).value;
    if (pass === 'halal2025') {
        sessionStorage.setItem('isAdmin', 'true');
        state.isAdmin = true;
        router();
    } else alert('كلمة السر خاطئة!');
};

// تشغيل الموقع
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// التأكد من عمل القائمة المتنقلة
(window as any).toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden');
    }
};
