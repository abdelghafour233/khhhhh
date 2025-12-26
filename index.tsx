
/**
 * Halal Digital Services - Version 4.0
 * Feature: Full Article Management (CRUD) in Dashboard
 */

// --- Constants & Data ---
const INITIAL_PROJECTS = [
    { 
        id: '1', 
        name: 'متجر "أناقة" للملابس المغربية', 
        description: 'تطوير متجر إلكتروني متكامل مع نظام دفع محلي وتصميم عصري متجاوب يزيد المبيعات بنسبة 40%.', 
        category: 'تطوير متاجر', 
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        id: '2', 
        name: 'موقع وكالة أسفار وطنية', 
        description: 'تصميم موقع سياحي احترافي يضم محرك بحث للرحلات ونظام حجز مباشر في كافة مدن المغرب.', 
        category: 'مواقع تعريفية', 
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800' 
    }
];

const INITIAL_ARTICLES = [
    {
        id: 'seo-guide-2024',
        title: 'الدليل الشامل للسيو (SEO): كيف تتصدر نتائج البحث في المغرب؟',
        excerpt: 'تعلم استراتيجيات تحسين محركات البحث لتحويل موقعك إلى مغناطيس للزبناء بدون إعلانات مدفوعة.',
        content: `ما هو السيو (SEO) ولماذا هو ضروري لعملك؟
السيو هو اختصار لـ Search Engine Optimization، وهو عملية تحسين موقعك الإلكتروني لزيادة ظهوره في نتائج محركات البحث مثل جوجل. في السوق المغربي المتزايد التنافسية، لم يعد امتلاك موقع كافياً، بل يجب أن يكون هذا الموقع قابلاً للإيجاد من طرف الزبناء المحتملين.

أهمية السيو للأعمال والمقاولات:
1. حركة مرور مجانية ومستدامة: على عكس الإعلانات المدفوعة التي تتوقف بمجرد انتهاء ميزانيتك، السيو يوفر لك زواراً بشكل مستمر ومجاني على المدى الطويل.
2. بناء الثقة والمصداقية: المستخدمون يثقون في المواقع التي تظهر في النتائج الأولى بشكل طبيعي أكثر من الإعلانات الممولة.
3. فهم سلوك الزبون المغربي: السيو يعتمد على الكلمات المفتاحية التي يبحث عنها المغاربة، مما يجعلك تقدم بالضبط ما يبحثون عنه.

الركائز الأساسية للسيو الناجح:
أولاً: السيو التقني (Technical SEO)
يتعلق الأمر بسرعة الموقع، التوافق مع الهواتف الذكية، وتأمين الموقع بشهادة SSL. جوجل يفضل المواقع السريعة والآمنة.
ثانياً: المحتوى (Content Marketing)
يقول الخبراء "المحتوى هو الملك". كتابة مقالات مفيدة تجيب على أسئلة زوارك تجعل جوجل يرفع من ترتيب موقعك.
ثالثاً: الروابط الخارجية (Backlinks)
عندما تشير مواقع أخرى إلى موقعك، فإنها تعطي إشارة لجوجل بأن محتواك ذو قيمة عالية وموثوق.

كيف نبدأ في تحسين موقعنا؟
ابدأ بالبحث عن الكلمات المفتاحية، ثم قم ببرمجة موقعك بشكل نظيف (وهو ما نقوم به في حلال ديجيتال)، وأخيراً استمر في نشر محتوى تعليمي مفيد لجمهورك.`,
        image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c20a?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    }
];

const DEFAULT_PASS = 'halal2025';

const INITIAL_SETTINGS = {
    dashPassword: DEFAULT_PASS,
    whatsappNumber: '212649075664',
    email: 'abdelghaforbahaddou@gmail.com',
    adsHeader: '',
    adsMiddle: '',
    adsBottom: ''
};

// --- App State ---
const loadState = () => {
    try {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) document.documentElement.classList.add('dark');
        
        const savedProjects = JSON.parse(localStorage.getItem('projects') || 'null');
        const savedArticles = JSON.parse(localStorage.getItem('articles') || 'null');
        const savedSettings = JSON.parse(localStorage.getItem('settings') || 'null');

        return {
            projects: (savedProjects && savedProjects.length > 0) ? savedProjects : INITIAL_PROJECTS,
            articles: (savedArticles && savedArticles.length > 0) ? savedArticles : INITIAL_ARTICLES,
            requests: JSON.parse(localStorage.getItem('requests') || '[]'),
            settings: savedSettings || INITIAL_SETTINGS,
            isAuthenticated: sessionStorage.getItem('isAdmin') === 'true',
            isMobileMenuOpen: false,
            isDarkMode: isDark
        };
    } catch (e) {
        return {
            projects: INITIAL_PROJECTS,
            articles: INITIAL_ARTICLES,
            requests: [],
            settings: INITIAL_SETTINGS,
            isAuthenticated: false,
            isMobileMenuOpen: false,
            isDarkMode: false
        };
    }
};

let state = loadState();

const saveState = () => {
    localStorage.setItem('projects', JSON.stringify(state.projects));
    localStorage.setItem('articles', JSON.stringify(state.articles));
    localStorage.setItem('requests', JSON.stringify(state.requests));
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('darkMode', state.isDarkMode.toString());
};

// --- Helpers ---
(window as any).toggleDarkMode = () => {
    state.isDarkMode = !state.isDarkMode;
    document.documentElement.classList.toggle('dark', state.isDarkMode);
    saveState();
    const darkIcons = document.querySelectorAll('.dark-toggle-icon');
    darkIcons.forEach(icon => {
        icon.innerHTML = state.isDarkMode ? '☀️' : '🌙';
    });
};

(window as any).togglePassword = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const btn = document.getElementById(inputId + '-btn');
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    if (btn) btn.innerHTML = isPassword ? '🙈' : '👁️';
};

(window as any).shareOnWhatsApp = (title: string) => {
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(title + ' : ' + url)}`, '_blank');
};

(window as any).shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

(window as any).shareOnTwitter = (title: string) => {
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
};

(window as any).copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('✅ تم نسخ رابط المقال بنجاح!');
    });
};

(window as any).toggleMobileMenu = () => {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden', !state.isMobileMenuOpen);
        menu.classList.toggle('flex', state.isMobileMenuOpen);
    }
};

// --- AdSense Renderer ---
const renderAdUnit = (type: 'adsHeader' | 'adsMiddle' | 'adsBottom', label: string) => {
    const adCode = state.settings[type];
    if (adCode && adCode.trim() !== '') {
        return `<div class="my-6 md:my-10 overflow-hidden flex justify-center max-w-full ad-container">${adCode}</div>`;
    }
    return `
        <div class="my-6 md:my-10 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl md:rounded-[2rem] text-center text-gray-300 dark:text-gray-700 text-xs font-bold">
            <div class="mb-1">AdSense [ ${label} ]</div>
            <div class="text-[9px] opacity-50">يظهر الكود هنا بعد تفعيله من لوحة التحكم</div>
        </div>
    `;
};

// --- Public Renderers ---
const renderHome = () => `
    <div class="space-y-16 md:space-y-32 animate-fadeIn pb-10 text-right dark:bg-gray-950">
        <section class="relative min-h-[500px] md:min-h-[600px] flex items-center bg-gray-950 text-white overflow-hidden px-4">
            <div class="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover">
            </div>
            <div class="max-w-7xl mx-auto relative z-10 w-full py-16 md:py-20 text-right">
                <div class="max-w-4xl space-y-6 md:space-y-10">
                    <h1 class="text-4xl md:text-7xl lg:text-8xl font-black leading-tight">حوّل أفكارك إلى <br class="hidden md:block"><span class="text-blue-500">واقع رقمي</span></h1>
                    <p class="text-lg md:text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">وكالة حلال ديجيتال المتخصصة في بناء وتطوير المشاريع الأكثر مبيعاً في المغرب 🇲🇦.</p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button onclick="document.getElementById('portfolio').scrollIntoView({behavior:'smooth'})" class="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl transition-all shadow-xl shadow-blue-600/20">تصفح أعمالنا</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 md:px-6" id="portfolio">
            <div class="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6">
                <div class="space-y-2 md:space-y-4 text-center md:text-right">
                    <h2 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">نصائح الخبراء</h2>
                    <p class="text-gray-400 dark:text-gray-500 text-lg md:text-xl font-medium">مقالات تعليمية في تطوير المواقع، التصميم، وخدمات السيو.</p>
                </div>
                <a href="#/blog" class="bg-gray-100 dark:bg-gray-900 px-6 md:px-8 py-3 rounded-xl md:rounded-2xl font-black text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition text-sm md:text-base">جميع المقالات ←</a>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                ${state.articles.length > 0 ? state.articles.slice(0, 3).map((a: any) => `
                    <article class="bg-white dark:bg-gray-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 group cursor-pointer shadow-sm hover:shadow-lg transition flex flex-col" onclick="window.location.hash='#/article/${a.id}'">
                        <div class="h-56 md:h-64 overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                            <img src="${a.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'">
                        </div>
                        <div class="p-6 md:p-8 space-y-3 md:space-y-4 text-right flex-grow">
                            <h3 class="text-xl md:text-2xl font-black group-hover:text-blue-600 dark:text-white transition line-clamp-2">${a.title}</h3>
                            <p class="text-gray-500 dark:text-gray-400 font-medium line-clamp-2 text-sm md:text-base">${a.excerpt}</p>
                            <div class="text-sm font-black text-blue-500 uppercase pt-2">اقرأ المزيد +</div>
                        </div>
                    </article>
                `).join('') : '<div class="col-span-full py-20 text-center text-gray-400 font-bold">لا توجد مقالات حالياً</div>'}
            </div>
        </section>
    </div>
`;

const renderBlog = () => `
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-fadeIn space-y-12 md:space-y-16 text-center text-gray-900 dark:text-white">
        <h1 class="text-4xl md:text-6xl font-black">المدونة التقنية</h1>
        <p class="text-gray-400 dark:text-gray-500 text-lg md:text-xl">دليلك الكامل للنجاح الرقمي وتطوير أعمالك في المغرب.</p>
        
        ${renderAdUnit('adsHeader', 'إعلان أعلى المدونة')}

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 text-right">
            ${state.articles.map((a: any) => `
                <article class="bg-white dark:bg-gray-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col" onclick="window.location.hash='#/article/${a.id}'">
                    <img src="${a.image}" class="h-56 md:h-64 w-full object-cover shrink-0" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'">
                    <div class="p-6 md:p-8 space-y-4 flex-grow">
                        <h3 class="text-xl md:text-2xl font-black text-right line-clamp-2">${a.title}</h3>
                        <p class="text-gray-500 dark:text-gray-400 text-sm md:text-base text-right line-clamp-3">${a.excerpt}</p>
                    </div>
                </article>
            `).join('')}
        </div>
        ${renderAdUnit('adsBottom', 'إعلان أسفل المدونة')}
    </div>
`;

const renderArticleDetail = (id: string) => {
    const article = state.articles.find((a: any) => a.id === id);
    if (!article) return `<div class="text-center py-40 font-black text-3xl dark:text-white">المقال غير موجود</div>`;

    return `
        <div class="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-20 animate-fadeIn text-right text-gray-900 dark:text-white">
            <nav class="flex gap-2 text-xs md:text-sm font-bold text-gray-400 dark:text-gray-600 mb-8 overflow-x-auto whitespace-nowrap">
                <a href="#/" class="hover:text-blue-600">الرئيسية</a> / 
                <a href="#/blog" class="hover:text-blue-600">المدونة</a> / 
                <span class="text-gray-300 dark:text-gray-700">${article.title.substring(0, 20)}...</span>
            </nav>
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 md:mb-12 text-gray-900 dark:text-white">${article.title}</h1>
            
            ${renderAdUnit('adsHeader', 'إعلان بداية المقال')}
            
            <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-xl mb-8 md:mb-12">
                <img src="${article.image}" class="w-full h-auto min-h-[250px] object-cover" onerror="this.src='https://images.unsplash.com/photo-1432888622747-4eb9a8f2c20a?w=1200'">
            </div>
            
            <div class="prose prose-lg md:prose-2xl dark:prose-invert text-gray-800 dark:text-gray-300 font-medium leading-relaxed space-y-6 md:space-y-8 max-w-none">
                ${article.content.split('\n').map((p: string, i: number) => {
                    if (p.trim() === '') return '';
                    return `
                        <p>${p}</p>
                        ${i === 1 ? renderAdUnit('adsMiddle', 'إعلان وسط المحتوى') : ''}
                    `;
                }).join('')}
            </div>

            <!-- Social Sharing Tools -->
            <div class="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800 space-y-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 class="text-2xl font-black mb-2">شارك الفائدة مع أصدقائك</h3>
                        <p class="text-gray-400 dark:text-gray-500 text-sm font-bold">إذا أعجبك المقال، لا تتردد في مشاركته لتعم الفائدة.</p>
                    </div>
                    <div class="flex flex-wrap gap-3">
                        <button onclick="shareOnWhatsApp('${article.title}')" class="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-2xl font-black text-sm hover:opacity-90 transition shadow-lg shadow-green-500/20">
                            <span>واتساب</span>
                        </button>
                        <button onclick="shareOnFacebook()" class="flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-2xl font-black text-sm hover:opacity-90 transition shadow-lg shadow-blue-500/20">
                            <span>فيسبوك</span>
                        </button>
                        <button onclick="shareOnTwitter('${article.title}')" class="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-black text-sm hover:opacity-90 transition shadow-lg">
                            <span>تويتر</span>
                        </button>
                        <button onclick="copyArticleLink()" class="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-black text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <span>نسخ الرابط</span>
                        </button>
                    </div>
                </div>

                <!-- Call to Action -->
                <div class="bg-blue-50 dark:bg-blue-900/10 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="text-center md:text-right">
                        <h4 class="text-xl font-black text-blue-600 mb-1">هل لديك مشروع ترغب في تطويره؟</h4>
                        <p class="text-gray-500 dark:text-blue-200/50 text-sm font-bold">نحن هنا لمساعدتك في بناء حضورك الرقمي باحترافية.</p>
                    </div>
                    <a href="https://wa.me/${state.settings.whatsappNumber}" target="_blank" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition">تواصل معنا الآن</a>
                </div>
            </div>

            ${renderAdUnit('adsBottom', 'إعلان نهاية المقال')}
        </div>
    `;
};

// --- Dashboard Component ---
const renderDashboard = () => `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row animate-fadeIn text-right transition-colors">
        <aside class="w-full md:w-80 bg-gray-900 dark:bg-black text-white p-6 md:p-10 flex flex-col border-l border-white/5">
            <div class="flex justify-between items-center mb-6 md:mb-12">
                <div class="text-2xl font-black">حلال <span class="text-blue-500">ADMIN</span></div>
                <button onclick="toggleDarkMode()" class="p-2 bg-white/10 rounded-lg dark-toggle-icon">${state.isDarkMode ? '☀️' : '🌙'}</button>
            </div>
            <nav class="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                <button onclick="switchTab('requests')" class="whitespace-nowrap flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 font-black text-sm">📊 الطلبات</button>
                <button onclick="switchTab('articles')" class="whitespace-nowrap flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 font-black text-sm">✍️ المدونة</button>
                <button onclick="switchTab('settings')" class="whitespace-nowrap flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 font-black text-sm">⚙️ الإعدادات</button>
            </nav>
            <button onclick="logout()" class="p-4 bg-red-500/10 text-red-400 rounded-xl font-black mt-auto hidden md:block">خروج</button>
        </aside>
        <main class="flex-1 p-4 md:p-16 overflow-y-auto">
            <div id="dash-content" class="max-w-5xl mx-auto space-y-8 md:space-y-12 text-right"></div>
            <button onclick="logout()" class="w-full p-4 bg-red-500 text-white rounded-xl font-black mt-8 md:hidden">تسجيل الخروج</button>
        </main>
    </div>
`;

// --- Admin Helper Functions ---
(window as any).switchTab = (tab: string) => {
    const container = document.getElementById('dash-content');
    if (!container) return;
    
    if (tab === 'articles') {
        container.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <h2 class="text-3xl font-black dark:text-white">إدارة المدونة</h2>
                <button onclick="openArticleForm()" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-blue-700 transition">+ إضافة مقال جديد</button>
            </div>
            <div class="grid grid-cols-1 gap-4">
                ${state.articles.map((a: any) => `
                    <div class="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                        <img src="${a.image}" class="w-20 h-20 rounded-xl object-cover shrink-0" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200'">
                        <div class="flex-grow">
                            <h4 class="font-black text-lg dark:text-white line-clamp-1">${a.title}</h4>
                            <p class="text-xs text-gray-400 font-bold uppercase">${new Date(a.date).toLocaleDateString('ar-MA')}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="openArticleForm('${a.id}')" class="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-100 transition">تعديل</button>
                            <button onclick="deleteArticle('${a.id}')" class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 transition">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'settings') {
        container.innerHTML = `
            <h2 class="text-3xl md:text-4xl font-black mb-8 dark:text-white text-right">إعدادات الموقع</h2>
            <div class="grid grid-cols-1 gap-8 text-right">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white dark:bg-gray-900 p-6 md:p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-6">
                        <h3 class="text-xl font-black text-blue-600">تغيير كلمة السر</h3>
                        <div class="space-y-4">
                            <label class="block font-black text-xs text-gray-400 dark:text-gray-600 uppercase">كلمة السر الجديدة</label>
                            <div class="relative">
                                <input id="set-pass" type="password" value="${state.settings.dashPassword}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-bold text-center">
                                <button id="set-pass-btn" onclick="togglePassword('set-pass')" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl">👁️</button>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-900 p-6 md:p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-6">
                        <h3 class="text-xl font-black text-green-600">إعدادات التواصل</h3>
                        <div class="space-y-4">
                            <label class="block font-black text-xs text-gray-400 dark:text-gray-600 uppercase">رقم الواتساب (بدون رمز الدولة)</label>
                            <input id="set-wa" value="${state.settings.whatsappNumber}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-bold text-center" dir="ltr">
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 p-6 md:p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-8">
                    <h3 class="text-xl font-black text-orange-500">إعدادات أدسنس (AdSense)</h3>
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="block font-black text-xs text-gray-400 dark:text-gray-600 uppercase">كود الإعلان العلوي</label>
                            <textarea id="set-ads-header" class="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-mono text-xs border border-transparent focus:border-orange-300 transition">${state.settings.adsHeader || ''}</textarea>
                        </div>
                        <div class="space-y-2">
                            <label class="block font-black text-xs text-gray-400 dark:text-gray-600 uppercase">كود الإعلان الأوسط</label>
                            <textarea id="set-ads-middle" class="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-mono text-xs border border-transparent focus:border-orange-300 transition">${state.settings.adsMiddle || ''}</textarea>
                        </div>
                        <div class="space-y-2">
                            <label class="block font-black text-xs text-gray-400 dark:text-gray-600 uppercase">كود الإعلان السفلي</label>
                            <textarea id="set-ads-bottom" class="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-mono text-xs border border-transparent focus:border-orange-300 transition">${state.settings.adsBottom || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
            <button onclick="updateSettings()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black shadow-xl mt-8 hover:bg-blue-700 transition">حفظ جميع الإعدادات ✅</button>
        `;
    } else if (tab === 'requests') {
        container.innerHTML = `<h2 class="text-3xl font-black mb-8 text-right dark:text-white">الطلبات الواردة</h2><div class="text-gray-400 font-bold py-10 text-center">لا توجد طلبات جديدة حالياً</div>`;
    }
};

(window as any).openArticleForm = (id?: string) => {
    const container = document.getElementById('dash-content');
    if (!container) return;
    const article = id ? state.articles.find((a: any) => a.id === id) : null;

    container.innerHTML = `
        <div class="flex items-center gap-4 mb-8">
            <button onclick="switchTab('articles')" class="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-black">← رجوع</button>
            <h2 class="text-3xl font-black dark:text-white">${id ? 'تعديل المقال' : 'إضافة مقال جديد'}</h2>
        </div>
        <div class="bg-white dark:bg-gray-900 p-6 md:p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-6">
            <input type="hidden" id="edit-id" value="${id || ''}">
            <div class="space-y-2">
                <label class="block font-black text-xs text-gray-400 dark:text-gray-600 uppercase">عنوان المقال</label>
                <input id="edit-title" value="${article ? article.title : ''}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-black">
            </div>
            <div class="space-y-2">
                <label class="block font-black text-xs text-gray-400 dark:text-gray-600 uppercase">وصف مختصر (Excerpt)</label>
                <textarea id="edit-excerpt" class="w-full h-24 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-bold">${article ? article.excerpt : ''}</textarea>
            </div>
            <div class="space-y-2">
                <label class="block font-black text-xs text-gray-400 dark:text-gray-600 uppercase">رابط الصورة المميزة</label>
                <input id="edit-image" value="${article ? article.image : ''}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-bold" dir="ltr" placeholder="https://...">
            </div>
            <div class="space-y-2">
                <label class="block font-black text-xs text-gray-400 dark:text-gray-600 uppercase">المحتوى الكامل (يدعم الأسطر)</label>
                <textarea id="edit-content" class="w-full h-96 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-medium leading-relaxed">${article ? article.content : ''}</textarea>
            </div>
            <button onclick="saveArticle()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition">نشر وحفظ المقال ✅</button>
        </div>
    `;
};

(window as any).saveArticle = () => {
    const id = (document.getElementById('edit-id') as HTMLInputElement).value;
    const title = (document.getElementById('edit-title') as HTMLInputElement).value;
    const excerpt = (document.getElementById('edit-excerpt') as HTMLTextAreaElement).value;
    const image = (document.getElementById('edit-image') as HTMLInputElement).value;
    const content = (document.getElementById('edit-content') as HTMLTextAreaElement).value;

    if (!title || !content) return alert('يرجى كتابة العنوان والمحتوى على الأقل');

    if (id) {
        // Edit existing
        const index = state.articles.findIndex((a: any) => a.id === id);
        if (index !== -1) {
            state.articles[index] = { ...state.articles[index], title, excerpt, image, content };
        }
    } else {
        // Add new
        const newArticle = {
            id: 'art-' + Date.now(),
            title,
            excerpt,
            image: image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            content,
            date: new Date().toISOString()
        };
        state.articles.unshift(newArticle);
    }

    saveState();
    alert('✅ تم الحفظ بنجاح');
    (window as any).switchTab('articles');
};

(window as any).deleteArticle = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المقال نهائياً؟')) {
        state.articles = state.articles.filter((a: any) => a.id !== id);
        saveState();
        (window as any).switchTab('articles');
    }
};

(window as any).updateSettings = () => {
    state.settings.whatsappNumber = (document.getElementById('set-wa') as HTMLInputElement).value;
    state.settings.dashPassword = (document.getElementById('set-pass') as HTMLInputElement).value;
    
    const hAd = document.getElementById('set-ads-header') as HTMLTextAreaElement;
    const mAd = document.getElementById('set-ads-middle') as HTMLTextAreaElement;
    const bAd = document.getElementById('set-ads-bottom') as HTMLTextAreaElement;
    
    if (hAd) state.settings.adsHeader = hAd.value;
    if (mAd) state.settings.adsMiddle = mAd.value;
    if (bAd) state.settings.adsBottom = bAd.value;
    
    saveState();
    alert('✅ تم حفظ التغييرات بنجاح');
};

(window as any).login = () => {
    const rawInput = (document.getElementById('dash-pass') as HTMLInputElement).value;
    const inputPass = rawInput.trim();
    if (inputPass === DEFAULT_PASS || inputPass === state.settings.dashPassword) {
        state.isAuthenticated = true;
        sessionStorage.setItem('isAdmin', 'true');
        state.settings.dashPassword = inputPass;
        saveState();
        router();
    } else {
        alert('كلمة السر خاطئة!');
    }
};

(window as any).logout = () => {
    state.isAuthenticated = false;
    sessionStorage.removeItem('isAdmin');
    window.location.hash = '#/';
};

const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const loading = document.getElementById('loading');
    if (!root || !loading) return;
    
    loading.style.width = '100%';
    setTimeout(() => loading.style.width = '0', 400);

    const isDashboard = hash.startsWith('#/dashboard');
    const isArticle = hash.startsWith('#/article/');
    
    const header = document.querySelector('header');
    const footer = document.getElementById('main-footer');
    if (header) header.style.display = isDashboard ? 'none' : 'block';
    if (footer) footer.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/blog') root.innerHTML = renderBlog();
    else if (isArticle) root.innerHTML = renderArticleDetail(hash.replace('#/article/', ''));
    else if (isDashboard) {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            root.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 text-right transition-colors">
                    <div class="bg-white dark:bg-gray-900 p-10 md:p-16 rounded-[2.5rem] shadow-xl text-center space-y-8 w-full max-w-md animate-fadeIn">
                        <div class="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-2xl mx-auto text-2xl font-black shadow-lg">H</div>
                        <h2 class="text-2xl font-black dark:text-white">تسجيل دخول المشرف</h2>
                        <div class="space-y-4">
                            <div class="relative">
                                <input type="password" id="dash-pass" class="w-full p-5 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl text-center text-xl font-bold outline-none border-2 border-transparent focus:border-blue-200 transition" placeholder="••••••••">
                                <button id="dash-pass-btn" onclick="togglePassword('dash-pass')" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50 hover:opacity-100 transition">👁️</button>
                            </div>
                            <button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition">دخول آمن</button>
                        </div>
                        <div class="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end items-center">
                             <button onclick="toggleDarkMode()" class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg dark-toggle-icon">${state.isDarkMode ? '☀️' : '🌙'}</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            root.innerHTML = renderDashboard();
            (window as any).switchTab('requests');
        }
    }
    
    state.isMobileMenuOpen = false;
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.add('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
