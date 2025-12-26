
/**
 * Halal Digital Services - Version 2.7
 * AdSense Management System & Live Ads Rendering
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
        id: 'art1',
        title: 'أهمية السيو (SEO) للمقاولات المغربية في 2024',
        excerpt: 'تعرف على كيف يمكن لتحسين محركات البحث أن يضاعف مبيعات شركتك دون دفع سنت واحد للإعلانات.',
        content: 'يعتبر السيو المحرك الأساسي للنمو الرقمي... (يمكنك تعديل هذا النص لاحقاً من لوحة التحكم)',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
        date: new Date().toISOString()
    }
];

const INITIAL_SETTINGS = {
    dashPassword: '1234',
    whatsappNumber: '0649075664',
    email: 'abdelghaforbahaddou@gmail.com',
    adsHeader: '', // كود الإعلان العلوي
    adsMiddle: '', // كود إعلان وسط المقال
    adsBottom: ''  // كود الإعلان السفلي
};

// --- App State ---
let state = {
    projects: JSON.parse(localStorage.getItem('projects') || 'null') || INITIAL_PROJECTS,
    articles: JSON.parse(localStorage.getItem('articles') || 'null') || INITIAL_ARTICLES,
    requests: JSON.parse(localStorage.getItem('requests') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || 'null') || INITIAL_SETTINGS,
    isAuthenticated: sessionStorage.getItem('isAdmin') === 'true'
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
    input.type = input.type === 'password' ? 'text' : 'password';
    if (btn) btn.innerHTML = input.type === 'password' ? '👁️' : '🔒';
};

// --- AdSense Renderer ---
const renderAdUnit = (type: 'adsHeader' | 'adsMiddle' | 'adsBottom', label: string) => {
    const adCode = state.settings[type];
    if (adCode && adCode.trim() !== '') {
        return `<div class="my-10 overflow-hidden flex justify-center">${adCode}</div>`;
    }
    // Fallback placeholder if no code is provided
    return `
        <div class="my-10 p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] text-center text-gray-300 text-xs font-bold animate-pulse">
            <div class="mb-1">AdSense Placeholder</div>
            <div>[ ${label} ]</div>
            <div class="mt-2 text-[10px]">ضع الكود في لوحة التحكم ليظهر هنا</div>
        </div>
    `;
};

// --- Public Renderers ---
const renderHome = () => `
    <div class="space-y-32 animate-fadeIn pb-20">
        <section class="relative min-h-[600px] flex items-center bg-gray-950 text-white overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover">
            </div>
            <div class="max-w-7xl mx-auto px-6 relative z-10 w-full py-20">
                <div class="max-w-4xl space-y-10">
                    <h1 class="text-6xl md:text-8xl font-black leading-tight">حوّل أفكارك إلى <br><span class="text-blue-500">واقع رقمي</span></h1>
                    <p class="text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">وكالة حلال ديجيتال المتخصصة في بناء وتطوير المشاريع الأكثر مبيعاً في المغرب.</p>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-6">
            <h2 class="text-5xl font-black mb-16">آخر النصائح التقنية</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                ${state.articles.slice(0, 3).map((a: any) => `
                    <article class="bg-white rounded-[3rem] overflow-hidden border border-gray-100 group cursor-pointer" onclick="window.location.hash='#/article/${a.id}'">
                        <img src="${a.image}" class="h-64 w-full object-cover">
                        <div class="p-8 space-y-4">
                            <h3 class="text-2xl font-black group-hover:text-blue-600 transition">${a.title}</h3>
                            <p class="text-gray-500 line-clamp-2">${a.excerpt}</p>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    </div>
`;

const renderBlog = () => `
    <div class="max-w-7xl mx-auto px-6 py-20 animate-fadeIn space-y-16 text-center">
        <h1 class="text-6xl font-black">المدونة</h1>
        ${renderAdUnit('adsHeader', 'إعلان أعلى المدونة')}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-right">
            ${state.articles.map((a: any) => `
                <article class="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm cursor-pointer" onclick="window.location.hash='#/article/${a.id}'">
                    <img src="${a.image}" class="h-64 w-full object-cover">
                    <div class="p-8 space-y-4">
                        <h3 class="text-2xl font-black">${a.title}</h3>
                        <p class="text-gray-500">${a.excerpt}</p>
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
        <div class="max-w-4xl mx-auto px-6 py-20 animate-fadeIn">
            <h1 class="text-5xl md:text-6xl font-black leading-tight mb-12">${article.title}</h1>
            ${renderAdUnit('adsHeader', 'إعلان بداية المقال')}
            <img src="${article.image}" class="w-full h-[500px] object-cover rounded-[4rem] mb-12 shadow-xl">
            <div class="prose prose-2xl text-gray-700 font-medium leading-relaxed space-y-8">
                ${article.content.split('\n').map((p: string, i: number) => `
                    ${p}
                    ${i === 1 ? renderAdUnit('adsMiddle', 'إعلان وسط المحتوى') : ''}
                `).join('')}
            </div>
            ${renderAdUnit('adsBottom', 'إعلان نهاية المقال')}
        </div>
    `;
};

// --- Dashboard Tabs ---
(window as any).switchTab = (tab: string) => {
    const container = document.getElementById('dash-content');
    if (!container) return;

    if (tab === 'settings') {
        container.innerHTML = `
            <h2 class="text-4xl font-black mb-8">إعدادات الموقع</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div class="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                    <h3 class="text-2xl font-black text-blue-600">المعلومات الأساسية</h3>
                    <div class="space-y-4">
                        <label class="block font-black text-gray-400">رقم الواتساب</label>
                        <input id="set-wa" value="${state.settings.whatsappNumber}" class="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold">
                    </div>
                    <div class="space-y-4">
                        <label class="block font-black text-gray-400">كلمة سر الإدارة</label>
                        <div class="relative">
                            <input id="set-pass" type="password" value="${state.settings.dashPassword}" class="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold">
                            <button id="set-pass-btn" onclick="togglePassword('set-pass')" class="absolute left-5 top-1/2 -translate-y-1/2">👁️</button>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                    <h3 class="text-2xl font-black text-green-600">إعدادات جوجل أدسنس</h3>
                    <div class="space-y-4">
                        <label class="block font-black text-gray-400 italic">Header Ad Code (علوي)</label>
                        <textarea id="set-ads-h" class="w-full p-5 bg-gray-50 rounded-2xl outline-none font-mono text-xs h-24" dir="ltr" placeholder="<script async src='...'></script>">${state.settings.adsHeader || ''}</textarea>
                    </div>
                    <div class="space-y-4">
                        <label class="block font-black text-gray-400 italic">Middle Ad Code (وسطي)</label>
                        <textarea id="set-ads-m" class="w-full p-5 bg-gray-50 rounded-2xl outline-none font-mono text-xs h-24" dir="ltr" placeholder="<!-- Ad Unit Code -->">${state.settings.adsMiddle || ''}</textarea>
                    </div>
                    <div class="space-y-4">
                        <label class="block font-black text-gray-400 italic">Bottom Ad Code (سفلي)</label>
                        <textarea id="set-ads-b" class="w-full p-5 bg-gray-50 rounded-2xl outline-none font-mono text-xs h-24" dir="ltr">${state.settings.adsBottom || ''}</textarea>
                    </div>
                </div>
            </div>
            <button onclick="updateSettings()" class="w-full py-6 bg-blue-600 text-white rounded-3xl font-black shadow-xl mt-12 hover:bg-blue-700 transition">حفظ جميع التغييرات</button>
        `;
    } else if (tab === 'articles') {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-8"><h2 class="text-4xl font-black">المدونة</h2><button onclick="addArticle()" class="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">جديد +</button></div>
            <div class="grid gap-4">${state.articles.map((a: any) => `<div class="bg-white p-6 rounded-3xl border flex justify-between items-center"><span class="font-black">${a.title}</span><button onclick="deleteArticle('${a.id}')" class="text-red-500 font-bold">حذف</button></div>`).join('')}</div>
        `;
    } else if (tab === 'requests') {
        container.innerHTML = `<h2 class="text-4xl font-black mb-8">الطلبات الواردة</h2><div class="grid gap-4">${state.requests.map((r: any) => `<div class="bg-white p-6 rounded-3xl border"><b>${r.name}</b> - ${r.type}</div>`).join('')}</div>`;
    } else if (tab === 'projects') {
        container.innerHTML = `<h2 class="text-4xl font-black mb-8">المشاريع</h2><button onclick="addProject()" class="bg-blue-600 text-white p-4 rounded-xl">أضف مشروع</button>`;
    }
};

(window as any).updateSettings = () => {
    state.settings.whatsappNumber = (document.getElementById('set-wa') as HTMLInputElement).value;
    state.settings.dashPassword = (document.getElementById('set-pass') as HTMLInputElement).value;
    state.settings.adsHeader = (document.getElementById('set-ads-h') as HTMLTextAreaElement).value;
    state.settings.adsMiddle = (document.getElementById('set-ads-m') as HTMLTextAreaElement).value;
    state.settings.adsBottom = (document.getElementById('set-ads-b') as HTMLTextAreaElement).value;
    saveState();
    alert('✅ تم تحديث الإعدادات وشفرات الإعلانات بنجاح!');
};

(window as any).addArticle = () => {
    const title = prompt('العنوان:'); if (!title) return;
    const content = prompt('النص (ضع فقرات بينها سطر):');
    state.articles.unshift({ id: 'art-' + Date.now(), title, excerpt: content.substring(0, 100) + '...', content, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', date: new Date().toISOString() });
    saveState(); (window as any).switchTab('articles');
};

(window as any).deleteArticle = (id: string) => { if (confirm('حذف؟')) { state.articles = state.articles.filter((a: any) => a.id !== id); saveState(); (window as any).switchTab('articles'); } };
(window as any).logout = () => { sessionStorage.removeItem('isAdmin'); window.location.hash = '#/'; };
(window as any).login = () => { if((document.getElementById('dash-pass') as HTMLInputElement).value === state.settings.dashPassword) { state.isAuthenticated = true; sessionStorage.setItem('isAdmin', 'true'); router(); } else { alert('خطأ!'); } };

// --- Router ---
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

    if (hash === '#/') {
        root.innerHTML = renderHome();
    } else if (hash === '#/blog') {
        root.innerHTML = renderBlog();
    } else if (isArticle) {
        root.innerHTML = renderArticleDetail(hash.replace('#/article/', ''));
    } else if (isDashboard) {
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            root.innerHTML = `<div class="min-h-screen flex items-center justify-center bg-gray-50"><div class="bg-white p-12 rounded-[3.5rem] shadow-4xl text-center space-y-8 w-full max-w-md"><h2 class="text-3xl font-black">الإدارة</h2><input type="password" id="dash-pass" class="w-full p-5 bg-gray-50 rounded-2xl text-center text-2xl" placeholder="••••"><button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black">دخول</button></div></div>`;
        } else {
            root.innerHTML = `
                <div class="min-h-screen bg-white flex flex-col md:flex-row animate-fadeIn">
                    <aside class="w-full md:w-80 bg-gray-900 text-white p-10 flex flex-col">
                        <div class="text-2xl font-black mb-12">لوحة التحكم</div>
                        <nav class="flex flex-col gap-2 flex-1">
                            <button onclick="switchTab('requests')" class="p-4 rounded-2xl hover:bg-white/5 text-right w-full font-black">📊 الطلبات</button>
                            <button onclick="switchTab('articles')" class="p-4 rounded-2xl hover:bg-white/5 text-right w-full font-black">✍️ المدونة</button>
                            <button onclick="switchTab('projects')" class="p-4 rounded-2xl hover:bg-white/5 text-right w-full font-black">📁 المشاريع</button>
                            <button onclick="switchTab('settings')" class="p-4 rounded-2xl hover:bg-white/5 text-right w-full font-black">⚙️ الإعدادات</button>
                        </nav>
                        <button onclick="logout()" class="p-4 bg-red-500/10 text-red-400 rounded-2xl font-black mt-10">خروج</button>
                    </aside>
                    <main class="flex-1 p-8 md:p-16 overflow-y-auto bg-gray-50"><div id="dash-content" class="max-w-5xl mx-auto space-y-12"></div></main>
                </div>
            `;
            (window as any).switchTab('requests');
        }
    }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
