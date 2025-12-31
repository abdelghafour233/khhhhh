
/**
 * storehalal Blog - Version 7.8 (The Adsterra Professional Ready Update 💰)
 */

// --- البيانات الافتراضية ---
const INITIAL_ARTICLES = [
    {
        id: 'fullstack-roadmap-2025',
        title: 'الدليل الشامل لاحتراف تطوير الويب Full-Stack في 2025',
        excerpt: 'خارطة طريق مفصلة لتعلم أحدث التقنيات من البداية وحتى الاحتراف والعمل الحر.',
        content: `في ظل التطور المتسارع الذي يشهده عالم الويب، لم يعد كافياً تعلم HTML و CSS فقط. لكي تصبح مطوراً ناجحاً في 2025، يجب أن تمتلك رؤية شاملة للمنظومة التقنية.

أولاً: الواجهات الأمامية (Frontend)
تجاوزت React كونها مجرد مكتبة لتصبح بيئة عمل كاملة. ينصح الآن بتعلم Next.js 15 كإطار عمل أساسي لما يوفره من سرعة في الأداء (Server Components) وتحسين لمحركات البحث. لا غنى أيضاً عن Tailwind CSS لتصميم واجهات عصرية بسرعة فائقة.

ثانياً: الواجهات الخلفية (Backend)
تعتبر Node.js الخيار الأقوى نظراً لسرعتها وتوافقها مع لغة JavaScript الموحدة. تعلم التعامل مع قواعد البيانات مثل MongoDB للتطبيقات المرنة، أو PostgreSQL للتطبيقات التي تتطلب دقة عالية في البيانات.

ثالثاً: النشر والسحاب (DevOps)
لم يعد المبرمج يكتب الكود فقط، بل يجب أن يعرف كيف ينشره. منصات مثل Vercel و Railway جعلت عملية النشر سهلة، لكن فهم أساسيات Docker و CI/CD سيعطيك أفضلية كبرى في سوق الشغل الدولي والمغربي.

رابعاً: الذكاء الاصطناعي (AI)
استخدام أدوات مثل GitHub Copilot و Cursor أصبح ضرورة لزيادة الإنتاجية. المبرمج الذي يعرف كيف يوجه الذكاء الاصطناعي هو الذي سيقود المستقبل.`,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    },
    {
        id: 'ai-integration-guide',
        title: 'كيفية دمج الذكاء الاصطناعي (Gemini API) في تطبيقات الويب',
        excerpt: 'تعلم كيف تحول موقعك التقليدي إلى موقع ذكي يستخدم قوة نماذج اللغة الكبيرة.',
        content: `لقد انتقلنا من عصر "المواقع الثابتة" إلى عصر "المواقع الذكية". دمج نماذج مثل Gemini API في موقعك يمكن أن يغير تجربة المستخدم بشكل جذري.

لماذا Gemini API؟
تتميز نماذج جوجل بقدرتها العالية على فهم السياق العربي وبسرعة استجابة مذهلة، والأهم من ذلك أنها توفر خططاً مجانية للمطورين للبدء في تجاربهم.

خطوات الدمج العملي:
1. الحصول على مفتاح API من Google AI Studio.
2. استخدام مكتبة @google/genai في مشروعك.
3. إنشاء "System Instructions" دقيقة لتوجيه النموذج (مثلاً: أنت مساعد تقني متخصص في البرمجة).

حالات استخدام واقعية:
- بناء شات بوت (Chatbot) ذكي يجيب على أسئلة العملاء بناءً على قاعدة بيانات منتجاتك.
- تلخيص المقالات الطويلة تلقائياً للمستخدمين.
- توليد صور ووصف للمنتجات في المتاجر الإلكترونية بضغطة زر واحدة.

الأمن والخصوصية:
من المهم جداً عدم تخزين مفاتيح API في الواجهة الأمامية للموقع مباشرة، بل يجب استخدام "Serverless Functions" أو وسيط Backend لحماية بياناتك من الاختراق.`,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    },
    {
        id: 'web-performance-seo',
        title: 'أسرار الأداء العالي وتحسين محركات البحث SEO للمبرمجين',
        excerpt: 'كيف تجعل موقعك يتصدر نتائج البحث ويحقق سرعة خيالية في التحميل.',
        content: `جوجل لا تحب المواقع البطيئة، والمستخدمون يغادرون الموقع إذا استغرق أكثر من 3 ثوانٍ للتحميل. إليك كيف تبرمج باحترافية لتحقيق أفضل النتائج.

قواعد البيانات والصور:
السبب الرئيسي لبطء المواقع هو الصور الضخمة. استخدم صيغة WebP دائماً، وقم بتطبيق "Lazy Loading" بحيث لا يتم تحميل الصور إلا عندما يصل إليها المستخدم أثناء التمرير.

الـ SEO التقني (Technical SEO):
لا يكفي كتابة كلمات دلالية. يجب أن يكون كودك مفهوماً لعناكب جوجل. استخدم "Semantic HTML" (مثل استخدام <article> بدلاً من <div> للمقالات). تأكد من وجود ملف sitemap.xml وملف robots.txt محدثين.

تحسين Core Web Vitals:
ركز على مقياس LCP (أكبر عنصر محتوى مرئي) واحرص على ألا يتجاوز 2.5 ثانية. تقليل حجم ملفات JavaScript غير الضرورية (Code Splitting) يلعب دوراً حاسماً هنا.

التجربة على الهاتف المحمول:
بما أن أكثر من 70% من الزوار يستخدمون الهواتف، فإن تصميمك يجب أن يكون Mobile-First. جوجل تعتمد الآن بشكل أساسي على نسخة الهاتف لترتيب موقعك في النتائج.`,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    }
];

const INITIAL_SETTINGS = {
    whatsapp: '212649075664',
    siteName: 'storehalal',
    adminPass: 'halal2025',
    adsterra: {
        header: '',
        middle: '',
        bottom: ''
    }
};

// --- إدارة الحالة ---
let state = {
    articles: JSON.parse(localStorage.getItem('articles') || JSON.stringify(INITIAL_ARTICLES)),
    settings: JSON.parse(localStorage.getItem('settings') || JSON.stringify(INITIAL_SETTINGS)),
    isAdmin: sessionStorage.getItem('isAdmin') === 'true',
    currentEditId: null as string | null
};

const saveState = () => {
    localStorage.setItem('articles', JSON.stringify(state.articles));
    localStorage.setItem('settings', JSON.stringify(state.settings));
};

const updateSEO = (title: string, description: string) => {
    document.title = `${title} | ${state.settings.siteName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
};

// وظيفة لتشغيل سكربتات Adsterra بشكل صحيح
const injectAd = (containerId: string, code: string) => {
    const container = document.getElementById(containerId);
    if (!container || !code) return;
    container.innerHTML = '';
    const range = document.createRange();
    range.selectNode(container);
    const documentFragment = range.createContextualFragment(code);
    container.appendChild(documentFragment);
};

// --- أيقونات SVG ---
const ICON_WHATSAPP = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
const EYE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12.a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
const ICON_COPY = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;

const getShareButtonsHTML = (id: string, title: string, isSmall: boolean = false) => {
    const url = `${window.location.origin}${window.location.pathname}#/article/${id}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    if (isSmall) {
        return `
            <div class="flex items-center gap-2 mt-4" onclick="event.stopPropagation()">
                <a href="https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}" target="_blank" class="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition shadow-sm">${ICON_WHATSAPP.replace('w-5 h-5', 'w-4 h-4')}</a>
                <button onclick="copyToClipboard('${url}')" class="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:scale-110 transition shadow-sm">${ICON_COPY.replace('w-5 h-5', 'w-4 h-4')}</button>
            </div>
        `;
    }
    return `
        <div class="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
            <h3 class="text-xl font-black mb-6 dark:text-white">شارك المعرفة مع أصدقائك 🚀</h3>
            <div class="flex justify-center gap-4">
                <a href="https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}" target="_blank" class="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold hover:shadow-lg transition">واتساب</a>
                <button onclick="copyToClipboard('${url}')" class="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:shadow-lg transition">نسخ الرابط</button>
            </div>
        </div>
    `;
};

const renderHome = () => {
    updateSEO("الرئيسية - مركز البرمجة والتقنية", "اكتشف أفضل المقالات والدروس في البرمجة وتطوير الويب مع storehalal.");
    setTimeout(() => injectAd('ad-header', state.settings.adsterra.header), 100);
    return `
        <div class="animate-fadeIn">
            <section class="bg-slate-950 text-white py-20 px-4 text-center">
                <h1 class="text-4xl md:text-6xl font-black mb-6 leading-tight">المركز التقني لـ <span class="text-blue-500">${state.settings.siteName}</span></h1>
                <p class="text-slate-400 max-w-2xl mx-auto text-lg">نقدم لكم أفضل المقالات في البرمجة والتكنولوجيا والربح من الإنترنت.</p>
            </section>
            <section class="max-w-7xl mx-auto px-4 py-12">
                <div id="ad-header" class="mb-10 text-center overflow-hidden min-h-[90px]"></div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${state.articles.map((a: any) => `
                        <article onclick="window.location.hash='#/article/${a.id}'" class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer group">
                            <div class="relative overflow-hidden aspect-video">
                                <img src="${a.image}" alt="${a.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                            </div>
                            <div class="p-6 text-right">
                                <h3 class="text-xl font-black mb-3 dark:text-white line-clamp-2 leading-tight">${a.title}</h3>
                                <p class="text-slate-500 text-sm line-clamp-3 mb-4">${a.excerpt}</p>
                                ${getShareButtonsHTML(a.id, a.title, true)}
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
    if (!article) return `<div class="py-20 text-center">المقال غير موجود</div>`;
    updateSEO(article.title, article.excerpt);
    setTimeout(() => {
        injectAd('ad-article-top', state.settings.adsterra.header);
        injectAd('ad-article-middle', state.settings.adsterra.middle);
        injectAd('ad-article-bottom', state.settings.adsterra.bottom);
    }, 100);
    return `
        <div class="max-w-4xl mx-auto px-4 py-8 text-right animate-fadeIn">
            <div id="ad-article-top" class="mb-8 text-center overflow-hidden min-h-[90px]"></div>
            <h1 class="text-3xl md:text-5xl font-black mb-8 dark:text-white leading-tight">${article.title}</h1>
            <img src="${article.image}" alt="${article.title}" class="w-full rounded-3xl shadow-2xl mb-10">
            <div id="ad-article-middle" class="my-10 text-center overflow-hidden min-h-[250px]"></div>
            <div class="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                ${article.content.split('\n').map((p: string) => `<p class="mb-6 leading-relaxed">${p}</p>`).join('')}
            </div>
            ${getShareButtonsHTML(article.id, article.title)}
            <div id="ad-article-bottom" class="mt-12 text-center overflow-hidden min-h-[250px]"></div>
        </div>
    `;
};

// صفحات إضافية للقبول في شركات الإعلانات
const renderPrivacy = () => `
    <div class="max-w-4xl mx-auto px-4 py-16 text-right animate-fadeIn">
        <h1 class="text-4xl font-black mb-8 dark:text-white">سياسة الخصوصية</h1>
        <div class="space-y-6 text-slate-600 dark:text-slate-400 leading-loose">
            <p>في <strong>${state.settings.siteName}</strong>، نولي خصوصية زوارنا أهمية بالغة. توضح هذه الوثيقة أنواع المعلومات الشخصية التي نجمعها وكيفية استخدامها.</p>
            <h2 class="text-2xl font-bold dark:text-white mt-8">ملفات السجل</h2>
            <p>مثل العديد من مواقع الويب الأخرى، يستخدم موقعنا ملفات السجل التي تشمل عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت، وغيرها من البيانات غير الشخصية.</p>
            <h2 class="text-2xl font-bold dark:text-white mt-8">ملفات تعريف الارتباط (Cookies)</h2>
            <p>نحن نستخدم ملفات تعريف الارتباط لتخزين معلومات حول تفضيلات الزوار وتخصيص تجربة المستخدم.</p>
        </div>
    </div>
`;

const renderContact = () => `
    <div class="max-w-2xl mx-auto px-4 py-16 text-right animate-fadeIn">
        <h1 class="text-4xl font-black mb-8 dark:text-white text-center">اتصل بنا</h1>
        <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <form onsubmit="event.preventDefault(); alert('شكراً لرسالتك! سنرد عليك قريباً.');" class="space-y-6">
                <div>
                    <label class="block font-bold mb-2 text-slate-500">الاسم الكامل</label>
                    <input type="text" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block font-bold mb-2 text-slate-500">البريد الإلكتروني</label>
                    <input type="email" required class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block font-bold mb-2 text-slate-500">رسالتك</label>
                    <textarea required class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-32"></textarea>
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">إرسال الرسالة</button>
            </form>
            <div class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                <p class="text-slate-500 mb-4">أو تواصل معنا عبر واتساب مباشرة:</p>
                <a href="https://wa.me/${state.settings.whatsapp}" target="_blank" class="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold">تواصل واتساب</a>
            </div>
        </div>
    </div>
`;

const syncUI = () => {
    const footer = document.getElementById('dynamic-footer');
    if (footer) {
        footer.innerHTML = `
            <footer class="bg-slate-900 text-white py-16 mt-20 border-t border-slate-800 text-center md:text-right">
                <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <div class="text-3xl font-black text-blue-500 mb-6">${state.settings.siteName}</div>
                        <p class="text-slate-400 leading-loose">منصة تقنية متخصصة في تقديم أحدث الحلول البرمجية والمقالات التعليمية بجودة عالية واحترافية.</p>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold mb-6">صفحات تهمك</h4>
                        <div class="flex flex-col gap-4 text-slate-400">
                            <a href="#/privacy" class="hover:text-white transition">سياسة الخصوصية</a>
                            <a href="#/terms" class="hover:text-white transition">اتفاقية الاستخدام</a>
                            <a href="#/contact" class="hover:text-white transition">اتصل بنا</a>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold mb-6">تابعنا</h4>
                        <div class="flex flex-wrap justify-center md:justify-start gap-4">
                            <a href="https://wa.me/${state.settings.whatsapp}" class="bg-white/5 p-3 rounded-xl hover:bg-blue-600 transition">واتساب</a>
                            <a href="#/dashboard" class="bg-white/5 p-3 rounded-xl hover:bg-slate-700 transition">لوحة الإدارة</a>
                        </div>
                    </div>
                </div>
                <div class="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
                    © ${new Date().getFullYear()} ${state.settings.siteName}. جميع الحقوق محفوظة.
                </div>
            </footer>
        `;
    }
};

const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    if (!root) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/blog') root.innerHTML = renderHome();
    else if (hash === '#/privacy') root.innerHTML = renderPrivacy();
    else if (hash === '#/terms') root.innerHTML = renderPrivacy().replace('سياسة الخصوصية', 'اتفاقية الاستخدام');
    else if (hash === '#/contact') root.innerHTML = renderContact();
    else if (hash.startsWith('#/article/')) root.innerHTML = renderArticle(hash.replace('#/article/', ''));
    else if (hash.startsWith('#/dashboard')) {
        // تم استيراد renderDashboard من الإصدار السابق داخلياً
        root.innerHTML = (window as any).renderDashboard ? (window as any).renderDashboard() : '<div class="p-20 text-center">جاري التحميل...</div>';
    }

    syncUI();
};

// الاحتفاظ بـ renderDashboard متاحاً للراوتر
(window as any).renderDashboard = () => {
    if (!state.isAdmin) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <div class="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl w-full max-w-md text-right border dark:border-slate-800">
                    <h2 class="text-2xl font-black mb-8 dark:text-white text-center">🔐 دخول المسؤول</h2>
                    <input type="password" id="login-pass" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl mb-6 text-center focus:ring-2 focus:ring-blue-500 outline-none" placeholder="كلمة السر">
                    <button onclick="handleLogin()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg shadow-lg hover:bg-blue-700 transition">دخول</button>
                </div>
            </div>
        `;
    }
    // بقية كود الداشبورد كما في الإصدار السابق ولكن مع تحسينات طفيفة
    return `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-right">
            <aside class="w-full md:w-72 bg-slate-900 text-white p-8 flex flex-col">
                <div class="text-2xl font-black text-blue-500 mb-10 italic">إدارة storehalal</div>
                <nav class="flex flex-col gap-2">
                    <button onclick="switchDashTab('articles')" class="text-right p-4 rounded-xl hover:bg-white/5 font-bold transition">📚 المقالات</button>
                    <button onclick="switchDashTab('adsterra')" class="text-right p-4 rounded-xl hover:bg-white/5 font-bold transition">💰 الإعلانات</button>
                    <button onclick="switchDashTab('settings')" class="text-right p-4 rounded-xl hover:bg-white/5 font-bold transition">⚙️ الإعدادات</button>
                    <button onclick="handleLogout()" class="text-right p-4 rounded-xl hover:bg-red-500/20 text-red-400 font-bold mt-4 transition">🚪 خروج</button>
                </nav>
            </aside>
            <main class="flex-1 p-4 md:p-12 overflow-x-hidden" id="dash-panel"></main>
        </div>
    `;
};

(window as any).handleLogin = () => {
    const pass = (document.getElementById('login-pass') as HTMLInputElement).value;
    if (pass === state.settings.adminPass) {
        state.isAdmin = true;
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else alert('❌ كلمة السر غير صحيحة');
};

(window as any).handleLogout = () => {
    state.isAdmin = false;
    sessionStorage.removeItem('isAdmin');
    router();
};

(window as any).copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert('تم نسخ الرابط! 🎉'));
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
