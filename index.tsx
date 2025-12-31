
/**
 * Halal Digital Services - Version 4.6
 * Feature: Optimized Hosting Image & Cache Busting
 */

// --- Constants & Data ---
const APP_VERSION = '4.6'; // رفع الإصدار لتحديث التخزين المحلي فوراً

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
        id: 'hosting-guide-2024',
        title: 'أنواع استضافة المواقع: دليلك الشامل لاختيار الخيار الأفضل لمشروعك',
        excerpt: 'تعرف على الفرق بين الاستضافة المشتركة، الـ VPS، والسيرفرات الخاصة، واكتشف المعايير التي تحدد نجاح موقعك.',
        content: `اختيار الاستضافة المناسبة هو حجر الأساس لأي مشروع رقمي ناجح. فكما تختار موقعاً متميزاً لمحلك التجاري على أرض الواقع، يجب أن تختار مساحة رقمية تتسم بالسرعة، الأمان، والاستقرار لموقعك الإلكتروني.\n\nأولاً: الاستضافة المشتركة (Shared Hosting)\nتعتبر الخيار الأكثر شعبية للمبتدئين وأصحاب المشاريع الصغيرة. في هذا النوع، يتشارك مئات المستخدمين نفس السيرفر والموارد (المعالج، الرام).\nالمميزات: تكلفة منخفضة جداً، سهولة الإعداد، لا تحتاج لخبرة تقنية.\n\nثانياً: السيرفر الافتراضي الخاص (VPS)\nهو ترقية ذكية للاستضافة المشتركة. يتم تقسيم السيرفر فيزيائياً إلى عدة أقسام افتراضية، مما يمنحك موارد مخصصة لك لا يتشارك فيها أحد معك.\nالمميزات: أداء ثابت، تحكم أكبر، أمان عالٍ.\n\nثالثاً: الاستضافة السحابية (Cloud Hosting)\nتعتمد على شبكة من السيرفرات تعمل معاً. إذا تعطل أحد السيرفرات، يقوم سيرفر آخر بالعمل مكانه فوراً.\nالمميزات: مرونة عالية جداً، استقرار مذهل، تدفع مقابل ما تستهلكه فقط.\n\nرابعاً: السيرفرات الكاملة (Dedicated Server)\nهنا تستأجر سيرفراً كامل لك وحدك. كل قوة المعالجة والتخزين مخصصة لموقعك فقط.\nالمميزات: قوة قصوى، أمان مطلق، تحكم كامل في الإعدادات.\n\nكيف تختار الاستضافة الأنسب لك؟\n1. حجم الزوار المتوقع: إذا كنت تبدأ بمدونة بسيطة، فالاستضافة المشتركة كافية.\n2. سرعة الاستجابة: ابحث عن استضافة توفر سيرفرات قريبة من جمهورك.\n3. الدعم الفني: تأكد من أن الشركة توفر دعماً على مدار الساعة.\n\nفي "حلال ديجيتال"، نحن نساعدك على اختيار أفضل استضافة ونهتم بكافة الإعدادات التقنية.`,
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200', // تحديث الصورة إلى صورة سيرفرات احترافية جداً
        date: new Date().toISOString()
    },
    {
        id: 'seo-guide-2024',
        title: 'الدليل الشامل للسيو (SEO): كيف تتصدر نتائج البحث في المغرب؟',
        excerpt: 'تعلم استراتيجيات تحسين محركات البحث لتحويل موقعك إلى مغناطيس للزبناء بدون إعلانات مدفوعة.',
        content: `ما هو السيو (SEO) ولماذا هو ضروري لعملك؟\nالسيو هو عملية تحسين موقعك الإلكتروني لزيادة ظهوره في نتائج محركات البحث مثل جوجل. في السوق المغربي المتزايد التنافسية، لم يعد امتلاك موقع كافياً، بل يجب أن يكون هذا الموقع قابلاً للإيجاد.\n\nأهمية السيو للأعمال والمقاولات:\n1. حركة مرور مجانية ومستدامة.\n2. بناء الثقة والمصداقية.\n3. فهم سلوك الزبون المغربي.\n\nالركائز الأساسية للسيو الناجح:\nأولاً: السيو التقني (Technical SEO) يتعلق ببرمجة الموقع وسرعته.\nثانياً: المحتوى (Content) كتابة مقالات مفيدة تجيب على أسئلة زوارك.\nثالثاً: الروابط الخارجية (Backlinks) وهي الإشارات التي تأتي من مواقع أخرى.`,
        image: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&q=80&w=1200',
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
    siteName: 'حلال ديجيتال'
};

// --- App State ---
const loadState = () => {
    try {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) document.documentElement.classList.add('dark');
        
        const storedVersion = localStorage.getItem('app_version');
        if (storedVersion !== APP_VERSION) {
            localStorage.setItem('articles', JSON.stringify(INITIAL_ARTICLES));
            localStorage.setItem('projects', JSON.stringify(INITIAL_PROJECTS));
            localStorage.setItem('app_version', APP_VERSION);
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

// --- AdSense Renderer ---
const renderAdUnit = (type: 'adsHeader' | 'adsMiddle' | 'adsBottom', label: string) => {
    const adCode = state.settings[type];
    if (adCode && adCode.trim() !== '') {
        return `<div class="my-6 md:my-10 overflow-hidden flex justify-center max-w-full ad-container">${adCode}</div>`;
    }
    return `<div class="my-6 md:my-10 p-6 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center text-gray-300 dark:text-gray-700 text-xs font-bold uppercase">إعلان ${label}</div>`;
};

// --- Page Renderers ---
const renderPrivacyPolicy = () => {
    updateMeta('سياسة الخصوصية');
    return `
        <div class="max-w-4xl mx-auto px-6 py-20 animate-fadeIn text-right dark:text-white">
            <h1 class="text-4xl font-black mb-10">سياسة الخصوصية</h1>
            <div class="prose prose-lg dark:prose-invert space-y-6">
                <p>في <strong>حلال ديجيتال</strong>، نولي خصوصية زوارنا أهمية بالغة. توضح هذه الوثيقة أنواع المعلومات الشخصية التي نجمعها وكيفية استخدامها.</p>
                <h3 class="text-xl font-bold">ملفات تعريف الارتباط (Cookies)</h3>
                <p>نحن نستخدم ملفات تعريف الارتباط لتخزين تفضيلات الزوار وتحسين تجربة المستخدم. قد تقوم شركات الإعلانات مثل Ezoic وGoogle AdSense باستخدام هذه الملفات لعرض إعلانات مخصصة.</p>
                <h3 class="text-xl font-bold">جمع البيانات</h3>
                <p>نحن نجمع فقط المعلومات التي تقدمها لنا طواعية (مثل الاسم ورقم الهاتف عند طلب خدمة). لا نقوم ببيع أو مشاركة بياناتك مع أطراف ثالثة.</p>
            </div>
        </div>
    `;
};

const renderTerms = () => {
    updateMeta('شروط الخدمة');
    return `
        <div class="max-w-4xl mx-auto px-6 py-20 animate-fadeIn text-right dark:text-white">
            <h1 class="text-4xl font-black mb-10">شروط الخدمة</h1>
            <div class="prose prose-lg dark:prose-invert space-y-6">
                <p>باستخدامك لموقع حلال ديجيتال، فإنك توافق على الالتزام بالشروط التالية:</p>
                <ul class="list-disc list-inside">
                    <li>المحتوى المنشور في المدونة هو ملكية فكرية للوكالة.</li>
                    <li>يُمنع نسخ المقالات دون ذكر المصدر برابط مباشر.</li>
                    <li>الخدمات المقدمة تخضع لاتفاقيات خاصة بكل عميل.</li>
                </ul>
            </div>
        </div>
    `;
};

const renderHome = () => {
    updateMeta('الرئيسية');
    return `
    <div class="space-y-16 md:space-y-32 animate-fadeIn pb-10 text-right dark:bg-gray-950">
        <section class="relative min-h-[500px] flex items-center bg-gray-950 text-white overflow-hidden px-4">
            <div class="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover">
            </div>
            <div class="max-w-7xl mx-auto relative z-10 w-full py-16 text-right">
                <div class="max-w-4xl space-y-10">
                    <h1 class="text-5xl md:text-8xl font-black leading-tight">واقعك الرقمي <br><span class="text-blue-500">يبدأ من هنا</span></h1>
                    <p class="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl">وكالة حلال ديجيتال: شريكك الموثوق لبناء المتاجر والمواقع الأكثر مبيعاً في المغرب.</p>
                    <button onclick="document.getElementById('portfolio').scrollIntoView({behavior:'smooth'})" class="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl">تصفح أعمالنا</button>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-6" id="portfolio">
            <div class="flex justify-between items-end mb-16">
                <h2 class="text-4xl font-black text-gray-900 dark:text-white">جديد المدونة</h2>
                <a href="#/blog" class="text-blue-600 font-black">كل المقالات ←</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
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

const renderBlog = () => {
    updateMeta('المدونة التقنية');
    return `
    <div class="max-w-7xl mx-auto px-6 py-20 animate-fadeIn space-y-16 text-center">
        <h1 class="text-5xl font-black dark:text-white">المدونة التقنية</h1>
        ${renderAdUnit('adsHeader', 'Header')}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-right">
            ${state.articles.map((a: any) => `
                <article class="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer" onclick="window.location.hash='#/article/${a.id}'">
                    <img src="${a.image}" class="h-60 w-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'">
                    <div class="p-8 space-y-4">
                        <h3 class="text-2xl font-black dark:text-white line-clamp-2">${a.title}</h3>
                        <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">${a.excerpt}</p>
                    </div>
                </article>
            `).join('')}
        </div>
        ${renderAdUnit('adsBottom', 'Footer')}
    </div>
`;
};

const renderArticleDetail = (id: string) => {
    const article = state.articles.find((a: any) => a.id === id);
    if (!article) return `<div class="text-center py-40 font-black text-3xl dark:text-white">المقال غير موجود</div>`;

    updateMeta(article.title, article.excerpt);

    // Schema Markup for Google & Ad networks
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "image": article.image,
        "datePublished": article.date,
        "author": {"@type": "Organization", "name": "حلال ديجيتال"},
        "description": article.excerpt
    };

    return `
        <script type="application/ld+json">${JSON.stringify(schema)}</script>
        <div class="max-w-4xl mx-auto px-6 py-20 animate-fadeIn text-right">
            <h1 class="text-4xl md:text-6xl font-black leading-tight mb-12 dark:text-white">${article.title}</h1>
            
            ${renderAdUnit('adsHeader', 'Article Top')}
            
            <img src="${article.image}" class="w-full h-auto rounded-[3rem] shadow-2xl mb-12" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200'">
            
            <div class="prose prose-xl dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 font-medium leading-relaxed">
                ${article.content.split('\n').map((p: string, i: number) => {
                    if (p.trim() === '') return '';
                    return `<p class="mb-6">${p}</p>${i === 1 ? renderAdUnit('adsMiddle', 'In-Content') : ''}`;
                }).join('')}
            </div>

            <div class="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4">
                 <button onclick="copyArticleLink()" class="px-8 py-3 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-xl font-black">نسخ الرابط</button>
                 <a href="https://wa.me/${state.settings.whatsappNumber}" class="px-8 py-3 bg-green-500 text-white rounded-xl font-black">مشاركة عبر واتساب</a>
            </div>
            ${renderAdUnit('adsBottom', 'Article Bottom')}
        </div>
    `;
};

// --- Admin Section ---
const renderDashboard = () => `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row animate-fadeIn text-right">
        <aside class="w-full md:w-80 bg-gray-900 text-white p-10 flex flex-col">
            <div class="text-2xl font-black mb-12">لوحة التحكم</div>
            <nav class="flex flex-col gap-4">
                <button onclick="switchTab('articles')" class="text-right p-4 rounded-xl hover:bg-white/5 font-black">✍️ المقالات</button>
                <button onclick="switchTab('settings')" class="text-right p-4 rounded-xl hover:bg-white/5 font-black">⚙️ الإعدادات</button>
                <button onclick="logout()" class="text-right p-4 bg-red-500/10 text-red-400 rounded-xl font-black mt-20">خروج</button>
            </nav>
        </aside>
        <main class="flex-1 p-16 overflow-y-auto">
            <div id="dash-content" class="max-w-5xl mx-auto space-y-12"></div>
        </main>
    </div>
`;

(window as any).switchTab = (tab: string) => {
    const container = document.getElementById('dash-content');
    if (!container) return;
    
    if (tab === 'articles') {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-black dark:text-white">إدارة المدونة</h2>
                <button onclick="openArticleForm()" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-lg">إضافة مقال جديد</button>
            </div>
            <div class="grid gap-4">
                ${state.articles.map((a: any) => `
                    <div class="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <img src="${a.image}" class="w-16 h-16 rounded-xl object-cover" onerror="this.src='https://via.placeholder.com/150'">
                            <h4 class="font-black dark:text-white">${a.title}</h4>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="openArticleForm('${a.id}')" class="p-2 bg-blue-50 text-blue-600 rounded-lg font-bold">تعديل</button>
                            <button onclick="deleteArticle('${a.id}')" class="p-2 bg-red-50 text-red-600 rounded-lg font-bold">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'settings') {
        container.innerHTML = `
            <h2 class="text-3xl font-black mb-8 dark:text-white">إعدادات الموقع (Sitemap & Ads)</h2>
            <div class="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block font-black mb-2 dark:text-gray-400">كلمة السر</label>
                        <input id="set-pass" type="password" value="${state.settings.dashPassword}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-bold">
                    </div>
                    <div>
                        <label class="block font-black mb-2 dark:text-gray-400">رقم الواتساب</label>
                        <input id="set-wa" value="${state.settings.whatsappNumber}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-bold">
                    </div>
                </div>
                <div>
                    <label class="block font-black mb-2 dark:text-gray-400">كود الإعلان العلوي (Ezoic/AdSense)</label>
                    <textarea id="set-ads-header" class="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none font-mono text-xs">${state.settings.adsHeader}</textarea>
                </div>
                <button onclick="updateSettings()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black shadow-xl">حفظ كل الإعدادات ✅</button>
            </div>
        `;
    }
};

(window as any).openArticleForm = (id?: string) => {
    const container = document.getElementById('dash-content');
    if (!container) return;
    const article = id ? state.articles.find((a: any) => a.id === id) : null;
    const initialImg = article ? article.image : 'https://via.placeholder.com/800x450';
    container.innerHTML = `
        <div class="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] space-y-6">
            <input type="hidden" id="edit-id" value="${id || ''}">
            <input id="edit-title" value="${article ? article.title : ''}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl font-black" placeholder="العنوان">
            <input id="edit-image" oninput="document.getElementById('img-preview').src = this.value" value="${article ? article.image : ''}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl font-bold" placeholder="رابط الصورة">
            <div class="w-full aspect-video rounded-2xl overflow-hidden border">
                <img id="img-preview" src="${initialImg}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/800x450?text=Invalid+Image'">
            </div>
            <textarea id="edit-excerpt" class="w-full h-24 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl font-bold" placeholder="الوصف القصير">${article ? article.excerpt : ''}</textarea>
            <textarea id="edit-content" class="w-full h-96 p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl font-medium" placeholder="المحتوى الكامل">${article ? article.content : ''}</textarea>
            <button onclick="saveArticle()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black shadow-xl">حفظ المقال</button>
        </div>
    `;
};

(window as any).saveArticle = () => {
    const id = (document.getElementById('edit-id') as HTMLInputElement).value;
    const title = (document.getElementById('edit-title') as HTMLInputElement).value;
    const excerpt = (document.getElementById('edit-excerpt') as HTMLTextAreaElement).value;
    const image = (document.getElementById('edit-image') as HTMLInputElement).value;
    const content = (document.getElementById('edit-content') as HTMLTextAreaElement).value;

    if (!title || !content) return alert('يرجى ملء البيانات');

    if (id) {
        const idx = state.articles.findIndex((a: any) => a.id === id);
        state.articles[idx] = { ...state.articles[idx], title, excerpt, image, content };
    } else {
        state.articles.unshift({ id: 'art-' + Date.now(), title, excerpt, image, content, date: new Date().toISOString() });
    }
    saveState();
    (window as any).switchTab('articles');
};

(window as any).deleteArticle = (id: string) => {
    if (confirm('هل تريد الحذف؟')) {
        state.articles = state.articles.filter((a: any) => a.id !== id);
        saveState();
        (window as any).switchTab('articles');
    }
};

(window as any).updateSettings = () => {
    state.settings.whatsappNumber = (document.getElementById('set-wa') as HTMLInputElement).value;
    state.settings.dashPassword = (document.getElementById('set-pass') as HTMLInputElement).value;
    state.settings.adsHeader = (document.getElementById('set-ads-header') as HTMLTextAreaElement).value;
    saveState();
    alert('✅ تم التحديث بنجاح');
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
    else if (hash === '#/blog') root.innerHTML = renderBlog();
    else if (hash === '#/privacy') root.innerHTML = renderPrivacyPolicy();
    else if (hash === '#/terms') root.innerHTML = renderTerms();
    else if (hash.startsWith('#/article/')) root.innerHTML = renderArticleDetail(hash.replace('#/article/', ''));
    else if (isDashboard) {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            root.innerHTML = `<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4"><div class="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-xl text-center space-y-8 w-full max-w-md"><h2 class="text-2xl font-black dark:text-white">تسجيل الدخول</h2><input type="password" id="dash-pass" class="w-full p-5 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl text-center font-bold outline-none" placeholder="كلمة السر"><button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl">دخول آمن</button></div></div>`;
        } else {
            root.innerHTML = renderDashboard();
            (window as any).switchTab('articles');
        }
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
