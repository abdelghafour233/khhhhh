
/**
 * Halal Digital Services - Version 3.2
 * Updated Default Password to 'halal2025'
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

const INITIAL_SETTINGS = {
    dashPassword: 'halal2025',
    whatsappNumber: '0649075664',
    email: 'abdelghaforbahaddou@gmail.com',
    adsHeader: '',
    adsMiddle: '',
    adsBottom: ''
};

// --- App State ---
let state = {
    projects: JSON.parse(localStorage.getItem('projects') || 'null') || INITIAL_PROJECTS,
    articles: JSON.parse(localStorage.getItem('articles') || 'null') || INITIAL_ARTICLES,
    requests: JSON.parse(localStorage.getItem('requests') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || 'null') || INITIAL_SETTINGS,
    isAuthenticated: sessionStorage.getItem('isAdmin') === 'true',
    isMobileMenuOpen: false
};

const saveState = () => {
    localStorage.setItem('projects', JSON.stringify(state.projects));
    localStorage.setItem('articles', JSON.stringify(state.articles));
    localStorage.setItem('requests', JSON.stringify(state.requests));
    localStorage.setItem('settings', JSON.stringify(state.settings));
};

// --- Helpers ---
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
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
};

(window as any).copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => alert('📋 تم نسخ رابط المقال!'));
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
        return `<div class="my-6 md:my-10 overflow-hidden flex justify-center max-w-full">${adCode}</div>`;
    }
    return `
        <div class="my-6 md:my-10 p-6 md:p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl md:rounded-[2rem] text-center text-gray-300 text-xs font-bold">
            <div class="mb-1">AdSense [ ${label} ]</div>
            <div class="text-[10px]">يظهر هنا كود أدسنس</div>
        </div>
    `;
};

// --- Public Renderers ---
const renderHome = () => `
    <div class="space-y-16 md:space-y-32 animate-fadeIn pb-10 text-right">
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

        <section class="max-w-7xl mx-auto px-4 md:px-6">
            <div class="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6">
                <div class="space-y-2 md:space-y-4">
                    <h2 class="text-3xl md:text-5xl font-black text-gray-900">نصائح الخبراء</h2>
                    <p class="text-gray-400 text-lg md:text-xl font-medium">مقالات تعليمية في تطوير المواقع، التصميم، وخدمات السيو.</p>
                </div>
                <a href="#/blog" class="bg-gray-100 px-6 md:px-8 py-3 rounded-xl md:rounded-2xl font-black text-gray-800 hover:bg-gray-200 transition text-sm md:text-base">جميع المقالات ←</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                ${state.articles.slice(0, 3).map((a: any) => `
                    <article class="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 group cursor-pointer shadow-sm hover:shadow-lg transition" onclick="window.location.hash='#/article/${a.id}'">
                        <div class="h-56 md:h-64 overflow-hidden bg-gray-100">
                            <img src="${a.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'">
                        </div>
                        <div class="p-6 md:p-8 space-y-3 md:space-y-4 text-right">
                            <h3 class="text-xl md:text-2xl font-black group-hover:text-blue-600 transition">${a.title}</h3>
                            <p class="text-gray-500 font-medium line-clamp-2 text-sm md:text-base">${a.excerpt}</p>
                            <div class="text-sm font-black text-blue-500 uppercase">اقرأ المزيد +</div>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    </div>
`;

const renderBlog = () => `
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-fadeIn space-y-12 md:space-y-16 text-center">
        <h1 class="text-4xl md:text-6xl font-black">المدونة التقنية</h1>
        <p class="text-gray-400 text-lg md:text-xl">دليلك الكامل للنجاح الرقمي وتطوير أعمالك في المغرب.</p>
        
        ${renderAdUnit('adsHeader', 'إعلان أعلى المدونة')}

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 text-right">
            ${state.articles.map((a: any) => `
                <article class="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition cursor-pointer" onclick="window.location.hash='#/article/${a.id}'">
                    <img src="${a.image}" class="h-56 md:h-64 w-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'">
                    <div class="p-6 md:p-8 space-y-4">
                        <h3 class="text-xl md:text-2xl font-black text-right">${a.title}</h3>
                        <p class="text-gray-500 text-sm md:text-base text-right">${a.excerpt}</p>
                    </div>
                </article>
            `).join('')}
        </div>
        ${renderAdUnit('adsBottom', 'إعلان أسفل المدونة')}
    </div>
`;

const renderArticleDetail = (id: string) => {
    const article = state.articles.find((a: any) => a.id === id);
    if (!article) return `<div class="text-center py-40 font-black text-3xl">المقال غير موجود</div>`;

    return `
        <div class="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-20 animate-fadeIn text-right">
            <nav class="flex gap-2 text-xs md:text-sm font-bold text-gray-400 mb-8">
                <a href="#/" class="hover:text-blue-600">الرئيسية</a> / 
                <a href="#/blog" class="hover:text-blue-600">المدونة</a>
            </nav>
            <h1 class="text-3xl md:text-6xl font-black leading-tight mb-8 md:mb-12 text-gray-900">${article.title}</h1>
            
            ${renderAdUnit('adsHeader', 'إعلان بداية المقال')}
            
            <div class="w-full bg-gray-100 rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-xl mb-8 md:mb-12">
                <img src="${article.image}" class="w-full h-auto min-h-[300px] object-cover" onerror="this.src='https://images.unsplash.com/photo-1432888622747-4eb9a8f2c20a?w=1200'">
            </div>
            
            <div class="prose prose-lg md:prose-2xl text-gray-800 font-medium leading-relaxed space-y-6 md:space-y-8">
                ${article.content.split('\n').map((p: string, i: number) => `
                    <p>${p}</p>
                    ${i === 1 ? renderAdUnit('adsMiddle', 'إعلان وسط المحتوى') : ''}
                `).join('')}
            </div>

            <div class="mt-16 border-t border-gray-100 pt-10">
                <h4 class="text-xl font-black mb-6 text-gray-400">شارك هذا المقال مع أصدقائك:</h4>
                <div class="flex flex-wrap gap-4">
                    <button onclick="shareOnWhatsApp('${article.title}')" class="flex-1 min-w-[120px] py-4 bg-green-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-600 transition">
                        <span>واتساب</span>
                        <span class="text-xl">💬</span>
                    </button>
                    <button onclick="shareOnFacebook()" class="flex-1 min-w-[120px] py-4 bg-blue-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-800 transition">
                        <span>فيسبوك</span>
                        <span class="text-xl">🌐</span>
                    </button>
                    <button onclick="shareOnTwitter('${article.title}')" class="flex-1 min-w-[120px] py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition">
                        <span>تويتر</span>
                        <span class="text-xl">𝕏</span>
                    </button>
                    <button onclick="copyArticleLink()" class="flex-1 min-w-[120px] py-4 bg-gray-100 text-gray-800 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                        <span>نسخ الرابط</span>
                        <span class="text-xl">🔗</span>
                    </button>
                </div>
            </div>
            
            ${renderAdUnit('adsBottom', 'إعلان نهاية المقال')}
        </div>
    `;
};

const renderDashboard = () => `
    <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row animate-fadeIn text-right">
        <aside class="w-full md:w-80 bg-gray-900 text-white p-6 md:p-10 flex flex-col">
            <div class="text-2xl font-black mb-6 md:mb-12">حلال <span class="text-blue-500">ADMIN</span></div>
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

(window as any).switchTab = (tab: string) => {
    const container = document.getElementById('dash-content');
    if (!container) return;
    if (tab === 'settings') {
        container.innerHTML = `
            <h2 class="text-3xl md:text-4xl font-black mb-8">إعدادات الإدارة</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 text-right">
                <div class="bg-white p-6 md:p-10 rounded-[2rem] border border-gray-100 space-y-6">
                    <h3 class="text-xl font-black text-blue-600">تغيير كلمة السر</h3>
                    <div class="space-y-4">
                        <label class="block font-black text-xs text-gray-400 uppercase">كلمة السر الحالية</label>
                        <div class="relative">
                            <input id="set-pass" type="password" value="${state.settings.dashPassword}" class="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-center">
                            <button id="set-pass-btn" onclick="togglePassword('set-pass')" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl">👁️</button>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 md:p-10 rounded-[2rem] border border-gray-100 space-y-6">
                    <h3 class="text-xl font-black text-green-600">إعدادات التواصل</h3>
                    <div class="space-y-4">
                        <label class="block font-black text-xs text-gray-400 uppercase">رقم الواتساب</label>
                        <input id="set-wa" value="${state.settings.whatsappNumber}" class="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-center" dir="ltr">
                    </div>
                </div>
            </div>
            <button onclick="updateSettings()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black shadow-xl mt-8">حفظ كافة الإعدادات</button>
        `;
    } else if (tab === 'requests') {
        container.innerHTML = `<h2 class="text-3xl font-black mb-8">طلبات التواصل (${state.requests.length})</h2><div class="space-y-4">${state.requests.map((r: any) => `<div class="bg-white p-6 rounded-2xl border flex justify-between items-center text-right"><div class="font-black">${r.name}</div><div class="text-blue-600 font-bold" dir="ltr">${r.phone}</div></div>`).join('')}</div>`;
    } else if (tab === 'articles') {
        container.innerHTML = `<div class="flex justify-between items-center mb-8"><h2 class="text-3xl font-black">المدونة</h2></div><div class="space-y-4">${state.articles.map((a: any) => `<div class="bg-white p-6 rounded-2xl border flex justify-between items-center"><span class="font-black">${a.title}</span><button onclick="deleteArticle('${a.id}')" class="text-red-500 font-bold">حذف</button></div>`).join('')}</div>`;
    }
};

(window as any).updateSettings = () => {
    state.settings.whatsappNumber = (document.getElementById('set-wa') as HTMLInputElement).value;
    state.settings.dashPassword = (document.getElementById('set-pass') as HTMLInputElement).value;
    saveState();
    alert('✅ تم تحديث الإعدادات بنجاح');
};

(window as any).login = () => {
    const pass = (document.getElementById('dash-pass') as HTMLInputElement).value;
    if (pass === state.settings.dashPassword) {
        state.isAuthenticated = true;
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else {
        alert('كلمة السر خاطئة، حاول مرة أخرى.');
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
    
    document.querySelector('header')!.style.display = isDashboard ? 'none' : 'block';
    document.getElementById('main-footer')!.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/blog') root.innerHTML = renderBlog();
    else if (isArticle) root.innerHTML = renderArticleDetail(hash.replace('#/article/', ''));
    else if (isDashboard) {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            root.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div class="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl text-center space-y-10 w-full max-w-md animate-fadeIn">
                        <div class="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-3xl mx-auto text-3xl font-black shadow-lg">H</div>
                        <h2 class="text-3xl font-black">تسجيل الدخول للإدارة</h2>
                        <div class="space-y-4">
                            <div class="relative">
                                <input type="password" id="dash-pass" class="w-full p-6 bg-gray-50 rounded-2xl text-center text-2xl font-bold outline-none border-2 border-transparent focus:border-blue-100 transition" placeholder="••••">
                                <button id="dash-pass-btn" onclick="togglePassword('dash-pass')" class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">👁️</button>
                            </div>
                            <button onclick="login()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition">دخول آمن</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            root.innerHTML = renderDashboard();
            (window as any).switchTab('requests');
        }
    }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
