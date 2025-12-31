
/**
 * Halal Digital Blog - Version 7.0 (The Secret Center Update)
 */

// --- البيانات الافتراضية ---
const INITIAL_ARTICLES = [
    {
        id: 'tech-morocco-2025',
        title: 'مستقبل البرمجة والذكاء الاصطناعي في المغرب 2025',
        excerpt: 'تحليل شامل للفرص المتاحة للمبرمجين المغاربة.',
        content: `يشهد قطاع التكنولوجيا في المغرب طفرة غير مسبوقة...`,
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

// --- وظائف المساعدة ---
const syncUI = () => {
    const footer = document.getElementById('dynamic-footer');
    if (footer) {
        footer.innerHTML = `
            <footer class="bg-slate-900 text-white py-12 mt-20 border-t border-slate-800 text-center md:text-right">
                <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <section class="bg-slate-950 text-white py-24 px-6 text-center">
                <h1 class="text-4xl md:text-6xl font-black mb-6">المركز التقني لـ <span class="text-blue-500">${state.settings.siteName}</span></h1>
                <p class="text-slate-400 max-w-2xl mx-auto text-lg">نقدم لكم أفضل المقالات في البرمجة والتكنولوجيا والربح من الإنترنت.</p>
            </section>
            
            <section class="max-w-7xl mx-auto px-6 py-16">
                <div id="ad-header" class="mb-10 text-center">${state.settings.adsterra.header}</div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${state.articles.map((a: any) => `
                        <article onclick="window.location.hash='#/article/${a.id}'" class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition cursor-pointer group">
                            <img src="${a.image}" class="w-full h-48 object-cover group-hover:scale-105 transition">
                            <div class="p-6">
                                <h3 class="text-xl font-black mb-2 dark:text-white">${a.title}</h3>
                                <p class="text-slate-500 text-sm line-clamp-2">${a.excerpt}</p>
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
        <div class="max-w-4xl mx-auto px-6 py-12 text-right animate-fadeIn">
            <div id="ad-article-top" class="mb-8 text-center">${state.settings.adsterra.header}</div>
            <h1 class="text-4xl md:text-6xl font-black mb-8 dark:text-white">${article.title}</h1>
            <img src="${article.image}" class="w-full rounded-3xl mb-10 shadow-lg">
            <div id="ad-article-middle" class="my-10 text-center">${state.settings.adsterra.middle}</div>
            <div class="prose prose-xl dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                ${article.content.split('\n').map((p: string) => `<p class="mb-6">${p}</p>`).join('')}
            </div>
            <div id="ad-article-bottom" class="mt-12 text-center">${state.settings.adsterra.bottom}</div>
        </div>
    `;
};

const renderDashboard = () => {
    if (!state.isAdmin) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
                <div class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-right border dark:border-slate-800">
                    <h2 class="text-2xl font-black mb-6 dark:text-white">المركز السري 🔐</h2>
                    <input type="password" id="admin-pass-input" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl mb-6 text-center" placeholder="كلمة السر">
                    <button onclick="handleLogin()" class="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg">دخول</button>
                </div>
            </div>
        `;
    }

    return `
        <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-right">
            <!-- Sidebar -->
            <aside class="w-full md:w-72 bg-slate-900 text-white p-8">
                <div class="text-xl font-black text-blue-500 mb-10 italic">المركز السري</div>
                <nav class="flex flex-col gap-2">
                    <button onclick="switchDashTab('articles')" class="text-right p-4 rounded-xl hover:bg-white/5 font-bold transition">📚 المقالات</button>
                    <button onclick="switchDashTab('adsterra')" class="text-right p-4 rounded-xl hover:bg-white/5 font-bold transition">💰 إعلانات Adsterra</button>
                    <button onclick="switchDashTab('settings')" class="text-right p-4 rounded-xl hover:bg-white/5 font-bold transition">⚙️ الإعدادات</button>
                    <hr class="border-slate-800 my-4">
                    <button onclick="handleLogout()" class="text-right p-4 rounded-xl hover:bg-red-500/20 text-red-400 font-bold transition">🚪 خروج</button>
                </nav>
            </aside>

            <!-- Main Panel -->
            <main class="flex-1 p-6 md:p-12" id="dash-panel"></main>
        </div>
    `;
};

// --- وظائف لوحة التحكم ---
(window as any).switchDashTab = (tab: string) => {
    const panel = document.getElementById('dash-panel');
    if (!panel) return;

    if (tab === 'articles') {
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-black dark:text-white">إدارة المقالات</h2>
                <button onclick="openArticleModal()" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">+ مقال جديد</button>
            </div>
            <div class="grid gap-4">
                ${state.articles.map((a: any) => `
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <img src="${a.image}" class="w-16 h-16 rounded-xl object-cover">
                            <div>
                                <h4 class="font-bold dark:text-white">${a.title}</h4>
                                <span class="text-xs text-slate-500">${new Date(a.date).toLocaleDateString('ar-MA')}</span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="editArticle('${a.id}')" class="bg-yellow-500/10 text-yellow-600 px-4 py-2 rounded-lg font-bold">تعديل</button>
                            <button onclick="deleteArticle('${a.id}')" class="bg-red-500/10 text-red-600 px-4 py-2 rounded-lg font-bold">حذف</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div id="article-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden z-[100] items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-900 w-full max-w-2xl p-8 rounded-[2rem] shadow-2xl relative">
                    <h3 id="modal-title" class="text-2xl font-black mb-6 dark:text-white">إضافة مقال جديد</h3>
                    <div class="space-y-4">
                        <input id="art-title" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none" placeholder="عنوان المقال">
                        <input id="art-image" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none" placeholder="رابط صورة المقال">
                        <textarea id="art-excerpt" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none h-20" placeholder="مقتطف قصير"></textarea>
                        <textarea id="art-content" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none h-48" placeholder="محتوى المقال الكامل"></textarea>
                    </div>
                    <div class="flex gap-4 mt-8">
                        <button onclick="saveArticle()" class="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold">حفظ المقال</button>
                        <button onclick="closeArticleModal()" class="flex-1 bg-slate-200 dark:bg-slate-800 dark:text-white py-4 rounded-xl font-bold">إلغاء</button>
                    </div>
                </div>
            </div>
        `;
    } else if (tab === 'adsterra') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-8 dark:text-white">إعدادات Adsterra</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                    <label class="block font-bold mb-2 text-slate-500">كود رأس الموقع (Header Ad)</label>
                    <textarea id="ad-h" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl font-mono text-sm h-32" dir="ltr">${state.settings.adsterra.header}</textarea>
                </div>
                <div>
                    <label class="block font-bold mb-2 text-slate-500">كود وسط المقال (Middle Ad)</label>
                    <textarea id="ad-m" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl font-mono text-sm h-32" dir="ltr">${state.settings.adsterra.middle}</textarea>
                </div>
                <div>
                    <label class="block font-bold mb-2 text-slate-500">كود أسفل المقال (Bottom Ad)</label>
                    <textarea id="ad-b" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl font-mono text-sm h-32" dir="ltr">${state.settings.adsterra.bottom}</textarea>
                </div>
                <button onclick="saveAdsterra()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-xl">تحديث الإعلانات ✅</button>
            </div>
        `;
    } else if (tab === 'settings') {
        panel.innerHTML = `
            <h2 class="text-3xl font-black mb-8 dark:text-white">الإعدادات العامة</h2>
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                    <label class="block font-bold mb-2 text-slate-500">اسم الموقع</label>
                    <input id="set-name" value="${state.settings.siteName}" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none">
                </div>
                <div>
                    <label class="block font-bold mb-2 text-slate-500">تغيير كلمة سر المركز السري</label>
                    <input type="text" id="set-pass" value="${state.settings.adminPass}" class="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border-none">
                </div>
                <button onclick="saveGeneralSettings()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">حفظ الإعدادات ✅</button>
            </div>
        `;
    }
};

(window as any).handleLogin = () => {
    const pass = (document.getElementById('admin-pass-input') as HTMLInputElement).value;
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
};

(window as any).closeArticleModal = () => {
    document.getElementById('article-modal')?.classList.replace('flex', 'hidden');
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
    // Fix: Access closeArticleModal via window as it's defined on the window object
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
    alert('✅ تم تحديث أكواد الإعلانات بنجاح');
};

(window as any).saveGeneralSettings = () => {
    state.settings.siteName = (document.getElementById('set-name') as HTMLInputElement).value;
    state.settings.adminPass = (document.getElementById('set-pass') as HTMLInputElement).value;
    saveState();
    alert('✅ تم حفظ الإعدادات');
};

// --- الموجه (Router) ---
const router = () => {
    const hash = window.location.hash || '#/';
    const root = document.getElementById('app-root');
    const header = document.querySelector('header');
    if (!root) return;

    const isDashboard = hash.startsWith('#/dashboard');
    if (header) header.style.display = isDashboard && state.isAdmin ? 'none' : 'block';
    
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
