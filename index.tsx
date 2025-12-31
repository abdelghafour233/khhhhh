
/**
 * Halal Digital Blog - Version 7.4 (The Ultra-Responsive Update 📱)
 */

// --- البيانات الافتراضية ---
const INITIAL_ARTICLES = [
    {
        id: 'tech-morocco-2025',
        title: 'مستقبل البرمجة والذكاء الاصطناعي في المغرب 2025',
        excerpt: 'تحليل شامل للفرص المتاحة للمبرمجين المغاربة.',
        content: `يشهد قطاع التكنولوجيا في المغرب طفرة غير مسبوقة... مع توجه الشركات الكبرى نحو التحول الرقمي، أصبح الطلب على المبرمجين المبدعين أكبر من أي وقت مضى.`,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
        date: new Date().toISOString()
    }
];

const INITIAL_SETTINGS = {
    whatsapp: '212649075664',
    siteName: 'حلال ديجيتال',
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

// --- أيقونات SVG ---
const EYE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12.a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
const EYE_SLASH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>`;

// --- وظائف المساعدة ---
(window as any).togglePassword = (inputId: string, btnId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const btn = document.getElementById(btnId);
    if (input && btn) {
        if (input.type === 'password') {
            input.type = 'text';
            btn.innerHTML = EYE_SLASH_ICON;
        } else {
            input.type = 'password';
            btn.innerHTML = EYE_ICON;
        }
    }
};

const syncUI = () => {
    const footer = document.getElementById('dynamic-footer');
    if (footer) {
        footer.innerHTML = `
            <footer class="bg-slate-900 text-white py-12 mt-12 border-t border-slate-800 text-center md:text-right">
                <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div class="text-2xl font-black text-blue-500 mb-4">${state.settings.siteName}</div>
                        <p class="text-slate-400 text-sm">وكالة تقنية مغربية للتدوين والبرمجة.</p>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">روابط سريعة</h4>
                        <div class="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-slate-400">
                            <a href="#/" class="hover:text-white">الرئيسية</a>
                            <a href="#/blog" class="hover:text-white">المدونة</a>
                            <a href="#/dashboard" class="hover:text-white">المركز السري 🔐</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
};

const renderHome = () => {
    return `
        <div class="animate-fadeIn">
            <section class="bg-slate-950 text-white py-16 md:py-24 px-4 text-center">
                <h1 class="text-3xl md:text-6xl font-black mb-6 leading-tight">المركز التقني لـ <span class="text-blue-500">${state.settings.siteName}</span></h1>
                <p class="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">نقدم لكم أفضل المقالات في البرمجة والتكنولوجيا والربح من الإنترنت.</p>
            </section>
            
            <section class="max-w-7xl mx-auto px-4 py-12">
                <div id="ad-header" class="mb-10 text-center overflow-hidden">${state.settings.adsterra.header}</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${state.articles.map((a: any) => `
                        <article onclick="window.location.hash='#/article/${a.id}'" class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition cursor-pointer group flex flex-col h-full">
                            <div class="relative overflow-hidden aspect-video">
                                <img src="${a.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                            </div>
                            <div class="p-5 text-right flex-1 flex flex-col">
                                <h3 class="text-lg font-black mb-2 dark:text-white line-clamp-2">${a.title}</h3>
                                <p class="text-slate-500 text-xs md:text-sm line-clamp-3 mb-4">${a.excerpt}</p>
                                <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                                    <span>بواسطة الإدارة</span>
                                    <span>${new Date(a.date).toLocaleDateString('ar-MA')}</span>
                                </div>
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

    return `
        <div class="max-w-4xl mx-auto px-4 py-8 text-right animate-fadeIn">
            <div id="ad-article-top" class="mb-8 text-center overflow-hidden">${state.settings.adsterra.header}</div>
            <h1 class="text-2xl md:text-5xl font-black mb-6 dark:text-white leading-snug">${article.title}</h1>
            <div class="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-xl">
                <img src="${article.image}" class="w-full h-full object-cover">
            </div>
            <div id="ad-article-middle" class="my-8 text-center overflow-hidden">${state.settings.adsterra.middle}</div>
            <div class="prose prose-sm md:prose-xl dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                ${article.content.split('\n').map((p: string) => `<p class="mb-4 leading-relaxed">${p}</p>`).join('')}
            </div>
            <div id="ad-article-bottom" class="mt-12 text-center overflow-hidden">${state.settings.adsterra.bottom}</div>
        </div>
    `;
};

const renderDashboard = () => {
    if (!state.isAdmin) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <div class="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-md text-right border dark:border-slate-800">
                    <h2 class="text-xl md:text-2xl font-black mb-6 dark:text-white flex items-center gap-2 justify-center">المركز السري <span class="text-blue-500">🔐</span></h2>
                    <div class="relative mb-6">
                        <input type="password" id="login-pass" class="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl text-center focus:ring-2 focus:ring-blue-500 outline-none border border-transparent dark:border-slate-700 font-bold" placeholder="كلمة السر">
                        <button id="login-eye-btn" onclick="togglePassword('login-pass', 'login-eye-btn')" type="button" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
                            ${EYE_ICON}
                        </button>
                    </div>
                    <button onclick="handleLogin()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg shadow-lg hover:bg-blue-700 transition">دخول</button>
                </div>
            </div>
        `;
    }

    return `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-right">
            <!-- Sidebar / Mobile Header -->
            <aside class="w-full md:w-72 bg-slate-900 text-white p-4 md:p-8 flex flex-col">
                <div class="text-lg md:text-xl font-black text-blue-500 mb-6 md:mb-10 italic flex items-center justify-between">
                    <span>المركز السري 👁️</span>
                    <span class="md:hidden text-[10px] bg-blue-600 px-2 rounded-full py-0.5">${state.articles.length} مقالات</span>
                </div>
                
                <!-- Nav - Horizontal on mobile, vertical on desktop -->
                <nav class="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
                    <button onclick="switchDashTab('articles')" class="whitespace-nowrap flex-shrink-0 text-right p-3 md:p-4 rounded-xl hover:bg-white/5 font-bold transition flex items-center gap-2">
                         <span>📚 المقالات</span>
                         <span class="hidden md:inline bg-blue-600 text-[10px] px-2 rounded-full">${state.articles.length}</span>
                    </button>
                    <button onclick="switchDashTab('adsterra')" class="whitespace-nowrap flex-shrink-0 text-right p-3 md:p-4 rounded-xl hover:bg-white/5 font-bold transition">💰 Adsterra</button>
                    <button onclick="switchDashTab('settings')" class="whitespace-nowrap flex-shrink-0 text-right p-3 md:p-4 rounded-xl hover:bg-white/5 font-bold transition">⚙️ الإعدادات</button>
                    <a href="#/" class="whitespace-nowrap flex-shrink-0 text-right p-3 md:p-4 rounded-xl bg-blue-600/10 text-blue-400 font-bold transition flex items-center gap-2">
                        <span>🏠 الموقع</span>
                    </a>
                    <button onclick="handleLogout()" class="whitespace-nowrap flex-shrink-0 text-right p-3 md:p-4 rounded-xl hover:bg-red-500/20 text-red-400 font-bold transition md:mt-4">🚪 خروج</button>
                </nav>
            </aside>

            <!-- Main Panel -->
            <main class="flex-1 p-4 md:p-12 overflow-x-hidden" id="dash-panel"></main>
        </div>
    `;
};

(window as any).switchDashTab = (tab: string) => {
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'articles') {
        panel.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 class="text-2xl md:text-3xl font-black dark:text-white text-right">إدارة المقالات</h2>
                <button onclick="openArticleModal()" class="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">+ مقال جديد</button>
            </div>
            <div class="grid gap-3">
                ${state.articles.map((a: any) => `
                    <div class="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 hover:shadow-md transition">
                        <div class="flex items-center gap-3 w-full">
                            <img src="${a.image}" class="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl object-cover">
                            <div class="min-w-0">
                                <h4 class="font-bold dark:text-white line-clamp-1 text-sm md:text-base text-right">${a.title}</h4>
                                <span class="text-[10px] md:text-xs text-slate-500">${new Date(a.date).toLocaleDateString('ar-MA')}</span>
                            </div>
                        </div>
                        <div class="flex gap-2 w-full md:w-auto">
                            <a href="#/article/${a.id}" class="flex-1 md:flex-none text-center bg-blue-500/10 text-blue-600 px-3 py-2 rounded-lg font-bold text-xs">👁️ معاينة</a>
                            <button onclick="editArticle('${a.id}')" class="flex-1 md:flex-none bg-yellow-500/10 text-yellow-600 px-3 py-2 rounded-lg font-bold text-xs">تعديل</button>
                            <button onclick="deleteArticle('${a.id}')" class="flex-1 md:flex-none bg-red-500/10 text-red-600 px-3 py-2 rounded-lg font-bold text-xs">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Article Modal -->
            <div id="article-modal" class="fixed inset-0 bg-black/70 backdrop-blur-sm hidden z-[100] items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-900 w-full max-w-2xl p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                    <h3 id="modal-title" class="text-xl md:text-2xl font-black mb-6 dark:text-white text-right">إضافة مقال جديد</h3>
                    <div class="space-y-4 text-right">
                        <div>
                            <label class="block text-xs font-bold mb-1 text-slate-400">العنوان</label>
                            <input id="art-title" class="w-full p-3 md:p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="اكتب عنواناً جذاباً">
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1 text-slate-400">رابط الصورة</label>
                            <input id="art-image" class="w-full p-3 md:p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-left text-sm" dir="ltr" placeholder="https://...">
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1 text-slate-400">المقتطف (Excerpt)</label>
                            <textarea id="art-excerpt" class="w-full p-3 md:p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none h-16 md:h-20 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="وصف قصير للمقال"></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1 text-slate-400">المحتوى الكامل</label>
                            <textarea id="art-content" class="w-full p-3 md:p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none h-40 md:h-64 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="اكتب مقالك هنا..."></textarea>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3 mt-8">
                        <button onclick="saveArticle()" class="flex-1 bg-blue-600 text-white py-3 md:py-4 rounded-xl font-bold shadow-lg">حفظ المقال</button>
                        <button onclick="closeArticleModal()" class="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-white py-3 md:py-4 rounded-xl font-bold">إلغاء</button>
                    </div>
                </div>
            </div>
        `;
    } else if (tab === 'adsterra') {
        panel.innerHTML = `
            <h2 class="text-2xl md:text-3xl font-black mb-8 dark:text-white text-right">إعدادات Adsterra 💰</h2>
            <div class="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div class="text-right">
                    <label class="block font-bold mb-2 text-slate-500 text-sm">كود الإعلان العلوي (Header)</label>
                    <textarea id="ad-h" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl font-mono text-[10px] h-24" dir="ltr">${state.settings.adsterra.header}</textarea>
                </div>
                <div class="text-right">
                    <label class="block font-bold mb-2 text-slate-500 text-sm">كود الإعلان وسط المقال (Middle)</label>
                    <textarea id="ad-m" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl font-mono text-[10px] h-24" dir="ltr">${state.settings.adsterra.middle}</textarea>
                </div>
                <div class="text-right">
                    <label class="block font-bold mb-2 text-slate-500 text-sm">كود الإعلان السفلي (Bottom)</label>
                    <textarea id="ad-b" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl font-mono text-[10px] h-24" dir="ltr">${state.settings.adsterra.bottom}</textarea>
                </div>
                <button onclick="saveAdsterra()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-xl">تحديث الإعلانات ✅</button>
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-2xl md:text-3xl font-black mb-8 dark:text-white text-right">إعدادات الموقع ⚙️</h2>
            <div class="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 max-w-2xl text-right">
                <div>
                    <label class="block font-bold mb-2 text-slate-500">اسم الوكالة/الموقع</label>
                    <input id="set-name" value="${state.settings.siteName}" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block font-bold mb-2 text-slate-500 text-right">تغيير كلمة السر</label>
                    <div class="relative">
                        <input type="password" id="set-pass" value="${state.settings.adminPass}" class="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold">
                        <button id="set-eye-btn" onclick="togglePassword('set-pass', 'set-eye-btn')" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            ${EYE_ICON}
                        </button>
                    </div>
                </div>
                <button onclick="saveGeneralSettings()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg">حفظ التغييرات ✅</button>
            </div>
        `;
    }
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

(window as any).openArticleModal = () => {
    state.currentEditId = null;
    (document.getElementById('modal-title') as HTMLElement).innerText = 'إضافة مقال جديد';
    (document.getElementById('art-title') as HTMLInputElement).value = '';
    (document.getElementById('art-image') as HTMLInputElement).value = '';
    (document.getElementById('art-excerpt') as HTMLTextAreaElement).value = '';
    (document.getElementById('art-content') as HTMLTextAreaElement).value = '';
    document.getElementById('article-modal')?.classList.replace('hidden', 'flex');
    document.body.style.overflow = 'hidden';
};

(window as any).closeArticleModal = () => {
    document.getElementById('article-modal')?.classList.replace('flex', 'hidden');
    document.body.style.overflow = 'auto';
};

(window as any).saveArticle = () => {
    const title = (document.getElementById('art-title') as HTMLInputElement).value;
    const image = (document.getElementById('art-image') as HTMLInputElement).value;
    const excerpt = (document.getElementById('art-excerpt') as HTMLTextAreaElement).value;
    const content = (document.getElementById('art-content') as HTMLTextAreaElement).value;

    if (!title || !content) return alert('الرجاء ملء كافة الحقول!');

    if (state.currentEditId) {
        const index = state.articles.findIndex((a: any) => a.id === state.currentEditId);
        state.articles[index] = { ...state.articles[index], title, image, excerpt, content };
    } else {
        const newArt = {
            id: Math.random().toString(36).substr(2, 9),
            title, image, excerpt, content,
            date: new Date().toISOString()
        };
        state.articles.unshift(newArt);
    }

    saveState();
    (window as any).closeArticleModal();
    (window as any).switchDashTab('articles');
};

(window as any).editArticle = (id: string) => {
    const art = state.articles.find((a: any) => a.id === id);
    if (!art) return;
    state.currentEditId = id;
    (document.getElementById('modal-title') as HTMLElement).innerText = 'تعديل المقال';
    (document.getElementById('art-title') as HTMLInputElement).value = art.title;
    (document.getElementById('art-image') as HTMLInputElement).value = art.image;
    (document.getElementById('art-excerpt') as HTMLTextAreaElement).value = art.excerpt;
    (document.getElementById('art-content') as HTMLTextAreaElement).value = art.content;
    document.getElementById('article-modal')?.classList.replace('hidden', 'flex');
    document.body.style.overflow = 'hidden';
};

(window as any).deleteArticle = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
        state.articles = state.articles.filter((a: any) => a.id !== id);
        saveState();
        (window as any).switchDashTab('articles');
    }
};

(window as any).saveAdsterra = () => {
    state.settings.adsterra.header = (document.getElementById('ad-h') as HTMLTextAreaElement).value;
    state.settings.adsterra.middle = (document.getElementById('ad-m') as HTMLTextAreaElement).value;
    state.settings.adsterra.bottom = (document.getElementById('ad-b') as HTMLTextAreaElement).value;
    saveState();
    alert('✅ تم تحديث الإعلانات بنجاح');
};

(window as any).saveGeneralSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.adminPass = (document.getElementById('set-pass') as HTMLInputElement).value;
    saveState();
    alert('✅ تم حفظ الإعدادات');
};

const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const header = document.querySelector('header');
    if (!root) return;

    const isDashboard = hash.startsWith('#/dashboard');
    if (header) header.style.display = isDashboard && state.isAdmin ? 'none' : 'block';
    
    // Smooth scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (hash === '#/') root.innerHTML = renderHome();
    else if (hash === '#/blog') root.innerHTML = renderHome();
    else if (hash.startsWith('#/article/')) root.innerHTML = renderArticle(hash.replace('#/article/', ''));
    else if (isDashboard) {
        root.innerHTML = renderDashboard();
        if (state.isAdmin) (window as any).switchDashTab('articles');
    }

    syncUI();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
