
/**
 * Halal Digital Services - Version 5.6
 * Feature: Desktop & Mobile Full Compatibility
 */

// --- Constants & Data ---
const APP_VERSION = '5.6'; 

const INITIAL_ARTICLES = [
    {
        id: 'ecommerce-morocco-2024',
        title: 'دليل التجارة الإلكترونية في المغرب: كيف تبدأ من الصفر؟',
        excerpt: 'تعرف على الخطوات الأساسية لإطلاق متجرك الإلكتروني في المغرب، من اختيار المنتج إلى طرق الدفع والشحن المحلي.',
        content: `تعتبر التجارة الإلكترونية في المغرب من أسرع القطاعات نمواً. إذا كنت ترغب في البدء، فهذا هو دليلك الشامل.\n\nأولاً: اختيار التخصص (Niche)\nلا تحاول بيع كل شيء. تخصص في فئة معينة مثل الملابس التقليدية، أدوات المطبخ، أو المنتجات التقنية. التخصص يمنحك مصداقية أكبر.\n\nثانياً: بناء المتجر\nيمكنك البدء بمتجر بسيط على شوبيفاي أو يوكان، أو حتى صفحة هبوط (Landing Page) إذا كنت تبيع منتجاً واحداً. المهم هو واجهة مستخدم نظيفة ومتجاوبة مع الهاتف.\n\nثالثاً: نظام الدفع عند الاستلام (COD)\nفي المغرب، لا يزال الدفع عند الاستلام هو الملك. تأكد من توفير نظام تتبع للطلبات والاتصال بالزبائن لتأكيد الطلب قبل الشحن.\n\nنحن في حلال ديجيتال نساعدك في كافة هذه الخطوات التقنية.`,
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    },
    {
        id: 'ai-programming-future',
        title: 'الذكاء الاصطناعي والبرمجة: هل سيعوض الروبوت المبرمج البشري؟',
        excerpt: 'استكشف كيف يغير الذكاء الاصطناعي عالم تطوير البرمجيات، وكيف يمكنك كمبرمج استغلال هذه التقنيات لتعزيز إنتاجيتك.',
        content: `الذكاء الاصطناعي لا يقتل البرمجة، بل يمنح المبرمج "قوى خارقة". أدوات مثل GitHub Copilot و Gemini تساعد في كتابة الأكواد الروتينية، مما يترك للمبرمج وقتاً أطول لحل المشكلات المعقدة والابتكار.\n\nالمستقبل للمبرمج الذي يتقن توظيف الذكاء الاصطناعي في عمله اليومي.`,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    }
];

const DEFAULT_PASS = 'halal2025';

const INITIAL_SETTINGS = {
    dashPassword: DEFAULT_PASS,
    whatsappNumber: '212649075664',
    siteName: 'حلال ديجيتال',
    socialLinks: {
        facebook: 'https://facebook.com/abdelghaforbahaddou',
        twitter: 'https://twitter.com/abdelghaforbahaddou',
        instagram: 'https://instagram.com/abdelghaforbahaddou',
        telegram: 'https://t.me/abdelghaforbahaddou',
        pinterest: 'https://pinterest.com/abdelghaforbahaddou'
    },
    ads: { header: '', middle: '', bottom: '' }
};

// --- Icons (Same high quality icons) ---
const SOCIAL_ICONS = {
    facebook: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>`,
    twitter: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    instagram: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    telegram: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1 .22-1.62.15-.16 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.52-.46-.01-1.33-.26-1.98-.48-.8-.27-1.43-.42-1.37-.89.03-.25.38-.51 1.03-.78 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.21z"/></svg>`,
    pinterest: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.164 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>`
};

// --- App State ---
const loadState = () => {
    try {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) document.documentElement.classList.add('dark');
        
        const savedSettings = JSON.parse(localStorage.getItem('settings') || JSON.stringify(INITIAL_SETTINGS));
        const savedArticles = JSON.parse(localStorage.getItem('articles') || JSON.stringify(INITIAL_ARTICLES));

        return {
            articles: savedArticles,
            settings: savedSettings,
            isAuthenticated: sessionStorage.getItem('isAdmin') === 'true',
            isDarkMode: isDark
        };
    } catch (e) {
        return { articles: INITIAL_ARTICLES, settings: INITIAL_SETTINGS, isAuthenticated: false, isDarkMode: false };
    }
};

let state = loadState();

const saveState = () => {
    localStorage.setItem('articles', JSON.stringify(state.articles));
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('darkMode', state.isDarkMode.toString());
};

// --- Global Sync ---
const syncUI = () => {
    const wa = `https://wa.me/${state.settings.whatsappNumber}`;
    const headerWa = document.getElementById('header-wa-link') as HTMLAnchorElement;
    const mobileWa = document.getElementById('mobile-wa-btn') as HTMLAnchorElement;
    if (headerWa) headerWa.href = wa;
    if (mobileWa) mobileWa.href = wa;

    const footer = document.getElementById('dynamic-footer');
    if (footer) {
        footer.innerHTML = `
            <footer class="bg-gray-900 dark:bg-black text-white py-16 md:py-32 mt-20 border-t border-gray-800">
                <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
                    <div class="space-y-8 text-center md:text-right">
                        <div class="text-3xl font-black">${state.settings.siteName.split(' ')[0]} <span class="text-blue-500">${state.settings.siteName.split(' ').slice(1).join(' ') || ''}</span></div>
                        <p class="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0">وكالة رقمية متكاملة لخدمات البرمجة، التصميم، والتدوين التقني الاحترافي في المغرب.</p>
                    </div>
                    <div class="space-y-8 text-center md:text-right">
                        <h4 class="text-xl font-black text-blue-500">استكشف</h4>
                        <ul class="space-y-4 text-gray-400 font-bold text-sm">
                            <li><a href="#/blog" class="hover:text-white transition">المدونة التقنية</a></li>
                            <li><a href="#/privacy" class="hover:text-white transition">سياسة الخصوصية</a></li>
                            <li><a href="#/dashboard" class="hover:text-white transition">الإدارة</a></li>
                        </ul>
                    </div>
                    <div class="space-y-8 text-center md:text-right">
                        <h4 class="text-xl font-black text-blue-500">تابعنا</h4>
                        <div class="flex justify-center md:justify-start gap-4">
                            <a href="${state.settings.socialLinks.facebook}" target="_blank" class="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-full hover:scale-110 transition shadow-lg">${SOCIAL_ICONS.facebook}</a>
                            <a href="${state.settings.socialLinks.twitter}" target="_blank" class="w-12 h-12 bg-black flex items-center justify-center rounded-full border border-gray-700 hover:scale-110 transition shadow-lg">${SOCIAL_ICONS.twitter}</a>
                            <a href="${state.settings.socialLinks.instagram}" target="_blank" class="w-12 h-12 bg-gradient-to-tr from-yellow-500 to-purple-600 flex items-center justify-center rounded-full hover:scale-110 transition shadow-lg">${SOCIAL_ICONS.instagram}</a>
                            <a href="${state.settings.socialLinks.telegram}" target="_blank" class="w-12 h-12 bg-blue-400 flex items-center justify-center rounded-full hover:scale-110 transition shadow-lg">${SOCIAL_ICONS.telegram}</a>
                        </div>
                        <p class="text-gray-500 text-xs font-bold pt-4">واتساب: ${state.settings.whatsappNumber}</p>
                    </div>
                </div>
                <div class="text-center pt-24 text-gray-700 text-[10px] font-black uppercase tracking-widest px-4">
                    جميع الحقوق محفوظة © 2024 ${state.settings.siteName} - صُنع بكل إتقان في المغرب 🇲🇦
                </div>
            </footer>
        `;
    }
};

// --- Page Renderers ---
const renderHome = () => {
    syncUI();
    return `
        <div class="animate-fadeIn">
            <!-- Hero Section -->
            <section class="relative min-h-[500px] md:min-h-[700px] flex items-center overflow-hidden bg-gray-950 px-6">
                <div class="absolute inset-0 z-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover">
                </div>
                <div class="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-right">
                    <div class="space-y-8 md:space-y-12">
                        <h1 class="text-4xl md:text-8xl font-black text-white leading-tight">
                            ابتكر مشروعك <br><span class="text-blue-500">الرقمي القادم</span>
                        </h1>
                        <p class="text-gray-400 text-lg md:text-2xl font-medium max-w-xl mx-auto lg:mx-0">
                            نحن لا نصمم مواقع فقط، بل نبني تجارب مستخدم تزيد من مبيعاتك وتنمي علامتك التجارية.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button onclick="window.location.hash='#/blog'" class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xl transition shadow-2xl">تصفح المدونة</button>
                            <a href="https://wa.me/${state.settings.whatsappNumber}" target="_blank" class="bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-xl border border-white/20 backdrop-blur-sm">اطلب خدمتك</a>
                        </div>
                    </div>
                    <div class="hidden lg:block relative">
                         <div class="w-full aspect-square bg-blue-600/20 rounded-[5rem] animate-pulse absolute -inset-4 blur-2xl"></div>
                         <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" class="relative z-10 w-full rounded-[4rem] shadow-2xl border-4 border-white/10">
                    </div>
                </div>
            </section>

            <!-- Blog Section -->
            <section class="max-w-7xl mx-auto px-6 py-24 md:py-32">
                <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 md:mb-24">
                    <div class="text-center md:text-right">
                        <h2 class="text-3xl md:text-5xl font-black dark:text-white">جديد المدونة</h2>
                        <p class="text-gray-500 font-bold mt-2">آخر المقالات والتقنيات في عالم الويب</p>
                    </div>
                    <a href="#/blog" class="text-blue-600 font-black flex items-center gap-2 text-lg">كل المقالات <span class="text-2xl">←</span></a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    ${state.articles.slice(0, 3).map((a: any) => `
                        <article onclick="window.location.hash='#/article/${a.id}'" class="group bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all cursor-pointer">
                            <div class="overflow-hidden aspect-video">
                                <img src="${a.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                            </div>
                            <div class="p-8 space-y-4">
                                <h3 class="text-2xl font-black dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition">${a.title}</h3>
                                <p class="text-gray-500 dark:text-gray-400 line-clamp-2 font-medium">${a.excerpt}</p>
                                <span class="text-blue-500 font-black text-sm pt-4 block">اقرأ المزيد ↗</span>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        </div>
    `;
};

const renderBlog = () => {
    return `
        <div class="max-w-7xl mx-auto px-6 py-16 md:py-32 animate-fadeIn text-right">
            <header class="max-w-2xl space-y-4 mb-16 md:mb-24">
                <h1 class="text-4xl md:text-7xl font-black dark:text-white">المدونة <br><span class="text-blue-600">التقنية</span></h1>
                <p class="text-gray-500 md:text-xl font-medium">نشاركك الخبرة في البرمجة، السيو، والتجارة الإلكترونية في المغرب.</p>
            </header>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                ${state.articles.map((a: any) => `
                    <article onclick="window.location.hash='#/article/${a.id}'" class="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm cursor-pointer group hover:shadow-xl transition">
                        <img src="${a.image}" class="h-60 w-full object-cover">
                        <div class="p-8">
                            <h3 class="text-2xl font-black dark:text-white mb-4 line-clamp-2 leading-snug">${a.title}</h3>
                            <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">${a.excerpt}</p>
                        </div>
                    </article>
                `).join('')}
            </div>
        </div>
    `;
};

const renderArticle = (id: string) => {
    const article = state.articles.find((a: any) => a.id === id);
    if (!article) return `<div class="py-40 text-center font-black text-3xl">المقال غير موجود</div>`;
    
    return `
        <article class="max-w-4xl mx-auto px-6 py-12 md:py-24 animate-fadeIn text-right">
            <div class="mb-12">
                <a href="#/blog" class="text-blue-600 font-bold mb-6 inline-block">← العودة للمدونة</a>
                <h1 class="text-3xl md:text-6xl font-black dark:text-white leading-tight mb-8">${article.title}</h1>
                <div class="flex items-center gap-4 text-gray-400 text-sm font-bold">
                    <span>📅 ${new Date(article.date).toLocaleDateString('ar-MA')}</span>
                    <span>⏱️ 5 دقائق قراءة</span>
                </div>
            </div>
            
            <img src="${article.image}" class="w-full h-auto rounded-[3rem] shadow-2xl mb-12 border-8 border-gray-100 dark:border-gray-900">
            
            <div class="prose prose-lg md:prose-2xl dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 font-medium leading-relaxed">
                ${article.content.split('\n').map((p: string) => p.trim() ? `<p class="mb-8">${p}</p>` : '').join('')}
            </div>
            
            <div class="mt-24 p-8 md:p-12 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h4 class="text-2xl font-black dark:text-white mb-2">شارك الفائدة</h4>
                    <p class="text-gray-500 font-bold">إذا أعجبك المقال شاركه مع أصدقائك المبرمجين.</p>
                </div>
                <div class="flex gap-4">
                    <button onclick="navigator.clipboard.writeText(window.location.href); alert('تم نسخ الرابط ✅')" class="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl">نسخ الرابط 🔗</button>
                </div>
            </div>
        </article>
    `;
};

// --- Dashboard Logic ---
(window as any).switchTab = (tab: string) => {
    const root = document.getElementById('dash-content');
    if (!root) return;

    if (tab === 'settings') {
        root.innerHTML = `
            <h2 class="text-3xl font-black dark:text-white mb-10">إعدادات الموقع</h2>
            <div class="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="block font-black mb-3 text-gray-600 dark:text-gray-400">اسم الموقع</label>
                        <input id="set-name" value="${state.settings.siteName}" class="w-full p-5 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl text-right border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block font-black mb-3 text-gray-600 dark:text-gray-400">رقم الواتساب</label>
                        <input id="set-wa" value="${state.settings.whatsappNumber}" class="w-full p-5 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl text-right border dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
                    </div>
                </div>
                <div class="space-y-6">
                    <h3 class="text-xl font-black text-blue-600 border-b pb-4">روابط التواصل الاجتماعي</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${Object.keys(state.settings.socialLinks).map(key => `
                            <div>
                                <label class="block text-xs font-black mb-2 uppercase text-gray-400">${key}</label>
                                <input id="set-social-${key}" value="${state.settings.socialLinks[key]}" class="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl text-left font-mono text-xs border dark:border-gray-700" dir="ltr">
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button onclick="updateSettings()" class="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-700 transition">حفظ كافة الإعدادات ✅</button>
            </div>
        `;
    }
};

(window as any).updateSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.whatsappNumber = (document.getElementById('set-wa') as HTMLInputElement).value;
    Object.keys(state.settings.socialLinks).forEach(key => {
        state.settings.socialLinks[key] = (document.getElementById(`set-social-${key}`) as HTMLInputElement).value;
    });
    saveState();
    syncUI();
    alert('✅ تم تحديث الإعدادات بنجاح');
};

(window as any).login = () => {
    const pass = (document.getElementById('dash-pass') as HTMLInputElement).value;
    if (pass === DEFAULT_PASS || pass === state.settings.dashPassword) {
        sessionStorage.setItem('isAdmin', 'true');
        router();
    } else alert('❌ كلمة السر غير صحيحة');
};

(window as any).toggleDarkMode = () => {
    state.isDarkMode = !state.isDarkMode;
    document.documentElement.classList.toggle('dark', state.isDarkMode);
    saveState();
};

const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    if (!root) return;

    const isDashboard = hash.startsWith('#/dashboard');
    const header = document.getElementById('main-header');
    const footer = document.getElementById('dynamic-footer');
    if (header) header.style.display = isDashboard ? 'none' : 'block';
    if (footer) footer.style.display = isDashboard ? 'none' : 'block';

    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/blog') root.innerHTML = renderBlog();
    else if (hash === '#/privacy') root.innerHTML = `<div class="max-w-4xl mx-auto py-32 px-6 text-right animate-fadeIn"><h1 class="text-5xl font-black mb-10 dark:text-white">سياسة الخصوصية</h1><div class="prose prose-xl dark:prose-invert font-medium leading-relaxed text-gray-600 dark:text-gray-400"><p>نحن في ${state.settings.siteName} نلتزم بحماية بياناتك الشخصية بالكامل. لا نقوم بجمع أي بيانات حساسة إلا بموافقتك الصريحة.</p></div></div>`;
    else if (hash.startsWith('#/article/')) root.innerHTML = renderArticle(hash.replace('#/article/', ''));
    else if (isDashboard) {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            root.innerHTML = `<div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6"><div class="bg-white dark:bg-gray-900 p-10 md:p-16 rounded-[3rem] shadow-2xl w-full max-w-md text-center space-y-10"><h2 class="text-3xl font-black dark:text-white">لوحة التحكم</h2><input type="password" id="dash-pass" class="w-full p-6 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl text-center font-bold text-2xl border-none outline-none focus:ring-4 focus:ring-blue-500/20" placeholder="كلمة السر"><button onclick="login()" class="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 transition">دخول آمن</button><a href="#/" class="block text-gray-400 font-bold hover:text-blue-600 transition">رجوع للرئيسية</a></div></div>`;
        } else {
            root.innerHTML = `
                <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col lg:flex-row text-right">
                    <aside class="w-full lg:w-80 bg-gray-900 text-white p-8 md:p-12 flex flex-col border-l border-gray-800">
                        <div class="text-2xl font-black mb-12 border-b border-gray-800 pb-8">الإدارة المركزية</div>
                        <nav class="flex flex-col gap-4">
                            <button onclick="switchTab('settings')" class="text-right p-5 rounded-2xl hover:bg-white/5 font-black text-lg transition">⚙️ الإعدادات</button>
                            <button onclick="window.location.hash='#/'" class="text-right p-5 rounded-2xl hover:bg-white/5 font-black text-lg transition">🏠 العودة للموقع</button>
                            <button onclick="sessionStorage.removeItem('isAdmin'); router();" class="text-right p-5 rounded-2xl bg-red-500/10 text-red-500 font-black text-lg mt-20">خروج آمن</button>
                        </nav>
                    </aside>
                    <main class="flex-1 p-8 md:p-20 overflow-y-auto">
                        <div id="dash-content" class="max-w-5xl mx-auto"></div>
                    </main>
                </div>`;
            (window as any).switchTab('settings');
        }
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
    syncUI();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
