
/**
 * Halal Digital Services - Version 2.6
 * Integrated Blog System & AdSense Placements
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
    },
    {
        id: 'art2',
        title: 'لماذا يجب عليك اختيار متجر خاص بدلاً من منصات الجاهزة؟',
        excerpt: 'الفرق بين امتلاك برمجتك الخاصة والاعتماد على اشتراكات شهرية، وكيف يؤثر ذلك على هوية علامتك التجارية.',
        content: 'في عالم التجارة الإلكترونية، التميز هو المفتاح... (يمكنك تعديل هذا النص لاحقاً)',
        image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800',
        date: new Date().toISOString()
    }
];

const INITIAL_SETTINGS = {
    dashPassword: '1234',
    whatsappNumber: '0649075664',
    email: 'abdelghaforbahaddou@gmail.com'
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

(window as any).copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => alert('📋 تم نسخ الرابط!'));
};

// --- AdSense Placeholder Component ---
const renderAdUnit = (label: string) => `
    <div class="my-10 p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl text-center text-gray-400 text-sm font-black animate-pulse">
        <div class="mb-2">Ads by Google AdSense</div>
        <div class="text-xs">[ ${label} ]</div>
        <!-- ضع كود أدسنس هنا لاحقاً -->
    </div>
`;

// --- Public Renderers ---
const renderHome = () => `
    <div class="space-y-32 animate-fadeIn pb-20">
        <!-- Hero Section -->
        <section class="relative min-h-[600px] flex items-center bg-gray-950 text-white overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover">
            </div>
            <div class="max-w-7xl mx-auto px-6 relative z-10 w-full py-20">
                <div class="max-w-4xl space-y-10">
                    <h1 class="text-6xl md:text-8xl font-black leading-tight">حوّل أفكارك إلى <br><span class="text-blue-500">واقع رقمي</span></h1>
                    <p class="text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">وكالة حلال ديجيتال المتخصصة في بناء وتطوير المشاريع الأكثر مبيعاً في المغرب.</p>
                    <div class="flex flex-wrap gap-6">
                        <button onclick="document.getElementById('portfolio').scrollIntoView({behavior:'smooth'})" class="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-3xl font-black text-xl transition-all shadow-xl shadow-blue-600/20">تصفح أعمالنا</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Latest Articles (AdSense Friendly) -->
        <section class="max-w-7xl mx-auto px-6">
            <div class="flex justify-between items-end mb-16">
                <div class="space-y-4">
                    <h2 class="text-5xl font-black text-gray-900">نصائح الخبراء</h2>
                    <p class="text-gray-400 text-xl font-medium">مقالات تعليمية في تطوير المواقع، التصميم، وخدمات السيو.</p>
                </div>
                <a href="#/blog" class="bg-gray-100 px-8 py-3 rounded-2xl font-black text-gray-800 hover:bg-gray-200 transition">جميع المقالات ←</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                ${state.articles.slice(0, 3).map((a: any) => `
                    <article class="bg-white rounded-[3rem] overflow-hidden border border-gray-100 group cursor-pointer" onclick="window.location.hash='#/article/${a.id}'">
                        <div class="h-64 overflow-hidden">
                            <img src="${a.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        </div>
                        <div class="p-8 space-y-4">
                            <h3 class="text-2xl font-black group-hover:text-blue-600 transition">${a.title}</h3>
                            <p class="text-gray-500 font-medium line-clamp-2">${a.excerpt}</p>
                            <div class="text-sm font-black text-blue-500 uppercase">اقرأ المزيد +</div>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>

        <!-- Portfolio Section -->
        <section id="portfolio" class="max-w-7xl mx-auto px-6">
            <h2 class="text-5xl font-black text-gray-900 text-center mb-20">آخر المشاريع</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                ${state.projects.map((p: any) => `
                    <div class="bg-white rounded-[3rem] overflow-hidden border border-gray-50 shadow-sm">
                        <img src="${p.image}" class="w-full h-64 object-cover">
                        <div class="p-8"><h3 class="text-2xl font-black">${p.name}</h3></div>
                    </div>
                `).join('')}
            </div>
        </section>
    </div>
`;

const renderBlog = () => `
    <div class="max-w-7xl mx-auto px-6 py-20 animate-fadeIn space-y-16">
        <div class="text-center space-y-4">
            <h1 class="text-6xl font-black">المدونة التقنية</h1>
            <p class="text-gray-400 text-xl">دليلك الكامل للنجاح الرقمي وتطوير أعمالك في المغرب.</p>
        </div>
        
        ${renderAdUnit('Header Ad - Responsive')}

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            ${state.articles.map((a: any) => `
                <article class="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition flex flex-col cursor-pointer" onclick="window.location.hash='#/article/${a.id}'">
                    <img src="${a.image}" class="h-64 object-cover">
                    <div class="p-8 space-y-4 flex-1">
                        <h3 class="text-2xl font-black">${a.title}</h3>
                        <p class="text-gray-500 font-medium line-clamp-3">${a.excerpt}</p>
                        <div class="pt-4 mt-auto text-blue-600 font-black">قراءة المقال ←</div>
                    </div>
                </article>
            `).join('')}
        </div>

        ${renderAdUnit('Bottom Ad - Multi-unit')}
    </div>
`;

const renderArticleDetail = (id: string) => {
    const article = state.articles.find((a: any) => a.id === id);
    if (!article) return `<div class="text-center py-40 font-black text-3xl">عذراً، المقال غير موجود!</div>`;

    return `
        <div class="max-w-4xl mx-auto px-6 py-20 animate-fadeIn">
            <article class="space-y-12">
                <nav class="flex gap-2 text-sm font-bold text-gray-400">
                    <a href="#/" class="hover:text-blue-600">الرئيسية</a> / 
                    <a href="#/blog" class="hover:text-blue-600">المدونة</a> / 
                    <span class="text-gray-900">مقال</span>
                </nav>
                
                <h1 class="text-5xl md:text-6xl font-black leading-tight text-gray-900">${article.title}</h1>
                
                <div class="flex items-center gap-4 border-b border-gray-100 pb-8">
                    <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">H</div>
                    <div>
                        <div class="font-black">حلال ديجيتال</div>
                        <div class="text-xs text-gray-400 font-bold">${new Date(article.date).toLocaleDateString('ar-MA')}</div>
                    </div>
                </div>

                <img src="${article.image}" class="w-full h-[500px] object-cover rounded-[4rem] shadow-2xl">

                ${renderAdUnit('Article Top - Large Display')}

                <div class="prose prose-2xl max-w-none text-gray-700 font-medium leading-relaxed space-y-8">
                    ${article.content.split('\n').map((p: string) => `<p>${p}</p>`).join('')}
                </div>

                ${renderAdUnit('In-Feed Ad - Article Middle')}

                <div class="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div class="space-y-2">
                        <h3 class="text-2xl font-black">هل تحتاج لموقع مثل هذا؟</h3>
                        <p class="text-gray-400 font-bold">يمكننا برمجة موقع أحلامك وتجهيزه لأدسنس والسيو.</p>
                    </div>
                    <a href="#/request" class="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-blue-100">اطلب استشارة مجانية</a>
                </div>

                ${renderAdUnit('Article End - Related Content')}
            </article>
        </div>
    `;
};

// --- Admin Renderers ---
const renderDashboard = () => `
    <div class="min-h-screen bg-white flex flex-col md:flex-row animate-fadeIn">
        <aside class="w-full md:w-80 bg-gray-900 text-white p-10 flex flex-col">
            <div class="text-2xl font-black mb-12">لوحة <span class="text-blue-500">التحكم</span></div>
            <nav class="flex flex-col gap-2 flex-1">
                <button onclick="switchTab('requests')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition font-black text-right w-full"><span>📊</span> الطلبات</button>
                <button onclick="switchTab('articles')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition font-black text-right w-full"><span>✍️</span> المدونة</button>
                <button onclick="switchTab('projects')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition font-black text-right w-full"><span>📁</span> المشاريع</button>
                <button onclick="switchTab('settings')" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition font-black text-right w-full"><span>⚙️</span> الإعدادات</button>
            </nav>
            <button onclick="logout()" class="p-4 bg-red-500/10 text-red-400 rounded-2xl font-black mt-10">تسجيل الخروج</button>
        </aside>
        <main class="flex-1 p-8 md:p-16 overflow-y-auto bg-gray-50">
            <div id="dash-content" class="max-w-5xl mx-auto space-y-12"></div>
        </main>
    </div>
`;

(window as any).switchTab = (tab: string) => {
    const container = document.getElementById('dash-content');
    if (!container) return;

    if (tab === 'articles') {
        container.innerHTML = `
            <div class="flex justify-between items-center">
                <h2 class="text-4xl font-black">إدارة المدونة</h2>
                <button onclick="addArticle()" class="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">إضافة مقال جديد +</button>
            </div>
            <div class="grid gap-6">
                ${state.articles.map((a: any) => `
                    <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex justify-between items-center">
                        <div class="flex gap-4 items-center">
                            <img src="${a.image}" class="w-20 h-20 rounded-2xl object-cover">
                            <span class="font-black text-xl">${a.title}</span>
                        </div>
                        <button onclick="deleteArticle('${a.id}')" class="text-red-500 font-black">حذف</button>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'requests') {
        container.innerHTML = `<h2 class="text-4xl font-black">طلبات الزبناء (${state.requests.length})</h2><div class="grid gap-4">${state.requests.map((r: any) => `<div class="bg-white p-6 rounded-3xl border"><b>${r.name}</b> - ${r.type}</div>`).join('')}</div>`;
    } else if (tab === 'projects') {
        container.innerHTML = `<h2 class="text-4xl font-black">المشاريع</h2><button onclick="addProject()" class="bg-blue-600 text-white p-4 rounded-xl">أضف مشروع</button>`;
    } else if (tab === 'settings') {
        container.innerHTML = `<h2 class="text-4xl font-black">الإعدادات</h2><input id="set-wa" value="${state.settings.whatsappNumber}" class="p-4 rounded-xl w-full border"><button onclick="updateSettings()" class="bg-blue-600 text-white p-4 rounded-xl mt-4">حفظ</button>`;
    }
};

(window as any).addArticle = () => {
    const title = prompt('عنوان المقال:');
    if (!title) return;
    const excerpt = prompt('وصف قصير (Excerpt):');
    const image = prompt('رابط الصورة:', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800');
    const content = prompt('محتوى المقال (نص كبير):');

    state.articles.unshift({
        id: 'art-' + Date.now(),
        title,
        excerpt,
        content,
        image,
        date: new Date().toISOString()
    });
    saveState();
    (window as any).switchTab('articles');
};

(window as any).deleteArticle = (id: string) => {
    if (!confirm('حذف هذا المقال نهائياً؟')) return;
    state.articles = state.articles.filter((a: any) => a.id !== id);
    saveState();
    (window as any).switchTab('articles');
};

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
        const id = hash.replace('#/article/', '');
        root.innerHTML = renderArticleDetail(id);
    } else if (hash === '#/request') {
        root.innerHTML = `<div>نموذج الطلب</div>`; // Simplified for brevity
    } else if (isDashboard) {
        if (!state.isAuthenticated && sessionStorage.getItem('isAdmin') !== 'true') {
            root.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gray-50">
                    <div class="bg-white p-12 rounded-[3.5rem] shadow-4xl text-center space-y-8 w-full max-w-md">
                        <h2 class="text-3xl font-black">الإدارة</h2>
                        <input type="password" id="dash-pass" class="w-full p-5 bg-gray-50 rounded-2xl outline-none text-center text-2xl tracking-widest" placeholder="••••">
                        <button onclick="login()" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black">دخول</button>
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
