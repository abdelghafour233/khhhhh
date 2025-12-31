
/**
 * Halal Digital Services - Version 5.2
 * Feature: Adsterra Integration & Final Social Sync
 */

// --- Constants & Data ---
const APP_VERSION = '5.2'; 

const INITIAL_PROJECTS = [
    { 
        id: '1', 
        name: 'متجر "أناقة" للملابس المغربية', 
        description: 'تطوير متجر إلكتروني متكامل مع نظام دفع محلي وتصميم عصري متجاوب يزيد المبيعات بنسبة 40%.', 
        category: 'تطوير متاجر', 
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800' 
    },
    { 
        id: '2', 
        name: 'موقع وكالة أسفار وطنية', 
        description: 'تصميم موقع سياحي احترافي يضم محرك بحث للرحلات ونظام حجز مباشر في كافة مدن المغرب.', 
        category: 'مواقع تعريفية', 
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800' 
    }
];

const INITIAL_ARTICLES = [
    {
        id: 'ai-programming-future',
        title: 'الذكاء الاصطناعي والبرمجة: هل سيعوض الروبوت المبرمج البشري؟',
        excerpt: 'استكشف كيف يغير الذكاء الاصطناعي عالم تطوير البرمجيات، وكيف يمكنك كمبرمج استغلال هذه التقنيات لتعزيز إنتاجيتك بدل الخوف منها.',
        content: `شهد عالم التكنولوجيا في السنوات الأخيرة قفزة هائلة مع ظهور نماذج الذكاء الاصطناعي التوليدي مثل Gemini وGPT. هذا التطور أثار تساؤلاً جوهرياً: هل اقتربت نهاية عصر المبرمجين؟\n\nفي الواقع، الإجابة ليست "نعم" أو "لا" مطلقة، بل هي عملية تحول جذري في مفهوم البرمجة ذاته. الذكاء الاصطناعي لا يقتل البرمجة، بل يمنح المبرمج "قوى خارقة" إذا عرف كيف يستخدمها.\n\nأولاً: الذكاء الاصطناعي كزميل عمل (Pair Programmer)\nأدوات مثل GitHub Copilot ليست مجرد أدوات للإكمال التلقائي، بل هي رفيق ذكي يساعد في كتابة الأكواد الروتينية، اكتشاف الأخطاء المنطقية قبل التشغيل، وحتى اقتراح بنية برمجية (Architecture) أفضل. المبرمج اليوم يقضي وقتاً أقل في كتابة "Syntax" ووقتاً أطول في حل المشكلات المعقدة.\n\nثانياً: هل ستختفي الوظائف؟\nتاريخياً، كلما ظهرت أداة أتمتة، زاد الطلب على الأشخاص الذين يجيدون استخدامها. الذكاء الاصطناعي قد يعوض المهام البسيطة، لكنه لا يستطيع استبدال الإبداع البشري، القدرة على فهم احتياجات الزبون المعقدة، أو اتخاذ قرارات تقنية استراتيجية تتطلب وعياً بالسياق التجاري والأخلاقي.\n\nثالثاً: كيف تنجو وتتفوق في عصر الذكاء الاصطناعي؟\n1. تعلم هندسة الأوامر (Prompt Engineering): قدرتك على صياغة سؤال دقيق للذكاء الاصطناعي هي مهارة برمجية جديدة.\n2. التركيز على الأساسيات: الذكاء الاصطناعي قد يخطئ، لذا يجب أن تكون فاهماً للخوارزميات وهياكل البيانات لتتمكن من مراجعة ما ينتجه.\n3. التخصص في المجالات المعقدة: الأمان السيبراني، الأنظمة السحابية الضخمة، وتطوير نماذج الذكاء الاصطناعي نفسها هي مجالات تزداد نمواً.\n\nرابعاً: آفاق المستقبل في المغرب\nنلاحظ توجهاً كبيراً للشركات المغربية لدمج الذكاء الاصطناعي في عملياتها. المبرمج المغربي الذي يدمج هذه التقنيات في عمله اليوم هو من سيقود سوق الشغل غداً.\n\nختاماً، الذكاء الاصطناعي هو أعظم "رافعة" (Leverage) في تاريخ البرمجة. إنه يحررنا من القيود التقنية لنركز على الابتكار الحقيقي. المستقبل ليس للمبرمج وحده، ولا للذكاء الاصطناعي وحده، بل للمبرمج الذي يتقن الذكاء الاصطناعي.`,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    },
    {
        id: 'hosting-guide-2024',
        title: 'أنواع استضافة المواقع: دليلك الشامل لاختيار الخيار الأفضل لمشروعك',
        excerpt: 'تعرف على الفرق بين الاستضافة المشتركة، الـ VPS، والسيرفرات الخاصة، واكتشف المعايير التي تحدد نجاح موقعك.',
        content: `اختيار الاستضافة المناسبة هو حجر الأساس لأي مشروع رقمي ناجح. فكما تختار موقعاً متميزاً لمحلك التجاري على أرض الواقع، يجب أن تختار مساحة رقمية تتسم بالسرعة، الأمان، والاستقرار لموقعك الإلكتروني.\n\nأولاً: الاستضافة المشتركة (Shared Hosting)\nتعتبر الخيار الأكثر شعبية للمبتدئين وأصحاب المشاريع الصغيرة. في هذا النوع، يتشارك مئات المستخدمين نفس السيرفر والموارد (المعالج، الرام).\nالمميزات: تكلفة منخفضة جداً، سهولة الإعداد، لا تحتاج لخبرة تقنية.\n\nثانياً: السيرفر الافتراضي الخاص (VPS)\nهو ترقية ذكية للاستضافة المشتركة. يتم تقسيم السيرفر فيزيائياً إلى عدة أقسام افتراضية، مما يمنحك موارد مخصصة لك لا يتشارك فيها أحد معك.\nالمميزات: أداء ثابت، تحكم أكبر، أمان عالٍ.\n\nثالثاً: الاستضافة السحابية (Cloud Hosting)\nتعتمد على شبكة من السيرفرات تعمل معاً. إذا تعطل أحد السيرفرات، يقوم سيرفر آخر بالعمل مكانه فوراً.\nالمميزات: مرونة عالية جداً، استقرار مذهل، تدفع مقابل ما تستهلكه فقط.\n\nرابعاً: السيرفرات الكاملة (Dedicated Server)\nهنا تستأجر سيرفراً كامل لك وحدك. كل قوة المعالجة والتخزين مخصصة لموقعك فقط.\nالمميزات: قوة قصوى، أمان مطلق، تحكم كامل في الإعدادات.\n\nكيف تختار الاستضافة الأنسب لك؟\n1. حجم الزوار المتوقع: إذا كنت تبدأ بمدونة بسيطة، فالاستضافة المشتركة كافية.\n2. سرعة الاستجابة: ابحث عن استضافة توفر سيرفرات قريبة من جمهورك.\n3. الدعم الفني: تأكد من أن الشركة توفر دعماً على مدار الساعة.\n\nنحن نساعدك على اختيار أفضل استضافة ونهتم بكافة الإعدادات التقنية.`,
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
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
    adsBottom: '',
    adsterraSocialBar: '',
    adsterraPopunder: '',
    siteName: 'حلال ديجيتال',
    socialLinks: {
        facebook: 'https://facebook.com/abdelghaforbahaddou',
        twitter: 'https://twitter.com/abdelghaforbahaddou',
        instagram: 'https://instagram.com/abdelghaforbahaddou',
        telegram: 'https://t.me/abdelghaforbahaddou',
        pinterest: 'https://pinterest.com/abdelghaforbahaddou'
    }
};

// --- App State ---
const loadState = () => {
    try {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) document.documentElement.classList.add('dark');
        
        const storedVersion = localStorage.getItem('app_version');
        if (storedVersion !== APP_VERSION) {
            localStorage.setItem('app_version', APP_VERSION);
            // We don't overwrite articles/projects to preserve user data, 
            // but we ensure settings has the new keys
            const current = JSON.parse(localStorage.getItem('settings') || '{}');
            localStorage.setItem('settings', JSON.stringify({ ...INITIAL_SETTINGS, ...current }));
        }

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
        return { projects: INITIAL_PROJECTS, articles: INITIAL_ARTICLES, requests: [], settings: INITIAL_SETTINGS, isAuthenticated: false, isMobileMenuOpen: false, isDarkMode: false };
    }
};

let state = loadState();

const saveState = () => {
    localStorage.setItem('projects', JSON.stringify(state.projects));
    localStorage.setItem('articles', JSON.stringify(state.articles));
    localStorage.setItem('requests', JSON.stringify(state.requests));
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('darkMode', state.isDarkMode.toString());
    localStorage.setItem('app_version', APP_VERSION);
};

// --- Helpers ---
(window as any).toggleDarkMode = () => {
    state.isDarkMode = !state.isDarkMode;
    document.documentElement.classList.toggle('dark', state.isDarkMode);
    saveState();
};

(window as any).copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => alert('✅ تم نسخ رابط المقال!'));
};

const updateMeta = (title: string, description: string = '') => {
    document.title = `${title} | ${state.settings.siteName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description || state.settings.siteName);
};

// Injection for scripts like Adsterra Social Bar or Popunder
const injectAdScripts = () => {
    // Remove existing
    document.querySelectorAll('.ad-script-injected').forEach(el => el.remove());
    
    const codes = [state.settings.adsterraSocialBar, state.settings.adsterraPopunder];
    codes.forEach(code => {
        if (code && code.trim() !== '') {
            const range = document.createRange();
            const documentFragment = range.createContextualFragment(code);
            // Mark scripts to prevent duplicates or for easy cleanup
            documentFragment.querySelectorAll('script').forEach(s => s.classList.add('ad-script-injected'));
            document.body.appendChild(documentFragment);
        }
    });
};

// --- Icons ---
const SOCIAL_ICONS = {
    facebook: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>`,
    twitter: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    instagram: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    telegram: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1 .22-1.62.15-.16 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.52-.46-.01-1.33-.26-1.98-.48-.8-.27-1.43-.42-1.37-.89.03-.25.38-.51 1.03-.78 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.21z"/></svg>`,
    pinterest: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.164 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>`
};

// --- AdSense Renderer ---
const renderAdUnit = (type: 'adsHeader' | 'adsMiddle' | 'adsBottom', label: string) => {
    const adCode = state.settings[type];
    if (adCode && adCode.trim() !== '') {
        return `<div class="my-6 md:my-10 overflow-hidden flex justify-center max-w-full ad-container">${adCode}</div>`;
    }
    return `<div class="my-6 md:my-10 p-6 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center text-gray-300 dark:text-gray-700 text-xs font-bold uppercase">مساحة إعلانية (${label})</div>`;
};

// --- Page Renderers ---
const renderHome = () => {
    updateMeta('الرئيسية');
    injectAdScripts();
    return `
    <div class="space-y-16 md:space-y-32 animate-fadeIn pb-10 text-right dark:bg-gray-950">
        <section class="relative min-h-[500px] flex items-center bg-gray-950 text-white overflow-hidden px-4">
            <div class="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover">
            </div>
            <div class="max-w-7xl mx-auto relative z-10 w-full py-16 text-right">
                <div class="max-w-4xl space-y-10">
                    <h1 class="text-5xl md:text-8xl font-black leading-tight">واقعك الرقمي <br><span class="text-blue-500">يبدأ من هنا</span></h1>
                    <p class="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl">بناء المتاجر والمواقع الأكثر مبيعاً باحترافية عالية في المغرب.</p>
                    <button onclick="document.getElementById('portfolio').scrollIntoView({behavior:'smooth'})" class="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl">تصفح أعمالنا</button>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-6" id="portfolio">
            <div class="flex justify-between items-end mb-16">
                <h2 class="text-4xl font-black text-gray-900 dark:text-white text-right">جديد المدونة</h2>
                <a href="#/blog" class="text-blue-600 font-black">كل المقالات ←</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-right">
                ${state.articles.slice(0, 3).map((a: any) => `
                    <article class="bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition flex flex-col cursor-pointer" onclick="window.location.hash='#/article/${a.id}'">
                        <img src="${a.image}" class="h-64 object-cover" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'">
                        <div class="p-8 space-y-4 flex-grow">
                            <h3 class="text-2xl font-black dark:text-white line-clamp-2">${a.title}</h3>
                            <p class="text-gray-500 dark:text-gray-400 font-medium line-clamp-2">${a.excerpt}</p>
                            <span class="text-blue-500 font-black pt-4 block">اقرأ المزيد</span>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    </div>
`;
};

const renderArticleDetail = (id: string) => {
    const article = state.articles.find((a: any) => a.id === id);
    if (!article) return `<div class="text-center py-40 font-black text-3xl dark:text-white">المقال غير موجود</div>`;

    updateMeta(article.title, article.excerpt);
    injectAdScripts();
    const url = window.location.href;
    const title = encodeURIComponent(article.title);

    return `
        <div class="max-w-4xl mx-auto px-6 py-20 animate-fadeIn text-right">
            <h1 class="text-4xl md:text-6xl font-black leading-tight mb-12 dark:text-white text-right">${article.title}</h1>
            ${renderAdUnit('adsHeader', 'إعلان علوي')}
            <img src="${article.image}" class="w-full h-auto rounded-[3rem] shadow-2xl mb-12" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200'">
            <div class="prose prose-xl dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 font-medium leading-relaxed text-right">
                ${article.content.split('\n').map((p: string, i: number) => {
                    if (p.trim() === '') return '';
                    return `<p class="mb-6">${p}</p>${i === 2 ? renderAdUnit('adsMiddle', 'داخل المحتوى') : ''}`;
                }).join('')}
            </div>
            <div class="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800">
                 <h4 class="text-xl font-black mb-6 dark:text-white">شارك المقال مع أصدقائك:</h4>
                 <div class="flex flex-wrap gap-4 items-center">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" class="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:scale-110 transition shadow-lg">${SOCIAL_ICONS.facebook}</a>
                    <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" target="_blank" class="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:scale-110 transition shadow-lg">${SOCIAL_ICONS.twitter}</a>
                    <a href="https://t.me/share/url?url=${url}&text=${title}" target="_blank" class="w-12 h-12 flex items-center justify-center bg-blue-400 text-white rounded-full hover:scale-110 transition shadow-lg">${SOCIAL_ICONS.telegram}</a>
                    <a href="https://pinterest.com/pin/create/button/?url=${url}&media=${encodeURIComponent(article.image)}&description=${title}" target="_blank" class="w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-full hover:scale-110 transition shadow-lg">${SOCIAL_ICONS.pinterest}</a>
                    <button onclick="copyArticleLink()" class="px-6 py-3 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-full font-black text-sm">نسخ الرابط 🔗</button>
                 </div>
            </div>
            ${renderAdUnit('adsBottom', 'إعلان سفلي')}
        </div>
    `;
};

// --- Dashboard ---
(window as any).switchTab = (tab: string) => {
    const container = document.getElementById('dash-content');
    if (!container) return;
    
    if (tab === 'articles') {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-black dark:text-white">إدارة المدونة</h2>
                <button onclick="openArticleForm()" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-black">إضافة مقال جديد</button>
            </div>
            <div class="grid gap-4">
                ${state.articles.map((a: any) => `
                    <div class="bg-white dark:bg-gray-900 p-4 rounded-2xl border flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <img src="${a.image}" class="w-16 h-16 rounded-xl object-cover">
                            <h4 class="font-black dark:text-white">${a.title}</h4>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="openArticleForm('${a.id}')" class="p-2 bg-blue-50 text-blue-600 rounded-lg">تعديل</button>
                            <button onclick="deleteArticle('${a.id}')" class="p-2 bg-red-50 text-red-600 rounded-lg">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'settings') {
        container.innerHTML = `
            <h2 class="text-3xl font-black mb-8 dark:text-white text-right">إعدادات الموقع والأرباح</h2>
            <div class="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] space-y-10 text-right">
                
                <div class="space-y-6">
                    <h3 class="text-xl font-black border-b pb-2 text-blue-600">إعدادات عامة</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block font-black mb-2 dark:text-gray-400 text-right">اسم الموقع</label>
                            <input id="set-name" value="${state.settings.siteName}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl text-right">
                        </div>
                        <div>
                            <label class="block font-black mb-2 dark:text-gray-400 text-right">رقم الواتساب</label>
                            <input id="set-wa" value="${state.settings.whatsappNumber}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl text-right">
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3 class="text-xl font-black border-b pb-2 text-red-600">إعلانات Adsterra</h3>
                    <div class="grid grid-cols-1 gap-6">
                        <div>
                            <label class="block font-black mb-2 dark:text-gray-400 text-right">كود Social Bar</label>
                            <textarea id="set-adsterra-social" class="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl text-left font-mono text-xs" dir="ltr">${state.settings.adsterraSocialBar}</textarea>
                        </div>
                        <div>
                            <label class="block font-black mb-2 dark:text-gray-400 text-right">كود Popunder</label>
                            <textarea id="set-adsterra-pop" class="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl text-left font-mono text-xs" dir="ltr">${state.settings.adsterraPopunder}</textarea>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3 class="text-xl font-black border-b pb-2 text-orange-600">إعلانات Google Adsense</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
                        <div>
                            <label class="block font-black mb-2 dark:text-gray-400 text-right">إعلان علوي</label>
                            <textarea id="set-ads-header" class="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl text-left" dir="ltr">${state.settings.adsHeader}</textarea>
                        </div>
                        <div>
                            <label class="block font-black mb-2 dark:text-gray-400 text-right">إعلان وسط المحتوى</label>
                            <textarea id="set-ads-middle" class="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl text-left" dir="ltr">${state.settings.adsMiddle}</textarea>
                        </div>
                        <div>
                            <label class="block font-black mb-2 dark:text-gray-400 text-right">إعلان سفلي</label>
                            <textarea id="set-ads-bottom" class="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl text-left" dir="ltr">${state.settings.adsBottom}</textarea>
                        </div>
                    </div>
                </div>

                <button onclick="updateSettings()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black shadow-xl">حفظ كافة الإعدادات ✅</button>
            </div>
        `;
    }
};

(window as any).updateSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.whatsappNumber = (document.getElementById('set-wa') as HTMLInputElement).value;
    state.settings.adsterraSocialBar = (document.getElementById('set-adsterra-social') as HTMLTextAreaElement).value;
    state.settings.adsterraPopunder = (document.getElementById('set-adsterra-pop') as HTMLTextAreaElement).value;
    state.settings.adsHeader = (document.getElementById('set-ads-header') as HTMLTextAreaElement).value;
    state.settings.adsMiddle = (document.getElementById('set-ads-middle') as HTMLTextAreaElement).value;
    state.settings.adsBottom = (document.getElementById('set-ads-bottom') as HTMLTextAreaElement).value;
    
    saveState();
    alert('✅ تم حفظ كافة إعدادات الموقع والإعلانات');
    injectAdScripts();
};

(window as any).login = () => {
    const pass = (document.getElementById('dash-pass') as HTMLInputElement).value;
    if (pass === DEFAULT_PASS || pass === state.settings.dashPassword) {
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else alert('❌ خطأ في كلمة السر');
};

(window as any).logout = () => {
    sessionStorage.removeItem('isAdmin');
    window.location.hash = '#/';
};

// --- Router ---
const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const loading = document.getElementById('loading');
    if (!root || !loading) return;
    
    loading.style.width = '100%';
    setTimeout(() => loading.style.width = '0', 400);

    const isDashboard = hash.startsWith('#/dashboard');
    const header = document.querySelector('header');
    const footer = document.getElementById('main-footer');
    if (header) header.style.display = isDashboard ? 'none' : 'block';
    if (footer) footer.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/blog') {
         updateMeta('المدونة التقنية');
         injectAdScripts();
         root.innerHTML = `<div class="max-w-7xl mx-auto px-6 py-20 text-center space-y-16"><h1 class="text-5xl font-black dark:text-white">المدونة التقنية</h1><div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-right">${state.articles.map((a: any) => `<article class="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer" onclick="window.location.hash='#/article/${a.id}'"><img src="${a.image}" class="h-60 w-full object-cover"><div class="p-8 space-y-4"><h3 class="text-2xl font-black dark:text-white line-clamp-2">${a.title}</h3><p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">${a.excerpt}</p></div></article>`).join('')}</div></div>`;
    }
    else if (hash === '#/privacy') {
        updateMeta('سياسة الخصوصية');
        root.innerHTML = `<div class="max-w-4xl mx-auto px-6 py-20 text-right"><h1 class="text-4xl font-black mb-10 dark:text-white">سياسة الخصوصية</h1><div class="prose dark:prose-invert"><p>نحن نحترم خصوصيتك بالكامل. جميع بياناتك مشفرة ولا يتم مشاركتها.</p></div></div>`;
    }
    else if (hash.startsWith('#/article/')) root.innerHTML = renderArticleDetail(hash.replace('#/article/', ''));
    else if (isDashboard) {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            root.innerHTML = `<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4"><div class="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-xl text-center space-y-8 w-full max-w-md"><h2 class="text-2xl font-black dark:text-white">تسجيل الدخول</h2><input type="password" id="dash-pass" class="w-full p-5 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl text-center font-bold outline-none" placeholder="كلمة السر"><button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl">دخول آمن</button></div></div>`;
        } else {
            root.innerHTML = `<div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row text-right"><aside class="w-full md:w-80 bg-gray-900 text-white p-10 flex flex-col"><div class="text-2xl font-black mb-12">لوحة التحكم</div><nav class="flex flex-col gap-4"><button onclick="switchTab('articles')" class="text-right p-4 rounded-xl hover:bg-white/5 font-black">✍️ المقالات</button><button onclick="switchTab('settings')" class="text-right p-4 rounded-xl hover:bg-white/5 font-black">⚙️ الإعدادات</button><button onclick="logout()" class="text-right p-4 bg-red-500/10 text-red-400 rounded-xl font-black mt-20">خروج</button></nav></aside><main class="flex-1 p-16 overflow-y-auto"><div id="dash-content" class="max-w-5xl mx-auto space-y-12"></div></main></div>`;
            (window as any).switchTab('articles');
        }
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
};

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    router();
    injectAdScripts();
});
